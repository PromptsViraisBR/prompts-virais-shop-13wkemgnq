/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 0062: Garante robustez absoluta para o usuário e e-mail admin
 * - Seleciona todos os registros de usuário com o e-mail juniorrodriguesjr123.jr@gmail.com
 *   (independente de maiúsculas/minúsculas ou se foi criado via login social Google ou e-mail/senha)
 * - Garante is_admin = true e verified = true em qualquer registro correspondente
 * - Garante assinatura ativa PRO (anual) na tabela subscriptions vinculada ao usuário
 * - Totalmente idempotente e seguro em bancos vazios ou existentes
 */
migrate(
  (app) => {
    const adminEmail = 'juniorrodriguesjr123.jr@gmail.com'

    try {
      // 1. Atualizar via SQL direto em _pb_users_auth_ / users para cobrir todos os casos
      app
        .db()
        .newQuery(
          'UPDATE users SET is_admin = 1, verified = 1 WHERE LOWER(email) = LOWER({:email})',
        )
        .bind({ email: adminEmail })
        .execute()
    } catch (sqlErr) {
      console.warn('0062: update users sql warning:', sqlErr)
    }

    // 2. Localizar registros com esse email usando a API do PocketBase para garantir sincronização de assinatura
    try {
      const users = app.findRecordsByFilter(
        '_pb_users_auth_',
        `email = "${adminEmail}"`,
        '-created',
        10,
        0,
      )

      if (users && users.length > 0) {
        const subsCol = app.findCollectionByNameOrId('subscriptions')

        for (let i = 0; i < users.length; i++) {
          const u = users[i]
          if (!u.getBool('is_admin')) {
            u.set('is_admin', true)
            u.setVerified(true)
            app.save(u)
          }

          // Garantir assinatura PRO ativa
          try {
            const existingSubs = app.findRecordsByFilter(
              'subscriptions',
              `user = "${u.id}"`,
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
              newSub.set('user', u.id)
              newSub.set('plan', 'annual')
              newSub.set('status', 'active')
              newSub.set('card_brand', 'Mastercard')
              newSub.set('card_last4', '4242')
              newSub.set('start_date', '2025-01-01 00:00:00.000Z')
              newSub.set('end_date', '2035-12-31 23:59:59.000Z')
              app.save(newSub)
            }
          } catch (subErr) {
            console.warn('0062: erro ao atualizar assinatura do admin:', subErr)
          }
        }
      }
    } catch (filterErr) {
      console.warn('0062: erro ao consultar usuarios admin:', filterErr)
    }
  },
  (app) => {
    // Reversão no-op intencional
  },
)
