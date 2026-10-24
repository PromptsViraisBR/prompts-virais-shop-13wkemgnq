migrate(
  (app) => {
    // 1. Assinaturas (subscriptions)
    const subscriptions = new Collection({
      name: 'subscriptions',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != '' && user = @request.auth.id",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user = @request.auth.id",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'plan',
          type: 'select',
          required: true,
          values: ['free', 'monthly', 'annual'],
          maxSelect: 1,
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          values: ['active', 'cancelled', 'expired'],
          maxSelect: 1,
        },
        {
          name: 'start_date',
          type: 'date',
        },
        {
          name: 'end_date',
          type: 'date',
        },
        {
          name: 'card_last4',
          type: 'text',
        },
        {
          name: 'card_brand',
          type: 'text',
        },
        {
          name: 'created',
          type: 'autodate',
          onCreate: true,
          onUpdate: false,
        },
        {
          name: 'updated',
          type: 'autodate',
          onCreate: true,
          onUpdate: true,
        },
      ],
      indexes: [
        'CREATE INDEX idx_subscriptions_user ON subscriptions (user)',
        'CREATE INDEX idx_subscriptions_status ON subscriptions (status)',
      ],
    })
    app.save(subscriptions)

    // 2. Prompts
    const prompts = new Collection({
      name: 'prompts',
      type: 'base',
      listRule: '', // leitura pública de prompts permitida (com controle de is_free ou premium no app)
      viewRule: '',
      createRule: "@request.auth.id != ''", // administradores ou autenticados
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
        {
          name: 'niche',
          type: 'select',
          required: true,
          values: [
            'moda_feminina',
            'moda_masculina',
            'fitness_academia',
            'moda_praia',
            'acessorios_calcados',
            'streetwear_casual',
            'infantil_kids',
            'lingerie_pijamas',
          ],
          maxSelect: 1,
        },
        {
          name: 'style',
          type: 'select',
          required: true,
          values: ['pov', 'modelo', 'unboxing_vitrine'],
          maxSelect: 1,
        },
        {
          name: 'prompt_text',
          type: 'text',
          required: true,
        },
        {
          name: 'hook',
          type: 'text',
        },
        {
          name: 'call_to_action',
          type: 'text',
        },
        {
          name: 'platform',
          type: 'select',
          values: ['tiktok_shop', 'shopee', 'ambos'],
          maxSelect: 1,
        },
        {
          name: 'is_free',
          type: 'bool',
        },
        {
          name: 'tags',
          type: 'text',
        },
        {
          name: 'created',
          type: 'autodate',
          onCreate: true,
          onUpdate: false,
        },
        {
          name: 'updated',
          type: 'autodate',
          onCreate: true,
          onUpdate: true,
        },
      ],
      indexes: [
        'CREATE INDEX idx_prompts_niche ON prompts (niche)',
        'CREATE INDEX idx_prompts_style ON prompts (style)',
        'CREATE INDEX idx_prompts_is_free ON prompts (is_free)',
      ],
    })
    app.save(prompts)

    // 3. Favoritos (favorites)
    const favorites = new Collection({
      name: 'favorites',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != '' && user = @request.auth.id",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user = @request.auth.id",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'prompt',
          type: 'relation',
          required: true,
          collectionId: prompts.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'created',
          type: 'autodate',
          onCreate: true,
          onUpdate: false,
        },
        {
          name: 'updated',
          type: 'autodate',
          onCreate: true,
          onUpdate: true,
        },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_favorites_user_prompt ON favorites (user, prompt)',
        'CREATE INDEX idx_favorites_user ON favorites (user)',
      ],
    })
    app.save(favorites)

    // 4. Histórico de Gerações (generations)
    const generations = new Collection({
      name: 'generations',
      type: 'base',
      listRule: "@request.auth.id != '' && user = @request.auth.id",
      viewRule: "@request.auth.id != '' && user = @request.auth.id",
      createRule: "@request.auth.id != '' && user = @request.auth.id",
      updateRule: "@request.auth.id != '' && user = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user = @request.auth.id",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'product_name',
          type: 'text',
          required: true,
        },
        {
          name: 'niche',
          type: 'select',
          required: true,
          values: [
            'moda_feminina',
            'moda_masculina',
            'fitness_academia',
            'moda_praia',
            'acessorios_calcados',
            'streetwear_casual',
            'infantil_kids',
            'lingerie_pijamas',
          ],
          maxSelect: 1,
        },
        {
          name: 'style',
          type: 'select',
          required: true,
          values: ['pov', 'modelo', 'unboxing_vitrine'],
          maxSelect: 1,
        },
        {
          name: 'platform',
          type: 'select',
          values: ['tiktok_shop', 'shopee', 'ambos'],
          maxSelect: 1,
        },
        {
          name: 'target_audience',
          type: 'text',
        },
        {
          name: 'generated_prompt',
          type: 'text',
          required: true,
        },
        {
          name: 'created',
          type: 'autodate',
          onCreate: true,
          onUpdate: false,
        },
        {
          name: 'updated',
          type: 'autodate',
          onCreate: true,
          onUpdate: true,
        },
      ],
      indexes: ['CREATE INDEX idx_generations_user_created ON generations (user, created DESC)'],
    })
    app.save(generations)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('generations'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('favorites'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('prompts'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('subscriptions'))
    } catch (_) {}
  },
)
