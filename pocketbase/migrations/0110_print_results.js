migrate(
  (app) => {
    try {
      const rec = app.findFirstRecordByData('feedback', 'name', 'DIAG_MODEL_TEST_STATUS')
      const parsed = JSON.parse(rec.getString('message'))

      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_JUST_RESULTS')
      f.set('email', 'admin@test.com')
      f.set('message', JSON.stringify(parsed.results))
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (err) {}
  },
  (app) => {},
)
