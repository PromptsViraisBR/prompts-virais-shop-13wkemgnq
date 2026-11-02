migrate(
  (app) => {
    try {
      const rec = app.findFirstRecordByData('feedback', 'name', 'DIAG_AUDIO_PROBE')
      const text = rec.getString('message')
      console.log('[AUDIO_PROBE_RESULT]', text)
    } catch (err) {}
  },
  (app) => {},
)
