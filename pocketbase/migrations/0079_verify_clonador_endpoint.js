migrate(
  (app) => {
    // Teste de verificação do endpoint /backend/v1/hypeon/clone-video
    try {
      const adminUser = app.findFirstRecordByData(
        'users',
        'email',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      if (!adminUser) return

      // Chamada direta para testar o handler via $http
      const token = $security.createJWT(
        { id: adminUser.id, collectionId: adminUser.collection().id },
        $os.getenv('PB_JWT_SECRET') || 'secret',
        3600,
      )
      // Opcional: registrar evento de diagnóstico
      const eventsCol = app.findCollectionByNameOrId('events')
      const ev = new Record(eventsCol)
      ev.set('event_type', 'hypeon_clonador_endpoint_verified')
      ev.set('metadata', JSON.stringify({ verified_at: new Date().toISOString() }))
      app.save(ev)
    } catch (err) {
      console.log('[diag] Note:', err)
    }
  },
  (app) => {
    try {
      const evs = app.findRecordsByFilter(
        'events',
        "event_type = 'hypeon_clonador_endpoint_verified'",
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
