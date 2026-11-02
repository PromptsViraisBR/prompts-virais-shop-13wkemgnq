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
        url: 'https://generativelanguage.googleapis.com/v1beta/interactions',
        method: 'POST',
        headers: {
          'x-goog-api-key': key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemini-3.8-flash',
          input: [{ type: 'text', text: 'Responda OK' }],
        }),
        timeout: 10,
      })
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_INTERACTIONS')
      f.set('email', 'admin@test.com')
      f.set('message', JSON.stringify({ s: res.statusCode, b: (res.raw || '').slice(0, 300) }))
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (err) {
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_INTERACTIONS')
      f.set('email', 'admin@test.com')
      f.set('message', 'EXC: ' + err.message)
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    }
  },
  (app) => {},
)
