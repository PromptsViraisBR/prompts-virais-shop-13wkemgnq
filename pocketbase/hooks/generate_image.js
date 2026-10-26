/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook POST /backend/v1/generate-image
 * Gera imagem gratuitamente para usuários logados usando a API Google Gemini (Nano Banana / gemini-2.5-flash-image).
 * Suporta:
 *  - Descrição em texto puro
 *  - Imagens de referência (até 3 imagens base64) com fidelidade facial e de produtos
 *  - Retorno de imagem gerada em base64 ou URL de dados (data:image/png;base64,...)
 */
// Rota GET para consultar status de disponibilidade dos motores
routerAdd('GET', '/backend/v1/image-engines', (e) => {
  try {
    const authUser = e.auth
    const userGoogleKey = authUser ? authUser.getString('google_ai_api_key') : ''
    const envGoogleKey = $os.getenv('GEMINI_API_KEY') || ''
    const hasGoogleKey = Boolean(userGoogleKey || envGoogleKey)

    // OpenAI dedicado (OPENAI_API_KEY)
    const envOpenAIKey = $os.getenv('OPENAI_API_KEY') || ''
    const hasOpenAIKey = Boolean(envOpenAIKey)

    return e.json(200, {
      success: true,
      has_google_key: hasGoogleKey,
      has_openai_key: hasOpenAIKey,
      engines: [
        {
          id: 'nano_banana',
          name: 'Nano Banana (Gemini)',
          provider: 'google',
          description:
            'Fidelidade facial e de detalhes estrita com suporte a fotos de referência (Gemini / Imagen 3).',
          is_available: true,
          has_key: hasGoogleKey,
          badge: 'Recomendado',
        },
        {
          id: 'chatgpt',
          name: 'ChatGPT (OpenAI)',
          provider: 'openai',
          description: 'Geração estética fotorrealista via IA avançada (DALL-E 3).',
          is_available: true,
          has_key: hasOpenAIKey,
          badge: 'Novo',
        },
      ],
    })
  } catch (err) {
    return e.json(500, { success: false, error: err.message || String(err) })
  }
})

