migrate(
  (app) => {
    try {
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      const key = adminUser.getString('google_ai_api_key')

      // Canonical 44-byte standard PCM 1-second 8000Hz 8-bit mono silence WAV
      // RIFF....WAVEfmt ....data....
      // Exactly 44 bytes:
      // 52 49 46 46 (RIFF)
      // 24 00 00 00 (chunk size 36)
      // 57 41 56 45 (WAVE)
      // 66 6d 74 20 (fmt )
      // 10 00 00 00 (subchunk1 size 16)
      // 01 00 (audio format 1: PCM)
      // 01 00 (channels 1: mono)
      // 40 1f 00 00 (sample rate 8000)
      // 40 1f 00 00 (byte rate 8000)
      // 01 00 (block align 1)
      // 08 00 (bits per sample 8)
      // 64 61 74 61 (data)
      // 00 00 00 00 (subchunk2 size 0)
      // Base64 encoding of these 44 bytes:
      const cleanWavBase64 = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='

      // Test with gemini-3.5-flash-lite and gemini-3-flash-preview
      const testModels = ['gemini-3.5-flash-lite', 'gemini-3-flash-preview', 'gemini-3.5-flash']
      const results = []

      for (let i = 0; i < testModels.length; i++) {
        const m = testModels[i]
        const res = $http.send({
          url: `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: 'Você é um transcritor. Analise este áudio e responda em JSON: {"detected_language":"Português","original_transcription":"silêncio","translated_transcription":"silence"}',
                  },
                  {
                    inlineData: {
                      mimeType: 'audio/wav',
                      data: cleanWavBase64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
          timeout: 20,
        })
        results.push({
          model: m,
          status: res.statusCode,
          bodySnippet: (res.raw || '').slice(0, 150),
        })
      }

      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_TEST_REAL_MODELS_200')
      f.set('email', 'admin@test.com')
      f.set('message', JSON.stringify(results))
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (e) {
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_TEST_REAL_MODELS_200')
      f.set('email', 'admin@test.com')
      f.set('message', 'ERR: ' + e.message)
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    }
  },
  (app) => {},
)
