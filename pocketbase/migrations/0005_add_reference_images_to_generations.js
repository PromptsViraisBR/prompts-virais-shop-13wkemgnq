migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('generations')

    // 1. Campo de arquivos de referência (até 3 imagens na galeria)
    if (!col.fields.getByName('reference_images')) {
      col.fields.add(
        new FileField({
          name: 'reference_images',
          maxSelect: 3,
          maxSize: 10485760, // 10MB por imagem
          mimeTypes: [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/heic',
            'image/avif',
          ],
          required: false,
        }),
      )
    }

    // 2. Campo de URLs / referências externas das imagens caso sejam enviadas como URL/dataURL
    if (!col.fields.getByName('reference_image_urls')) {
      col.fields.add(
        new JSONField({
          name: 'reference_image_urls',
          required: false,
        }),
      )
    }

    // 3. Campo para guardar a descrição customizada que o usuário pediu para a imagem
    if (!col.fields.getByName('image_prompt_description')) {
      col.fields.add(
        new TextField({
          name: 'image_prompt_description',
          required: false,
        }),
      )
    }

    app.save(col)
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('generations')
      const f1 = col.fields.getByName('reference_images')
      if (f1) col.fields.remove(f1)
      const f2 = col.fields.getByName('reference_image_urls')
      if (f2) col.fields.remove(f2)
      const f3 = col.fields.getByName('image_prompt_description')
      if (f3) col.fields.remove(f3)
      app.save(col)
    } catch (_) {}
  },
)
