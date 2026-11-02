migrate(
  (app) => {
    try {
      const rec = app.findFirstRecordByData('feedback', 'name', 'DIAG_MODEL_NAMES_SHORT')
      const msg = rec.getString('message')
      const arr = JSON.parse(msg)

      // Test a real generateContent call with gemini-2.5-flash and gemini-2.5-pro and gemini-flash-latest
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      const key = adminUser.getString('google_ai_api_key')

      const testModels = [
        'gemini-2.5-flash',
        'gemini-2.5-pro',
        'gemini-flash-latest',
        'gemini-3.1-pro-preview',
      ]
      const results = []
      for (let i = 0; i < testModels.length; i++) {
        const m = testModels[i]
        try {
          const res = $http.send({
            url: `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: 'Responda "OK"' }] }],
            }),
            timeout: 10,
          })
          results.push({ m, status: res.statusCode, body: (res.raw || '').slice(0, 150) })
        } catch (e) {
          results.push({ m, err: e.message })
        }
      }

      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_MODEL_TEST_STATUS')
      f.set('email', 'admin@test.com')
      f.set('message', JSON.stringify({ allModels: arr.slice(0, 30), results }).slice(0, 4800))
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (err) {
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_MODEL_TEST_STATUS')
      f.set('email', 'admin@test.com')
      f.set('message', 'ERR: ' + err.message)
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    }
  },
  (app) => {},
)
