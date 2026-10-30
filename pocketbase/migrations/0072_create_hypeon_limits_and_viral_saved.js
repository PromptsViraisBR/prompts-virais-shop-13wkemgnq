migrate(
  (app) => {
    // 1. Coleção hypeon_limits: limites por ferramenta HYPEON
    try {
      const hypeonLimits = new Collection({
        name: 'hypeon_limits',
        type: 'base',
        listRule: '', // público/logado pode ler limites
        viewRule: '',
        createRule:
          "@request.auth.id != '' && (@request.auth.is_admin = true || @request.auth.email = 'juniorrodriguesjr123.jr@gmail.com')",
        updateRule:
          "@request.auth.id != '' && (@request.auth.is_admin = true || @request.auth.email = 'juniorrodriguesjr123.jr@gmail.com')",
        deleteRule:
          "@request.auth.id != '' && (@request.auth.is_admin = true || @request.auth.email = 'juniorrodriguesjr123.jr@gmail.com')",
        fields: [
          { name: 'tool_id', type: 'text', required: true }, // ex: 'radar', 'clonador', 'stories', etc
          { name: 'tool_name', type: 'text', required: true },
          { name: 'free_limit_daily', type: 'number', required: false },
          { name: 'pro_limit_daily', type: 'number', required: false },
          { name: 'credit_cost', type: 'number', required: false },
          { name: 'is_active', type: 'bool', required: false },
          { name: 'description', type: 'text', required: false },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE UNIQUE INDEX idx_hypeon_limits_tool ON hypeon_limits (tool_id)'],
      })
      app.save(hypeonLimits)

      // Seed das 8 ferramentas com seus limites padrão
      const defaultTools = [
        {
          tool_id: 'radar',
          tool_name: 'Radar Viral',
          free_limit_daily: 5,
          pro_limit_daily: 100,
          credit_cost: 0,
          is_active: true,
          description: 'Feed inteligente de vídeos e tendências em alta',
        },
        {
          tool_id: 'clonador',
          tool_name: 'Clonador de Estruturas',
          free_limit_daily: 1,
          pro_limit_daily: 30,
          credit_cost: 1,
          is_active: false,
          description: 'Engenharia reversa de vídeos e ganchos virais',
        },
        {
          tool_id: 'stories',
          tool_name: 'Gerador de Stories',
          free_limit_daily: 2,
          pro_limit_daily: 50,
          credit_cost: 1,
          is_active: false,
          description: 'Sequências de engajamento diário e vendas',
        },
        {
          tool_id: 'ideas',
          tool_name: 'Banco de Ideias IA',
          free_limit_daily: 3,
          pro_limit_daily: 80,
          credit_cost: 0,
          is_active: false,
          description: 'Ideias infinitas baseadas no seu nicho',
        },
        {
          tool_id: 'analisador',
          tool_name: 'Analisador de Retenção',
          free_limit_daily: 1,
          pro_limit_daily: 20,
          credit_cost: 1,
          is_active: false,
          description: 'Diagnóstico de roteiros antes de gravar',
        },
        {
          tool_id: 'cenas',
          tool_name: 'Fábrica de Cenas',
          free_limit_daily: 1,
          pro_limit_daily: 25,
          credit_cost: 1,
          is_active: false,
          description: 'Criação de variações de ganchos em lote',
        },
        {
          tool_id: 'tendencias',
          tool_name: 'Tendências por Nicho',
          free_limit_daily: 5,
          pro_limit_daily: 100,
          credit_cost: 0,
          is_active: true,
          description: 'Mapeamento de padrões por nicho do TikTok/Shopee',
        },
        {
          tool_id: 'biblioteca',
          tool_name: 'Biblioteca Viral',
          free_limit_daily: 10,
          pro_limit_daily: 500,
          credit_cost: 0,
          is_active: true,
          description: 'Coleção pessoal de vídeos e referências salvas',
        },
      ]

      for (const t of defaultTools) {
        try {
          const rec = new Record(hypeonLimits)
          rec.set('tool_id', t.tool_id)
          rec.set('tool_name', t.tool_name)
          rec.set('free_limit_daily', t.free_limit_daily)
          rec.set('pro_limit_daily', t.pro_limit_daily)
          rec.set('credit_cost', t.credit_cost)
          rec.set('is_active', t.is_active)
          rec.set('description', t.description)
          app.save(rec)
        } catch (_) {
          // registro pode já existir se replay
        }
      }
    } catch (e) {
      console.warn('Erro ao criar hypeon_limits:', e)
    }

    // 2. Coleção viral_saved: salvar referências do Radar Viral
    try {
      const usersColId = '_pb_users_auth_'
      const viralSaved = new Collection({
        name: 'viral_saved',
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
          { name: 'external_id', type: 'text', required: true }, // id do vídeo na plataforma de origem
          { name: 'platform', type: 'text', required: true }, // tiktok, instagram, youtube, facebook
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'text', required: false },
          { name: 'thumbnail_url', type: 'text', required: false },
          { name: 'original_url', type: 'text', required: true },
          { name: 'author_name', type: 'text', required: false },
          { name: 'author_handle', type: 'text', required: false },
          { name: 'views_count', type: 'number', required: false },
          { name: 'likes_count', type: 'number', required: false },
          { name: 'comments_count', type: 'number', required: false },
          { name: 'shares_count', type: 'number', required: false },
          { name: 'niche', type: 'text', required: false },
          { name: 'growth_score', type: 'number', required: false },
          { name: 'published_at', type: 'text', required: false },
          { name: 'notes', type: 'text', required: false },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE UNIQUE INDEX idx_viral_saved_user_ext ON viral_saved (user, external_id, platform)',
          'CREATE INDEX idx_viral_saved_user_created ON viral_saved (user, created DESC)',
        ],
      })
      app.save(viralSaved)
    } catch (e) {
      console.warn('Erro ao criar viral_saved:', e)
    }
  },
  (app) => {
    try {
      const vs = app.findCollectionByNameOrId('viral_saved')
      app.delete(vs)
    } catch (_) {}
    try {
      const hl = app.findCollectionByNameOrId('hypeon_limits')
      app.delete(hl)
    } catch (_) {}
  },
)
