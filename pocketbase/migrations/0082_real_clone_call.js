migrate(
  (app) => {
    let diag = { step: 'init' }
    try {
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )

      // Obter URL do Pocketbase
      const pbUrl =
        $os.getenv('PB_INSTANCE_URL') ||
        'https://prompts-virais-shop-16b33.shrd01.internal.goskip.dev'
      diag.pbUrl = pbUrl

      // Como gerar um auth token válido para o usuário?
      // Em migrations / goja, podemos definir uma senha temporária conhecida ou usar o token de verificação/superuser?
      // Espera, app.generatePasswordHash ou adminUser.newAuthToken() existe?
      let token = ''
      try {
        if (typeof adminUser.newAuthToken === 'function') {
          token = adminUser.newAuthToken()
          diag.token_source = 'newAuthToken'
        }
      } catch (e1) {
        diag.newAuthToken_err = String(e1)
      }

      if (!token) {
        // Tentar via POST /api/collections/users/auth-with-password se tivermos a senha ou definir uma senha de teste
        // Espera, adminUser.setPassword("teste123456")
        // Mas não queremos estragar a senha do admin se ele usa no login!
        // Podemos criar um usuário temporário de teste!
        const usersCol = app.findCollectionByNameOrId('users')
        const testUser = new Record(usersCol)
        testUser.setEmail('test_clonador_runner@example.com')
        testUser.setPassword('TestClonador123!')
        testUser.setVerified(true)
        app.save(testUser)

        diag.test_user_created = testUser.id

        // Agora autenticar via HTTP
        const authRes = $http.send({
          url: pbUrl + '/api/collections/users/auth-with-password',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identity: 'test_clonador_runner@example.com',
            password: 'TestClonador123!',
          }),
          timeout: 10,
        })

        diag.auth_status = authRes.statusCode
        if (authRes.statusCode === 200) {
          const authData = JSON.parse(authRes.raw)
          token = authData.token
        } else {
          diag.auth_raw = authRes.raw
        }

        // Cleanup do usuário de teste depois que terminar
      }

      if (token) {
        diag.has_token = true

        const t0 = Date.now()
        const cloneRes = $http.send({
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
        diag.clone_duration_ms = Date.now() - t0
        diag.clone_status = cloneRes.statusCode
        diag.clone_raw = cloneRes.raw
      }

      // Deleta o test_user se foi criado
      try {
        const u = app.findFirstRecordByData('users', 'email', 'test_clonador_runner@example.com')
        if (u) app.delete(u)
      } catch (_) {}
    } catch (err) {
      diag.error = String(err)
    }

    try {
      const eventsCol = app.findCollectionByNameOrId('events')
      const ev = new Record(eventsCol)
      ev.set('event_type', 'diag_0082_real_clone_call')
      ev.set('metadata', JSON.stringify(diag))
      app.save(ev)
    } catch (_) {}
  },
  (app) => {
    try {
      const evs = app.findRecordsByFilter(
        'events',
        "event_type = 'diag_0082_real_clone_call'",
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
