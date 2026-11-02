migrate(
  (app) => {
    try {
      const rec = app.findFirstRecordByData('feedback', 'name', 'DIAG_DETAILED_STATUSES')
      const parsed = JSON.parse(rec.getString('message'))

      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i]
        const f = new Record(app.findCollectionByNameOrId('feedback'))
        f.set('name', 'DIAG_ITEM_' + item.m)
        f.set('email', 'admin@test.com')
        f.set('message', item.status + ': ' + item.snippet)
        f.set('category', 'bug')
        f.set('status', 'unread')
        app.save(f)
      }
    } catch (err) {}
  },
  (app) => {},
)
