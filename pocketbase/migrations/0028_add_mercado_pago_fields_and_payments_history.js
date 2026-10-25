/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // 1. Atualizar coleção users: adicionar is_admin (bool)
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
    if (!usersCol.fields.getByName('is_admin')) {
      usersCol.fields.add(
        new BoolField({
          name: 'is_admin',
          required: false,
        }),
      )
      app.save(usersCol)
    }

    // Marcar o primeiro usuário existente como admin inicial se houver
    try {
      const adminUser = app.findAuthRecordByEmail(
        '_pb_users_auth_',
        'juniorrodriguesjr123.jr@gmail.com',
      )
      if (adminUser) {
        adminUser.set('is_admin', true)
        app.save(adminUser)
      }
    } catch (_) {}

    // 2. Atualizar coleção subscriptions com campos do Mercado Pago
    const subsCol = app.findCollectionByNameOrId('subscriptions')
    if (!subsCol.fields.getByName('mp_preapproval_id')) {
      subsCol.fields.add(
        new TextField({
          name: 'mp_preapproval_id',
          required: false,
        }),
      )
    }
    if (!subsCol.fields.getByName('mp_payment_id')) {
      subsCol.fields.add(
        new TextField({
          name: 'mp_payment_id',
          required: false,
        }),
      )
    }
    if (!subsCol.fields.getByName('external_reference')) {
      subsCol.fields.add(
        new TextField({
          name: 'external_reference',
          required: false,
        }),
      )
    }
    if (!subsCol.fields.getByName('payer_email')) {
      subsCol.fields.add(
        new TextField({
          name: 'payer_email',
          required: false,
        }),
      )
    }
    if (!subsCol.fields.getByName('next_payment_date')) {
      subsCol.fields.add(
        new DateField({
          name: 'next_payment_date',
          required: false,
        }),
      )
    }
    app.save(subsCol)

    // 3. Criar coleção payments_history para registrar pagamentos processados (idempotência e auditoria)
    let paymentsHistoryCol
    try {
      paymentsHistoryCol = app.findCollectionByNameOrId('payments_history')
    } catch (_) {
      paymentsHistoryCol = null
    }

    if (!paymentsHistoryCol) {
      const col = new Collection({
        name: 'payments_history',
        type: 'base',
        listRule:
          "@request.auth.id != '' && (user = @request.auth.id || @request.auth.is_admin = true)",
        viewRule:
          "@request.auth.id != '' && (user = @request.auth.id || @request.auth.is_admin = true)",
        createRule: null, // Apenas hooks / superuser criam
        updateRule: null,
        deleteRule: null,
        fields: [
          {
            name: 'user',
            type: 'relation',
            collectionId: '_pb_users_auth_',
            required: false,
            maxSelect: 1,
            cascadeDelete: false,
          },
          { name: 'mp_payment_id', type: 'text', required: true },
          { name: 'mp_preapproval_id', type: 'text', required: false },
          { name: 'external_reference', type: 'text', required: false },
          { name: 'payment_type', type: 'text', required: false }, // subscription | credits
          { name: 'status', type: 'text', required: true }, // approved, pending, rejected, etc.
          { name: 'status_detail', type: 'text', required: false },
          { name: 'transaction_amount', type: 'number', required: false },
          { name: 'payer_email', type: 'text', required: false },
          { name: 'payment_method_id', type: 'text', required: false },
          { name: 'raw_payload', type: 'json', required: false },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: [
          'CREATE UNIQUE INDEX idx_pmt_history_mp_id ON payments_history (mp_payment_id)',
          'CREATE INDEX idx_pmt_history_user ON payments_history (user)',
        ],
      })
      app.save(col)
    }
  },
  (app) => {
    try {
      const pmtCol = app.findCollectionByNameOrId('payments_history')
      app.delete(pmtCol)
    } catch (_) {}
  },
)
