migrate(
  (app) => {
    try {
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      const key = adminUser.getString('google_ai_api_key')
      const fullMsg = app
        .findFirstRecordByData('feedback', 'name', 'DIAG_INTERACTIONS_ALL')
        .getString('message')

      // Also test generateContent with gemini-3.5-flash-lite
      let genContentRes = null
      try {
        const gRes = $http.send({
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${key}`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Hello, reply OK' }] }],
          }),
          timeout: 10,
        })
        genContentRes = { s: gRes.statusCode, b: (gRes.raw || '').slice(0, 150) }
      } catch (e) {
        genContentRes = { err: e.message }
      }

      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_FINAL_CONFIRM')
      f.set('email', 'admin@test.com')
      f.set('message', JSON.stringify({ fullMsg: fullMsg.slice(0, 500), genContentRes }))
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (err) {
      // ignore
    }
  },
  (app) => {},
)
