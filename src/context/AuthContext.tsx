import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import pb from '@/lib/pocketbase/client'
import type { UserRecord, SubscriptionRecord, PlanType } from '@/types'
import { getUserSubscription, subscribePlan } from '@/services/subscriptions'

interface AuthContextType {
  user: UserRecord | null
  subscription: SubscriptionRecord | null
  plan: PlanType
  isPaidPlan: boolean
  isProOrVip: boolean
  isLoading: boolean
  login: (email: string, pass: string) => Promise<void>
  signup: (email: string, pass: string, name: string) => Promise<void>
  logout: () => void
  refreshSubscription: () => Promise<void>
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>
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

  const signup = async (email: string, pass: string, name: string) => {
    await pb.collection('users').create({
      email,
      password: pass,
      passwordConfirm: pass,
      name,
    })
    // Faz login automático após cadastro
    await pb.collection('users').authWithPassword(email, pass)
    // Cria plano gratuito padrão
    if (pb.authStore.record?.id) {
      await subscribePlan(pb.authStore.record.id, 'free')
    }
    await refreshSubscription()
  }

  const logout = () => {
    pb.authStore.clear()
    setUser(null)
    setSubscription(null)
  }

  const updateProfile = async (data: { name?: string; email?: string }) => {
    if (!user) throw new Error('Não autenticado')
    const updated = await pb.collection('users').update<UserRecord>(user.id, data)
    setUser(updated)
  }

  const changePlanDemo = async (newPlan: PlanType, cardData?: { last4: string; brand: string }) => {
    if (!user) throw new Error('Não autenticado')
    const sub = await subscribePlan(user.id, newPlan, cardData)
    setSubscription(sub)
  }

  // Determina plano: se não tem assinatura ou expirou, fallback para 'free'
  const plan: PlanType = subscription?.status === 'active' ? subscription.plan : 'free'
  const isPaidPlan = plan === 'monthly' || plan === 'annual'
  const isProOrVip = isPaidPlan // Plano PRO (R$ 49,90) e Anual VIP têm acesso à geração de vídeo

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        plan,
        isPaidPlan,
        isProOrVip,
        isLoading,
        login,
        signup,
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
