migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('generations')
    if (!col.fields.getByName('generated_image_url')) {
      col.fields.add(
        new TextField({
          name: 'generated_image_url',
          required: false,
        }),
      )
      app.save(col)
    }
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('generations')
      const field = col.fields.getByName('generated_image_url')
      if (field) {
        col.fields.remove(field)
        app.save(col)
      }
    } catch (_) {}
  },
)
