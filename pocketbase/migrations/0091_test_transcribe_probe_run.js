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
      console.log(
        '[probe-res] status:',
        res.statusCode,
        'body:',
        res.raw ? res.raw.slice(0, 1000) : '',
      )
    } catch (err) {
      console.log('[probe-res] error:', err.message)
    }
  },
  (app) => {},
)
