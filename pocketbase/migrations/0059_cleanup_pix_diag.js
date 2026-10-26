/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // Limpar os registros de diagnóstico criados pelos testes anteriores
    try {
      const records = app.findRecordsByFilter(
        'events',
        'event_type = "diag_pix_probe_result"',
        '',
        20,
        0,
      )
      for (let i = 0; i < records.length; i++) {
        app.delete(records[i])
      }
    } catch (_) {}
  },
  () => {},
)
