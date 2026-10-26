/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    try {
      const records = app.findRecordsByFilter(
        'events',
        'event_type = "pix_validation_test_result"',
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
