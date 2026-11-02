migrate(
  (app) => {
    try {
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      const key = adminUser.getString('google_ai_api_key')

      const realMp3Base64 =
        '//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAFAAAAZABUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'

      // Call v1beta/interactions with audio
      const r = $http.send({
        url: 'https://generativelanguage.googleapis.com/v1beta/interactions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key,
        },
        body: JSON.stringify({
          model: 'gemini-3.5-flash',
          input: [
            {
              type: 'text',
              text: 'Você é um transcritor. Identifique o áudio e responda em JSON.',
            },
            { type: 'audio', data: realMp3Base64, mime_type: 'audio/mp3' },
          ],
          response_format: {
            type: 'json',
            schema: {
              type: 'object',
              properties: {
                detected_language: { type: 'string' },
                original_transcription: { type: 'string' },
                translated_transcription: { type: 'string' },
              },
              required: ['detected_language', 'original_transcription', 'translated_transcription'],
            },
          },
        }),
        timeout: 30,
      })

      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_V1BETA_INTERACTION_AUDIO')
      f.set('email', 'admin@test.com')
      f.set('message', r.statusCode + ' - ' + (r.raw || '').slice(0, 500))
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (e) {
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_V1BETA_INTERACTION_AUDIO')
      f.set('email', 'admin@test.com')
      f.set('message', 'ERR: ' + e.message)
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    }
  },
  (app) => {},
)
