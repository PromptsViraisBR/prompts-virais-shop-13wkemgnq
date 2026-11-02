migrate(
  (app) => {
    try {
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      const key = adminUser.getString('google_ai_api_key')
      const res = $http.send({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${key}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Hello' }] }],
        }),
        timeout: 30,
      })
      const bodyObj = res.json || {}
      const textOut =
        (bodyObj.candidates &&
          bodyObj.candidates[0] &&
          bodyObj.candidates[0].content &&
          bodyObj.candidates[0].content.parts[0] &&
          bodyObj.candidates[0].content.parts[0].text) ||
        res.raw ||
        ''
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_38_TEST')
      f.set('email', 'admin@test.com')
      f.set('message', JSON.stringify({ status: res.statusCode, text: textOut.slice(0, 500) }))
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (err) {
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_38_TEST')
      f.set('email', 'admin@test.com')
      f.set('message', 'EXC: ' + err.message)
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    }
  },
  (app) => {},
)
