migrate(
  (app) => {
    // 1. Ativar ou atualizar a ferramenta 'cenas' (Criador de Cenas) em hypeon_limits
    try {
      const limitsCol = app.findCollectionByNameOrId('hypeon_limits')
      try {
        const rec = app.findFirstRecordByData('hypeon_limits', 'tool_id', 'cenas')
        rec.set('tool_name', 'Criador de Cenas')
        rec.set('free_limit_daily', 2)
        rec.set('pro_limit_daily', 25)
        rec.set('credit_cost', 1)
        rec.set('is_active', true)
        rec.set(
          'description',
          'Transformação de roteiros em cenas prontas com prompts de imagem e vídeo',
        )
        app.save(rec)
      } catch (_) {
        const newRec = new Record(limitsCol)
        newRec.set('tool_id', 'cenas')
        newRec.set('tool_name', 'Criador de Cenas')
        newRec.set('free_limit_daily', 2)
        newRec.set('pro_limit_daily', 25)
        newRec.set('credit_cost', 1)
        newRec.set('is_active', true)
        newRec.set(
          'description',
          'Transformação de roteiros em cenas prontas com prompts de imagem e vídeo',
        )
        app.save(newRec)
      }
    } catch (e) {
      console.warn('Erro ao atualizar ferramenta cenas em hypeon_limits:', e)
    }

    // 2. Adicionar campos 'folder' e 'content_type' em hypeon_projects
    try {
      const projectsCol = app.findCollectionByNameOrId('hypeon_projects')
      let changed = false

      if (!projectsCol.fields.getByName('folder')) {
        projectsCol.fields.add(
          new TextField({
            name: 'folder',
            required: false,
          }),
        )
        changed = true
      }

      if (!projectsCol.fields.getByName('content_type')) {
        projectsCol.fields.add(
          new TextField({
            name: 'content_type',
            required: false,
          }),
        )
        changed = true
      }

      if (!projectsCol.fields.getByName('notes')) {
        projectsCol.fields.add(
          new TextField({
            name: 'notes',
            required: false,
          }),
        )
        changed = true
      }

      if (changed) {
        app.save(projectsCol)
      }
    } catch (e) {
      console.warn('Erro ao adicionar campos em hypeon_projects:', e)
    }

    // 3. Adicionar campos 'folder' em viral_saved
    try {
      const viralCol = app.findCollectionByNameOrId('viral_saved')
      let changedViral = false

      if (!viralCol.fields.getByName('folder')) {
        viralCol.fields.add(
          new TextField({
            name: 'folder',
            required: false,
          }),
        )
        changedViral = true
      }

      if (changedViral) {
        app.save(viralCol)
      }
    } catch (e) {
      console.warn('Erro ao adicionar campos em viral_saved:', e)
    }

    // 4. Coleção hypeon_folders para gerenciar pastas personalizadas (com cor, ícone, ordenação)
    try {
      const usersColId = '_pb_users_auth_'
      const foldersCol = new Collection({
        name: 'hypeon_folders',
        type: 'base',
        listRule: "@request.auth.id != '' && user = @request.auth.id",
        viewRule: "@request.auth.id != '' && user = @request.auth.id",
        createRule: "@request.auth.id != '' && @request.body.user = @request.auth.id",
        updateRule: "@request.auth.id != '' && user = @request.auth.id",
        deleteRule: "@request.auth.id != '' && user = @request.auth.id",
        fields: [
          {
            name: 'user',
            type: 'relation',
            required: true,
            collectionId: usersColId,
            cascadeDelete: true,
            maxSelect: 1,
          },
          { name: 'name', type: 'text', required: true },
          { name: 'color', type: 'text', required: false },
          { name: 'icon', type: 'text', required: false },
          { name: 'description', type: 'text', required: false },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_hypeon_folders_user ON hypeon_folders (user, created DESC)'],
      })
      app.save(foldersCol)
    } catch (e) {
      console.warn('Erro ao criar hypeon_folders:', e)
    }
  },
  (app) => {
    try {
      const f = app.findCollectionByNameOrId('hypeon_folders')
      app.delete(f)
    } catch (_) {}
  },
)
