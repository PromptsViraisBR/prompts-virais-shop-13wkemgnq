/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('prompts')
    if (!col.fields.getByName('reference_video_url')) {
      col.fields.add(
        new TextField({
          name: 'reference_video_url',
          required: false,
        }),
      )
      app.save(col)
    }

    // Tentar preencher reference_video_url para os prompts existentes caso ainda não possuam.
    // Usando pipeline assíncrono/idempotente com tratamento estrito de falha por item:
    // Nunca trava a migração se a API externa ou gateway de vídeo estiver instável/sem cota.
    const records = app.findRecordsByFilter('prompts', '', 'created', 100, 0)
    const gatewayUrl = $os.getenv('SKIP_AI_GATEWAY_URL')
    const gatewayKey = $os.getenv('SKIP_AI_GATEWAY_API_KEY')

    for (let i = 0; i < records.length; i++) {
      const rec = records[i]
      const currentVideo = rec.getString('reference_video_url')
      if (currentVideo && currentVideo.trim()) {
        continue // Idempotente: já possui vídeo de referência
      }

      const refImg = rec.getString('reference_image_url')
      const title = rec.getString('title')
      const niche = rec.getString('niche')
      const style = rec.getString('style')

      // Se o gateway de vídeo estiver configurado, tentamos gerar clip curto
      if (gatewayUrl && gatewayKey && refImg) {
        try {
          const baseUrl = gatewayUrl.replace(/\/+$/, '')
          const promptDesc = `Short 3-second e-commerce fashion video showcase for TikTok Shop: ${title}, niche: ${niche}, style: ${style}. Smooth camera movement, realistic cloth physics.`

          const res = $http.send({
            url: baseUrl + '/videos/generations',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + gatewayKey,
            },
            body: JSON.stringify({
              model: 'fast-video',
              prompt: promptDesc,
              aspect_ratio: '9:16',
              duration: 3,
              image_url: refImg,
            }),
            timeout: 15,
          })

          if (res.statusCode >= 200 && res.statusCode < 300) {
            const data = res.json || JSON.parse(res.raw || '{}')
            let generatedUrl = null
            if (data.data && data.data[0] && data.data[0].url) {
              generatedUrl = data.data[0].url
            } else if (data.url) {
              generatedUrl = data.url
            }

            if (generatedUrl) {
              rec.set('reference_video_url', generatedUrl)
              app.save(rec)
              continue
            }
          }
        } catch (itemErr) {
          console.log(
            `[MIGRATION_0009_PROMPT_VIDEO_WARN] Prompt ${rec.id} (${title}): ${itemErr.message}`,
          )
        }
      }
    }
  },
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('prompts')
      const field = col.fields.getByName('reference_video_url')
      if (field) {
        col.fields.remove(field)
        app.save(col)
      }
    } catch (_) {}
  },
)
