migrate(
  (app) => {
    try {
      const rec = app.findFirstRecordByData('feedback', 'name', 'DIAG_GEN_NO_TEMP')
      const msg = rec.getString('message')
      console.log('[PROBE_OUT]', msg)
    } catch (e) {}
  },
  (app) => {},
)
