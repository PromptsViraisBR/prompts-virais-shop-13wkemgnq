/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // 1. Adicionar campos de API Keys no users para Modo Completo (armazenados com segurança)
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!usersCol.fields.getByName('xai_api_key')) {
      usersCol.fields.add(
        new TextField({
          name: 'xai_api_key',
          required: false,
        }),
      )
    }
    if (!usersCol.fields.getByName('google_ai_api_key')) {
      usersCol.fields.add(
        new TextField({
          name: 'google_ai_api_key',
          required: false,
        }),
      )
    }
    app.save(usersCol)

    // 2. Adicionar campo engine e engine_mode na coleção generations se não existirem
    const genCol = app.findCollectionByNameOrId('generations')
    if (!genCol.fields.getByName('video_engine')) {
      genCol.fields.add(
        new TextField({
          name: 'video_engine',
          required: false,
        }),
      )
    }
    if (!genCol.fields.getByName('engine_mode')) {
      genCol.fields.add(
        new TextField({
          name: 'engine_mode',
          required: false,
        }),
      )
    }
    if (!genCol.fields.getByName('combination_mode')) {
      genCol.fields.add(
        new TextField({
          name: 'combination_mode',
          required: false,
        }),
      )
    }
    app.save(genCol)

    // 3. Criar coleção video_credits_usage para contabilizar créditos diários por usuário e motor
    try {
      app.findCollectionByNameOrId('video_credits_usage')
    } catch (_) {
      const creditsUsageCol = new Collection({
        name: 'video_credits_usage',
        type: 'base',
        listRule: "@request.auth.id != '' && user = @request.auth.id",
        viewRule: "@request.auth.id != '' && user = @request.auth.id",
        createRule: "@request.auth.id != '' && user = @request.auth.id",
        updateRule: "@request.auth.id != '' && user = @request.auth.id",
        deleteRule: null, // histórico de créditos não deve ser deletado pelo cliente
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
            name: 'engine',
            type: 'text',
            required: true,
          },
          {
            name: 'date',
            type: 'text', // YYYY-MM-DD
            required: true,
          },
          {
            name: 'count',
            type: 'number',
            min: 0,
            onlyInt: true,
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE INDEX idx_credits_usage_user_date ON video_credits_usage (user, date)',
          'CREATE UNIQUE INDEX idx_credits_usage_user_engine_date ON video_credits_usage (user, engine, date)',
        ],
      })
      app.save(creditsUsageCol)
    }
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('video_credits_usage')
      app.delete(col)
    } catch (_) {}
  },
)
