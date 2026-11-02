migrate(
  (app) => {
    try {
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      const key = adminUser.getString('google_ai_api_key')
      const models = [
        'gemini-3.5-flash-lite',
        'gemini-3-flash-preview',
        'gemini-2.0-flash',
        'gemini-2.5-pro',
      ]
      const tested = []
      for (let i = 0; i < models.length; i++) {
        const m = models[i]
        try {
          const res = $http.send({
            url: 'https://generativelanguage.googleapis.com/v1beta/interactions',
            method: 'POST',
            headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: m,
              input: [{ type: 'text', text: 'Responda OK' }],
            }),
            timeout: 10,
          })
          tested.push({ m, s: res.statusCode, b: (res.raw || '').slice(0, 150) })
        } catch (e) {
          tested.push({ m, err: e.message })
        }
      }
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_INTERACTIONS_ALL')
      f.set('email', 'admin@test.com')
      f.set('message', JSON.stringify(tested))
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (err) {
      // ignore
    }
  },
  (app) => {},
)
