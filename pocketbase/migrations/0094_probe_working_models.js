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
        'gemini-3.8-flash',
        'gemini-3.6-flash',
        'gemini-3.5-flash-lite',
        'gemini-3-flash-preview',
        'gemini-2.0-flash',
        'gemini-2.0-flash-exp',
      ]
      const tested = []
      for (let i = 0; i < models.length; i++) {
        const m = models[i]
        const res = $http.send({
          url: `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Hello, answer in 1 word: 'OK'" }] }],
          }),
          timeout: 10,
        })
        tested.push({ model: m, status: res.statusCode, raw: (res.raw || '').slice(0, 150) })
      }
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_MODELS')
      f.set('email', 'admin@test.com')
      f.set('message', JSON.stringify(tested))
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (err) {
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_MODELS')
      f.set('email', 'admin@test.com')
      f.set('message', 'ERR: ' + err.message)
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    }
  },
  (app) => {},
)
