migrate(
  (app) => {
    const usersColId = '_pb_users_auth_'

    // 1. Atualizar limites padrão do HYPEON ativando as 4 ferramentas da Fase 3
    try {
      const limitsCol = app.findCollectionByNameOrId('hypeon_limits')
      const toolsToActivate = [
        {
          id: 'clonador',
          name: 'Clonador Viral',
          free: 2,
          pro: 25,
          cost: 1,
          desc: 'Engenharia reversa e criação de roteiros originais',
        },
        {
          id: 'stories',
          name: 'HYPEON Stories',
          free: 2,
          pro: 30,
          cost: 1,
          desc: 'Histórias em cenas e episódios com continuidade',
        },
        {
          id: 'ideas',
          name: 'HYPEON Ideas',
          free: 3,
          pro: 50,
          cost: 0,
          desc: 'Banco de ideias infinitas com estimativa de engajamento',
        },
        {
          id: 'analisador',
          name: 'Analisador de Vídeos',
          free: 2,
          pro: 25,
          cost: 1,
          desc: 'Diagnóstico de retenção e notas de 0 a 100 por critério',
        },
      ]

      for (const t of toolsToActivate) {
        try {
          const rec = app.findFirstRecordByData('hypeon_limits', 'tool_id', t.id)
          rec.set('tool_name', t.name)
          rec.set('free_limit_daily', t.free)
          rec.set('pro_limit_daily', t.pro)
          rec.set('credit_cost', t.cost)
          rec.set('is_active', true)
          rec.set('description', t.desc)
          app.save(rec)
        } catch (_) {
          // Criar se não existir
          const newRec = new Record(limitsCol)
          newRec.set('tool_id', t.id)
          newRec.set('tool_name', t.name)
          newRec.set('free_limit_daily', t.free)
          newRec.set('pro_limit_daily', t.pro)
          newRec.set('credit_cost', t.cost)
          newRec.set('is_active', true)
          newRec.set('description', t.desc)
          app.save(newRec)
        }
      }
    } catch (e) {
      console.warn('Erro ao atualizar hypeon_limits:', e)
    }

    // 2. Coleção hypeon_usage: controle diário de consumo server-side por ferramenta HYPEON
    try {
      const hypeonUsage = new Collection({
        name: 'hypeon_usage',
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
          { name: 'tool_id', type: 'text', required: true }, // 'clonador', 'stories', 'ideas', 'analisador'
          { name: 'date', type: 'text', required: true }, // 'YYYY-MM-DD' em BRT
          { name: 'count', type: 'number', required: false },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE UNIQUE INDEX idx_hypeon_usage_u_t_d ON hypeon_usage (user, tool_id, date)',
          'CREATE INDEX idx_hypeon_usage_date ON hypeon_usage (date)',
        ],
      })
      app.save(hypeonUsage)
    } catch (e) {
      console.warn('Erro ao criar hypeon_usage:', e)
    }

    // 3. Coleção hypeon_projects: projetos salvos do Clonador Viral, Stories, Ideas e Analisador
    try {
      const hypeonProjects = new Collection({
        name: 'hypeon_projects',
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
          { name: 'tool_id', type: 'text', required: true }, // 'clonador', 'stories', 'ideas', 'analisador'
          { name: 'title', type: 'text', required: true },
          { name: 'category', type: 'text', required: false },
          { name: 'mode', type: 'text', required: false },
          { name: 'source_type', type: 'text', required: false }, // 'youtube_link', 'video_upload', 'text_description', etc.
          { name: 'source_reference', type: 'text', required: false },
          { name: 'payload', type: 'json', required: false }, // Dados estruturados completos gerados
          { name: 'is_favorite', type: 'bool', required: false },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE INDEX idx_hypeon_projects_user_tool ON hypeon_projects (user, tool_id, created DESC)',
        ],
      })
      app.save(hypeonProjects)
    } catch (e) {
      console.warn('Erro ao criar hypeon_projects:', e)
    }

    // 4. Coleção hypeon_series: banco de personagens e continuidade para HYPEON Stories
    try {
      const hypeonSeries = new Collection({
        name: 'hypeon_series',
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
          { name: 'series_title', type: 'text', required: true },
          { name: 'category', type: 'text', required: true },
          { name: 'description', type: 'text', required: false },
          { name: 'characters', type: 'json', required: false }, // Array de personagens: [{ id, name, appearance, clothes, personality, role }]
          { name: 'recurring_settings', type: 'json', required: false }, // Cenários recorrentes
          { name: 'episodes_count', type: 'number', required: false },
          { name: 'last_events_summary', type: 'text', required: false }, // Acontecimentos anteriores para o próximo episódio
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_hypeon_series_user ON hypeon_series (user, created DESC)'],
      })
      app.save(hypeonSeries)
    } catch (e) {
      console.warn('Erro ao criar hypeon_series:', e)
    }
  },
  (app) => {
    try {
      const hs = app.findCollectionByNameOrId('hypeon_series')
      app.delete(hs)
    } catch (_) {}
    try {
      const hp = app.findCollectionByNameOrId('hypeon_projects')
      app.delete(hp)
    } catch (_) {}
    try {
      const hu = app.findCollectionByNameOrId('hypeon_usage')
      app.delete(hu)
    } catch (_) {}
  },
)