routerAdd('POST', '/backend/v1/generate-image', (e) => {
  try {
    // 1. Obter usuário autenticado via e.auth
    const authUser = e.auth
    if (!authUser) {
      return e.json(401, {
        success: false,
        error: 'Você precisa estar logado para gerar imagens com IA.',
      })
    }

    // 2. Validação obrigatória de PLANO PRO no BACKEND
    // Admin tem acesso PRO total automaticamente
    const email = (authUser.getString('email') || '').toLowerCase().trim()
    const isAdmin = authUser.getBool('is_admin') || email === 'juniorrodriguesjr123.jr@gmail.com'

    let isProActive = false
    if (isAdmin) {
      isProActive = true
    } else {
      try {
        const activeSubs = $app.findRecordsByFilter(
          'subscriptions',
          `user = "${authUser.id}" && status = "active" && (plan = "monthly" || plan = "annual")`,
          '-created',
          1,
          0,
        )
        if (activeSubs && activeSubs.length > 0) {
          isProActive = true
        }
      } catch (subErr) {
        console.warn('[generate-image] Erro ao verificar assinatura:', subErr)
      }
    }

    if (!isProActive) {
      return e.json(403, {
        success: false,
        error:
          'O Gerador de Imagens é um recurso exclusivo do Plano PRO. Faça upgrade para o plano Mensal ou Anual para desbloquear!',
        code: 'PRO_REQUIRED',
      })
    }

    // 3. Extrair payload via e.requestInfo().body
    const reqInfo = e.requestInfo()
    const body = reqInfo.body || {}
    const promptText = (body.prompt || body.description || '').trim()
    const referenceImages = Array.isArray(body.images) ? body.images : []
    const engine = (body.engine || 'nano_banana').toLowerCase().trim() // 'nano_banana' ou 'chatgpt'

    if (!promptText && referenceImages.length === 0) {
      return e.json(400, {
        success: false,
        error: 'Forneça uma descrição em texto ou pelo menos uma imagem de referência.',
      })
    }

    // 4. Preparação das imagens de referência (até 3)
    const normalizedReferenceImages = []
    const maxImages = Math.min(referenceImages.length, 3)

    for (let i = 0; i < maxImages; i++) {
      const imgItem = referenceImages[i]
      if (!imgItem) continue

      let mimeType = 'image/jpeg'
      let base64Data = ''

      if (typeof imgItem === 'string') {
        if (imgItem.startsWith('data:')) {
          const match = imgItem.match(/^data:([^;]+);base64,(.*)$/)
          if (match) {
            mimeType = match[1]
            base64Data = match[2]
          } else {
            base64Data = imgItem
          }
        } else {
          base64Data = imgItem
        }
      } else if (typeof imgItem === 'object' && imgItem.data) {
        mimeType = imgItem.mime_type || imgItem.mimeType || 'image/jpeg'
        base64Data = imgItem.data
      }

      if (base64Data) {
        normalizedReferenceImages.push({
          mimeType,
          data: base64Data,
        })
      }
    }

    // 5. Montagem do prompt com instrução de FIDELIDADE ESTRITA ao pedido do usuário
    // Regra mandatória: o pedido do usuário deve ser mantido literalmente em posição de destaque absoluto,
    // sem substituição ou eliminação dos elementos citados.
    let strictFidelityPrompt = ''
    if (normalizedReferenceImages.length > 0) {
      strictFidelityPrompt = `[DIRETIVA DE FIDELIDADE ABSOLUTA - OBRIGATÓRIO]
Siga EXATAMENTE e LITERALMENTE a descrição informada pelo usuário. Cada elemento, personagem, ação, cor e objeto citado DEVE aparecer na imagem gerada. Não omita nenhum detalhe solicitado e não adicione elementos arbitrários que alterem a ideia.
Preserve com fidelidade estrita o rosto, traços faciais, tom de pele, proporções anatômicas, cores, vestimentas e detalhes das ${normalizedReferenceImages.length} imagem(ns) de referência anexada(s).

DESCRIÇÃO EXATA DO USUÁRIO:
"""
${promptText}
"""

ESPECIFICAÇÕES TÉCNICAS:
- Formato vertical 9:16 (enquadramento cinematográfico para TikTok, Shorts e Reels)
- Fotografia em altíssima definição (estilo hiper-realista, iluminação de estúdio profissional, foco nítido)
- Imagem 100% limpa: ZERO texto impresso, ZERO legendas, ZERO caracteres ou marcas d'água.`
    } else {
      strictFidelityPrompt = `[DIRETIVA DE FIDELIDADE ABSOLUTA - OBRIGATÓRIO]
Siga EXATAMENTE e LITERALMENTE a descrição informada pelo usuário. Cada elemento, personagem, ação, cor e objeto citado DEVE aparecer na imagem gerada. Não omita nenhum detalhe solicitado e não adicione elementos arbitrários.

DESCRIÇÃO EXATA DO USUÁRIO:
"""
${promptText}
"""

ESPECIFICAÇÕES TÉCNICAS:
- Formato vertical 9:16 (enquadramento cinematográfico para TikTok, Shorts e Reels)
- Fotografia em altíssima definição (estilo hiper-realista, iluminação de estúdio profissional, foco nítido)
- Imagem 100% limpa: ZERO texto impresso, ZERO legendas, ZERO caracteres ou marcas d'água.`
    }

    // 6. MOTOR: ChatGPT (OpenAI - DALL-E 3)
    if (engine === 'chatgpt' || engine === 'openai') {
      const openAiKey = $os.getenv('OPENAI_API_KEY') || ''

      let openAiImageUrl = null
      let openAiError = null

      if (openAiKey) {
        try {
          const res = $http.send({
            method: 'POST',
            url: 'https://api.openai.com/v1/images/generations',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openAiKey}`,
            },
            body: JSON.stringify({
              model: 'dall-e-3',
              prompt: strictFidelityPrompt.slice(0, 4000),
              n: 1,
              size: '1024x1792', // vertical 9:16
              quality: 'standard',
            }),
            timeout: 60,
          })

          if (res.statusCode >= 200 && res.statusCode < 300) {
            const data = res.json || {}
            if (data.data && data.data[0] && data.data[0].url) {
              openAiImageUrl = data.data[0].url
            } else if (data.data && data.data[0] && data.data[0].b64_json) {
              openAiImageUrl = `data:image/png;base64,${data.data[0].b64_json}`
            }
          } else {
            openAiError = `OpenAI API HTTP ${res.statusCode}: ${JSON.stringify(res.json || res.body || '')}`
            console.warn('[generate-image] OpenAI erro:', openAiError)
          }
        } catch (openAiErr) {
          openAiError = openAiErr.message || String(openAiErr)
          console.warn('[generate-image] Falha na API OpenAI:', openAiErr)
        }
      }

      if (openAiImageUrl) {
        return e.json(200, {
          success: true,
          image_url: openAiImageUrl,
          engine: 'chatgpt',
          source: 'openai',
          prompt: promptText,
          is_fallback: false,
          reference_images_count: normalizedReferenceImages.length,
          notice:
            'Imagem gerada diretamente pela API DALL-E 3 com fidelidade estrita à sua descrição.',
        })
      }

      // Fallback para ChatGPT com sinalização explícita de limitação
      const queryKeywords = encodeURIComponent(
        (promptText || 'cinematic viral creator character')
          .replace(/[^a-zA-Z0-9\s]/g, ' ')
          .split(/\s+/)
          .slice(0, 4)
          .join('+') || 'creator+viral',
      )
      const fallbackUrl = `https://img.usecurling.com/p/720/1280?q=${queryKeywords}&color=purple`

      return e.json(200, {
        success: true,
        image_url: fallbackUrl,
        engine: 'chatgpt',
        source: 'fallback',
        prompt: promptText,
        is_fallback: true,
        reference_images_count: normalizedReferenceImages.length,
        notice: openAiKey
          ? 'Serviço OpenAI temporariamente indisponível. Exibindo pré-visualização demonstrativa.'
          : 'Modo Demonstração PRO: O servidor não possui chave OpenAI (DALL-E 3) configurada no ambiente. Esta imagem é uma prévia ilustrativa e não reflete fielmente o texto ou fotos de referência.',
      })
    }

    // 7. MOTOR: Nano Banana (Google Gemini / Imagen 3)
    let googleApiKey = authUser.getString('google_ai_api_key') || ''
    if (!googleApiKey) {
      googleApiKey = $os.getenv('GEMINI_API_KEY') || ''
    }

    let generatedImageBase64 = null
    let generatedMimeType = 'image/png'
    let usedProviderSource = ''

    if (googleApiKey) {
      // Montagem das partes no padrão Gemini (multimodal)
      const geminiParts = []
      for (let i = 0; i < normalizedReferenceImages.length; i++) {
        geminiParts.push({
          inlineData: {
            mimeType: normalizedReferenceImages[i].mimeType,
            data: normalizedReferenceImages[i].data,
          },
        })
      }
      geminiParts.push({
        text: strictFidelityPrompt,
      })

      // Ordem prioritária de endpoints oficiais:
      // 1. interactions v1beta gemini-nano-banana-2.1 (modelo mais novo do Nano Banana)
      // 2. interactions v1beta gemini-2.5-flash-image
      // 3. interactions v1beta gemini-3.1-flash-image
      // 4. generateContent v1beta gemini-2.5-flash-image com responseModalities
      // 5. imagen-3.0-generate-002:predict (caso seja text-to-image de alta fidelidade 9:16)
      // 6. imagen-3.0-generate-001:predict
      const candidateEndpoints = [
        {
          name: 'interactions:gemini-nano-banana-2.1',
          url: 'https://generativelanguage.googleapis.com/v1beta/interactions',
          headers: {
            'x-goog-api-key': googleApiKey,
            'Content-Type': 'application/json',
          },
          body: {
            model: 'gemini-nano-banana-2.1',
            input: geminiParts.map((p) => {
              if (p.inlineData) {
                return {
                  type: 'image',
                  mime_type: p.inlineData.mimeType,
                  data: p.inlineData.data,
                }
              }
              return { type: 'text', text: p.text }
            }),
          },
          parser: (data) => {
            const outImg =
              data.output_image ||
              (data.interaction && data.interaction.output_image) ||
              data.outputImage
            if (outImg && outImg.data) {
              return { data: outImg.data, mime: outImg.mime_type || outImg.mimeType || 'image/png' }
            }
            return null
          },
        },
        {
          name: 'interactions:gemini-2.5-flash-image',
          url: 'https://generativelanguage.googleapis.com/v1beta/interactions',
          headers: {
            'x-goog-api-key': googleApiKey,
            'Content-Type': 'application/json',
          },
          body: {
            model: 'gemini-2.5-flash-image',
            input: geminiParts.map((p) => {
              if (p.inlineData) {
                return {
                  type: 'image',
                  mime_type: p.inlineData.mimeType,
                  data: p.inlineData.data,
                }
              }
              return { type: 'text', text: p.text }
            }),
          },
          parser: (data) => {
            const outImg =
              data.output_image ||
              (data.interaction && data.interaction.output_image) ||
              data.outputImage
            if (outImg && outImg.data) {
              return { data: outImg.data, mime: outImg.mime_type || outImg.mimeType || 'image/png' }
            }
            return null
          },
        },
        {
          name: 'generateContent:gemini-2.5-flash-image',
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${googleApiKey}`,
          headers: { 'Content-Type': 'application/json' },
          body: {
            contents: [{ parts: geminiParts }],
            generationConfig: {
              responseModalities: ['TEXT', 'IMAGE'],
            },
          },
          parser: (data) => {
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
              const respParts = data.candidates[0].content.parts || []
              for (let j = 0; j < respParts.length; j++) {
                const pt = respParts[j]
                if (pt.inlineData && pt.inlineData.data) {
                  return { data: pt.inlineData.data, mime: pt.inlineData.mimeType || 'image/png' }
                }
              }
            }
            return null
          },
        },
        {
          name: 'imagen-3.0-generate-002:predict',
          url: `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${googleApiKey}`,
          headers: { 'Content-Type': 'application/json' },
          body: {
            instances: [
              {
                prompt: `${promptText}. Retrato vertical 9:16 hiper-realista, iluminação profissional cinematográfica, altíssima definição, vídeo limpo sem texto ou marcas.`,
              },
            ],
            parameters: {
              sampleCount: 1,
              aspectRatio: '9:16',
              outputMimeType: 'image/jpeg',
            },
          },
          parser: (data) => {
            if (data.predictions && data.predictions[0]) {
              const pred = data.predictions[0]
              const b64 = pred.bytesBase64Encoded || pred.data
              if (b64) {
                return { data: b64, mime: pred.mimeType || 'image/jpeg' }
              }
            }
            return null
          },
        },
      ]

      for (let i = 0; i < candidateEndpoints.length; i++) {
        const ep = candidateEndpoints[i]
        try {
          const res = $http.send({
            method: 'POST',
            url: ep.url,
            headers: ep.headers,
            body: JSON.stringify(ep.body),
            timeout: 60,
          })

          if (res.statusCode >= 200 && res.statusCode < 300) {
            const data = res.json || {}
            const parsed = ep.parser(data)
            if (parsed && parsed.data) {
              generatedImageBase64 = parsed.data
              generatedMimeType = parsed.mime || 'image/png'
              usedProviderSource = ep.name
              break
            }
          } else {
            console.warn(
              `[generate-image] endpoint ${ep.name} retornou status ${res.statusCode}:`,
              res.body ? String(res.body).slice(0, 200) : '',
            )
          }
        } catch (callErr) {
          console.warn(`[generate-image] endpoint ${ep.name} falhou:`, callErr.message || callErr)
        }
      }
    }

    // 8. Se gerou imagem real com a API do Google Gemini / Imagen
    if (generatedImageBase64) {
      const dataUri = `data:${generatedMimeType};base64,${generatedImageBase64}`
      return e.json(200, {
        success: true,
        image_url: dataUri,
        engine: 'nano_banana',
        mime_type: generatedMimeType,
        prompt: promptText,
        source: 'gemini',
        endpoint: usedProviderSource,
        is_fallback: false,
        reference_images_count: normalizedReferenceImages.length,
        notice:
          'Imagem gerada com sucesso pela API oficial Nano Banana (Gemini) com fidelidade total à sua descrição e referências.',
      })
    }

    // 9. Modo Demonstrativo (Fallback CDN do Skip)
    // Quando nem o usuário nem o servidor possuem chave externa configurada.
    // IMPORTANTE: Deixa claro que este modo NÃO tem fidelidade de IA e orienta a conexão da chave.
    const queryKeywords = encodeURIComponent(
      (promptText || 'product photography viral creator character')
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .split(/\s+/)
        .slice(0, 4)
        .join('+') || 'creator+viral',
    )
    const fallbackUrl = `https://img.usecurling.com/p/720/1280?q=${queryKeywords}&color=pink`

    return e.json(200, {
      success: true,
      image_url: fallbackUrl,
      engine: 'nano_banana',
      prompt: promptText,
      source: 'fallback',
      is_fallback: true,
      reference_images_count: normalizedReferenceImages.length,
      notice: googleApiKey
        ? 'A API Nano Banana (Google AI) retornou sem imagem no momento. Exibindo pré-visualização demonstrativa.'
        : 'Modo Demonstração PRO: Nenhuma chave da API Google AI Studio (Gemini/Nano Banana) foi configurada no seu perfil. Por isso, a imagem exibida é uma prévia demonstrativa e NÃO corresponde à sua descrição nem às fotos enviadas. Para fidelidade 100%, adicione sua chave gratuita do Google AI Studio em "Meu Perfil"!',
    })
  } catch (err) {
    console.error('[generate-image] Erro geral:', err)
    return e.json(500, {
      success: false,
      error: 'Não foi possível gerar a imagem no momento. Tente novamente em instantes.',
    })
  }
})
