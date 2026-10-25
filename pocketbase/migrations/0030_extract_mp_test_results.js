/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // Vamos desmembrar os resultados e salvar cada teste em um registro separado com status_detail claro
    try {
      const diagRec = app.findFirstRecordByData('payments_history', 'payment_type', 'm29_diag')
      const payloadStr = diagRec.getString('raw_payload')
      const data = JSON.parse(payloadStr)
      const histCol = app.findCollectionByNameOrId('payments_history')

      // Teste users_me
      const rUsers = new Record(histCol)
      rUsers.set('mp_payment_id', `res_users_me_${Date.now()}`)
      rUsers.set('payment_type', 'res_users_me')
      rUsers.set('status', String(data.tests.users_me.statusCode))
      rUsers.set(
        'status_detail',
        JSON.stringify(data.tests.users_me.data || data.tests.users_me.error).slice(0, 500),
      )
      app.save(rUsers)

      // Teste preapproval
      const rPre = new Record(histCol)
      rPre.set('mp_payment_id', `res_preapproval_${Date.now()}`)
      rPre.set('payment_type', 'res_preapproval')
      rPre.set('status', String(data.tests.preapproval_monthly.statusCode))
      rPre.set(
        'status_detail',
        JSON.stringify(
          data.tests.preapproval_monthly.data || data.tests.preapproval_monthly.error,
        ).slice(0, 500),
      )
      app.save(rPre)

      // Teste annual preference
      const rAnn = new Record(histCol)
      rAnn.set('mp_payment_id', `res_pref_annual_${Date.now()}`)
      rAnn.set('payment_type', 'res_pref_annual')
      rAnn.set('status', String(data.tests.preference_annual.statusCode))
      rAnn.set(
        'status_detail',
        JSON.stringify(
          data.tests.preference_annual.data || data.tests.preference_annual.error,
        ).slice(0, 500),
      )
      app.save(rAnn)

      // Teste credits preference
      const rCred = new Record(histCol)
      rCred.set('mp_payment_id', `res_pref_credits_${Date.now()}`)
      rCred.set('payment_type', 'res_pref_credits')
      rCred.set('status', String(data.tests.preference_credits.statusCode))
      rCred.set(
        'status_detail',
        JSON.stringify(
          data.tests.preference_credits.data || data.tests.preference_credits.error,
        ).slice(0, 500),
      )
      app.save(rCred)

      // HMAC
      const rHmac = new Record(histCol)
      rHmac.set('mp_payment_id', `res_hmac_${Date.now()}`)
      rHmac.set('payment_type', 'res_hmac')
      rHmac.set('status', data.tests.hmac_validation ? 'valid_true' : 'valid_false')
      rHmac.set('status_detail', JSON.stringify(data.tests.hmac_validation || {}))
      app.save(rHmac)
    } catch (e) {
      console.warn('Erro na migracao 0030:', e)
    }
  },
  (app) => {
    try {
      const pmts = app.findRecordsByFilter('payments_history', 'payment_type ~ "res_"', '', 50, 0)
      for (let i = 0; i < pmts.length; i++) {
        app.delete(pmts[i])
      }
    } catch (_) {}
  },
)
