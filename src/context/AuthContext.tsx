import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import pb from '@/lib/pocketbase/client'
import type { UserRecord, SubscriptionRecord, PlanType } from '@/types'
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
  loginWithOAuth: (provider: 'google' | 'apple') => Promise<{ success: boolean; error?: string }>
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
      refreshSubscription().finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }

    return () => {
      unsub()
    }
  }, [refreshSubscription])

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

  const loginWithOAuth = async (
    provider: 'google' | 'apple',
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const authData = await pb.collection('users').authWithOAuth2({ provider })
      if (authData.record?.id) {
        // Garantir que tem plano gratuito ativo caso novo
        try {
          const sub = await getUserSubscription(authData.record.id)
          if (!sub) {
            await subscribePlan(authData.record.id, 'free')
          }
        } catch {
          /* intentionally ignored */
        }

        // Garantir código de indicação gerado
        const rec = authData.record as unknown as UserRecord
        if (!rec.referral_code) {
          try {
            await pb.collection('users').update(authData.record.id, {
              referral_code: authData.record.id.slice(0, 8).toUpperCase(),
            })
          } catch {
            /* intentionally ignored */
          }
        }
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
  const isAdmin = Boolean(user?.is_admin || user?.email === 'juniorrodriguesjr123.jr@gmail.com')

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
