migrate(
  (app) => {
    try {
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      const key = adminUser.getString('google_ai_api_key')

      const dummyWavBase64 = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='

      // Test 1: Interactions API with audio
      const res1 = $http.send({
        url: 'https://generativelanguage.googleapis.com/v1beta/interactions',
        method: 'POST',
        headers: {
          'x-goog-api-key': key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemini-3.5-flash-lite',
          input: [
            { type: 'text', text: 'Analise este áudio e diga se há fala.' },
            {
              type: 'audio',
              data: dummyWavBase64,
              mime_type: 'audio/wav',
            },
          ],
        }),
        timeout: 20,
      })

      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_INTERACTION_AUDIO')
      f.set('email', 'admin@test.com')
      f.set('message', res1.statusCode + ' - ' + (res1.raw || '').slice(0, 300))
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (e) {
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_INTERACTION_AUDIO')
      f.set('email', 'admin@test.com')
      f.set('message', 'ERR: ' + e.message)
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    }
  },
  (app) => {},
)
