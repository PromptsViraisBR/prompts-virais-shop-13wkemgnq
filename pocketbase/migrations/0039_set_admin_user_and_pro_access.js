/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 0039: Garante acesso PRO total e credenciais do administrador Junior.
 * - E-mail: juniorrodriguesjr123.jr@gmail.com
 * - Nome: Junior
 * - Flag is_admin: true
 * - Senha definida: Junior@Admin2025!
 * - Garante assinatura ativa PRO (anual) na coleção subscriptions vinculada ao usuário
 */
migrate(
  (app) => {
    const adminEmail = 'juniorrodriguesjr123.jr@gmail.com'
    const adminPass = 'Junior@Admin2025!'
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    const subsCol = app.findCollectionByNameOrId('subscriptions')

    let userRec
    try {
      userRec = app.findAuthRecordByEmail('_pb_users_auth_', adminEmail)
      userRec.setPassword(adminPass)
      userRec.set('name', 'Junior')
      userRec.set('is_admin', true)
      userRec.setVerified(true)
      app.save(userRec)
    } catch (_) {
      userRec = new Record(usersCol)
      userRec.setEmail(adminEmail)
      userRec.setPassword(adminPass)
      userRec.set('name', 'Junior')
      userRec.set('is_admin', true)
      userRec.setVerified(true)
      app.save(userRec)
    }

    // Garante que exista uma assinatura PRO ativa no banco para o usuário
    const userId = userRec.id
    try {
      const existingSubs = app.findRecordsByFilter(
        'subscriptions',
        `user = "${userId}"`,
        '-created',
        1,
        0,
      )
      if (existingSubs && existingSubs.length > 0) {
        const sub = existingSubs[0]
        sub.set('status', 'active')
        sub.set('plan', 'annual')
        sub.set('card_brand', 'Mastercard')
        sub.set('card_last4', '4242')
        sub.set('end_date', '2035-12-31 23:59:59.000Z')
        app.save(sub)
      } else {
        const newSub = new Record(subsCol)
        newSub.set('user', userId)
        newSub.set('plan', 'annual')
        newSub.set('status', 'active')
        newSub.set('card_brand', 'Mastercard')
        newSub.set('card_last4', '4242')
        newSub.set('start_date', '2025-01-01 00:00:00.000Z')
        newSub.set('end_date', '2035-12-31 23:59:59.000Z')
        app.save(newSub)
      }
    } catch (err) {
      console.warn('Erro ao configurar assinatura do admin:', err)
    }
  },
  (app) => {
    // Reversão no-op intencional
  },
)
