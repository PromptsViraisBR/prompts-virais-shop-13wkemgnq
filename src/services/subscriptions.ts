import pb from '@/lib/pocketbase/client'
import type { SubscriptionRecord, PlanType } from '@/types'

export async function getUserSubscription(userId: string): Promise<SubscriptionRecord | null> {
  try {
    const records = await pb.collection('subscriptions').getList<SubscriptionRecord>(1, 1, {
      filter: `user = '${userId}' && status = 'active'`,
      sort: '-created',
    })
    return records.items[0] || null
  } catch (err) {
    console.warn('Erro ao carregar assinatura do usuário:', err)
    return null
  }
}

export async function subscribePlan(
  userId: string,
  plan: PlanType,
  cardData?: { last4: string; brand: string },
): Promise<SubscriptionRecord> {
  // Se for plano gratuito, atualiza ou cria
  const existing = await getUserSubscription(userId)

  const now = new Date()
  const endDate = new Date()
  if (plan === 'annual') {
    endDate.setFullYear(now.getFullYear() + 1)
  } else if (plan === 'monthly') {
    endDate.setMonth(now.getMonth() + 1)
  } else {
    // Free eterno
    endDate.setFullYear(now.getFullYear() + 10)
  }

  const payload = {
    user: userId,
    plan,
    status: 'active',
    start_date: now.toISOString(),
    end_date: endDate.toISOString(),
    card_last4: cardData?.last4 || (plan === 'free' ? '' : '4242'),
    card_brand: cardData?.brand || (plan === 'free' ? '' : 'Mastercard'),
  }

  if (existing) {
    return await pb.collection('subscriptions').update<SubscriptionRecord>(existing.id, payload)
  } else {
    return await pb.collection('subscriptions').create<SubscriptionRecord>(payload)
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<SubscriptionRecord> {
  return await pb.collection('subscriptions').update<SubscriptionRecord>(subscriptionId, {
    status: 'cancelled',
  })
}
