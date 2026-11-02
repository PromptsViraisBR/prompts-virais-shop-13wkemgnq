migrate(
  (app) => {
    try {
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      const key = adminUser.getString('google_ai_api_key')

      // Test 1: Interactions with models/ prefix
      const res1 = $http.send({
        url: 'https://generativelanguage.googleapis.com/v1/interactions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key,
        },
        body: JSON.stringify({
          model: 'models/gemini-3.5-flash',
          input: 'Olá, responda apenas OK.',
        }),
        timeout: 15,
      })

      // Test 2: generateContent with models/gemini-3-flash-preview
      const res2 = $http.send({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${key}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Olá, responda apenas OK.' }] }],
        }),
        timeout: 15,
      })

      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_MODEL_PREFIX_TEST')
      f.set('email', 'admin@test.com')
      f.set(
        'message',
        'T1 (v1/interactions): ' +
          res1.statusCode +
          ' ' +
          (res1.raw || '').slice(0, 200) +
          ' | T2 (v1beta/generateContent): ' +
          res2.statusCode +
          ' ' +
          (res2.raw || '').slice(0, 200),
      )
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (e) {
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_MODEL_PREFIX_TEST')
      f.set('email', 'admin@test.com')
      f.set('message', 'ERR: ' + e.message)
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    }
  },
  (app) => {},
)
