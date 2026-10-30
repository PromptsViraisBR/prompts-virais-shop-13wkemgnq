migrate(
  (app) => {
    try {
      const evs = app.findRecordsByFilter(
        'events',
        "event_type = 'diag_0085_test_speed'",
        '-created',
        1,
        0,
      )
      if (evs.length > 0) {
        const rawMeta = evs[0].getString('metadata') || '{}'
        // Copiar dados chaves para a session_id para fácil inspeção
        const data = JSON.parse(rawMeta)
        const summary = `M:${data.manual_code}(${data.manual_ms}ms) Y:${data.yt_code}(${data.yt_ms}ms) S:${data.step}`
        evs[0].set('session_id', summary.slice(0, 100))
        app.save(evs[0])
      }
    } catch (_) {}
  },
  (app) => {},
)
