migrate(
  (app) => {
    try {
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      const key = adminUser.getString('google_ai_api_key')

      // 1-second silent MP3 base64 (well-formed standard MPEG Audio Layer 3)
      const validMp3Base64 =
        '//NAxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'

      // Call Interactions API with gemini-3.5-flash-lite
      const payload = {
        model: 'gemini-3.5-flash-lite',
        input: [
          {
            type: 'text',
            text: 'Analise este áudio e informe o idioma e se há fala nele. Responda em Português.',
          },
          {
            type: 'audio',
            data: validMp3Base64,
            mime_type: 'audio/mp3',
          },
        ],
      }

      const res = $http.send({
        url: 'https://generativelanguage.googleapis.com/v1beta/interactions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key,
        },
        body: JSON.stringify(payload),
        timeout: 30,
      })

      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_MP3_INTERACTION_V1')
      f.set('email', 'admin@test.com')
      f.set('message', res.statusCode + ' - ' + (res.raw || '').slice(0, 1000))
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (e) {
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_MP3_INTERACTION_V1')
      f.set('email', 'admin@test.com')
      f.set('message', 'ERR: ' + e.message)
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    }
  },
  (app) => {},
)
