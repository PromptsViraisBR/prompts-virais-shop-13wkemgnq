migrate(
  (app) => {
    // 1. Em subscriptions, adicionar campos de idempotência e flags de notificação
    const subsCol = app.findCollectionByNameOrId('subscriptions')

    if (!subsCol.fields.getByName('expiration_notified')) {
      subsCol.fields.add(
        new BoolField({
          name: 'expiration_notified',
          required: false,
        }),
      )
    }

    if (!subsCol.fields.getByName('expiration_notified_at')) {
      subsCol.fields.add(
        new DateField({
          name: 'expiration_notified_at',
          required: false,
        }),
      )
    }

    if (!subsCol.fields.getByName('welcome_sub_notified')) {
      subsCol.fields.add(
        new BoolField({
          name: 'welcome_sub_notified',
          required: false,
        }),
      )
    }

    app.save(subsCol)

    // 2. Em users, adicionar flag de email de boas-vindas
    const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')

    if (!usersCol.fields.getByName('welcome_email_sent')) {
      usersCol.fields.add(
        new BoolField({
          name: 'welcome_email_sent',
          required: false,
        }),
      )
    }

    app.save(usersCol)
  },
  (app) => {
    try {
      const subsCol = app.findCollectionByNameOrId('subscriptions')
      if (subsCol.fields.getByName('expiration_notified')) {
        subsCol.fields.removeByName('expiration_notified')
      }
      if (subsCol.fields.getByName('expiration_notified_at')) {
        subsCol.fields.removeByName('expiration_notified_at')
      }
      if (subsCol.fields.getByName('welcome_sub_notified')) {
        subsCol.fields.removeByName('welcome_sub_notified')
      }
      app.save(subsCol)
    } catch (_) {}

    try {
      const usersCol = app.findCollectionByNameOrId('_pb_users_auth_')
      if (usersCol.fields.getByName('welcome_email_sent')) {
        usersCol.fields.removeByName('welcome_email_sent')
      }
      app.save(usersCol)
    } catch (_) {}
  },
)
