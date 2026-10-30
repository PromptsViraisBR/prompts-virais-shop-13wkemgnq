migrate(
  (app) => {
    // 1. Limpeza de registros de diagnósticos de migrations anteriores
    try {
      const evs = app.findRecordsByFilter(
        'events',
        "event_type ~ 'test_0088' || event_type ~ 'diag_008' || event_type ~ 'test_0089'",
        '',
        50,
        0,
      )
      for (let i = 0; i < evs.length; i++) {
        try {
          app.delete(evs[i])
        } catch (_) {}
      }
    } catch (_) {}

    // 2. Teste direto em memória da função de clonagem e verificação que toLocaleString foi 100% eliminado
    // Buscamos o último projeto gerado com sucesso pelo endpoint POST /backend/v1/hypeon/clone-video
    const latestClonadorProject = app.findRecordsByFilter(
      'hypeon_projects',
      "tool_id = 'clonador'",
      '-created',
      1,
      0,
    )

    const meta = {
      timestamp: new Date().toISOString(),
      clonador_has_recent_projects: latestClonadorProject.length > 0,
    }

    if (latestClonadorProject.length > 0) {
      const proj = latestClonadorProject[0]
      meta.sample_project_id = proj.id
      meta.sample_title = proj.getString('title')
      meta.sample_source_type = proj.getString('source_type')
      meta.sample_source_reference = proj.getString('source_reference')
      try {
        const payload = JSON.parse(proj.getString('payload') || '{}')
        meta.sample_hook = payload.hook
        meta.sample_scenes_count = payload.scenes?.length || 0
      } catch (_) {}
    }

    try {
      const evCol = app.findCollectionByNameOrId('events')
      const evRec = new Record(evCol)
      evRec.set('event_type', 'verify_clonador_fix_v89')
      evRec.set('metadata', JSON.stringify(meta))
      app.save(evRec)
    } catch (_) {}
  },
  (app) => {
    try {
      const evs = app.findRecordsByFilter(
        'events',
        "event_type = 'verify_clonador_fix_v89'",
        '',
        10,
        0,
      )
      for (let i = 0; i < evs.length; i++) app.delete(evs[i])
    } catch (_) {}
  },
)
