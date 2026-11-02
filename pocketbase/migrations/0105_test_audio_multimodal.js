migrate(
  (app) => {
    try {
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      const key = adminUser.getString('google_ai_api_key')

      // 1 second base64 silent WAV
      const dummyWavBase64 = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='

      const candidateModels = [
        'gemini-3.5-flash-lite',
        'gemini-3-flash-preview',
        'gemini-2.0-flash',
        'gemini-2.5-pro',
      ]

      const promptText =
        'Transcreva e traduza o áudio se houver fala. Retorne JSON com detected_language, original_transcription, translated_transcription.'

      const results = []

      for (let i = 0; i < candidateModels.length; i++) {
        const model = candidateModels[i]
        try {
          const payload = {
            contents: [
              {
                role: 'user',
                parts: [
                  { text: promptText },
                  {
                    inlineData: {
                      mimeType: 'audio/wav',
                      data: dummyWavBase64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }

          const res = $http.send({
            url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            timeout: 25,
          })

          results.push({
            model,
            status: res.statusCode,
            bodySnippet: res.raw ? res.raw.slice(0, 300) : '',
          })
        } catch (e) {
          results.push({ model, err: e.message })
        }
      }

      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_AUDIO_PROBE')
      f.set('email', 'admin@test.com')
      f.set('message', JSON.stringify(results))
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (err) {
      // ignore
    }
  },
  (app) => {},
)
