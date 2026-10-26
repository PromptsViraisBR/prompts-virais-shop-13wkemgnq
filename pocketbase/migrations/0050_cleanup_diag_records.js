/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // Limpar os registros que foram criados exclusivamente para este diagnóstico:
    const idsToDelete = [
      'diag_run_prod_eval',
      'diag_sec_token',
      'diag_sec_checkouts',
      'diag_sec_webhook',
      'f_seller_details',
      'f_token_details',
      'f_monthly_details',
      'f_annual_details',
      'f_credits_details',
      'f_webhook_details',
    ]

    idsToDelete.forEach((mpId) => {
      try {
        const rec = app.findFirstRecordByData('payments_history', 'mp_payment_id', mpId)
        if (rec) {
          app.delete(rec)
        }
      } catch (_) {}
    })
  },
  (app) => {},
)
