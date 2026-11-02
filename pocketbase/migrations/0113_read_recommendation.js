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
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'hi' }] }] }),
        timeout: 10,
      })
      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_25_FLASH_FULL_ERR')
      f.set('email', 'admin@test.com')
      f.set('message', (res.raw || '').slice(0, 1000))
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (err) {}
  },
  (app) => {},
)
