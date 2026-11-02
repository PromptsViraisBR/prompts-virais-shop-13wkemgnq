migrate(
  (app) => {
    try {
      const rec = app.findFirstRecordByData('feedback', 'name', 'DIAG_AUDIO_TEST_200')
      const msg = rec.getString('message')

      const f = new Record(app.findCollectionByNameOrId('feedback'))
      f.set('name', 'DIAG_AUDIO_FULL_READ')
      f.set('email', 'admin@test.com')
      // Let's grab the GenContent part (second half)
      const genPart = msg.indexOf('GenContent:') > -1 ? msg.split('GenContent:')[1] : msg
      f.set('message', genPart.slice(0, 500))
      f.set('category', 'bug')
      f.set('status', 'unread')
      app.save(f)
    } catch (e) {}
  },
  (app) => {},
)
