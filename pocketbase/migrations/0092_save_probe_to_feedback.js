migrate(
  (app) => {
    try {
      const res = $http.send({
        url: 'https://prompts-virais-shop-16b33.shrd01.internal.goskip.dev/backend/v1/test-transcribe-probe',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        timeout: 30,
      })
      const feedback = new Record(app.findCollectionByNameOrId('feedback'))
      feedback.set('name', 'DIAG_PROBE')
      feedback.set('email', 'admin@test.com')
      feedback.set('message', (res.raw || '').slice(0, 4000))
      feedback.set('category', 'bug')
      feedback.set('status', 'unread')
      app.save(feedback)
    } catch (err) {
      // ignore
    }
  },
  (app) => {},
)
