migrate(
  (app) => {
    try {
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      const key = adminUser.getString('google_ai_api_key')

      const validMp3Base64 =
        '//NAxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'

      // Payload A: Content object with type: 'audio' and models/ prefix
      const resA = $http.send({
        url: 'https://generativelanguage.googleapis.com/v1/interactions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key,
        },
        body: JSON.stringify({
          model: 'models/gemini-3.5-flash',
          input: [
            { type: 'text', text: 'Analise este áudio e diga se há fala.' },
            { type: 'audio', data: validMp3Base64, mime_type: 'audio/mp3' },
          ],
        }),
        timeout: 25,
      })

      // Payload B: generateContent with models/gemini-3.5-flash
      const resB = $http.send({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${key}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: 'Analise este áudio e diga se há fala.' },
                { inlineData: { mimeType: 'audio/mp3', data: validMp3Base64 } },
              ],
            },
          ],
        }),
        timeout: 25,
      })

      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_AUDIO_TEST_200')
      f.set('email', 'admin@test.com')
      f.set(
        'message',
        'Interactions: ' +
          resA.statusCode +
          ' ' +
          (resA.raw || '').slice(0, 300) +
          ' | GenContent: ' +
          resB.statusCode +
          ' ' +
          (resB.raw || '').slice(0, 300),
      )
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (e) {
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_AUDIO_TEST_200')
      f.set('email', 'admin@test.com')
      f.set('message', 'ERR: ' + e.message)
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    }
  },
  (app) => {},
)
