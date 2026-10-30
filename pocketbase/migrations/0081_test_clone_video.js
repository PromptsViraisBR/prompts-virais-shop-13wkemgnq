migrate(
  (app) => {
    // Teste de chamada real de ponta a ponta ao hook clone-video
    let diag = { step: 'init' }
    try {
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )

      // Obter URL do Pocketbase
      const pbUrl = $os.getenv('PB_INSTANCE_URL') || 'http://127.0.0.1:8090'
      diag.pbUrl = pbUrl

      // Gerar token de superuser ou user
      // No pocketbase, auth token do user:
      // Token JWT assinado com user collection token secret
      const token = $security.createJWT(
        {
          id: adminUser.id,
          collectionId: adminUser.collection().id,
        },
        adminUser.tokenKey() + adminUser.collection().tokenSecret(),
        3600,
      )

      diag.token_length = token.length

      // Chamada HTTP para /backend/v1/hypeon/clone-video
      const res = $http.send({
        url: pbUrl + '/backend/v1/hypeon/clone-video',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          manual_description: 'Vídeo mostrando uma curiosidade surpreendente sobre a Amazônia',
          category: 'Curiosidades & Fatos',
          mode: 'recriar_formato',
          duration_short: '30s',
        }),
        timeout: 120,
      })

      diag.statusCode = res.statusCode
      diag.raw = res.raw ? res.raw.slice(0, 500) : ''
    } catch (err) {
      diag.error = String(err)
    }

    try {
      const eventsCol = app.findCollectionByNameOrId('events')
      const ev = new Record(eventsCol)
      ev.set('event_type', 'diag_0081_test_clone_video')
      ev.set('metadata', JSON.stringify(diag))
      app.save(ev)
    } catch (_) {}
  },
  (app) => {
    try {
      const evs = app.findRecordsByFilter(
        'events',
        "event_type = 'diag_0081_test_clone_video'",
        '',
        10,
        0,
      )
      for (let i = 0; i < evs.length; i++) {
        app.delete(evs[i])
      }
    } catch (_) {}
  },
)
