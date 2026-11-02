migrate(
  (app) => {
    try {
      const rec = app.findFirstRecordByData('feedback', 'name', 'DIAG_INTERACTION_AUDIO')
      const msg = rec.getString('message')

      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      const key = adminUser.getString('google_ai_api_key')

      // Let's test generateContent WITHOUT temperature (defaults) with audio
      const dummyWavBase64 = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
      const resGen = $http.send({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${key}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: 'Analise este áudio e responda OK.' },
                { inlineData: { mimeType: 'audio/wav', data: dummyWavBase64 } },
              ],
            },
          ],
        }),
        timeout: 15,
      })

      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_GEN_NO_TEMP')
      f.set('email', 'admin@test.com')
      f.set(
        'message',
        'INTERACTION: ' +
          msg.slice(0, 150) +
          ' | GEN: ' +
          resGen.statusCode +
          ' ' +
          (resGen.raw || '').slice(0, 200),
      )
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (e) {
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_GEN_NO_TEMP')
      f.set('email', 'admin@test.com')
      f.set('message', 'ERR: ' + e.message)
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    }
  },
  (app) => {},
)
