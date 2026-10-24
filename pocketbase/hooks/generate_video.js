/// <reference path="../pb_data/types.d.ts" />

/**
 * Route: GET /backend/v1/video-credits
 * Retorna o saldo diário de créditos do usuário para cada motor de vídeo.
 */
routerAdd('GET', '/backend/v1/video-credits', (e) => {
  try {
    const userId = e.auth ? e.auth.id : null
    if (!userId) {
      return e.json(401, { success: false, error: 'Usuário não autenticado.' })
    }

    // Verificar se o usuário possui assinatura PRO ativa
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
    } catch (_) {}

    // Verificar se o usuário possui chaves próprias cadastradas no perfil
    let hasXaiKey = false
    let hasGoogleKey = false
    try {
      const userRec = $app.findRecordById('_pb_users_auth_', userId)
      if (userRec) {
        hasXaiKey = !!(userRec.getString('xai_api_key') || '').trim()
        hasGoogleKey = !!(userRec.getString('google_ai_api_key') || '').trim()
      }
    } catch (_) {}

    // Data de hoje formato YYYY-MM-DD (UTC)
    const todayStr = new Date().toISOString().slice(0, 10)

    // Cotas diárias por motor
    const engineLimits = {
      flow: 50, // Flow (Veo): 50 créditos diários
      grok: 30, // Grok Imagine: 30 créditos diários
      kling: 20, // Kling: 20 créditos diários
      hailuo: 20, // Hailuo (MiniMax): 20 créditos diários
      luma: 15, // Luma: 15 créditos diários
    }

    // Buscar uso de hoje
    const usageRecords = $app.findRecordsByFilter(
      'video_credits_usage',
      `user = '${userId}' && date = '${todayStr}'`,
      '-created',
      50,
      0,
    )

    const usageMap = {}
    for (let i = 0; i < usageRecords.length; i++) {
      const rec = usageRecords[i]
      const eng = rec.getString('engine')
      usageMap[eng] = rec.getInt('count') || 0
    }

    const creditsInfo = {
      is_pro: isProUser,
      date: todayStr,
      has_xai_key: hasXaiKey,
      has_google_key: hasGoogleKey,
      engines: {
        flow: {
          name: 'Flow (Veo 3.1 Fast)',
          limit: engineLimits.flow,
          used: usageMap['flow'] || 0,
          remaining: Math.max(0, engineLimits.flow - (usageMap['flow'] || 0)),
          has_custom_key: hasGoogleKey,
          full_mode: hasGoogleKey,
        },
        grok: {
          name: 'Grok Imagine Video',
          limit: engineLimits.grok,
          used: usageMap['grok'] || 0,
          remaining: Math.max(0, engineLimits.grok - (usageMap['grok'] || 0)),
          has_custom_key: hasXaiKey,
          full_mode: hasXaiKey,
        },
        kling: {
          name: 'Kling AI Video v1.5',
          limit: engineLimits.kling,
          used: usageMap['kling'] || 0,
          remaining: Math.max(0, engineLimits.kling - (usageMap['kling'] || 0)),
          has_custom_key: false,
          full_mode: false,
        },
        hailuo: {
          name: 'Hailuo (MiniMax Video-01)',
          limit: engineLimits.hailuo,
          used: usageMap['hailuo'] || 0,
          remaining: Math.max(0, engineLimits.hailuo - (usageMap['hailuo'] || 0)),
          has_custom_key: false,
          full_mode: false,
        },
        luma: {
          name: 'Luma Dream Machine',
          limit: engineLimits.luma,
          used: usageMap['luma'] || 0,
          remaining: Math.max(0, engineLimits.luma - (usageMap['luma'] || 0)),
          has_custom_key: false,
          full_mode: false,
        },
      },
    }

    return e.json(200, { success: true, ...creditsInfo })
  } catch (err) {
    return e.json(500, { success: false, error: err.message })
  }
})

