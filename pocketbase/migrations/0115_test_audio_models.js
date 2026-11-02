migrate(
  (app) => {
    try {
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      const key = adminUser.getString('google_ai_api_key')

      // Let's test audio with gemini-3.5-flash-lite and gemini-3-flash-preview
      const dummyWavBase64 = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
      const models = ['gemini-3.5-flash-lite', 'gemini-3-flash-preview', 'gemini-3.8-flash']

      for (let i = 0; i < models.length; i++) {
        const m = models[i]
        try {
          const res = $http.send({
            url: `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { text: 'Analise este áudio e diga se há fala.' },
                    { inlineData: { mimeType: 'audio/wav', data: dummyWavBase64 } },
                  ],
                },
              ],
            }),
            timeout: 15,
          })
          const f = new Record(app.findCollectionByNameOrId('feedback'))
          f.set('name', 'DIAG_AUDIO_' + m)
          f.set('email', 'admin@test.com')
          f.set('message', res.statusCode + ' - ' + (res.raw || '').slice(0, 300))
          f.set('category', 'bug')
          f.set('status', 'unread')
          app.save(f)
        } catch (e) {
          const f = new Record(app.findCollectionByNameOrId('feedback'))
          f.set('name', 'DIAG_AUDIO_' + m)
          f.set('email', 'admin@test.com')
          f.set('message', 'ERR: ' + e.message)
          f.set('category', 'bug')
          f.set('status', 'unread')
          app.save(f)
        }
      }
    } catch (err) {}
  },
  (app) => {},
)
