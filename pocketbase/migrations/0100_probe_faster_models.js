migrate(
  (app) => {
    try {
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      const key = adminUser.getString('google_ai_api_key')
      const testList = [
        'gemini-2.5-flash-lite',
        'gemini-flash-latest',
        'gemini-2.0-flash',
        'gemini-3.5-flash-lite',
      ]
      const out = []
      for (let i = 0; i < testList.length; i++) {
        const m = testList[i]
        try {
          const res = $http.send({
            url: `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: 'Oi' }] }],
            }),
            timeout: 12,
          })
          out.push({ m: m, s: res.statusCode, b: (res.raw || '').slice(0, 100) })
        } catch (e) {
          out.push({ m: m, err: e.message })
        }
      }
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_FAST_MODELS')
      f.set('email', 'admin@test.com')
      f.set('message', JSON.stringify(out))
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (err) {
      // ignore
    }
  },
  (app) => {},
)