/**
 * Route: POST /backend/v1/generate-video
 *
 * Gera vídeo curto (5 a 10 segundos) vertical no formato 9:16 para TikTok Shop e Shopee.
 * Exclusivo para assinantes do plano PRO (ou com Modo Completo / Chave Própria).
 * Suporta motores:
 *  - flow (Google Veo via Gemini API ou gateway)
 *  - grok (xAI Grok Imagine Video via API oficial com polling assíncrono ou gateway)
 *  - kling, hailuo, luma
 *
 * Contabiliza créditos diários na coleção video_credits_usage (ex: Flow 50/dia, Grok 30/dia)
 * Quando o usuário possui chave de API própria conectada no perfil, opera no MODO COMPLETO sem consumir os créditos in-app.
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

    const requestInfo = e.requestInfo()
    const body = requestInfo.body || {}

    // Motor selecionado (default: flow)
    const selectedEngine = (body.engine || 'flow').toLowerCase() // flow | grok | kling | hailuo | luma

    // 1. Obter usuário e chaves de API próprias
    let userXaiKey = ''
    let userGoogleKey = ''
    try {
      const userRec = $app.findRecordById('_pb_users_auth_', userId)
      if (userRec) {
        userXaiKey = (userRec.getString('xai_api_key') || '').trim()
        userGoogleKey = (userRec.getString('google_ai_api_key') || '').trim()
      }
    } catch (_) {}

    // Chaves passadas no corpo têm prioridade
    if (body.xai_api_key && typeof body.xai_api_key === 'string') {
      userXaiKey = body.xai_api_key.trim()
    }
    if (body.google_ai_api_key && typeof body.google_ai_api_key === 'string') {
      userGoogleKey = body.google_ai_api_key.trim()
    }

    const isUsingCustomKey =
      (selectedEngine === 'grok' && !!userXaiKey) || (selectedEngine === 'flow' && !!userGoogleKey)

    // 2. Verificação de assinatura (se estiver usando chave própria no modo completo, libera; senão exige PRO)
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

    if (!isProUser && !isUsingCustomKey) {
      return e.json(403, {
        success: false,
        error:
          'A geração de vídeo viral com IA é um recurso exclusivo dos planos PRO (R$ 49,90/mês) ou com Chave Própria no Modo Completo. Conecte sua chave no Perfil ou faça upgrade.',
        code: 'PLAN_UPGRADE_REQUIRED',
      })
    }

    // 3. Verificação de créditos in-app caso não esteja no Modo Completo com chave própria
    const engineLimits = {
      flow: 50,
      grok: 30,
      kling: 20,
      hailuo: 20,
      luma: 15,
    }
    const currentLimit = engineLimits[selectedEngine] || 20
    const todayStr = new Date().toISOString().slice(0, 10)

    let creditUsageRecord = null
    let currentUsageCount = 0

    if (!isUsingCustomKey) {
      try {
        const existingUsages = $app.findRecordsByFilter(
          'video_credits_usage',
          `user = '${userId}' && engine = '${selectedEngine}' && date = '${todayStr}'`,
          '-created',
          1,
          0,
        )
        if (existingUsages && existingUsages.length > 0) {
          creditUsageRecord = existingUsages[0]
          currentUsageCount = creditUsageRecord.getInt('count') || 0
        }
      } catch (_) {}

      if (currentUsageCount >= currentLimit) {
        return e.json(429, {
          success: false,
          error: `Você atingiu o limite de créditos diários para o motor ${selectedEngine.toUpperCase()} (${currentLimit}/${currentLimit} hoje). Seus créditos renovam à meia-noite, ou você pode conectar sua própria chave de API no Perfil para usar no Modo Completo sem restrições.`,
          code: 'DAILY_CREDITS_EXHAUSTED',
          engine: selectedEngine,
          limit: currentLimit,
          remaining: 0,
        })
      }
    }

    // Parâmetros do vídeo
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
        `Vídeo comercial vertical 9:16 de alta conversão para TikTok Shop e Shopee de 5 a 8 segundos.`,
        `Produto: "${productName}".`,
        niche ? `Nicho: ${niche}.` : '',
        `Direção de cena: ${styleDirection}.`,
        details ? `Destaque da peça: ${details}.` : '',
        referenceImageUrls.length > 0
          ? `Preservar estritamente o produto e modelo visual da imagem de referência enviada.`
          : '',
        `Movimento de câmera fluído, iluminação natural vibrante, alta resolução 4k, textura realista sem artefatos, estética viral de alta conversão.`,
      ]
        .filter(Boolean)
        .join(' ')

    const gatewayUrl = $os.getenv('SKIP_AI_GATEWAY_URL')
    const gatewayKey = $os.getenv('SKIP_AI_GATEWAY_API_KEY')

    let videoResultUrl = null
    let modelUsed = null
    let engineMode = isUsingCustomKey ? 'full_mode_custom_key' : 'in_app_credits'
    let upstreamError = null

    // EXECUÇÃO POR MOTOR:
    // A) MOTOR FLOW (Veo 3.1 Fast / Google Veo)
    if (selectedEngine === 'flow') {
      // 1. Tentar com chave própria do Google AI Studio se disponível
      if (userGoogleKey) {
        try {
          const googleVeoUrl = `https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-fast:predictLongRunning?key=${encodeURIComponent(userGoogleKey)}`
          const veoPayload = {
            prompt: promptText,
            aspectRatio: '9:16',
            durationSeconds: 6,
          }
          if (referenceImageUrls.length > 0 && typeof referenceImageUrls[0] === 'string') {
            veoPayload.image = { imageUri: referenceImageUrls[0] }
          }

          const resVeo = $http.send({
            url: googleVeoUrl,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(veoPayload),
            timeout: 60,
          })

          if (resVeo.statusCode >= 200 && resVeo.statusCode < 300) {
            const dataVeo = resVeo.json || JSON.parse(resVeo.raw || '{}')
            if (dataVeo.video && dataVeo.video.uri) {
              videoResultUrl = dataVeo.video.uri
              modelUsed = 'Google Veo 3.1 Fast (Modo Completo - Chave Própria)'
            } else if (dataVeo.name) {
              // Operação assíncrona iniciada
              modelUsed = 'Google Veo 3.1 Fast (Processando)'
            }
          }
        } catch (veoErr) {
          console.log('[FLOW_VEO_USER_KEY_ERR] ' + veoErr.message)
          upstreamError = veoErr.message
        }
      }

      // 2. Se não gerou via chave própria, tentar via Skip AI Gateway
      if (!videoResultUrl && gatewayUrl && gatewayKey) {
        const baseUrl = gatewayUrl.replace(/\/+$/, '')
        const veoModels = ['veo-3.1-fast', 'veo-3.1', 'flow-veo-video', 'fast-video']
        for (let v = 0; v < veoModels.length; v++) {
          const cand = veoModels[v]
          try {
            const payload = {
              model: cand,
              prompt: promptText,
              aspect_ratio: '9:16',
              duration: 6,
              size: '720x1280',
            }
            if (referenceImageUrls.length > 0) {
              payload.image_url = referenceImageUrls[0]
            }

            const res = $http.send({
              url: baseUrl + '/videos/generations',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + gatewayKey,
              },
              body: JSON.stringify(payload),
              timeout: 60,
            })

            if (res.statusCode >= 200 && res.statusCode < 300) {
              const d = res.json || JSON.parse(res.raw || '{}')
              if (d.data && d.data[0] && d.data[0].url) {
                videoResultUrl = d.data[0].url
                modelUsed = `Flow Veo (${cand})`
                break
              } else if (d.url) {
                videoResultUrl = d.url
                modelUsed = `Flow Veo (${cand})`
                break
              }
            }
          } catch (gErr) {
            upstreamError = gErr.message
          }
        }
      }
    }

    // B) MOTOR GROK (xAI Grok Imagine Video)
    else if (selectedEngine === 'grok') {
      // 1. Tentar com chave própria da xAI se disponível
      if (userXaiKey) {
        try {
          // Endpoint de vídeo xAI Grok com image-to-video e prompt
          const xaiVideoUrl = 'https://api.x.ai/v1/videos/generations'
          const grokPayload = {
            model: 'grok-imagine-video',
            prompt: promptText,
            aspect_ratio: '9:16',
            duration: 6,
          }
          if (referenceImageUrls.length > 0 && typeof referenceImageUrls[0] === 'string') {
            grokPayload.image_url = referenceImageUrls[0]
          }

          const resXai = $http.send({
            url: xaiVideoUrl,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + userXaiKey,
            },
            body: JSON.stringify(grokPayload),
            timeout: 60,
          })

          if (resXai.statusCode >= 200 && resXai.statusCode < 300) {
            const dataXai = resXai.json || JSON.parse(resXai.raw || '{}')
            if (dataXai.data && dataXai.data[0] && dataXai.data[0].url) {
              videoResultUrl = dataXai.data[0].url
              modelUsed = 'xAI Grok Imagine Video (Modo Completo - Chave Própria)'
            } else if (dataXai.url) {
              videoResultUrl = dataXai.url
              modelUsed = 'xAI Grok Imagine Video (Modo Completo - Chave Própria)'
            } else if (dataXai.id) {
              // Polling assíncrono caso retorne task ID
              const taskId = dataXai.id
              for (let poll = 0; poll < 4; poll++) {
                try {
                  const check = $http.send({
                    url: `https://api.x.ai/v1/videos/generations/${taskId}`,
                    method: 'GET',
                    headers: { Authorization: 'Bearer ' + userXaiKey },
                    timeout: 20,
                  })
                  if (check.statusCode === 200) {
                    const cData = check.json || JSON.parse(check.raw || '{}')
                    if (cData.status === 'completed' && cData.output && cData.output.url) {
                      videoResultUrl = cData.output.url
                      modelUsed = 'xAI Grok Imagine Video (Polling concluído)'
                      break
                    }
                  }
                } catch (_) {}
              }
            }
          }
        } catch (xaiErr) {
          console.log('[GROK_XAI_USER_KEY_ERR] ' + xaiErr.message)
          upstreamError = xaiErr.message
        }
      }

      // 2. Se não gerou via chave de usuário, tentar via Skip AI Gateway
      if (!videoResultUrl && gatewayUrl && gatewayKey) {
        const baseUrl = gatewayUrl.replace(/\/+$/, '')
        const grokModels = ['grok-imagine-video', 'grok-video-1', 'fast-video']
        for (let g = 0; g < grokModels.length; g++) {
          const cand = grokModels[g]
          try {
            const res = $http.send({
              url: baseUrl + '/videos/generations',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + gatewayKey,
              },
              body: JSON.stringify({
                model: cand,
                prompt: promptText,
                aspect_ratio: '9:16',
                duration: 6,
                image_url: referenceImageUrls[0] || undefined,
              }),
              timeout: 60,
            })
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const d = res.json || JSON.parse(res.raw || '{}')
              if (d.data && d.data[0] && d.data[0].url) {
                videoResultUrl = d.data[0].url
                modelUsed = `Grok Imagine (${cand})`
                break
              }
            }
          } catch (gErr) {
            upstreamError = gErr.message
          }
        }
      }
    }

    // C) MOTORES KLING, HAILUO (MINIMAX), LUMA
    else {
      const engineToModels = {
        kling: ['kling-v1-standard', 'kling-video-1.5', 'kling-fast'],
        hailuo: ['hailuo-minimax-video-01', 'minimax-video-01', 'hailuo-fast'],
        luma: ['luma-dream-machine', 'luma-ray-1', 'luma-fast'],
      }
      const candidateList = engineToModels[selectedEngine] || ['fast-video']

      if (gatewayUrl && gatewayKey) {
        const baseUrl = gatewayUrl.replace(/\/+$/, '')
        for (let m = 0; m < candidateList.length; m++) {
          const cand = candidateList[m]
          try {
            const res = $http.send({
              url: baseUrl + '/videos/generations',
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + gatewayKey,
              },
              body: JSON.stringify({
                model: cand,
                prompt: promptText,
                aspect_ratio: '9:16',
                duration: 6,
                image_url: referenceImageUrls[0] || undefined,
              }),
              timeout: 60,
            })
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const d = res.json || JSON.parse(res.raw || '{}')
              if (d.data && d.data[0] && d.data[0].url) {
                videoResultUrl = d.data[0].url
                modelUsed = `${selectedEngine.toUpperCase()} (${cand})`
                break
              }
            }
          } catch (eErr) {
            upstreamError = eErr.message
          }
        }
      }
    }

    // Se o serviço upstream do motor não estiver ativo ou não retornou vídeo
    if (!videoResultUrl) {
      console.log(
        `[VIDEO_GEN_UPSTREAM_UNAVAILABLE] Motor ${selectedEngine} indisponível: ${upstreamError || 'sem retorno'}. Oferecendo fallback gracioso.`,
      )

      return e.json(200, {
        success: false,
        fallback: true,
        engine: selectedEngine,
        engine_mode: engineMode,
        service_status: 'temporarily_unavailable',
        message: `O motor ${selectedEngine.toUpperCase()} está com alta demanda momentânea nos servidores oficiais. Você pode tentar os outros motores (Flow, Grok, Kling, Hailuo, Luma), conectar sua própria chave de API no Perfil para o Modo Completo ou usar o gerador de imagens Nano Banana.`,
        prompt_used: promptText,
        recommended_action: 'switch_engine_or_use_image',
        product_name: productName,
        reference_images_count: referenceImageUrls.length,
      })
    }

    // 4. Sucesso: Contabilizar crédito caso não esteja usando chave própria
    if (!isUsingCustomKey) {
      try {
        if (creditUsageRecord) {
          creditUsageRecord.set('count', currentUsageCount + 1)
          $app.save(creditUsageRecord)
        } else {
          const colUsage = $app.findCollectionByNameOrId('video_credits_usage')
          const newUsage = new Record(colUsage)
          newUsage.set('user', userId)
          newUsage.set('engine', selectedEngine)
          newUsage.set('date', todayStr)
          newUsage.set('count', 1)
          $app.save(newUsage)
        }
      } catch (countErr) {
        console.log('[CREDIT_COUNT_ERR] ' + countErr.message)
      }
    }

    // 5. Persistir na geração se generationId foi informado
    if (generationId && userId && videoResultUrl) {
      try {
        const genRecord = $app.findRecordById('generations', generationId)
        if (genRecord && genRecord.getString('user') === userId) {
          genRecord.set('generated_video_url', videoResultUrl)
          genRecord.set('video_engine', selectedEngine)
          genRecord.set('engine_mode', engineMode)
          $app.save(genRecord)
        }
      } catch (saveErr) {
        console.log('[SAVE_VIDEO_TO_GEN_ERR] ' + saveErr.message)
      }
    }

    const updatedRemaining = isUsingCustomKey
      ? 'ilimitado (chave própria)'
      : Math.max(0, currentLimit - (currentUsageCount + 1))

    return e.json(200, {
      success: true,
      video_url: videoResultUrl,
      engine: selectedEngine,
      engine_mode: engineMode,
      remaining_credits: updatedRemaining,
      limit: currentLimit,
      duration: '6-8s',
      model: modelUsed || selectedEngine,
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
