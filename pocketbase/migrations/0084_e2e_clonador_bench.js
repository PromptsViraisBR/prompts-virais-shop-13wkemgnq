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

      // Teste 1: Descrição manual
      const t0 = Date.now()
      const resManual = $http.send({
        url: pbUrl + '/backend/v1/hypeon/clone-video',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          manual_description:
            'Vídeo curto sobre um hábito matinal incomum que dobra o foco e energia',
          category: 'Motivacional & Mindset',
          mode: 'recriar_formato',
          duration_short: '30s',
        }),
        timeout: 120,
      })
      diag.manual_duration_ms = Date.now() - t0
      diag.manual_status = resManual.statusCode
      try {
        const data = JSON.parse(resManual.raw)
        diag.manual_success = data.success
        diag.manual_title = data.data?.title
        diag.manual_scenes_count = data.data?.scenes?.length
        diag.manual_hook = (data.data?.hook || '').slice(0, 80)
      } catch (e) {
        diag.manual_parse_error = String(e)
      }

      // Teste 2: Link do YouTube Shorts
      const t1 = Date.now()
      const resYt = $http.send({
        url: pbUrl + '/backend/v1/hypeon/clone-video',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          video_url: 'https://youtube.com/shorts/3f5t3gqWqLk',
          category: 'Curiosidades & Fatos',
          mode: 'recriar_formato',
          duration_short: '30s',
        }),
        timeout: 120,
      })
      diag.yt_duration_ms = Date.now() - t1
      diag.yt_status = resYt.statusCode
      try {
        const dataYt = JSON.parse(resYt.raw)
        diag.yt_success = dataYt.success
        diag.yt_title = dataYt.data?.title
        diag.yt_scenes_count = dataYt.data?.scenes?.length
        diag.yt_has_metadata = !!dataYt.youtube_metadata
      } catch (e) {
        diag.yt_parse_error = String(e)
      }

      diag.step = 'completed'
    } catch (err) {
      diag.error = String(err)
    }

    try {
      const eventsCol = app.findCollectionByNameOrId('events')
      const ev = new Record(eventsCol)
      ev.set('event_type', 'diag_0084_e2e_clonador_bench')
      ev.set('metadata', JSON.stringify(diag))
      app.save(ev)
    } catch (_) {}
  },
  (app) => {
    try {
      const evs = app.findRecordsByFilter(
        'events',
        "event_type = 'diag_0084_e2e_clonador_bench'",
        '',
        10,
        0,
      )
      for (let i = 0; i < evs.length; i++) app.delete(evs[i])
    } catch (_) {}
  },
)
