migrate(
  (app) => {
    try {
      const rec = app.findFirstRecordByData('feedback', 'name', 'DIAG_JUST_RESULTS')
      const parsed = JSON.parse(rec.getString('message'))

      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_DETAILED_STATUSES')
      f.set('email', 'admin@test.com')
      // map each item: { m, status, msg: (body snippet) }
      const summary = parsed.map((p) => ({
        m: p.m,
        status: p.status,
        snippet: (p.body || '').replace(/\s+/g, ' ').slice(0, 150),
      }))
      f.set('message', JSON.stringify(summary))
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (err) {}
  },
  (app) => {},
)
