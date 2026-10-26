import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import pb from '@/lib/pocketbase/client'
import type { UserRecord, SubscriptionRecord, PlanType } from '@/types'
import { toast } from '@/hooks/use-toast'
import { getUserSubscription, subscribePlan } from '@/services/subscriptions'

interface AuthContextType {
  user: UserRecord | null
  subscription: SubscriptionRecord | null
  isAdmin: boolean
  plan: PlanType
  isPaidPlan: boolean
  isProOrVip: boolean
  isLoading: boolean
  login: (email: string, pass: string) => Promise<void>
  signup: (email: string, pass: string, name: string, referralCode?: string) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  loginWithOAuth: (provider?: 'google' | 'apple') => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshSubscription: () => Promise<void>
  updateProfile: (data: {
    name?: string
    email?: string
    xai_api_key?: string
    google_ai_api_key?: string
  }) => Promise<void>
  changePlanDemo: (newPlan: PlanType, cardData?: { last4: string; brand: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserRecord | null>(() => {
    return (pb.authStore.record as unknown as UserRecord) || null
  })
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const isMobileDevice = useCallback(() => {
    if (typeof window === 'undefined') return false
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ''
    const mobileRegex = /android|avantgo|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i
    const isMobileUA = mobileRegex.test(userAgent)
    const isNarrowViewport = typeof window.innerWidth === 'number' && window.innerWidth < 768
    const isTouch = typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1
    return isMobileUA || (isNarrowViewport && isTouch)
  }, [])

  const postProcessAuthRecord = useCallback(
    async (recordId: string, currentRecord?: UserRecord | null) => {
      // 1. Garantir que tem plano gratuito ativo caso novo
      try {
        const sub = await getUserSubscription(recordId)
        if (!sub) {
          await subscribePlan(recordId, 'free')
        }
      } catch {
        /* intentionally ignored */
      }

      // 2. Garantir código de indicação gerado
      const rec = currentRecord || (pb.authStore.record as unknown as UserRecord)
      if (rec && !rec.referral_code) {
        try {
          await pb.collection('users').update(recordId, {
            referral_code: recordId.slice(0, 8).toUpperCase(),
          })
        } catch {
          /* intentionally ignored */
        }
      }

      // 3. Atualizar assinatura no contexto
      if (pb.authStore.record?.id) {
        const sub = await getUserSubscription(pb.authStore.record.id)
        setSubscription(sub)
      }
    },
    [],
  )

  const refreshSubscription = useCallback(async () => {
    if (!pb.authStore.record?.id) {
      setSubscription(null)
      return
    }
    const sub = await getUserSubscription(pb.authStore.record.id)
    setSubscription(sub)
  }, [])

  useEffect(() => {
    const unsub = pb.authStore.onChange(() => {
      const current = (pb.authStore.record as unknown as UserRecord) || null
      setUser(current)
      if (current) {
        refreshSubscription()
      } else {
        setSubscription(null)
      }
    })

    // Carga inicial
    if (pb.authStore.record) {
      setUser(pb.authStore.record as unknown as UserRecord)
      refreshSubscription().finally(() => {
        setIsLoading(false)
      })
    } else {
      setIsLoading(false)
    }

    return () => {
      unsub()
    }
  }, [refreshSubscription])

  // Detecta e processa o retorno de OAuth2 redirect (fluxo mobile PKCE)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')

    if (!code || !state) return

    const rawHandshake = localStorage.getItem('oauth_provider_handshake')
    if (!rawHandshake) return

    let cancelled = false
    setIsLoading(true)

    const completeMobileOAuth = async () => {
      try {
        const stored = JSON.parse(rawHandshake)
        localStorage.removeItem('oauth_provider_handshake')

        if (stored.state !== state) {
          throw new Error('Parâmetro state divergente na validação do OAuth.')
        }

        const providerName = stored.name || 'google'
        const codeVerifier = stored.codeVerifier
        const backendUrl = import.meta.env.VITE_POCKETBASE_URL || pb.baseUrl
        const redirectUrl = stored.redirectUrl || `${backendUrl}/api/oauth2-redirect`

        const authData = await pb
          .collection('users')
          .authWithOAuth2Code(providerName, code, codeVerifier, redirectUrl)

        if (!cancelled && authData?.record?.id) {
          await postProcessAuthRecord(authData.record.id, authData.record as unknown as UserRecord)
          toast({
            title: 'Login com Google realizado! 🎉',
            description: 'Bem-vindo ao Prompts Virais Shop!',
          })
        }
      } catch (err: any) {
        console.warn('[OAuth Mobile] Falha ao trocar code por token:', err)
        toast({
          title: 'Não foi possível concluir o login',
          description: 'Não foi possível concluir o login. Tente novamente.',
          variant: 'destructive',
        })
      } finally {
        // Limpa code e state da barra de endereços sem recarregar a tela
        try {
          const currentUrl = new URL(window.location.href)
          currentUrl.searchParams.delete('code')
          currentUrl.searchParams.delete('state')
          currentUrl.searchParams.delete('scope')
          currentUrl.searchParams.delete('authuser')
          currentUrl.searchParams.delete('prompt')
          const cleanSearch = currentUrl.searchParams.toString()
          const newRelativePath =
            currentUrl.pathname + (cleanSearch ? `?${cleanSearch}` : '') + currentUrl.hash
          window.history.replaceState({}, document.title, newRelativePath)
        } catch {
          /* ignore */
        }
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    completeMobileOAuth()

    return () => {
      cancelled = true
    }
  }, [postProcessAuthRecord])

  const login = async (email: string, pass: string) => {
    await pb.collection('users').authWithPassword(email, pass)
    await refreshSubscription()
  }

  const signup = async (email: string, pass: string, name: string, referralCode?: string) => {
    // Se foi fornecido referralCode, buscar usuário indicador
    let referredById: string | undefined = undefined
    const cleanRef = (referralCode || '').trim()
    if (cleanRef) {
      try {
        const refUser = await pb
          .collection('users')
          .getFirstListItem(`referral_code = "${cleanRef}" || id = "${cleanRef}"`)
        if (refUser) {
          referredById = refUser.id
        }
      } catch {
        /* intentionally ignored */
      }
    }

    const createdUser = await pb.collection('users').create({
      email,
      password: pass,
      passwordConfirm: pass,
      name,
      referred_by: referredById || undefined,
    })

    // Gera referral_code se não preenchido
    if (!createdUser.referral_code && createdUser.id) {
      try {
        await pb.collection('users').update(createdUser.id, {
          referral_code: createdUser.id.slice(0, 8).toUpperCase(),
        })
      } catch {
        /* intentionally ignored */
      }
    }

    // Faz login automático após cadastro
    await pb.collection('users').authWithPassword(email, pass)
    // Cria plano gratuito padrão
    if (pb.authStore.record?.id) {
      await subscribePlan(pb.authStore.record.id, 'free')
    }
    await refreshSubscription()
  }

  const requestPasswordReset = async (email: string) => {
    const cleanEmail = (email || '').trim().toLowerCase()
    if (!cleanEmail) throw new Error('Informe seu e-mail para recuperar a senha.')
    await pb.collection('users').requestPasswordReset(cleanEmail)
  }

  const loginWithOAuth = async (
    provider: 'google' | 'apple' = 'google',
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // No MOBILE: evitar window.open (popup) que costuma ser bloqueado ou abrir janela branca
      // Usar fluxo oficial de redirecionamento PKCE
      if (isMobileDevice()) {
        const authMethods = await pb.collection('users').listAuthMethods()
        const providers = authMethods.oauth2?.providers || []
        const providerEntry = providers.find(
          (p) => p && p.name && p.name.toLowerCase() === provider.toLowerCase(),
        )

        if (!providerEntry) {
          return {
            success: false,
            error: `Provedor ${provider} não está configurado no servidor.`,
          }
        }

        const backendUrl = import.meta.env.VITE_POCKETBASE_URL || pb.baseUrl
        const redirectUrl = `${backendUrl}/api/oauth2-redirect`

        // Salva dados do handshake para conferência e troca no retorno
        localStorage.setItem(
          'oauth_provider_handshake',
          JSON.stringify({
            name: providerEntry.name,
            state: providerEntry.state,
            codeVerifier: providerEntry.codeVerifier,
            redirectUrl: redirectUrl,
          }),
        )

        // Redireciona a janela inteira
        window.location.href = providerEntry.authURL + redirectUrl
        return { success: true }
      }

      // No DESKTOP: mantém exatamente o fluxo padrão de popup original
      const authData = await pb.collection('users').authWithOAuth2({ provider })
      if (authData.record?.id) {
        await postProcessAuthRecord(authData.record.id, authData.record as unknown as UserRecord)
      }
      await refreshSubscription()
      return { success: true }
    } catch (err: any) {
      console.warn(`[OAuth] Erro ao autenticar com ${provider}:`, err)
      const msg = err?.message || String(err)
      return { success: false, error: msg }
    }
  }

  const logout = () => {
    pb.authStore.clear()
    setUser(null)
    setSubscription(null)
  }

  const updateProfile = async (data: {
    name?: string
    email?: string
    xai_api_key?: string
    google_ai_api_key?: string
  }) => {
    if (!user) throw new Error('Não autenticado')
    const updated = await pb.collection('users').update<UserRecord>(user.id, data)
    setUser(updated)
  }

  const changePlanDemo = async (newPlan: PlanType, cardData?: { last4: string; brand: string }) => {
    if (!user) throw new Error('Não autenticado')
    const sub = await subscribePlan(user.id, newPlan, cardData)
    setSubscription(sub)
  }

  // Determina se o usuário é administrador (flag is_admin ou e-mail de admin)
  const userEmail = (user?.email || '').toLowerCase().trim()
  const isAdmin = Boolean(user?.is_admin || userEmail === 'juniorrodriguesjr123.jr@gmail.com')

  // Determina plano: admin tem acesso PRO/anual total automático irrestrito
  const subPlan: PlanType = subscription?.status === 'active' ? subscription.plan : 'free'
  const plan: PlanType = isAdmin ? (subPlan === 'free' ? 'annual' : subPlan) : subPlan
  const isPaidPlan = isAdmin || plan === 'monthly' || plan === 'annual'
  const isProOrVip = isPaidPlan

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        isAdmin,
        plan,
        isPaidPlan,
        isProOrVip,
        isLoading,
        login,
        signup,
        requestPasswordReset,
        loginWithOAuth,
        logout,
        refreshSubscription,
        updateProfile,
        changePlanDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider')
  }
  return context
}
