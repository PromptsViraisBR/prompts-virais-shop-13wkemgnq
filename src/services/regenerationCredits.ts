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
  cardNumber?: string
  paymentMethod?: 'saved_card' | 'card' | 'pix'
}): Promise<RegenerationCreditRecord> {
  const { userId, quantity = 1, cardNumber, paymentMethod = 'card' } = params
  const last4 =
    paymentMethod === 'pix'
      ? 'PIX'
      : (cardNumber ? cardNumber.replace(/\D/g, '').slice(-4) : '4242') || '4242'

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

/**
 * Limite de regenerações gratuitas/incluídas por contexto:
 * - 'virais': máximo de 2 regenerações gratuitas por usuário/item
 * - 'ecommerce': comportamento padrão (1 regeneração gratuita/base)
 */
export const VIRAL_REGENERATION_LIMIT = 2

const VIRAL_REGEN_STORAGE_KEY = 'viral_regeneration_counts'

/**
 * Obtém quantas regenerações gratuitas já foram utilizadas pelo usuário em vídeos virais.
 */
export function getViralRegenerationsUsed(userId: string, targetKey: string = 'global'): number {
  if (!userId) return 0
  try {
    const raw = localStorage.getItem(`${VIRAL_REGEN_STORAGE_KEY}_${userId}`)
    if (!raw) return 0
    const parsed = JSON.parse(raw)
    return typeof parsed[targetKey] === 'number' ? parsed[targetKey] : parsed.total || 0
  } catch {
    return 0
  }
}

/**
 * Incrementa o contador de regeneração para a categoria virais.
 */
export function recordViralRegenerationUsed(
  userId: string,
  targetKey: string = 'global',
): { used: number; remainingFree: number } {
  if (!userId) return { used: 0, remainingFree: VIRAL_REGENERATION_LIMIT }
  try {
    const key = `${VIRAL_REGEN_STORAGE_KEY}_${userId}`
    const raw = localStorage.getItem(key)
    const data = raw ? JSON.parse(raw) : {}
    const current = typeof data[targetKey] === 'number' ? data[targetKey] : 0
    const next = current + 1
    data[targetKey] = next
    data.total = (data.total || 0) + 1
    localStorage.setItem(key, JSON.stringify(data))
    const remainingFree = Math.max(0, VIRAL_REGENERATION_LIMIT - next)
    return { used: next, remainingFree }
  } catch {
    return { used: 1, remainingFree: Math.max(0, VIRAL_REGENERATION_LIMIT - 1) }
  }
}

/**
 * Verifica se o usuário ainda pode regenerar gratuitamente na categoria virais (máx 2 vezes).
 */
export function canViralRegenerateFree(userId: string, targetKey: string = 'global'): boolean {
  if (!userId) return false
  const used = getViralRegenerationsUsed(userId, targetKey)
  return used < VIRAL_REGENERATION_LIMIT
}
