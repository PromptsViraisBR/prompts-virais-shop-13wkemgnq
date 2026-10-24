import pb from '@/lib/pocketbase/client'
import { RegenerationCreditRecord } from '@/types'

/**
 * Obtém o registro de créditos de regeneração do usuário atual.
 */
export async function getUserRegenerationCredits(
  userId: string,
): Promise<RegenerationCreditRecord | null> {
  if (!userId) return null
  try {
    const records = await pb
      .collection('regeneration_credits')
      .getList<RegenerationCreditRecord>(1, 1, {
        filter: `user = '${userId}'`,
      })
    if (records.items.length > 0) {
      return records.items[0]
    }
    return null
  } catch (err) {
    console.warn('Erro ao buscar saldo de créditos de regeneração:', err)
    return null
  }
}

/**
 * Compra demonstrativa de prompts de regeneração extras (R$ 1,99 por prompt extra).
 * Pode comprar 1 ou mais prompts extras.
 */
export async function purchaseExtraRegenerations(params: {
  userId: string
  quantity: number
  cardNumber: string
}): Promise<RegenerationCreditRecord> {
  const { userId, quantity = 1, cardNumber } = params
  const last4 = cardNumber.replace(/\D/g, '').slice(-4) || '4242'

  const existing = await getUserRegenerationCredits(userId)

  if (existing) {
    const updated = await pb
      .collection('regeneration_credits')
      .update<RegenerationCreditRecord>(existing.id, {
        extra_prompts_balance: (existing.extra_prompts_balance || 0) + quantity,
        total_purchased: (existing.total_purchased || 0) + quantity,
        last_purchase_card_last4: last4,
      })
    return updated
  }

  const created = await pb.collection('regeneration_credits').create<RegenerationCreditRecord>({
    user: userId,
    extra_prompts_balance: quantity,
    total_purchased: quantity,
    total_used: 0,
    last_purchase_card_last4: last4,
  })
  return created
}

/**
 * Deduz 1 crédito de regeneração extra quando utilizado além do limite inicial incluído.
 */
export async function consumeExtraRegenerationCredit(userId: string): Promise<boolean> {
  if (!userId) return false
  const existing = await getUserRegenerationCredits(userId)
  if (!existing || (existing.extra_prompts_balance || 0) <= 0) {
    return false
  }

  try {
    await pb.collection('regeneration_credits').update(existing.id, {
      extra_prompts_balance: Math.max(0, existing.extra_prompts_balance - 1),
      total_used: (existing.total_used || 0) + 1,
    })
    return true
  } catch (err) {
    console.warn('Erro ao consumir crédito de regeneração:', err)
    return false
  }
}
