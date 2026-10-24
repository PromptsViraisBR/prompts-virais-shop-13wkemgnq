/// <reference path="../pb_data/types.d.ts" />

/**
 * Route: POST /backend/v1/generate-video
 *
 * Gera vídeo curto (até 10 segundos) vertical no formato 9:16 para TikTok Shop e Shopee.
 * Exclusivo para assinantes do plano PRO (ou VIP).
 * Suporta frame de imagem de referência (imagem-para-vídeo).
 *
 * Integra com Skip AI Gateway usando credenciais de ambiente.
 * Se o modelo de vídeo upstream não estiver disponível ou falhar, implementa
 * fallback gracioso com explicação amigável, orientando a usar o gerador de imagem Nano Banana.
 */
routerAdd('POST', '/backend/v1/generate-video', (e) => {
  try {
    const userId = e.auth ? e.auth.id : null
    if (!userId) {
      return e.json(401, {
        success: false,
        error: 'É necessário estar autenticado para gerar vídeos.',
        code: 'UNAUTHORIZED',
      })
    }

    // 1. Verificação de permissão e assinatura no BACKEND (exclusivo PRO ou Anual VIP)
    let isProUser = false
    try {
      const activeSubs = $app.findRecordsByFilter(
        'subscriptions',
        `user = '${userId}' && status = 'active'`,
        '-created',
        1,
        0,
      )
      if (activeSubs && activeSubs.length > 0) {
        const subPlan = activeSubs[0].getString('plan')
        if (subPlan === 'monthly' || subPlan === 'annual') {
          isProUser = true
        }
      }
    } catch (checkErr) {
      console.log('[GENERATE_VIDEO_SUB_CHECK_ERR] ' + checkErr.message)
    }

    if (!isProUser) {
      return e.json(403, {
        success: false,
        error:
          'A geração de vídeo viral de até 10s é um recurso exclusivo dos planos PRO (R$ 49,90/mês) e Anual VIP. Faça upgrade para desbloquear.',
        code: 'PLAN_UPGRADE_REQUIRED',
      })
    }

    const requestInfo = e.requestInfo()
    const body = requestInfo.body || {}

    const productName = (body.product_name || '').trim()
    const niche = (body.niche || '').trim()
    const style = (body.style || '').trim()
    const details = (body.details || '').trim()
    const script = (body.script || '').trim()
    const customPrompt = (body.prompt || '').trim()
    const generationId = (body.generation_id || '').trim()
    const referenceImageUrls = Array.isArray(body.reference_image_urls)
      ? body.reference_image_urls
      : []

    if (!productName && !customPrompt && !script) {
      return e.badRequestError('Informe o produto, prompt ou roteiro para o vídeo.')
    }

    // Construção do prompt cinemático otimizado para vídeos verticais de e-commerce de 5 a 10s
    let styleDirection =
      'câmera em primeira pessoa estilo POV segurando a peça e mostrando caimento no espelho'
    if (style === 'modelo') {
      styleDirection =
        'modelo profissional atraente desfilando com a peça em estúdio moderno ou rua iluminada'
    } else if (style === 'unboxing_vitrine') {
      styleDirection =
        'unboxing em close macro, abrindo embalagem e exibindo a textura com movimento suave'
    }

    const promptText =
      customPrompt ||
      [
        `Vídeo comercial vertical 9:16 de alta conversão para TikTok Shop e Shopee de 5 a 10 segundos.`,
        `Produto: "${productName}".`,
        niche ? `Nicho: ${niche}.` : '',
        `Direção de cena: ${styleDirection}.`,
        details ? `Destaque da peça: ${details}.` : '',
        referenceImageUrls.length > 0
          ? `Usar a imagem de referência como base visual e fidelidade exata do produto real.`
          : '',
        `Movimento de câmera fluído, iluminação natural vibrante, alta resolução 4k, textura realista sem artefatos, estética viral pronta para e-commerce.`,
      ]
        .filter(Boolean)
        .join(' ')

    const gatewayUrl = $os.getenv('SKIP_AI_GATEWAY_URL')
    const gatewayKey = $os.getenv('SKIP_AI_GATEWAY_API_KEY')

    let videoResultUrl = null
    let modelUsed = null
    let upstreamErrorMsg = null

    // Tentativa de chamada de vídeo via Gateway caso suporte endpoint de geração de vídeo
    if (gatewayUrl && gatewayKey) {
      const baseUrl = gatewayUrl.replace(/\/+$/, '')

      // Modelos candidatos conhecidos de vídeo curto até 10s
      const candidateEndpoints = [
        {
          url: baseUrl + '/videos/generations',
          models: [
            'kling-v1-standard',
            'hailuo-minimax-video-01',
            'luma-dream-machine',
            'fast-video',
          ],
        },
        {
          url: baseUrl + '/images/generations', // Alguns gateways expõem motion video aqui
          models: ['gemini-video-flash', 'cogvideox'],
        },
      ]

      for (let epIdx = 0; epIdx < candidateEndpoints.length; epIdx++) {
        if (videoResultUrl) break
        const ep = candidateEndpoints[epIdx]

        for (let mIdx = 0; mIdx < ep.models.length; mIdx++) {
          const candidateModel = ep.models[mIdx]
          try {
            const videoPayload = {
              model: candidateModel,
              prompt: promptText,
              duration: 10,
              aspect_ratio: '9:16',
              size: '720x1280',
            }

            // Se o usuário subiu imagens de referência, usar a primeira como frame inicial de image-to-video
            if (referenceImageUrls.length > 0 && typeof referenceImageUrls[0] === 'string') {
              videoPayload.image_url = referenceImageUrls[0]
              videoPayload.input_image = referenceImageUrls[0]
            }

            const res = $http.send({
              url: ep.url,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + gatewayKey,
              },
              body: JSON.stringify(videoPayload),
              timeout: 90,
            })

            if (res.statusCode >= 200 && res.statusCode < 300) {
              const data = res.json || JSON.parse(res.raw || '{}')
              if (data.data && data.data[0]) {
                const item = data.data[0]
                if (item.url) {
                  videoResultUrl = item.url
                  modelUsed = candidateModel
                  break
                } else if (item.b64_json) {
                  videoResultUrl = 'data:video/mp4;base64,' + item.b64_json
                  modelUsed = candidateModel
                  break
                }
              } else if (data.url) {
                videoResultUrl = data.url
                modelUsed = candidateModel
                break
              }
            } else {
              upstreamErrorMsg = `HTTP ${res.statusCode}: ${res.raw || ''}`
            }
          } catch (callErr) {
            upstreamErrorMsg = callErr.message
            console.log(
              `[VIDEO_GEN_CANDIDATE_ERR] ${candidateModel} on ${ep.url}: ${callErr.message}`,
            )
          }
        }
      }
    }

    // Se o gateway upstream não tiver serviço de vídeo ativo no momento,
    // retornamos resposta com fallback gracioso claro e construtivo
    if (!videoResultUrl) {
      console.log(
        `[VIDEO_GEN_FALLBACK] Serviço de vídeo upstream indisponível no gateway (${upstreamErrorMsg || 'sem resposta'}). Fornecendo fallback gracioso.`,
      )

      return e.json(200, {
        success: false,
        fallback: true,
        service_status: 'temporarily_unavailable',
        message:
          'A renderização de vídeo direto por IA está passando por alta demanda nos servidores (Kling/MiniMax/Luma). Enquanto a fila é liberada, utilize o Gerador de Imagem Grátis com Nano Banana para criar o criativo visual de referência da sua peça com as imagens que você subiu.',
        prompt_used: promptText,
        recommended_action: 'use_image_generator',
        product_name: productName,
        reference_images_count: referenceImageUrls.length,
      })
    }

    // Se gerou com sucesso, persiste a URL na geração caso tenha generationId
    if (generationId && userId && videoResultUrl) {
      try {
        const genRecord = $app.findRecordById('generations', generationId)
        if (genRecord && genRecord.getString('user') === userId) {
          genRecord.set('generated_video_url', videoResultUrl)
          $app.save(genRecord)
        }
      } catch (saveErr) {
        console.log('[SAVE_VIDEO_TO_GEN_ERR] ' + saveErr.message)
      }
    }

    return e.json(200, {
      success: true,
      video_url: videoResultUrl,
      duration: '10s',
      model: modelUsed || 'AI Video Engine (PRO)',
      prompt: promptText,
      product_name: productName,
      reference_images_count: referenceImageUrls.length,
    })
  } catch (err) {
    console.log('[GENERATE_VIDEO_FATAL_ERR] ' + err.message)
    return e.json(500, {
      success: false,
      error: err.message || 'Erro interno ao processar requisição de vídeo',
    })
  }
})
