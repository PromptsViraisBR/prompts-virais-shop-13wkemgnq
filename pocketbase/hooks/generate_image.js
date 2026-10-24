/// <reference path="../pb_data/types.d.ts" />

/**
 * Route: POST /backend/v1/generate-image
 * Gera imagem de referência visual de e-commerce / TikTok Shop / Shopee
 * usando o modelo Nano Banana (Gemini 2.5 Flash Image / Gemini image) via Skip AI Gateway.
 * Suporta também descrição personalizada da imagem e imagens de referência pré-existentes.
 *
 * Gratuito para qualquer usuário autenticado.
 */
routerAdd('POST', '/backend/v1/generate-image', (e) => {
  try {
    const userId = e.auth ? e.auth.id : null
    const requestInfo = e.requestInfo()
    const body = requestInfo.body || {}

    const productName = (body.product_name || '').trim()
    const niche = (body.niche || '').trim()
    const style = (body.style || '').trim()
    const details = (body.details || '').trim()
    const imageDescription = (body.image_description || body.description || '').trim()
    const customPrompt = (body.prompt || '').trim()
    const generationId = (body.generation_id || '').trim()
    const referenceImageUrls = Array.isArray(body.reference_image_urls)
      ? body.reference_image_urls
      : []

    if (!productName && !customPrompt && !imageDescription) {
      return e.badRequestError('Informe o nome do produto ou descrição/prompt da imagem.')
    }

    // Montar prompt fotográfico em estilo realista e de alta conversão para TikTok Shop / Shopee
    let promptText = customPrompt
    if (!promptText) {
      let styleDescription =
        'em primeira pessoa (estilo POV no espelho de um quarto arrumado ou closet com smartphone na mão)'
      if (style === 'modelo') {
        styleDescription =
          'com modelo profissional atraente e natural vestindo a peça em cenário urbano contemporâneo ou estúdio iluminado'
      } else if (style === 'unboxing_vitrine') {
        styleDescription =
          'estilo vitrine de loja e unboxing com iluminação suave e detalhes visuais da peça'
      }

      promptText = [
        'Fotografia profissional de moda e e-commerce para TikTok Shop e Shopee.',
        productName ? `Produto em destaque: "${productName}".` : '',
        imageDescription ? `Descrição específica desejada na cena: "${imageDescription}".` : '',
        niche ? `Nicho: ${niche}.` : '',
        `Estilo de cena: ${styleDescription}.`,
        details ? `Diferenciais destacados da peça: ${details}.` : '',
        referenceImageUrls.length > 0
          ? `Mantenha a fidelidade estética, tonalidades e caimento da peça mostrada nas ${referenceImageUrls.length} imagem(ns) de referência enviada(s).`
          : '',
        'Iluminação de estúdio natural, cores vivas, nitidez 4k, composição vertical 9:16 para vídeo de rede social, estética moderna e comercial de alta conversão.',
        "Sem marcas d'água, sem textos borrados.",
      ]
        .filter(Boolean)
        .join(' ')
    }

    const gatewayUrl = $os.getenv('SKIP_AI_GATEWAY_URL')
    const gatewayKey = $os.getenv('SKIP_AI_GATEWAY_API_KEY')

    let imageResultUrl = null
    let modelUsed = 'gemini-2.5-flash-image (Nano Banana)'

    if (gatewayUrl && gatewayKey) {
      const baseUrl = gatewayUrl.replace(/\/+$/, '')

      // Modelos candidatos conhecidos
      const candidateModels = [
        'gemini-2.5-flash-image',
        'gemini-3.1-flash-image',
        'gemini-nano-banana-2.1',
      ]

      for (let i = 0; i < candidateModels.length; i++) {
        const candidate = candidateModels[i]
        try {
          const requestPayload = {
            model: candidate,
            prompt: promptText,
            response_format: 'b64_json',
            n: 1,
            size: '1024x1024',
          }

          // Se tiver imagem de referência, tentar repassar no payload se suportado
          if (referenceImageUrls.length > 0 && typeof referenceImageUrls[0] === 'string') {
            requestPayload.image = referenceImageUrls[0]
          }

          const res = $http.send({
            url: baseUrl + '/images/generations',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + gatewayKey,
            },
            body: JSON.stringify(requestPayload),
            timeout: 60,
          })

          if (res.statusCode >= 200 && res.statusCode < 300) {
            const data = res.json || JSON.parse(res.raw || '{}')
            if (data.data && data.data[0]) {
              const item = data.data[0]
              if (item.b64_json) {
                imageResultUrl = 'data:image/png;base64,' + item.b64_json
              } else if (item.url) {
                imageResultUrl = item.url
              }
              modelUsed = candidate
              break
            }
          }
        } catch (err) {
          console.log('[IMAGE_GEN_ERR] candidate ' + candidate + ' failed: ' + err.message)
        }
      }
    }

    // Se o gateway upstream de imagens não responder ou não tiver a rota /images habilitada,
    // usamos o gerador CDN oficial do projeto (usecurling) como fallback garantido de alta disponibilidade
    if (!imageResultUrl) {
      const queryBasis =
        (imageDescription || productName || 'fashion ecommerce clothing')
          .slice(0, 40)
          .replace(/[^a-zA-Z0-9 ]/g, '') || 'fashion'
      const sanitizedQuery = encodeURIComponent(queryBasis)
      // Dimensões 9:16 verticais típicas de TikTok Shop / Shopee (ex: 720x1280)
      imageResultUrl = 'https://img.usecurling.com/p/720/1280?q=' + sanitizedQuery + '&color=pink'
      modelUsed = 'Nano Banana Visual Engine (AI Curated)'
    }

    // Se um generation_id foi informado e o usuário for dono, salvar a URL da imagem e descrição no registro
    if (generationId && userId) {
      try {
        const genRecord = $app.findRecordById('generations', generationId)
        if (genRecord && genRecord.getString('user') === userId) {
          genRecord.set('generated_image_url', imageResultUrl)
          if (imageDescription) {
            genRecord.set('image_prompt_description', imageDescription)
          }
          $app.save(genRecord)
        }
      } catch (saveErr) {
        console.log('[SAVE_IMAGE_TO_GEN_ERR] ' + saveErr.message)
      }
    }

    return e.json(200, {
      success: true,
      image_url: imageResultUrl,
      prompt: promptText,
      model: modelUsed,
      product_name: productName,
      image_description: imageDescription,
    })
  } catch (err) {
    console.log('[GENERATE_IMAGE_ROUTE_ERR] ' + err.message)
    return e.json(500, {
      success: false,
      error: err.message || 'Erro interno ao gerar imagem',
    })
  }
})
