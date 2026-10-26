migrate(
  (app) => {
    const subsCol = app.findCollectionByNameOrId('subscriptions')

    if (!subsCol.fields.getByName('pix_reminder_notified')) {
      subsCol.fields.add(
        new BoolField({
          name: 'pix_reminder_notified',
          required: false,
        }),
      )
    }

    if (!subsCol.fields.getByName('pix_reminder_notified_at')) {
      subsCol.fields.add(
        new DateField({
          name: 'pix_reminder_notified_at',
          required: false,
        }),
      )
    }

    app.save(subsCol)
  },
  (app) => {
    try {
      const subsCol = app.findCollectionByNameOrId('subscriptions')
      if (subsCol.fields.getByName('pix_reminder_notified')) {
        subsCol.fields.removeByName('pix_reminder_notified')
      }
      if (subsCol.fields.getByName('pix_reminder_notified_at')) {
        subsCol.fields.removeByName('pix_reminder_notified_at')
      }
      app.save(subsCol)
    } catch (_) {}
  },
)
