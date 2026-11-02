migrate(
  (app) => {
    try {
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      const key = adminUser.getString('google_ai_api_key')
      const res = $http.send({
        url: `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
        method: 'GET',
        timeout: 10,
      })
      const data = res.json || {}
      const modelNames = (data.models || [])
        .map((m) => m.name)
        .filter((n) => n.includes('flash') || n.includes('generateContent'))
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_MODEL_NAMES')
      f.set('email', 'admin@test.com')
      f.set('message', JSON.stringify(modelNames))
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (err) {
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_MODEL_NAMES')
      f.set('email', 'admin@test.com')
      f.set('message', 'ERR: ' + err.message)
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    }
  },
  (app) => {},
)
