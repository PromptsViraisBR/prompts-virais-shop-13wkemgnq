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
      // Blindagem de sessão corrompida/expirada: valida o token contra o
      // servidor na abertura do app. Se inválido, o authStore é limpo e a UI
      // passa a mostrar o estado de deslogado (e o modal de login nas ações),
      // em vez de enviar requests que falham com 401 por todo o site.
      pb.collection('users')
        .authRefresh()
        .catch(() => {
          try {
            pb.authStore.clear()
          } catch {
            /* ignore */
          }
          setUser(null)
          setSubscription(null)
        })
        .finally(() => {
          setIsLoading(false)
        })
      refreshSubscription()
    } else {
      setIsLoading(false)
    }

    return () => {
      unsub()
    }
  }, [refreshSubscription])

  // Helpers para tripla persistência do handshake (localStorage, sessionStorage, cookie)
  const OAUTH_HANDSHAKE_KEY = 'oauth_provider_handshake'

  const readHandshakeCookie = (): string | null => {
    if (typeof document === 'undefined') return null
    try {
      const match = document.cookie.match(new RegExp(`(?:^|; )${OAUTH_HANDSHAKE_KEY}=([^;]*)`))
      return match ? decodeURIComponent(match[1]) : null
    } catch {
      return null
    }
  }

  const writeHandshake = (val: string) => {
    try {
      localStorage.setItem(OAUTH_HANDSHAKE_KEY, val)
    } catch {
      /* ignore */
    }
    try {
      sessionStorage.setItem(OAUTH_HANDSHAKE_KEY, val)
    } catch {
      /* ignore */
    }
    try {
      // Cookie curto de 10 min (600s), path=/, sem SameSite restritivo para funcionar em webviews
      document.cookie = `${OAUTH_HANDSHAKE_KEY}=${encodeURIComponent(val)}; max-age=600; path=/`
    } catch {
      /* ignore */
    }
  }

  const readHandshake = (): string | null => {
    try {
      const fromLocal = localStorage.getItem(OAUTH_HANDSHAKE_KEY)
      if (fromLocal) return fromLocal
    } catch {
      /* ignore */
    }
    try {
      const fromSession = sessionStorage.getItem(OAUTH_HANDSHAKE_KEY)
      if (fromSession) return fromSession
    } catch {
      /* ignore */
    }
    return readHandshakeCookie()
  }

  const clearHandshake = () => {
    try {
      localStorage.removeItem(OAUTH_HANDSHAKE_KEY)
    } catch {
      /* ignore */
    }
    try {
      sessionStorage.removeItem(OAUTH_HANDSHAKE_KEY)
    } catch {
      /* ignore */
    }
    try {
      document.cookie = `${OAUTH_HANDSHAKE_KEY}=; max-age=0; path=/`
    } catch {
      /* ignore */
    }
  }

  // Detecta e processa o retorno de OAuth2 redirect (fluxo mobile PKCE)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    const error = urlParams.get('error')
    const errorDescription = urlParams.get('error_description')

    // Função utilitária para limpar parâmetros OAuth da URL e restaurar rota de destino se informada
    const cleanOAuthUrl = (targetPath?: string) => {
      try {
        const currentUrl = new URL(window.location.href)
        currentUrl.searchParams.delete('code')
        currentUrl.searchParams.delete('state')
        currentUrl.searchParams.delete('error')
        currentUrl.searchParams.delete('error_description')
        currentUrl.searchParams.delete('scope')
        currentUrl.searchParams.delete('authuser')
        currentUrl.searchParams.delete('prompt')
        currentUrl.searchParams.delete('hd')

        if (targetPath) {
          try {
            const parsedTarget = new URL(targetPath, window.location.origin)
            // Mantém apenas o target path e queries que não sejam os de auth
            window.history.replaceState(
              {},
              document.title,
              parsedTarget.pathname + parsedTarget.search + parsedTarget.hash,
            )
            return
          } catch {
            /* se targetPath for inválido, cai no fallback */
          }
        }

        const cleanSearch = currentUrl.searchParams.toString()
        const newRelativePath =
          currentUrl.pathname + (cleanSearch ? `?${cleanSearch}` : '') + currentUrl.hash
        window.history.replaceState({}, document.title, newRelativePath)
      } catch {
        /* ignore */
      }
    }

    const currentBaseUrl =
      typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''

    // 3. Tratar error / error_description na URL (ex: usuário cancelou no Google ou redirect_uri_mismatch)
    if (error || errorDescription) {
      console.warn(
        `[OAuth Mobile] Erro retornado pelo provedor OAuth: error=${error}, desc=${errorDescription}. URL: ${currentBaseUrl}`,
      )
      clearHandshake()
      cleanOAuthUrl()
      toast({
        title: 'Login cancelado ou recusado',
        description:
          'Login cancelado ou configuração do Google recusada. Tente novamente ou use e-mail e senha.',
        variant: 'destructive',
      })
      setIsLoading(false)
      return
    }

    if (!code || !state) return

    const rawHandshake = readHandshake()
    if (!rawHandshake) {
      // a) code && state na URL mas sem handshake no storage/cookie: limpa e avisa amigavelmente
      console.warn(
        `[OAuth Mobile] code e state presentes na URL, mas handshake local não encontrado. URL: ${currentBaseUrl}`,
      )
      clearHandshake()
      cleanOAuthUrl()
      toast({
        title: 'Não foi possível concluir o login',
        description: 'Não foi possível concluir o login. Tente novamente.',
        variant: 'destructive',
      })
      setIsLoading(false)
      return
    }

    let stored: any = null
    try {
      stored = JSON.parse(rawHandshake)
    } catch (parseErr) {
      // c) Falha no JSON.parse: limpa handshake corrompido, limpa URL e avisa
      console.warn(`[OAuth Mobile] Handshake corrompido: ${parseErr}. URL: ${currentBaseUrl}`)
      clearHandshake()
      cleanOAuthUrl()
      toast({
        title: 'Não foi possível concluir o login',
        description: 'Não foi possível concluir o login. Tente novamente.',
        variant: 'destructive',
      })
      setIsLoading(false)
      return
    }

    // b) Expiração do handshake (mais de 10 minutos)
    const startedAt = stored?.startedAt ? Number(stored.startedAt) : 0
    const TEN_MINUTES_MS = 10 * 60 * 1000
    if (startedAt > 0 && Date.now() - startedAt > TEN_MINUTES_MS) {
      console.warn(`[OAuth Mobile] Handshake expirado (> 10 minutos). URL: ${currentBaseUrl}`)
      clearHandshake()
      cleanOAuthUrl()
      toast({
        title: 'Sessão de login expirada',
        description: 'O tempo limite do login com Google foi excedido. Tente novamente.',
        variant: 'destructive',
      })
      setIsLoading(false)
      return
    }

    // d) state mismatch: limpeza completa (storages + cookie + URL) e toast amigável sem throw
    if (stored.state !== state) {
      console.warn(
        `[OAuth Mobile] state mismatch detectado: recebido vs armazenado divergentes. URL: ${currentBaseUrl}`,
      )
      clearHandshake()
      cleanOAuthUrl()
      toast({
        title: 'Não foi possível concluir o login',
        description: 'Validação de segurança do login não confere. Tente novamente.',
        variant: 'destructive',
      })
      setIsLoading(false)
      return
    }

    let cancelled = false
    setIsLoading(true)

    const completeMobileOAuth = async () => {
      let targetReturnTo: string | undefined = stored.returnTo
      try {
        clearHandshake()

        const providerName = stored.name || 'google'
        const codeVerifier = stored.codeVerifier
        // Garantir que redirectUrl usado na troca do código seja EXATAMENTE o mesmo salvo no handshake
        const appFallbackRedirectUrl = `${window.location.origin}/login`
        const redirectUrl = stored.redirectUrl || appFallbackRedirectUrl

        // f) Processa a troca de código mesmo que pb.authStore já tenha registro
        const authData = await pb
          .collection('users')
          .authWithOAuth2Code(providerName, code, codeVerifier, redirectUrl)

        if (!cancelled && authData?.record?.id) {
          // i) Pós-processamento e refresh protegidos contra erro
          try {
            await postProcessAuthRecord(
              authData.record.id,
              authData.record as unknown as UserRecord,
            )
          } catch (postErr) {
            console.warn(
              `[OAuth Mobile] pós-processamento falhou: ${postErr}. URL: ${currentBaseUrl}`,
            )
          }

          toast({
            title: 'Login com Google realizado! 🎉',
            description: 'Bem-vindo ao Prompts Virais Shop!',
          })
        }
      } catch (err: any) {
        console.warn(
          `[OAuth Mobile] Falha ao trocar code por token: ${err}. URL: ${currentBaseUrl}`,
        )
        toast({
          title: 'Não foi possível concluir o login',
          description: 'Não foi possível concluir o login. Tente novamente.',
          variant: 'destructive',
        })
      } finally {
        // g) Restaura rota original se houver ou limpa parâmetros na rota atual
        cleanOAuthUrl(targetReturnTo)
        // e) Incondicional: garante isLoading false em qualquer cenário
        setIsLoading(false)
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
    // Processa a indicação no servidor (se houver código ou referred_by)
    if (cleanRef || referredById) {
      try {
        const token = pb.authStore.token
        if (token) {
          await pb.send('/backend/v1/referrals/process-signup', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: { referral_code: cleanRef },
          })
        }
      } catch (refProcErr) {
        console.warn('[signup] Falha ao acionar process-signup:', refProcErr)
      }
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

        // Redireciona de volta para a rota /login do próprio app (em vez de /api/oauth2-redirect do backend)
        // para que code+state voltem direto para o useEffect que completa via authWithOAuth2Code
        const redirectUrl =
          window.location.pathname === '/login'
            ? `${window.location.origin}/login`
            : `${window.location.origin}/login`

        // Salva dados do handshake na tripla persistência (localStorage, sessionStorage, cookie)
        const returnTo = window.location.pathname + window.location.search
        writeHandshake(
          JSON.stringify({
            name: providerEntry.name,
            state: providerEntry.state,
            codeVerifier: providerEntry.codeVerifier,
            redirectUrl: redirectUrl,
            startedAt: Date.now(),
            returnTo: returnTo || '/',
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
      const currentBaseUrl =
        typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''
      console.warn(`[OAuth] Erro ao autenticar com ${provider}: ${err}. URL: ${currentBaseUrl}`)
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
