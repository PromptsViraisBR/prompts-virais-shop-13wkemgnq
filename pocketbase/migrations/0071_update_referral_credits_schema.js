/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 0071:
 * Evolução da coleção `referral_credits` para o novo sistema de indicações:
 * 1. PLANO GRÁTIS:
 *    - Indicação ilimitada.
 *    - Cada cadastro novo concluído concede +5 gerações extras (creditadas em regeneration_credits e registradas em referral_credits).
 * 2. PLANO PRO:
 *    - Oportunidade única por indicador PRO.
 *    - Registro vinculado ao indicado.
 *    - Ao assinar PRO com pagamento confirmado via webhook do Mercado Pago: estorno de 1 mensalidade na assinatura do indicador.
 *    - Link removido da interface do indicador PRO assim que o cadastro do indicado for confirmado.
 * 3. Campos adicionais em `referral_credits`:
 *    - referrer_plan: text ('free' | 'monthly' | 'annual')
 *    - referral_code_used: text
 *    - reward_type: text ('generations_5' | 'pro_refund')
 *    - refund_amount: number
 *    - refund_status: text ('not_applicable' | 'pending_payment' | 'processing' | 'refunded' | 'refund_pending_manual' | 'not_eligible' | 'failed')
 *    - refund_reason: text
 *    - mp_payment_id: text
 *    - mp_refund_id: text
 *    - processed_at: date
 */
migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('referral_credits')

    // 1. Atualizar select de status se necessário (active, consumed, expired, completed, cancelled)
    const statusField = col.fields.getByName('status')
    if (statusField) {
      statusField.values = ['active', 'consumed', 'expired', 'completed', 'cancelled']
      statusField.required = false
    }

    // 2. Tornar expires_at opcional (créditos de 5 gerações grátis acumulam sem expiração forçada)
    const expiresField = col.fields.getByName('expires_at')
    if (expiresField) {
      expiresField.required = false
    }

    // 3. Adicionar novos campos para auditoria completa e idempotência
    if (!col.fields.getByName('referrer_plan')) {
      col.fields.add(
        new TextField({
          name: 'referrer_plan',
          required: false,
        }),
      )
    }

    if (!col.fields.getByName('referral_code_used')) {
      col.fields.add(
        new TextField({
          name: 'referral_code_used',
          required: false,
        }),
      )
    }

    if (!col.fields.getByName('reward_type')) {
      col.fields.add(
        new TextField({
          name: 'reward_type',
          required: false,
        }),
      )
    }

    if (!col.fields.getByName('refund_amount')) {
      col.fields.add(
        new NumberField({
          name: 'refund_amount',
          required: false,
        }),
      )
    }

    if (!col.fields.getByName('refund_status')) {
      col.fields.add(
        new TextField({
          name: 'refund_status',
          required: false,
        }),
      )
    }

    if (!col.fields.getByName('refund_reason')) {
      col.fields.add(
        new TextField({
          name: 'refund_reason',
          required: false,
        }),
      )
    }

    if (!col.fields.getByName('mp_payment_id')) {
      col.fields.add(
        new TextField({
          name: 'mp_payment_id',
          required: false,
        }),
      )
    }

    if (!col.fields.getByName('mp_refund_id')) {
      col.fields.add(
        new TextField({
          name: 'mp_refund_id',
          required: false,
        }),
      )
    }

    if (!col.fields.getByName('processed_at')) {
      col.fields.add(
        new DateField({
          name: 'processed_at',
          required: false,
        }),
      )
    }

    app.save(col)

    // 4. Adicionar índices para buscas rápidas
    try {
      col.addIndex('idx_ref_credits_reward_type', false, 'reward_type', '')
      col.addIndex('idx_ref_credits_referrer_reward', false, 'referrer, reward_type', '')
      col.addIndex('idx_ref_credits_referred_user', false, 'referred_user', '')
      app.save(col)
    } catch (idxErr) {
      console.warn('[migration 0071] Aviso ao adicionar índices em referral_credits:', idxErr)
    }
  },
  (app) => {
    // Reversão
    try {
      const col = app.findCollectionByNameOrId('referral_credits')
      const fieldsToRemove = [
        'referrer_plan',
        'referral_code_used',
        'reward_type',
        'refund_amount',
        'refund_status',
        'refund_reason',
        'mp_payment_id',
        'mp_refund_id',
        'processed_at',
      ]
      for (let i = 0; i < fieldsToRemove.length; i++) {
        const f = col.fields.getByName(fieldsToRemove[i])
        if (f) col.fields.removeByName(fieldsToRemove[i])
      }
      app.save(col)
    } catch (_) {}
  },
)
