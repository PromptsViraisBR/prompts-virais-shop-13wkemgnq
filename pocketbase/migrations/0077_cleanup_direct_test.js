migrate(
  (app) => {
    try {
      const recs = app.findRecordsByFilter(
        'events',
        "event_type = 'hypeon_radar_e2e_test'",
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
