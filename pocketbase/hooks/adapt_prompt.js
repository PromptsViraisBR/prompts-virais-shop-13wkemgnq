/// <reference path="../pb_data/types.d.ts" />

/**
 * Hook para:
 * 1. POST /backend/v1/adapt-prompt
 *    - Adaptação inteligente de roteiro com base em fotos reais ou novo produto/personagem.
 *    - Usa $ai.chat (model: "fast") para substituir com precisão absoluta o produto/personagem
 *      antigo do prompt pelo novo informado (ex: capinha de celular -> espelho; cachorro -> pinguim).
 *    - Cada chamada gera um roteiro totalmente diferente e dinâmico, conexo com o nicho solicitado.
 *    - Garante diretrizes fixas: PT-BR, vídeo 100% limpo sem legendas/texto na tela,
 *      e-commerce máx 10s (0-3s gancho, 3-7s detalhes, 7-10s CTA carrinho); virais ~60s (6 cenas de 10s).
 *
 * 2. POST /backend/v1/generate-viral-scene
 *    - Gerador de vídeos virais a partir de fotos criadas ou tema/personagem.
 *    - Gera Ideia de Cena (conceito curto) + Roteiro Opcional de ~60s (6 cenas de 10s).
 *    - Variação dinâmica a cada execução.
 *
 * 3. POST /backend/v1/regenerate-variations
 *    - Regenera 3 variações totalmente novas e variadas a cada chamada mantendo o nicho solicitado.
 *
 * IMPORTANTE: Todas as funções utilitárias ficam INLINE dentro de cada callback de rota
 * para compatibilidade estrita com o pool JSVM do PocketBase.
 */

