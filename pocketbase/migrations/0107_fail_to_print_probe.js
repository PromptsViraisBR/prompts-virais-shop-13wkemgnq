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
      const res = $http.send({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${key}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: 'Transcribe this audio or state if silent.' },
                { inlineData: { mimeType: 'audio/wav', data: dummyWavBase64 } },
              ],
            },
          ],
        }),
        timeout: 15,
      })
      throw new Error('PRO_STATUS: ' + res.statusCode + ' ' + (res.raw || '').slice(0, 300))
    } catch (err) {
      throw new Error('DETAIL: ' + err.message)
    }
  },
  (app) => {},
)
