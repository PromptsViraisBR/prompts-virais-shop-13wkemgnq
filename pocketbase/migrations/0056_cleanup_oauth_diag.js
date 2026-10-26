/// <reference path="../pb_data/types.d.ts" />

/**
 * Migration 0056: Limpeza do registro temporário de diagnóstico OAuth em payments_history.
 */
migrate(
  (app) => {
    try {
      app.db().newQuery("DELETE FROM payments_history WHERE payment_type = 'oauth_diag'").execute()
    } catch (_) {}
  },
  (app) => {},
)