// ROTA 1: POST /backend/v1/adapt-prompt
routerAdd('POST', '/backend/v1/adapt-prompt', (e) => {
  const sanitizeText = function (text) {
    if (!text) return ''
    let cleaned = String(text)
    cleaned = cleaned.replace(/^[ \t]*[-•*]?[ \t]*Texto[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
    cleaned = cleaned.replace(/^[ \t]*[-•*]?[ \t]*Legenda[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
    cleaned = cleaned.replace(/^[ \t]*[-•*]?[ \t]*Subtítulo[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
    cleaned = cleaned.replace(/^[ \t]*[-•*]?[ \t]*Overlay[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
    return cleaned.replace(/\n{3,}/g, '\n\n').trim()
  }

  const pickRandom = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  try {
    const data = e.requestInfo().body || {}
    const basePrompt = (data.original_prompt || data.base_prompt || '').trim()
    const promptTitle = (data.prompt_title || '').trim()
    const targetProduct = (data.product_name || promptTitle || 'novo produto').trim()
    const characterName = (data.character_name || '').trim()
    const visualDetails = (data.visual_details || '').trim()
    const niche = (data.niche || '').trim()
    const imageCount = parseInt(data.images_count || data.image_count || '0', 10)
    const category = (data.category || '').trim()
    const iterationSeed = data.iteration_seed || data.seed || Math.floor(Math.random() * 1000000)

    const authUser = e.auth
    // Verificação de acesso: Se o usuário for admin ou tiver assinatura ativa PRO ou créditos extras
    if (authUser) {
      let isProActive = false
      const email = (authUser.getString('email') || '').toLowerCase().trim()
      const isAdmin = authUser.getBool('is_admin') || email === 'juniorrodriguesjr123.jr@gmail.com'

      if (isAdmin) {
        isProActive = true
      } else {
        try {
          const subs = $app.findRecordsByFilter(
            'subscriptions',
            `user = "${authUser.id}" && status = "active" && (plan = "monthly" || plan = "annual")`,
            '-created',
            1,
            0,
          )
          if (subs && subs.length > 0) isProActive = true
        } catch (_) {}
      }

      // Se não é PRO nem admin, verificar se possui créditos extras de regeneração
      if (!isProActive) {
        let hasCredits = false
        try {
          const credRec = $app.findFirstRecordByData('regeneration_credits', 'user', authUser.id)
          if (credRec && credRec.getInt('extra_prompts_balance') > 0) {
            hasCredits = true
          }
        } catch (_) {}

        // Se a requisição veio explicitamente para adaptação de catálogo avançada e não possui PRO nem créditos extras
        if (!hasCredits && data.require_pro) {
          return e.json(403, {
            success: false,
            error:
              'Recurso exclusivo do Plano PRO. Faça upgrade para desbloquear adaptação ilimitada!',
            code: 'PRO_REQUIRED',
          })
        }
      }
    }

    const isViral =
      category === 'virais' ||
      basePrompt.includes('60 SEGUNDOS') ||
      basePrompt.includes('CENA 6') ||
      Boolean(characterName)

    let photoNotes = ''
    if (imageCount > 0) {
      photoNotes = `📸 Adaptação baseada em ${imageCount} foto(s) anexada(s) da peça/cena real.`
      if (visualDetails) {
        photoNotes += ` Detalhes observados: ${visualDetails}.`
      }
    }

    let aiPromptResult = ''

    // Fonte prioritária de IA de TEXTO: hub JRL do usuário (jrl-ai-hub), com fallback
    // para o $ai.chat (Skip AI) atual — nada quebra se o hub estiver fora do ar.
    // Funções inline para compatibilidade estrita com o pool JSVM do PocketBase.
    const readJrlSecret = function (name) {
      let v = ''
      try {
        v = $os.getenv(name) || ''
      } catch (_) {}
      if (!v) {
        try {
          if ($secrets.has(name)) v = $secrets.get(name) || ''
        } catch (_) {}
      }
      return v
    }
    const jrlHubChatText = function (systemPrompt, userPrompt, opts) {
      const r = { ok: false, text: '', model: '', error: '', status: 0 }
      try {
        const base = (readJrlSecret('JRL_AI_HUB_BASE_URL') || '').replace(/\/+$/, '')
        const key = readJrlSecret('JRL_AI_HUB_API_KEY') || ''
        if (!base || !key) {
          r.error = 'hub-não-configurado'
          return r
        }
        const messages = []
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
        messages.push({ role: 'user', content: userPrompt })
        const body = { messages: messages }
        if (opts && opts.model) body.model = opts.model
        if (opts && opts.maxTokens) body.max_tokens = opts.maxTokens
        const res = $http.send({
          method: 'POST',
          url: base + '/chat/completions',
          headers: {
            Authorization: 'Bearer ' + key,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
          timeout: (opts && opts.timeout) || 90,
        })
        r.status = res.statusCode
        if (res.statusCode < 200 || res.statusCode >= 300) {
          r.error = 'hub-http-' + res.statusCode
          return r
        }
        const json = res.json || {}
        if (json.choices && json.choices[0] && json.choices[0].message) {
          const content = String(json.choices[0].message.content || '')
          if (content.trim()) {
            r.ok = true
            r.text = content
            r.model = json.model || (opts && opts.model) || ''
          } else {
            r.error = 'hub-resposta-vazia'
          }
        } else {
          r.error = 'hub-formato-inesperado'
        }
      } catch (err) {
        r.error = 'hub-exceção: ' + (err.message || String(err))
      }
      return r
    }

    // Tentativa com IA Skip AI ($ai.chat) para adaptação e substituição profunda
    try {
      const systemInstruction = `Você é um diretor e roteirista profissional de vídeos virais para TikTok, Shopee Vídeo, Reels e Shorts em Português Brasileiro (PT-BR).

REGRAS CRÍTICAS E OBRIGATÓRIAS:
1. SUBSTITUIÇÃO TOTAL DO PRODUTO/PERSONAGEM: Se o prompt original falava de um produto ou personagem anterior (exemplo: capinha de celular, vestido, cachorro, etc.), você DEVE SUBSTITUIR TOTALMENTE pelo NOVO PRODUTO ou NOVO PERSONAGEM informado pelo usuário: "${characterName ? characterName : targetProduct}". Não deixe resquícios do produto antigo. Toda a narrativa, benefícios, toque e ações devem ser exclusivamente sobre o novo item/personagem.
2. PRESERVAR O NICHO E ESTRUTURA: Mantenha a essência do nicho informado (${niche || 'relevante ao produto'}), mas crie uma abordagem e falas TOTALMENTE NOVAS E VARIADAS a cada execução (Seed da variação: ${iterationSeed}).
3. VÍDEO 100% LIMPO: JAMAIS inclua texto na tela, JAMAIS inclua legendas gravadas no vídeo, nem caracteres visuais na imagem. A narração é apenas falada (áudio).
4. FORMATO:
   ${isViral ? `- Roteiro VIRAL de ~60 SEGUNDOS organizado em EXATAMENTE 6 CENAS de até 10 segundos (CENA 1: Gancho 0-10s, CENA 2: 10-20s, CENA 3: 20-30s, CENA 4: 30-40s, CENA 5: 40-50s, CENA 6: CTA 50-60s). Personagem central: ${characterName || targetProduct}.` : `- Roteiro de E-COMMERCE de NO MÁXIMO 10 SEGUNDOS organizado em 3 CENAS (CENA 1: Gancho hipnótico 0-3s, CENA 2: Detalhes reais do produto 3-7s, CENA 3: Chamada ao carrinho/sacola 7-10s). Produto central: ${targetProduct}.`}
5. Responda em Português do Brasil com tom natural, sem erros gramaticais ou de concordância. Retorne diretamente o roteiro formatado cena a cena.`

      const userMessage = `Roteiro base original (para adaptar e transformar):
"""
${basePrompt || `Roteiro para ${targetProduct}`}
"""

Dados para adaptação:
- Novo produto/item desejado: ${targetProduct}
${characterName ? `- Novo personagem desejado para a história: ${characterName}` : ''}
- Nicho: ${niche || 'comércio/criadores'}
- Detalhes visuais das fotos reais: ${visualDetails || 'acabamento nítido e caimento real'}
- Fotos anexadas: ${imageCount}
- Variação aleatória: #${iterationSeed}

Crie um roteiro totalmente novo e renovado, substituindo perfeitamente o produto ou personagem anterior pelo informado agora, com vídeo 100% limpo sem texto na tela.`

      // 1) Prioridade: hub JRL; 2) fallback: $ai.chat (Skip AI)
      const hubRes = jrlHubChatText(systemInstruction, userMessage, {
        maxTokens: 1600,
        timeout: 90,
      })
      if (hubRes.ok) {
        aiPromptResult = sanitizeText(hubRes.text)
        console.log('[adapt-prompt] roteiro gerado via hub JRL (' + hubRes.model + ')')
      } else {
        console.log(
          '[adapt-prompt] hub JRL indisponível (' + hubRes.error + '), usando $ai.chat (Skip AI)',
        )
        const reply = $ai.chat({
          model: 'fast',
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userMessage },
          ],
        })

        if (reply && reply.choices && reply.choices[0] && reply.choices[0].message) {
          aiPromptResult = sanitizeText(reply.choices[0].message.content)
        }
      }
    } catch (aiErr) {
      console.log(
        'adapt-prompt: falha no hub/$ai.chat, usando gerador dinâmico de fallback: ' +
          aiErr.message,
      )
    }

    // Se a IA não gerou, usamos o gerador dinâmico com grande variedade
    if (!aiPromptResult || aiPromptResult.length < 50) {
      if (isViral) {
        const char = characterName || targetProduct
        const viralHooks = [
          `"Você não vai acreditar no que o(a) ${char} aprontou quando ninguém tava olhando!"`,
          `"Se você acha que já viu de tudo hoje, para tudo e olha o(a) ${char} em ação!"`,
          `"Eu jurei que era montagem até ver o(a) ${char} fazer exatamente isso ao vivo!"`,
          `"O dia em que o(a) ${char} decidiu quebrar todas as regras da casa!"`,
          `"Segredo revelado: o que realmente acontece quando o(a) ${char} fica sozinho(a)?"`,
        ]
        const hookText = pickRandom(viralHooks)

        aiPromptResult = `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S (PT-BR)]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10s)
🎯 PERSONAGEM/ELEMENTO CENTRAL: ${char}
🏷️ NICHO: ${niche || 'Vídeos Virais'}
📌 DIRETRIZES: Vídeo 100% limpo sem legendas na tela. Narração em áudio PT-BR.
${photoNotes ? `\n${photoNotes}\n` : ''}
🎬 CENA 1 (0-10s) - GANCHO HIPNÓTICO (HOOK):
- Visual: Enquadramento direto em ${char} com iluminação cinematográfica e detalhes expressivos (${visualDetails || 'texturas vívidas'}).
- Narração (PT-BR): ${hookText}

🎬 CENA 2 (10-20s) - O DESENVOLVIMENTO:
- Visual: A câmera revela o cenário ao redor em plano médio lateral com ${char} reagindo ao ambiente.
- Narração (PT-BR): "No início parecia uma situação comum, mas repare com atenção nos detalhes dos movimentos..."

🎬 CENA 3 (20-30s) - A REVIRAVOLTA:
- Visual: Mudança brusca de ângulo; ${char} toma uma decisão inesperada que muda o tom da cena.
- Narração (PT-BR): "E foi aí que aconteceu o que ninguém na internet estava esperando!"

🎬 CENA 4 (30-40s) - O CLÍMAX:
- Visual: Tomada em câmera lenta suave capturando a intensidade máxima da reação de ${char}.
- Narração (PT-BR): "Olha essa expressão! É exatamente por isso que essa cena viralizou em tempo recorde!"

🎬 CENA 5 (40-50s) - O DESFECHO:
- Visual: Enquadramento estético mostrando a consequência cômica ou surpreendente do momento.
- Narração (PT-BR): "No final das contas, ficou claro que momentos assim merecem ficar gravados pra sempre!"

🎬 CENA 6 (50-60s) - FECHAMENTO E ENGAGEMENT (CTA):
- Visual: ${char} olha diretamente para a lente com atitude e carisma. Fade-out suave.
- Narração (PT-BR): "O que você faria no lugar dele(a)? Comente a sua opinião sincera e siga o perfil para ver a continuação!"`
      } else {
        const prod = targetProduct
        const hooks = [
          `"Se você viu a foto e ficou na dúvida, olha o caimento real desse(a) ${prod} no corpo!"`,
          `"POV: Você finalmente achou o(a) ${prod} perfeito(a) que todo mundo tá usando no TikTok!"`,
          `"SE VOCÊ TÁ VENDO ESSE VÍDEO, CORRE! O lote desse(a) ${prod} tá quase esgotando!"`,
          `"Eu comprei esse(a) ${prod} pra testar se as avaliações 5 estrelas eram verdade e... chocada!"`,
          `"Pare de comprar peças sem graça e olha a presença desse(a) ${prod} na prática!"`,
        ]
        const hook = pickRandom(hooks)
        const detailObs =
          visualDetails || 'acabamento reforçado, cor idêntica à foto e tecido premium'

        aiPromptResult = `[ROTEIRO VIRAL SHOPEE & TIKTOK SHOP - MÁXIMO 10 SEGUNDOS]
🎯 PRODUTO: ${prod}
🏷️ NICHO: ${niche || 'Moda & E-commerce'}
⏱️ DURAÇÃO MÁXIMA: 10 segundos
📌 DIRETRIZES ESSENCIAIS: Vídeo 100% limpo sem texto na tela, sem legendas gravadas.
${photoNotes ? `\n${photoNotes}\n` : ''}
🎬 CENA 1 (0-3s) - O GANCHO PODEROSO (HOOK):
- Enquadramento vertical 9:16: modelo ou POV segurando/vestindo o(a) ${prod} com iluminação frontal nítida.
- Narração empolgada (PT-BR): ${hook}

🎬 CENA 2 (3-7s) - DETALHES REAIS DA PEÇA:
- Close nos detalhes físicos destacados nas fotos: ${detailObs}.
- Narração (PT-BR): "Acabamento de primeira linha, toque macio e fidelidade absoluta às fotos do catálogo."

🎬 CENA 3 (7-10s) - CHAMADA DIRETA PARA O CARRINHO (CTA):
- Apontando diretamente para o carrinho amarelo no canto inferior esquerdo:
- Narração (PT-BR): "Garanta o seu com desconto ativo e envio imediato no link do carrinho aqui embaixo!"`
      }
    }

    return e.json(200, {
      success: true,
      adapted_prompt: aiPromptResult,
      product_name: targetProduct,
      character_name: characterName || undefined,
      visual_details: visualDetails,
      image_count: imageCount,
    })
  } catch (err) {
    return e.json(500, {
      success: false,
      message: 'Erro ao adaptar roteiro: ' + (err.message || String(err)),
    })
  }
})

// ROTA 2: POST /backend/v1/generate-viral-scene
routerAdd('POST', '/backend/v1/generate-viral-scene', (e) => {
  const sanitizeText = function (text) {
    if (!text) return ''
    let cleaned = String(text)
    cleaned = cleaned.replace(/^[ \t]*[-•*]?[ \t]*Texto[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
    cleaned = cleaned.replace(/^[ \t]*[-•*]?[ \t]*Legenda[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
    cleaned = cleaned.replace(/^[ \t]*[-•*]?[ \t]*Subtítulo[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
    cleaned = cleaned.replace(/^[ \t]*[-•*]?[ \t]*Overlay[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
    return cleaned.replace(/\n{3,}/g, '\n\n').trim()
  }

  const pickRandom = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  try {
    const data = e.requestInfo().body || {}
    const characterName = (data.character_name || '').trim()
    const userIdea = (
      data.user_idea ||
      data.script_idea ||
      data.idea ||
      data.theme_name ||
      data.theme ||
      ''
    ).trim()
    const themeName = (data.theme_name || userIdea || characterName || 'Personagem central').trim()
    const characterOrTheme = (characterName || userIdea || themeName).trim()
    const niche = (data.niche || 'historinhas_frutas').trim()
    const visualDetails = (data.visual_details || '').trim()
    const imagesPayload = Array.isArray(data.images) ? data.images : []
    const imageCount = parseInt(
      data.images_count || (imagesPayload.length > 0 ? imagesPayload.length : '0'),
      10,
    )
    const seed = data.seed || Math.floor(Math.random() * 1000000)

    const nicheNames = {
      historinhas_frutas: 'Historinhas de Frutas Humanoides',
      infantil_historinhas: 'Conteúdo Infantil & Fábulas',
      terror_suspense: 'Terror & Suspense 3AM',
      comedia_engracado: 'Comédia & Situações Engraçadas',
      face_swap: 'Troca de Rosto (Face Swap)',
      asmr_sensorial: 'ASMR Sons & Visual Sensorial',
      animais_falantes: 'Animais Falantes & Pets Cômicos',
      perfumes_cosmeticos: 'Perfumes & Cosméticos',
    }
    const nicheLabel = nicheNames[niche] || 'Vídeos Virais'

    const buildWrittenPostTemplate = function (n, title, char) {
      const cleanTitle = (title || char || 'vídeo viral').trim()
      const cleanChar = char && char !== cleanTitle ? ` (${char})` : ''
      const posts = {
        historinhas_frutas: `Você nunca mais vai olhar para uma fruta do mesmo jeito depois disso! 😱🍎\n\nAcompanhe a história do(a) ${cleanTitle}${cleanChar} que viralizou e conquistou todo mundo.\n\nQual fruta você quer ver no próximo vídeo? Deixe nos comentários! 👇\n\n# # # # # `,
        infantil_historinhas: `Era uma vez uma aventura cheia de lições e magia! 🌟📚\n\nVenha se encantar com ${cleanTitle}${cleanChar}, perfeito para todas as idades.\n\nCompartilhe com quem adora boas historinhas e fábulas encantadas! 💖\n\n# # # # # `,
        terror_suspense: `NÃO ASSISTA ESTE VÍDEO SE VOCÊ TIVER MEDO DO ESCURO... 🕯️👁️\n\nO que aconteceu com ${cleanTitle}${cleanChar} às 3 da manhã não tem explicação lógica.\n\nVocê teria coragem de ficar sozinho nesse lugar? Comente sua teoria aqui embaixo... se tiver coragem. 😱\n\n# # # # # `,
        comedia_engracado: `Eu juro que tentei disfarçar, mas não deu! 😂🤣\n\nQuando o assunto é ${cleanTitle}${cleanChar}, o perrengue vem em dose dupla!\n\nMarca aquele amigo que passa exatamente pela mesma vergonha todo dia! 👇👇\n\n# # # # # `,
        face_swap: `Parece real, mas é pura inteligência artificial! 🤖✨\n\nTroca de rosto épica com ${cleanTitle}${cleanChar}. O nível de realismo ficou absurdo.\n\nQuem você gostaria de ver transformado no próximo vídeo? Manda nos comentários! 👇\n\n# # # # # `,
        asmr_sensorial: `Coloque os fones de ouvido e sinta o relaxamento imediato... 🎧🫧\n\nSons táteis e visual super satisfatório de ${cleanTitle}${cleanChar}.\n\nDeixe nos comentários qual gatilho te dá mais arrepio bom! 💆‍♀️✨\n\n# # # # # `,
        animais_falantes: `Se os bichinhos pudessem falar tudo o que pensam, seria exatamente assim! 🐶🐱🗣️\n\nA reação de ${cleanTitle}${cleanChar} é simplesmente impagável.\n\nQual é a raça do seu pet? Me conta nos comentários como ele reagiria! 👇❤️\n\n# # # # # `,
        perfumes_cosmeticos: `O segredo para ficar com cheiro de gente rica e marcante o dia inteiro! 💎✨\n\nConheça todos os detalhes de ${cleanTitle}${cleanChar}. Projeção e fixação que chamam atenção por onde passar.\n\nVocê já testou essa fragrância? Me conta nos comentários o que achou! 👇🛍️\n\n# # # # # `,
      }
      return (
        posts[n] ||
        `Você não vai acreditar no que aconteceu aqui! 😱🎬\n\nConfira todos os detalhes de ${cleanTitle}${cleanChar}. Uma história pensada para prender sua atenção do primeiro ao último segundo.\n\nO que você faria nessa situação? Deixe sua opinião sincera nos comentários e siga para mais! 👇💬\n\n# # # # # `
      )
    }

    // Análise multimodal da imagem via Gemini se houver imagem enviada
    let analyzedImageDescription = ''
    if (imagesPayload.length > 0) {
      try {
        let apiKey = ''
        if (e.auth) {
          apiKey = e.auth.getString('google_ai_api_key') || ''
        }
        if (!apiKey) {
          apiKey = $os.getenv('GEMINI_API_KEY') || ''
        }

        if (apiKey) {
          const geminiParts = []
          const maxImgs = Math.min(imagesPayload.length, 3)
          for (let i = 0; i < maxImgs; i++) {
            const item = imagesPayload[i]
            if (!item) continue
            let mType = 'image/jpeg'
            let b64 = ''
            if (typeof item === 'string') {
              if (item.startsWith('data:')) {
                const match = item.match(/^data:([^;]+);base64,(.*)$/)
                if (match) {
                  mType = match[1]
                  b64 = match[2]
                } else {
                  b64 = item
                }
              } else {
                b64 = item
              }
            } else if (typeof item === 'object' && item.data) {
              mType = item.mime_type || item.mimeType || 'image/jpeg'
              b64 = item.data
            }

            if (b64) {
              geminiParts.push({
                inlineData: {
                  mimeType: mType,
                  data: b64,
                },
              })
            }
          }

          if (geminiParts.length > 0) {
            geminiParts.push({
              text: 'Descreva em 2 a 3 frases em Português os elementos visuais exatos desta imagem: quem ou o que é o personagem/objeto principal (espécie, roupas, cores, expressão facial, postura), o cenário de fundo (local, iluminação, objetos presentes) e o estilo visual.',
            })

            const gRes = $http.send({
              method: 'POST',
              url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: geminiParts }],
              }),
              timeout: 20,
            })

            if (gRes.statusCode >= 200 && gRes.statusCode < 300) {
              const gData = gRes.json || {}
              if (
                gData.candidates &&
                gData.candidates[0] &&
                gData.candidates[0].content &&
                gData.candidates[0].content.parts
              ) {
                analyzedImageDescription = sanitizeText(
                  gData.candidates[0].content.parts.map((p) => p.text || '').join(' '),
                )
              }
            }
          }
        }
      } catch (visErr) {
        console.log('generate-viral-scene: visão Gemini opcional indisponível: ' + visErr.message)
      }
    }

    const visualSummary = [
      analyzedImageDescription ? `Análise da foto enviada: ${analyzedImageDescription}` : '',
      visualDetails ? `Detalhes informados pelo usuário: ${visualDetails}` : '',
    ]
      .filter(Boolean)
      .join(' | ')

    let sceneConcept = ''
    let optionalScript = ''

    // Prioridade da ideia digitada pelo usuário conduzindo o roteiro, combinada com a foto
    const effectiveIdea = userIdea || themeName || characterOrTheme
    const effectiveChar = characterName || (userIdea ? '' : characterOrTheme)

    // Tentar gerar via hub JRL (prioritário) e $ai.chat com prompt estrito de fidelidade à ideia e personagem
    // Funções do hub inline (pool JSVM): mesma definição da ROTA 1.
    const readJrlSecret = function (name) {
      let v = ''
      try {
        v = $os.getenv(name) || ''
      } catch (_) {}
      if (!v) {
        try {
          if ($secrets.has(name)) v = $secrets.get(name) || ''
        } catch (_) {}
      }
      return v
    }
    const jrlHubChatText = function (systemPrompt, userPrompt, opts) {
      const r = { ok: false, text: '', model: '', error: '', status: 0 }
      try {
        const base = (readJrlSecret('JRL_AI_HUB_BASE_URL') || '').replace(/\/+$/, '')
        const key = readJrlSecret('JRL_AI_HUB_API_KEY') || ''
        if (!base || !key) {
          r.error = 'hub-não-configurado'
          return r
        }
        const messages = []
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
        messages.push({ role: 'user', content: userPrompt })
        const body = { messages: messages }
        if (opts && opts.model) body.model = opts.model
        if (opts && opts.maxTokens) body.max_tokens = opts.maxTokens
        const res = $http.send({
          method: 'POST',
          url: base + '/chat/completions',
          headers: {
            Authorization: 'Bearer ' + key,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
          timeout: (opts && opts.timeout) || 90,
        })
        r.status = res.statusCode
        if (res.statusCode < 200 || res.statusCode >= 300) {
          r.error = 'hub-http-' + res.statusCode
          return r
        }
        const json = res.json || {}
        if (json.choices && json.choices[0] && json.choices[0].message) {
          const content = String(json.choices[0].message.content || '')
          if (content.trim()) {
            r.ok = true
            r.text = content
            r.model = json.model || (opts && opts.model) || ''
          } else {
            r.error = 'hub-resposta-vazia'
          }
        } else {
          r.error = 'hub-formato-inesperado'
        }
      } catch (err) {
        r.error = 'hub-exceção: ' + (err.message || String(err))
      }
      return r
    }

    try {
      const systemInstruction = `Você é um diretor e roteirista profissional de canais virais (TikTok, Shorts, Reels) em Português Brasileiro (PT-BR).

REGRAS ABSOLUTAS E OBRIGATÓRIAS:
1. PRIORIDADE MÁXIMA PARA A IDEIA DO USUÁRIO:
   - A ideia digitada pelo usuário ("${effectiveIdea}") TEM PRIORIDADE ABSOLUTA e DEVE CONDUZIR TODA A HISTÓRIA DO ROTEIRO (ex: "abacate que vira herói", "fuga épica do gato da banheira", etc.).
   - Se o usuário digitou uma ideia e enviou foto, o roteiro DEVE COMBINAR OS DOIS: a ideia digitada comanda os acontecimentos e o enredo, enquanto a foto ancla o visual (personagem, cores, ambiente, texturas).
   - Se houver apenas foto, baseie-se nos elementos visuais da foto. Se houver apenas texto/ideia, baseie-se integralmente na ideia digitada.
   - NUNCA crie uma história genérica. Cada uma das 6 cenas DEVE desenvolver exatamente a ideia informada pelo usuário.
2. PERSONAGEM PRINCIPAL:
   ${effectiveChar ? `- Personagem principal: "${effectiveChar}". Ele deve protagonizar e conduzir a história.` : `- Destaque o personagem ou figura central da ideia ("${effectiveIdea}").`}
3. COERÊNCIA VISUAL COM A FOTO ENVIADA:
   - Detalhes visuais observados: ${visualSummary || 'Cores vibrantes, expressão do personagem e ambiente da imagem de referência'}.
4. REGRAS DE VÍDEO VIRAL:
   - Idioma: Português do Brasil (PT-BR) impecável, natural e coloquial para vídeos virais.
   - VÍDEO 100% LIMPO: SEM legendas gravadas na imagem, SEM textos na tela, SEM caracteres impressos no vídeo. A narração é estritamente falada (apenas em áudio).
   - Duração: ~60 segundos divididos em EXATAMENTE 6 cenas de até 10 segundos:
     CENA 1 (0-10s) - GANCHO HIPNÓTICO (HOOK)
     CENA 2 (10-20s) - DESENVOLVIMENTO
     CENA 3 (20-30s) - REVIRAVOLTA / TENSÃO
     CENA 4 (30-40s) - O CLÍMAX
     CENA 5 (40-50s) - A RESOLUÇÃO
     CENA 6 (50-60s) - CTA / ENGAGEMENT
   - Cada cena deve conter obrigatoriamente:
     - Visual: descrição precisa da ação da cena sem texto na tela
     - Narração (PT-BR): fala envolvente para narração em áudio
5. FORMATO DE RESPOSTA OBRIGATÓRIO:
   Divida a resposta exatamente com a tag [IDEIA_DE_CENA] e a tag [ROTEIRO_OPCIONAL].
   Em [IDEIA_DE_CENA], entregue o conceito sintetizado (2 a 4 linhas) baseado na ideia do usuário e foto.
   Em [ROTEIRO_OPCIONAL], entregue o roteiro completo de 6 cenas seguindo o padrão CENA 1 (0-10s), CENA 2 (10-20s), etc.`

      const userInstruction = `Crie a ideia de cena e o roteiro opcional de 60s (6 cenas de 10s) com fidelidade absoluta a estes dados:
- Ideia do usuário (PRIORIDADE TOTAL): "${effectiveIdea}"
${effectiveChar ? `- Personagem Principal: "${effectiveChar}"` : ''}
- Nicho viral: ${nicheLabel}
- Detalhes visuais / foto de referência: ${visualSummary || (imageCount > 0 ? 'Fidelidade visual total aos personagens, cores e ambiente da foto anexada' : 'Sem foto anexada, construir visual focado na ideia')}
- Fotos anexadas: ${imageCount}
- Variação Seed: #${seed}

Gere agora a [IDEIA_DE_CENA] e o [ROTEIRO_OPCIONAL] baseados na ideia digitada e na foto.`

      // 1) Prioridade: hub JRL; 2) fallback: $ai.chat (Skip AI)
      const hubRes = jrlHubChatText(systemInstruction, userInstruction, {
        maxTokens: 2000,
        timeout: 90,
      })
      let fullTxt = ''
      if (hubRes.ok) {
        console.log('[generate-viral-scene] roteiro gerado via hub JRL (' + hubRes.model + ')')
        fullTxt = hubRes.text
      } else {
        console.log(
          '[generate-viral-scene] hub JRL indisponível (' +
            hubRes.error +
            '), usando $ai.chat (Skip AI)',
        )
        const aiRes = $ai.chat({
          model: 'fast',
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userInstruction },
          ],
        })
        if (aiRes && aiRes.choices && aiRes.choices[0] && aiRes.choices[0].message) {
          fullTxt = aiRes.choices[0].message.content
        }
      }

      if (fullTxt) {
        if (fullTxt.includes('[IDEIA_DE_CENA]') && fullTxt.includes('[ROTEIRO_OPCIONAL]')) {
          const parts = fullTxt.split('[ROTEIRO_OPCIONAL]')
          sceneConcept = sanitizeText(parts[0].replace('[IDEIA_DE_CENA]', ''))
          optionalScript = sanitizeText(parts[1])
        } else {
          optionalScript = sanitizeText(fullTxt)
        }
      }
    } catch (aiErr) {
      console.log(
        'generate-viral-scene: IA indisponível, usando gerador contextual: ' + aiErr.message,
      )
    }

    // Fallbacks dinâmicos contextuais se a IA não responder no formato esperado
    const activeChar = characterName || (userIdea ? '' : characterOrTheme) || 'Personagem Principal'
    const activeIdea = effectiveIdea

    if (!sceneConcept) {
      sceneConcept = `💡 IDEIA DE CENA VIRAL:\n"${activeIdea}" no universo de ${nicheLabel}, com enquadramento frontal dinâmico e retenção alta nos primeiros 3 segundos.\n${visualSummary ? `🔍 Detalhes visuais da foto: ${visualSummary}` : imageCount > 0 ? '🔍 Baseado na composição visual da imagem enviada.' : '🔍 Focado na ideia digitada pelo usuário.'}`
    }

    if (!optionalScript) {
      optionalScript = `[ROTEIRO OPCIONAL SUGERIDO - ~60 SEGUNDOS EM 6 CENAS DE 10S]
⏱️ DURAÇÃO ALVO: ~60 Segundos (6 Cenas de até 10s cada)
🏷️ NICHO: ${nicheLabel}
💡 IDEIA CENTRAL: ${activeIdea}
${activeChar ? `🎯 PERSONAGEM: ${activeChar}\n` : ''}📌 DIRETRIZES ESSENCIAIS:
- Idioma da narração: Português Brasileiro (PT-BR)
- Vídeo totalmente limpo: SEM legendas gravadas na tela, SEM textos impressos no vídeo (narração apenas em áudio)
- Narração fluida e expressiva

🎬 CENA 1 (0-10s) - GANCHO HIPNÓTICO (HOOK):
- Visual: Enquadramento direto iniciando a situação: "${activeIdea}", com estética e cores fiéis à foto de referência (${visualSummary || 'alta definição'}). Vídeo 100% limpo sem texto.
- Narração (PT-BR): "Se você acha que já viu de tudo na internet hoje, para tudo e olha o que acabou de acontecer aqui!"

🎬 CENA 2 (10-20s) - DESENVOLVIMENTO DO CONTEXTO:
- Visual: A câmera se move em plano médio revelando os detalhes de "${activeIdea}" enquanto o personagem interage com o cenário.
- Narração (PT-BR): "Tudo começou quando parecia mais um dia qualquer, até que esse detalhe mudou o rumo da história..."

🎬 CENA 3 (20-30s) - A TENSÃO / REVIRAVOLTA:
- Visual: Close expressivo capturando uma atitude inesperada diante do desafio de "${activeIdea}".
- Narração (PT-BR): "E foi exatamente aí que aconteceu o que ninguém esperava ver na internet!"

🎬 CENA 4 (30-40s) - O CLÍMAX DA HISTÓRIA:
- Visual: Tomada dinâmica capturando o ápice da ação de "${activeIdea}", com iluminação vibrante e vídeo limpo sem legendas na tela.
- Narração (PT-BR): "Olha essa reação em tempo real! É exatamente por isso que essa cena merece viralizar!"

🎬 CENA 5 (40-50s) - A RESOLUÇÃO DA CENA:
- Visual: O desfecho da situação de "${activeIdea}" com expressão de cumplicidade ou alívio voltada para a lente.
- Narração (PT-BR): "No final das contas, ficou provado que essa história valeu cada segundo!"

🎬 CENA 6 (50-60s) - FECHAMENTO E ENGAGEMENT (CTA):
- Visual: Enquadramento final estético e carismático. Fade-out suave sem texto na tela.
- Narração (PT-BR): "O que você faria se estivesse nessa situação? Comente a sua opinião sincera aqui embaixo e já segue para não perder a continuação!"`
    }

    const writtenPost = buildWrittenPostTemplate(niche, themeName, characterName || userIdea)

    return e.json(200, {
      success: true,
      theme_name: themeName,
      user_idea: userIdea || undefined,
      character_name: characterName || undefined,
      niche,
      niche_label: nicheLabel,
      scene_concept: sceneConcept.trim(),
      optional_script: optionalScript.trim(),
      written_post: writtenPost.trim(),
      image_count: imageCount,
    })
  } catch (err) {
    return e.json(500, {
      success: false,
      message: 'Erro ao gerar ideia de cena viral: ' + (err.message || String(err)),
    })
  }
})

// ROTA 3: POST /backend/v1/regenerate-variations
routerAdd('POST', '/backend/v1/regenerate-variations', (e) => {
  const sanitizeText = function (text) {
    if (!text) return ''
    let cleaned = String(text)
    cleaned = cleaned.replace(/^[ \t]*[-•*]?[ \t]*Texto[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
    cleaned = cleaned.replace(/^[ \t]*[-•*]?[ \t]*Legenda[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
    cleaned = cleaned.replace(/^[ \t]*[-•*]?[ \t]*Subtítulo[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
    cleaned = cleaned.replace(/^[ \t]*[-•*]?[ \t]*Overlay[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
    return cleaned.replace(/\n{3,}/g, '\n\n').trim()
  }

  try {
    const data = e.requestInfo().body || {}
    const basePrompt = (data.original_prompt || data.base_prompt || '').trim()
    const promptTitle = (data.prompt_title || '').trim()
    const characterName = (data.character_name || '').trim()
    const productName = (
      characterName ||
      data.product_name ||
      promptTitle ||
      'elemento da cena'
    ).trim()
    const visualDetails = (data.visual_details || '').trim()
    const niche = (data.niche || '').trim()
    const imageCount = parseInt(data.images_count || data.image_count || '0', 10)
    const category = (data.category || '').trim()
    const seed = data.seed || Math.floor(Math.random() * 1000000)

    const isViral =
      category === 'virais' ||
      basePrompt.includes('60 SEGUNDOS') ||
      basePrompt.includes('CENA 6') ||
      Boolean(characterName)

    let photoNotes = ''
    if (imageCount > 0) {
      photoNotes = `📸 Adaptação baseada em ${imageCount} foto(s) anexada(s). ${visualDetails ? `Detalhes: ${visualDetails}` : ''}`
    }

    // Tentar gerar 3 variações via hub JRL (prioritário) e $ai.chat com ângulos distintos
    // Funções do hub inline (pool JSVM): mesma definição da ROTA 1.
    const readJrlSecret = function (name) {
      let v = ''
      try {
        v = $os.getenv(name) || ''
      } catch (_) {}
      if (!v) {
        try {
          if ($secrets.has(name)) v = $secrets.get(name) || ''
        } catch (_) {}
      }
      return v
    }
    const jrlHubChatText = function (systemPrompt, userPrompt, opts) {
      const r = { ok: false, text: '', model: '', error: '', status: 0 }
      try {
        const base = (readJrlSecret('JRL_AI_HUB_BASE_URL') || '').replace(/\/+$/, '')
        const key = readJrlSecret('JRL_AI_HUB_API_KEY') || ''
        if (!base || !key) {
          r.error = 'hub-não-configurado'
          return r
        }
        const messages = []
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
        messages.push({ role: 'user', content: userPrompt })
        const body = { messages: messages }
        if (opts && opts.model) body.model = opts.model
        if (opts && opts.maxTokens) body.max_tokens = opts.maxTokens
        const res = $http.send({
          method: 'POST',
          url: base + '/chat/completions',
          headers: {
            Authorization: 'Bearer ' + key,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
          timeout: (opts && opts.timeout) || 90,
        })
        r.status = res.statusCode
        if (res.statusCode < 200 || res.statusCode >= 300) {
          r.error = 'hub-http-' + res.statusCode
          return r
        }
        const json = res.json || {}
        if (json.choices && json.choices[0] && json.choices[0].message) {
          const content = String(json.choices[0].message.content || '')
          if (content.trim()) {
            r.ok = true
            r.text = content
            r.model = json.model || (opts && opts.model) || ''
          } else {
            r.error = 'hub-resposta-vazia'
          }
        } else {
          r.error = 'hub-formato-inesperado'
        }
      } catch (err) {
        r.error = 'hub-exceção: ' + (err.message || String(err))
      }
      return r
    }

    try {
      const angles = isViral
        ? [
            {
              id: 'v_humor_60s',
              title: 'Humor & Quebra de Expectativa',
              badge: '😂 Ângulo Humor (60s)',
              desc: 'Roteiro de 60s em 6 cenas de 10s focado em perrengue divertido e ironia.',
            },
            {
              id: 'v_suspense_60s',
              title: 'Suspense & Curiosidade Máxima',
              badge: '🕯️ Ângulo Suspense (60s)',
              desc: 'Roteiro de 60s em 6 cenas de 10s focado em retenção alta e pistas secretas.',
            },
            {
              id: 'v_emocao_60s',
              title: 'Emoção & Conexão Afetuosa',
              badge: '💖 Ângulo Emoção (60s)',
              desc: 'Roteiro de 60s em 6 cenas de 10s focado em carinho, fofura e inspiração.',
            },
          ]
        : [
            {
              id: 'v1_emocional',
              title: 'Emocional & Autoestima',
              badge: '💖 Ângulo Emocional',
              desc: 'Focado em sensação, transformação pessoal, elogios e desejo imediato.',
            },
            {
              id: 'v2_urgencia',
              title: 'Urgência & Escassez Máxima',
              badge: '⚡ Ângulo Urgência',
              desc: 'Focado em promoção relâmpago, estoque zerando e clique direto no carrinho.',
            },
            {
              id: 'v3_prova_social',
              title: 'Prova Social & Avaliações Reais',
              badge: '⭐ Ângulo Prova Social',
              desc: 'Focado em avaliações 5 estrelas, caimento real e quebra de objeções.',
            },
          ]

      const promptRequest = `Você é um especialista em roteiros virais.
Crie 3 VARIAÇÕES TOTALMENTE DIFERENTES E INÉDITAS para o produto/personagem "${productName}" no nicho "${niche || 'Geral'}".
Cada variação deve seguir estritamente o seu ângulo respectivo:
1. ${angles[0].title}
2. ${angles[1].title}
3. ${angles[2].title}

REGRAS:
- Produto/personagem a destacar: ${productName} (substitua qualquer outro citado anteriormente)
- Idioma: Português do Brasil (PT-BR)
- VÍDEO 100% LIMPO: SEM legendas gravadas, SEM texto na tela
- Estrutura: ${isViral ? '6 cenas sequenciais de até 10s (~60s no total)' : '3 cenas sequenciais (máx 10s no total: 0-3s gancho, 3-7s detalhes, 7-10s CTA)'}
- Variação aleatória Seed #${seed}

Separe cada uma com as tags [VARIACAO_1], [VARIACAO_2], [VARIACAO_3].`

      // 1) Prioridade: hub JRL; 2) fallback: $ai.chat (Skip AI)
      const hubRes = jrlHubChatText('', promptRequest, { maxTokens: 2400, timeout: 120 })
      let hubText = ''
      if (hubRes.ok) {
        console.log('[regenerate-variations] variações geradas via hub JRL (' + hubRes.model + ')')
        hubText = hubRes.text
      } else {
        console.log(
          '[regenerate-variations] hub JRL indisponível (' +
            hubRes.error +
            '), usando $ai.chat (Skip AI)',
        )
        const aiRes = $ai.chat({
          model: 'fast',
          messages: [{ role: 'user', content: promptRequest }],
        })
        if (aiRes && aiRes.choices && aiRes.choices[0] && aiRes.choices[0].message) {
          hubText = aiRes.choices[0].message.content
        }
      }

      if (hubText) {
        const text = hubText
        if (
          text.includes('[VARIACAO_1]') &&
          text.includes('[VARIACAO_2]') &&
          text.includes('[VARIACAO_3]')
        ) {
          const p1 = text.split('[VARIACAO_2]')
          const v1Text = sanitizeText(p1[0].replace('[VARIACAO_1]', ''))
          const p2 = p1[1].split('[VARIACAO_3]')
          const v2Text = sanitizeText(p2[0])
          const v3Text = sanitizeText(p2[1])

          aiVariations = [
            {
              id: angles[0].id,
              angle: angles[0].title,
              badge: angles[0].badge,
              description: angles[0].desc,
              prompt_text: v1Text,
            },
            {
              id: angles[1].id,
              angle: angles[1].title,
              badge: angles[1].badge,
              description: angles[1].desc,
              prompt_text: v2Text,
            },
            {
              id: angles[2].id,
              angle: angles[2].title,
              badge: angles[2].badge,
              description: angles[2].desc,
              prompt_text: v3Text,
            },
          ]
        }
      }
    } catch (aiErr) {
      console.log(
        'regenerate-variations: IA indisponível, usando fallback dinâmico: ' + aiErr.message,
      )
    }

    if (aiVariations.length === 3) {
      return e.json(200, {
        success: true,
        product_name: productName,
        character_name: characterName || undefined,
        variations: aiVariations,
      })
    }

    // Fallbacks dinâmicos locais caso a IA não tenha respondido com 3 blocos
    if (isViral) {
      const vViral1 = `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S]
✨ ÂNGULO 1: NARRATIVA CÔMICA & HUMOR
⏱️ DURAÇÃO ALVO: ~60s (6 Cenas de até 10s)
📌 DIRETRIZES: Narração PT-BR cômica, vídeo 100% limpo sem texto na tela.
${photoNotes ? `${photoNotes}\n` : ''}
🎬 CENA 1 (0-10s) - O FLAGRA INESPERADO (HOOK):
- Visual: Close cômico em ${productName} aprontando uma confusão hilária.
- Narração (PT-BR): "Eu jurei que ninguém tava gravando, até que o(a) ${productName} fez exatamente isso na minha frente!"

🎬 CENA 2 (10-20s) - A TENTATIVA DE DISFARÇAR:
- Visual: Movimento desajeitado tentando disfarçar a bagunça (${visualDetails || 'olhar culpado e divertido'}).
- Narração (PT-BR): "A tentativa de fingir costume só deixou a situação dez vezes mais engraçada!"

🎬 CENA 3 (20-30s) - A REAÇÃO GERAL:
- Visual: O ambiente ao redor reagindo atônito à cena.
- Narração (PT-BR): "Quem estava por perto simplesmente não aguentou e caiu na gargalhada!"

🎬 CENA 4 (30-40s) - O CLÍMAX DA TRAPALHADA:
- Visual: O ápice do momento engraçado com enquadramento dinâmico.
- Narração (PT-BR): "Quando a gente achava que ia dar certo, o desfecho foi o mais inesperado de todos!"

🎬 CENA 5 (40-50s) - A CONFORMAÇÃO COM O PERRENGUE:
- Visual: O personagem aceitando a fama de meme com um sorriso cúmplice.
- Narração (PT-BR): "Rir do próprio perrengue é a melhor parte de criar conteúdo na internet!"

🎬 CENA 6 (50-60s) - CTA DE COMENTÁRIOS:
- Visual: Piscadela ou aceno direto para a lente.
- Narração (PT-BR): "Marca aqui nos comentários aquela pessoa que faria igualzinho e já segue o perfil!"`

      const vViral2 = `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S]
⚡ ÂNGULO 2: SUSPENSE & CURIOSIDADE MÁXIMA
⏱️ DURAÇÃO ALVO: ~60s (6 Cenas de até 10s)
📌 DIRETRIZES: Narração PT-BR envolvente, vídeo 100% limpo sem texto na tela.
${photoNotes ? `${photoNotes}\n` : ''}
🎬 CENA 1 (0-10s) - O DETALHE OCULTO (HOOK):
- Visual: Enquadramento cinematográfico na penumbra com foco total em ${productName}.
- Narração (PT-BR): "Olhe com muita atenção para o que o(a) ${productName} está segurando antes que esse vídeo suma do seu feed..."

🎬 CENA 2 (10-20s) - A PISTA ESCONDIDA:
- Visual: Iluminação dramática revelando detalhes sutis da cena (${visualDetails || 'sombras expressivas'}).
- Narração (PT-BR): "A maioria passa reto, mas quem observa o olhar percebe que algo estranho está acontecendo."

🎬 CENA 3 (20-30s) - APROXIMAÇÃO GRADUAL:
- Visual: Traveling lento de aproximação mantendo tensão contínua.
- Narração (PT-BR): "Quanto mais você repara nos movimentos, mais a história ganha um sentido surpreendente..."

🎬 CENA 4 (30-40s) - O PONTO DE VIRADA:
- Visual: Um feixe de luz revela o segredo guardado na cena.
- Narração (PT-BR): "Foi exatamente nesse instante que a gravação registrou algo inacreditável!"

🎬 CENA 5 (40-50s) - A DESCOBERTA FINAL:
- Visual: O clímax do mistério em alta definição 4K.
- Narração (PT-BR): "Agora me diz com sinceridade: você já tinha notado isso desde o começo?"

🎬 CENA 6 (50-60s) - CTA DE TEORIAS:
- Visual: Enquadramento final estático e misterioso.
- Narração (PT-BR): "Compartilhe este vídeo com quem ama um bom mistério e deixe sua teoria nos comentários!"`

      const vViral3 = `[ROTEIRO VIRAL CRIADORES - 60 SEGUNDOS EM CENAS DE 10S]
💖 ÂNGULO 3: EMOÇÃO, FOFURA & TRANSFORMAÇÃO
⏱️ DURAÇÃO ALVO: ~60s (6 Cenas de até 10s)
📌 DIRETRIZES: Narração PT-BR calorosa e cativante, vídeo 100% limpo sem texto na tela.
${photoNotes ? `${photoNotes}\n` : ''}
🎬 CENA 1 (0-10s) - O INÍCIO DE UMA JORNADA DOCE (HOOK):
- Visual: Luz dourada e acolhedora envolvendo ${productName} em primeiro plano.
- Narração (PT-BR): "Essa é a história mais fofa e inspiradora com ${productName} que vai cruzar o seu feed hoje!"

🎬 CENA 2 (10-20s) - O PEQUENO DESAFIO:
- Visual: ${productName} encarando um obstáculo com olhos brilhantes e curiosos.
- Narração (PT-BR): "Parecia um desafio gigante para alguém tão pequenininho e dedicado..."

🎬 CENA 3 (20-30s) - A AJUDA INESPERADA:
- Visual: Gesto de afeto e cores vibrantes iluminando o ambiente (${visualDetails || 'harmonia estética'}).
- Narração (PT-BR): "Mas quando a persistência fala mais alto, a mágica começa a acontecer de verdade."

🎬 CENA 4 (30-40s) - A CONQUISTA BRILHANTE:
- Visual: Momento triunfante com luz suave e um sorriso genuíno.
- Narração (PT-BR): "E com paciência e amor em cada detalhe, a transformação finalmente se completou!"

🎬 CENA 5 (40-50s) - O ABRAÇO DE GRATIDÃO:
- Visual: Expressão de pura felicidade e aconchego.
- Narração (PT-BR): "Cenas como essa provam que a verdadeira beleza está nos gestos mais simples da vida."

🎬 CENA 6 (50-60s) - CTA DE CARINHO:
- Visual: Aceno doce para a lente e despedida carinhosa.
- Narração (PT-BR): "Mande esse vídeo para alegrar o dia de alguém muito especial e deixe o seu like!"`

      return e.json(200, {
        success: true,
        product_name: productName,
        character_name: characterName || undefined,
        variations: [
          {
            id: 'v_humor_60s',
            angle: 'Humor & Quebra de Expectativa',
            badge: '😂 Ângulo Humor (60s)',
            description: 'Roteiro de 60s em 6 cenas de 10s focado em perrengue divertido.',
            prompt_text: vViral1,
          },
          {
            id: 'v_suspense_60s',
            angle: 'Suspense & Curiosidade Máxima',
            badge: '🕯️ Ângulo Suspense (60s)',
            description: 'Roteiro de 60s em 6 cenas de 10s focado em retenção alta e mistério.',
            prompt_text: vViral2,
          },
          {
            id: 'v_emocao_60s',
            angle: 'Emoção & Conexão Afetuosa',
            badge: '💖 Ângulo Emoção (60s)',
            description: 'Roteiro de 60s em 6 cenas de 10s focado em acolhimento e conexão.',
            prompt_text: vViral3,
          },
        ],
      })
    }

    // E-commerce (10s)
    const vEcom1 = `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS]
✨ ÂNGULO 1: EMOCIONAL & AUTOESTIMA
📌 DIRETRIZES: Narração PT-BR, máx 10s, vídeo 100% limpo sem texto na tela.
${photoNotes ? `${photoNotes}\n` : ''}
🎬 CENA 1 (0-3s) - O GANCHO EMOCIONAL (HOOK):
- Enquadramento vertical 9:16: segurando ou vestindo o(a) ${productName} em frente ao espelho com olhar radiante.
- Narração (PT-BR): "POV: O dia em que eu cansei de produtos sem graça e experimentei esse(a) ${productName}! O caimento é surreal."

🎬 CENA 2 (3-7s) - DETALHES REAIS DA PEÇA:
- Close nos detalhes observados nas fotos: ${visualDetails || 'toque premium, costuras reforçadas e cor vibrante'}.
- Narração (PT-BR): "Material de extrema qualidade que valoriza a estética e traz conforto o dia inteiro."

🎬 CENA 3 (7-10s) - CHAMADA DE DESEJO:
- Apontando diretamente para o carrinho amarelo no canto inferior:
- Narração (PT-BR): "Você merece essa experiência todos os dias! O link com envio imediato tá no carrinho aqui embaixo."`

    const vEcom2 = `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS]
⚡ ÂNGULO 2: URGÊNCIA & ESCASSEZ MÁXIMA
📌 DIRETRIZES: Narração PT-BR, máx 10s, vídeo 100% limpo sem texto na tela.
${photoNotes ? `${photoNotes}\n` : ''}
🎬 CENA 1 (0-3s) - O GANCHO DE ALERTA (HOOK):
- Câmera rápida com corte dinâmico mostrando o(a) ${productName} em destaque com luz natural.
- Narração (PT-BR): "SE VOCÊ TÁ VENDO ESSE VÍDEO, CORRE! O lote desse(a) ${productName} tá zerando com cupom hoje!"

🎬 CENA 2 (3-7s) - PROVA RÁPIDA DE QUALIDADE:
- Close nos diferenciais da vitrine: ${visualDetails || 'resistência garantida, acabamento limpo e design moderno'}.
- Narração (PT-BR): "Estoque nacional com envio em 24h e fidelidade total às fotos da nossa vitrine."

🎬 CENA 3 (7-10s) - CHAMADA URGENTE (CTA):
- Apontando para o carrinho antes que acabe o estoque:
- Narração (PT-BR): "Clica agora no carrinho amarelo antes que a promoção encerre e volte ao preço cheio!"`

    const vEcom3 = `[ROTEIRO VIRAL TIKTOK SHOP / SHOPEE - 10 SEGUNDOS]
⭐ ÂNGULO 3: PROVA SOCIAL & AVALIAÇÕES REAIS
📌 DIRETRIZES: Narração PT-BR, máx 10s, vídeo 100% limpo sem texto na tela.
${photoNotes ? `${photoNotes}\n` : ''}
🎬 CENA 1 (0-3s) - O GANCHO DE PROVA REAL (HOOK):
- POV desembalando o pacote ou exibindo o(a) ${productName} com iluminação nítida.
- Narração (PT-BR): "Eu comprei esse(a) ${productName} pra ver se as milhares de avaliações 5 estrelas eram verdade... E olhem esse acabamento!"

🎬 CENA 2 (3-7s) - COMPROVAÇÃO PRÁTICA:
- Mostrando a fidelidade absoluta às fotos: ${visualDetails || 'acabamento impecável, material nobre e caimento perfeito'}.
- Narração (PT-BR): "Zero defeitos de fabricação, caimento impecável e aprovação recorde de quem já recebeu."

🎬 CENA 3 (7-10s) - CTA CONFIÁVEL:
- Apontando para o link da sacolinha oficial:
- Narração (PT-BR): "Mais de 3.000 clientes já compraram e aprovaram. Veja as avaliações no link da sacolinha aqui embaixo!"`

    return e.json(200, {
      success: true,
      product_name: productName,
      character_name: characterName || undefined,
      variations: [
        {
          id: 'v1_emocional',
          angle: 'Emocional & Autoestima',
          badge: '💖 Ângulo Emocional',
          description: 'Focado em sensação, transformação pessoal, elogios e desejo imediato.',
          prompt_text: vEcom1,
        },
        {
          id: 'v2_urgencia',
          angle: 'Urgência & Escassez',
          badge: '⚡ Ângulo Urgência',
          description:
            'Focado em promoção relâmpago, estoque acabando e chamada direta pro carrinho.',
          prompt_text: vEcom2,
        },
        {
          id: 'v3_prova_social',
          angle: 'Prova Social & Confiança',
          badge: '⭐ Ângulo Prova Social',
          description: 'Focado em avaliações 5 estrelas, durabilidade e quebra de objeções.',
          prompt_text: vEcom3,
        },
      ],
    })
  } catch (err) {
    return e.json(500, {
      success: false,
      message: 'Erro ao gerar variações do roteiro: ' + (err.message || String(err)),
    })
  }
})

// ROTA 4: POST /backend/v1/generate-image-prompt
// Transforma uma ideia/referência em texto simples do cliente em um PROMPT DE IMAGEM profissional,
// detalhado, em Português Brasileiro (PT-BR), com fidelidade total ao pedido original,
// formato vertical 9:16 e regra de imagem 100% limpa (sem texto/letras/legendas/marcas d'água na arte).
// Otimizado para colar diretamente no ChatGPT ou no Google Flow / Nano Banana.
routerAdd('POST', '/backend/v1/generate-image-prompt', (e) => {
  const sanitizeText = function (text) {
    if (!text) return ''
    let cleaned = String(text)
    cleaned = cleaned.replace(/^[ \t]*[-•*]?[ \t]*Texto[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
    cleaned = cleaned.replace(/^[ \t]*[-•*]?[ \t]*Legenda[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
    cleaned = cleaned.replace(/^[ \t]*[-•*]?[ \t]*Subtítulo[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
    cleaned = cleaned.replace(/^[ \t]*[-•*]?[ \t]*Overlay[^:\n\r]*:[^\n\r]*\r?\n?/gim, '')
    return cleaned.replace(/\n{3,}/g, '\n\n').trim()
  }

  try {
    const data = e.requestInfo().body || {}
    const rawIdea = (data.idea || data.prompt_idea || data.reference || '').trim()
    const styleOption = (data.style_option || data.style || '').trim()
    const seed = data.seed || Math.floor(Math.random() * 1000000)

    if (!rawIdea) {
      return e.json(400, {
        success: false,
        message: 'Por favor, informe a ideia ou referência da imagem que você quer criar.',
      })
    }

    let generatedPrompt = ''
    let usedAi = false

    // Chamada à IA: hub JRL prioritário e $ai.chat (Skip AI) como fallback.
    // Funções do hub inline (pool JSVM): mesma definição da ROTA 1.
    const readJrlSecret = function (name) {
      let v = ''
      try {
        v = $os.getenv(name) || ''
      } catch (_) {}
      if (!v) {
        try {
          if ($secrets.has(name)) v = $secrets.get(name) || ''
        } catch (_) {}
      }
      return v
    }
    const jrlHubChatText = function (systemPrompt, userPrompt, opts) {
      const r = { ok: false, text: '', model: '', error: '', status: 0 }
      try {
        const base = (readJrlSecret('JRL_AI_HUB_BASE_URL') || '').replace(/\/+$/, '')
        const key = readJrlSecret('JRL_AI_HUB_API_KEY') || ''
        if (!base || !key) {
          r.error = 'hub-não-configurado'
          return r
        }
        const messages = []
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
        messages.push({ role: 'user', content: userPrompt })
        const body = { messages: messages }
        if (opts && opts.model) body.model = opts.model
        if (opts && opts.maxTokens) body.max_tokens = opts.maxTokens
        const res = $http.send({
          method: 'POST',
          url: base + '/chat/completions',
          headers: {
            Authorization: 'Bearer ' + key,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
          timeout: (opts && opts.timeout) || 90,
        })
        r.status = res.statusCode
        if (res.statusCode < 200 || res.statusCode >= 300) {
          r.error = 'hub-http-' + res.statusCode
          return r
        }
        const json = res.json || {}
        if (json.choices && json.choices[0] && json.choices[0].message) {
          const content = String(json.choices[0].message.content || '')
          if (content.trim()) {
            r.ok = true
            r.text = content
            r.model = json.model || (opts && opts.model) || ''
          } else {
            r.error = 'hub-resposta-vazia'
          }
        } else {
          r.error = 'hub-formato-inesperado'
        }
      } catch (err) {
        r.error = 'hub-exceção: ' + (err.message || String(err))
      }
      return r
    }

    try {
      const systemInstruction = `Você é um especialista sênior em engenharia de prompts de imagem para inteligências artificiais geradoras (Google Flow, Nano Banana, Gemini Imagen 3, ChatGPT DALL-E 3, Midjourney).

SUA MISSÃO:
Receber a ideia curta ou referência do usuário (ex: "crie uma banaca com asas", "um cachorro de terno jogando xadrez") e transformá-la em um PROMPT DE IMAGEM PROFISSIONAL, DETALHADO, HIPER-REALISTA E TOTALMENTE FIEL ao que foi pedido.

DIRETRIZES OBRIGATÓRIAS E INEGOCIÁVEIS:
1. FIDELIDADE ABSOLUTA AO PEDIDO ORIGINAL:
   - Se o usuário pediu "banana com asas" (mesmo se escreveu "banaca"), o sujeito central DEVE SER exatamente uma banana com asas. Não troque a fruta, não substitua as asas por braços, não invente outro personagem principal. O pedido original deve estar 100% intacto e no centro absoluto da imagem.
   - Corrija automaticamente e silenciosamente erros de digitação e ortografia da ideia (ex: "banaca" -> "banana", "morango mutante", etc.).
2. ENRIQUECIMENTO VISUAL PROFISSIONAL (Sem descaracterizar a ideia):
   - Descreva com riqueza de detalhes: textura da superfície (casca, pele, penas, reflexos), anatomia coerente do objeto/personagem, expressão, pose e interação com o ambiente.
   - Composição fotográfica: enquadramento cinematográfico vertical no formato 9:16 (aspect ratio 9:16, ideal para Reels, TikTok, Shorts e telas verticais).
   - Iluminação: iluminação de estúdio profissional, luz volumétrica suave, sombras naturais e profundidade de campo sutil (foco nítido no sujeito, fundo levemente desfocado).
   - Estilo: fotorrealismo cinematográfico de altíssima definição (estilo 8k, textura tátil vívida, cores equilibradas e vibrantes).
3. REGRA MANDATÓRIA DE IMAGEM 100% LIMPA:
   - NUNCA inclua texto, letras, tipografia, palavras, placas com escritas, legendas, marcas d'água ou assinaturas na arte.
   - Adicione instrução explícita de exclusão no final do prompt: "sem nenhum texto na imagem, sem legendas, sem caracteres, sem marca d'água".
4. IDIOMA E COMPATIBILIDADE:
   - O prompt DEVE ser gerado em PORTUGUÊS BRASILEIRO (PT-BR) claro, conciso e direto.
   - Otimizado para copiar e colar diretamente no ChatGPT ou no Google Flow / Nano Banana.
5. FORMATO DE RETORNO:
   - Responda DIRETAMENTE com o texto do prompt pronto para copiar e colar.
   - NÃO inclua introduções como "Aqui está o seu prompt:", NÃO coloque aspas no início/fim, NÃO use blocos de código com markdown. Retorne apenas o prompt de imagem final e pronto.`

      const userInstruction = `Transforme esta ideia em um prompt de imagem profissional de alta fidelidade:
"${rawIdea}"

${styleOption ? `Estilo preferencial indicado: ${styleOption}` : ''}
Variação/Seed: #${seed}

Gere o prompt em Português Brasileiro (PT-BR), vertical 9:16, 100% fiel ao elemento pedido, com imagem limpa sem texto na tela.`

      // 1) Prioridade: hub JRL; 2) fallback: $ai.chat (Skip AI)
      const hubRes = jrlHubChatText(systemInstruction, userInstruction, {
        maxTokens: 900,
        timeout: 90,
      })
      let rawContent = ''
      if (hubRes.ok) {
        console.log('[generate-image-prompt] prompt gerado via hub JRL (' + hubRes.model + ')')
        rawContent = hubRes.text
      } else {
        console.log(
          '[generate-image-prompt] hub JRL indisponível (' +
            hubRes.error +
            '), usando $ai.chat (Skip AI)',
        )
        const reply = $ai.chat({
          model: 'fast',
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userInstruction },
          ],
        })
        if (reply && reply.choices && reply.choices[0] && reply.choices[0].message) {
          rawContent = reply.choices[0].message.content || ''
        }
      }
      const cleaned = sanitizeText(rawContent)
        .replace(/^["']|["']$/g, '')
        .trim()
      if (cleaned && cleaned.length >= 30) {
        generatedPrompt = cleaned
        usedAi = true
      }
    } catch (aiErr) {
      console.log(
        'generate-image-prompt: falha no $ai.chat, usando fallback determinístico: ' +
          aiErr.message,
      )
    }

    // Fallback determinístico caso o $ai.chat não esteja disponível
    if (!generatedPrompt) {
      // Correções comuns simples de ortografia da ideia do usuário
      let cleanIdea = rawIdea
      cleanIdea = cleanIdea.replace(/\bbanaca\b/gi, 'banana')
      cleanIdea = cleanIdea.replace(/\bcrie uma\b/gi, '')
      cleanIdea = cleanIdea.replace(/\bcrie um\b/gi, '')
      cleanIdea = cleanIdea.replace(/\bcrie\b/gi, '')
      cleanIdea = cleanIdea.replace(/\bquero uma\b/gi, '')
      cleanIdea = cleanIdea.replace(/\bquero um\b/gi, '')
      cleanIdea = cleanIdea.trim()
      if (!cleanIdea) cleanIdea = rawIdea

      const subjectFirst = cleanIdea.charAt(0).toUpperCase() + cleanIdea.slice(1)

      generatedPrompt = `Fotografia em altíssima definição no formato vertical 9:16 de ${subjectFirst}, com fidelidade absoluta aos elementos descritos. Texturas táteis hiper-realistas, cores vibrantes com gradientes naturais, iluminação cinematográfica de estúdio com luz suave de preenchimento e realces delicados nas bordas. Enquadramento central dinâmico, profundidade de campo rasa com plano de fundo suavemente desfocado criando contraste estético. Imagem 100% limpa: sem nenhum texto na tela, sem legendas, sem letras, sem tipografia e sem marca d'água.`
    }

    return e.json(200, {
      success: true,
      prompt: generatedPrompt,
      original_idea: rawIdea,
      used_ai: usedAi,
      is_fallback: !usedAi,
    })
  } catch (err) {
    return e.json(500, {
      success: false,
      message: 'Erro ao gerar prompt de imagem: ' + (err.message || String(err)),
    })
  }
})
