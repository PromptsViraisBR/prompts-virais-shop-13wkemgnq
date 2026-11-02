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
        'gemini-3.8-flash',
        'gemini-3.5-flash-lite',
        'gemini-3.1-flash',
        'gemini-3-flash-preview',
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
        'gemini-flash-latest',
      ]

      for (let i = 0; i < testList.length; i++) {
        const m = testList[i]
        try {
          const res = $http.send({
            url: `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: 'Hello, reply 1 word.' }] }] }),
            timeout: 10,
          })
          const f = new Record(app.findCollectionByNameOrId('feedback'))
          f.set('name', 'DIAG_CANDIDATE_' + m)
          f.set('email', 'admin@test.com')
          f.set('message', res.statusCode + ' - ' + (res.raw || '').slice(0, 200))
          f.set('category', 'bug')
          f.set('status', 'unread')
          app.save(f)
        } catch (e) {
          const f = new Record(app.findCollectionByNameOrId('feedback'))
          f.set('name', 'DIAG_CANDIDATE_' + m)
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
