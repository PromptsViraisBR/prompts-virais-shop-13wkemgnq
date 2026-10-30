migrate(
  (app) => {
    let diag = { step: 'init' }
    try {
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      const pbUrl =
        $os.getenv('PB_INSTANCE_URL') ||
        'https://prompts-virais-shop-16b33.shrd01.internal.goskip.dev'
      const token = adminUser.newAuthToken()

      // Teste 1: Manual
      const t0 = Date.now()
      const resManual = $http.send({
        url: pbUrl + '/backend/v1/hypeon/clone-video',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          manual_description: '3 hábitos diários que aumentam o foco mental instantaneamente',
          category: 'Motivacional & Mindset',
          mode: 'recriar_formato',
          duration_short: '30s',
        }),
        timeout: 120,
      })
      diag.manual_ms = Date.now() - t0
      diag.manual_code = resManual.statusCode
      if (resManual.statusCode === 200) {
        const data = JSON.parse(resManual.raw)
        diag.manual_title = data.data?.title
        diag.manual_scenes = data.data?.scenes?.length
      }

      // Teste 2: YouTube Link
      const t1 = Date.now()
      const resYt = $http.send({
        url: pbUrl + '/backend/v1/hypeon/clone-video',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          video_url: 'https://youtube.com/shorts/dQw4w9WgXcQ',
          category: 'Curiosidades & Fatos',
          mode: 'recriar_formato',
          duration_short: '30s',
        }),
        timeout: 120,
      })
      diag.yt_ms = Date.now() - t1
      diag.yt_code = resYt.statusCode
      if (resYt.statusCode === 200) {
        const data = JSON.parse(resYt.raw)
        diag.yt_title = data.data?.title
        diag.yt_scenes = data.data?.scenes?.length
        diag.yt_meta = !!data.youtube_metadata
      }

      diag.step = 'completed'
    } catch (err) {
      diag.err = String(err)
    }

    try {
      const eventsCol = app.findCollectionByNameOrId('events')
      const ev = new Record(eventsCol)
      ev.set('event_type', 'diag_0085_test_speed')
      ev.set('metadata', JSON.stringify(diag))
      app.save(ev)
    } catch (_) {}
  },
  (app) => {
    try {
      const evs = app.findRecordsByFilter(
        'events',
        "event_type = 'diag_0085_test_speed'",
        '',
        10,
        0,
      )
      for (let i = 0; i < evs.length; i++) app.delete(evs[i])
    } catch (_) {}
  },
)
