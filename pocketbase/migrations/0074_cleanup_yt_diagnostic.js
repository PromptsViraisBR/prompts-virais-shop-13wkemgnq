migrate(
  (app) => {
    try {
      const recs = app.findRecordsByFilter(
        'events',
        "event_type = 'hypeon_yt_diagnostic'",
        '',
        10,
        0,
      )
      for (const r of recs) {
        app.delete(r)
      }
    } catch (_) {}
  },
  () => {},
)
