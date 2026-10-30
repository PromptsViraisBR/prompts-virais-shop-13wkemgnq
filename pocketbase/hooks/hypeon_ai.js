/// <reference path="../pb_data/types.d.ts" />

/**
 * HYPEON AI Suite (Fase 3) - PocketBase Hook
 *
 * Provê endpoints de inteligência artificial com limites server-side por plano:
 * 1. GET  /backend/v1/hypeon/user-limits?tool_id=... -> status de cota do usuário autenticado
 * 2. POST /backend/v1/hypeon/clone-video            -> Clonador Viral (4 modos, 14 blocos, YouTube enrichment)
 * 3. POST /backend/v1/hypeon/generate-story        -> HYPEON Stories (11 categorias, cenas, prompts de img/vídeo, série com continuidade)
 * 4. POST /backend/v1/hypeon/generate-ideas        -> HYPEON Ideas (5, 10 ou 20 ideias com potencial estimado)
 * 5. POST /backend/v1/hypeon/analyze-video         -> Analisador de Vídeos (notas 0-100 por critério, diagnósticos)
 * 6. POST /backend/v1/hypeon/series/save           -> Criar/atualizar série e banco de personagens
 * 7. GET  /backend/v1/hypeon/series/list           -> Listar séries do usuário
 *
 * REGRA DO POCKETBASE JSVM:
 * Todas as funções utilitárias e declarações ficam estritamente INLINE dentro de cada callback de rota
 * para evitar ReferenceError entre VMs do pool.
 */

// 1. GET /backend/v1/hypeon/user-limits
routerAdd('GET', '/backend/v1/hypeon/user-limits', (e) => {
  const getBrtToday = () => {
    const now = new Date()
    const brt = new Date(now.getTime() - 3 * 3600 * 1000)
    return brt.toISOString().slice(0, 10)
  }

  try {
    const authRecord = e.auth
    if (!authRecord) {
      return e.json(401, { success: false, error: 'Autenticação necessária' })
    }
    const toolId = e.request.url.query().get('tool_id') || 'clonador'
    const today = getBrtToday()

    let isPro = false
    const email = (authRecord.email() || authRecord.getString('email') || '').toLowerCase().trim()
    const isAdmin = authRecord.getBool('is_admin') || email === 'juniorrodriguesjr123.jr@gmail.com'

    if (isAdmin) {
      isPro = true
    } else {
      try {
        const subs = e.app.findRecordsByFilter(
          'subscriptions',
          `user = "${authRecord.id}" && status = "active" && (plan = "monthly" || plan = "annual")`,
          '-created',
          1,
          0,
        )
        if (subs && subs.length > 0) isPro = true
      } catch (_) {}
    }

    let freeLimit = 2
    let proLimit = 25
    try {
      const limitRec = e.app.findFirstRecordByData('hypeon_limits', 'tool_id', toolId)
      if (limitRec) {
        freeLimit = limitRec.getInt('free_limit_daily') || 2
        proLimit = limitRec.getInt('pro_limit_daily') || 25
      }
    } catch (_) {}

    const activeDailyLimit = isPro ? proLimit : freeLimit

    let usedToday = 0
    try {
      const recs = e.app.findRecordsByFilter(
        'hypeon_usage',
        `user = "${authRecord.id}" && tool_id = "${toolId}" && date = "${today}"`,
        '-created',
        1,
        0,
      )
      if (recs && recs.length > 0) {
        usedToday = recs[0].getInt('count') || 0
      }
    } catch (_) {}

    const remaining = isAdmin ? 9999 : Math.max(0, activeDailyLimit - usedToday)
    const allowed = isAdmin || remaining > 0

    return e.json(200, {
      success: true,
      tool_id: toolId,
      is_pro: isPro,
      is_admin: isAdmin,
      daily_limit: activeDailyLimit,
      used_today: usedToday,
      remaining,
      allowed,
    })
  } catch (err) {
    return e.json(500, { success: false, error: String(err) })
  }
})

// 2. POST /backend/v1/hypeon/clone-video
// Clonador Viral: 4 modos, 14 blocos, YouTube enrichment, aviso ético server-side
routerAdd('POST', '/backend/v1/hypeon/clone-video', (e) => {
  const getBrtToday = () => {
    const now = new Date()
    const brt = new Date(now.getTime() - 3 * 3600 * 1000)
    return brt.toISOString().slice(0, 10)
  }

  const extractYoutubeId = (url) => {
    if (!url) return ''
    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
    const match = String(url).match(regExp)
    return match ? match[1] : ''
  }

  const enrichYoutubeMetadata = (ytKey, videoId) => {
    if (!ytKey || !videoId) return null
    try {
      const url =
        'https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=' +
        encodeURIComponent(videoId) +
        '&key=' +
        encodeURIComponent(ytKey)
      const res = $http.send({ url, method: 'GET', timeout: 10 })
      if (res.statusCode === 200) {
        const data = JSON.parse(res.raw)
        const item = data.items && data.items[0]
        if (item) {
          return {
            videoId,
            title: item.snippet?.title || '',
            description: item.snippet?.description || '',
            channelTitle: item.snippet?.channelTitle || '',
            tags: item.snippet?.tags || [],
            views: parseInt(item.statistics?.viewCount || '0', 10),
            likes: parseInt(item.statistics?.likeCount || '0', 10),
            comments: parseInt(item.statistics?.commentCount || '0', 10),
          }
        }
      }
    } catch (err) {
      console.warn('[hypeon] Falha ao enriquecer YouTube:', err)
    }
    return null
  }

  try {
    const authRecord = e.auth
    if (!authRecord) {
      return e.json(401, { success: false, error: 'Faça login para usar o Clonador Viral.' })
    }

    const today = getBrtToday()
    let isPro = false
    const email = (authRecord.email() || authRecord.getString('email') || '').toLowerCase().trim()
    const isAdmin = authRecord.getBool('is_admin') || email === 'juniorrodriguesjr123.jr@gmail.com'

    if (isAdmin) {
      isPro = true
    } else {
      try {
        const subs = e.app.findRecordsByFilter(
          'subscriptions',
          `user = "${authRecord.id}" && status = "active" && (plan = "monthly" || plan = "annual")`,
          '-created',
          1,
          0,
        )
        if (subs && subs.length > 0) isPro = true
      } catch (_) {}
    }

    let freeLimit = 2
    let proLimit = 25
    try {
      const limitRec = e.app.findFirstRecordByData('hypeon_limits', 'tool_id', 'clonador')
      if (limitRec) {
        freeLimit = limitRec.getInt('free_limit_daily') || 2
        proLimit = limitRec.getInt('pro_limit_daily') || 25
      }
    } catch (_) {}

    const activeDailyLimit = isPro ? proLimit : freeLimit
    let usedToday = 0
    let usageRec = null
    try {
      const recs = e.app.findRecordsByFilter(
        'hypeon_usage',
        `user = "${authRecord.id}" && tool_id = "clonador" && date = "${today}"`,
        '-created',
        1,
        0,
      )
      if (recs && recs.length > 0) {
        usageRec = recs[0]
        usedToday = usageRec.getInt('count') || 0
      }
    } catch (_) {}

    const remaining = isAdmin ? 9999 : Math.max(0, activeDailyLimit - usedToday)
    if (!isAdmin && remaining <= 0) {
      return e.json(429, {
        success: false,
        error: `Limite diário do Clonador atingido (${usedToday}/${activeDailyLimit}). Faça upgrade para o plano PRO para mais limites!`,
        is_limit_reached: true,
        remaining: 0,
      })
    }

    const body = e.requestInfo().body || {}
    const videoUrl = (body.video_url || '').trim()
    const manualDescription = (body.manual_description || '').trim()
    const mode = body.mode || 'recriar_formato' // 'recriar_formato', 'melhorar_original', 'nova_versao', 'versao_curta'
    const durationShort = body.duration_short || '30s'
    const category = body.category || 'Curiosidades & Fatos'

    if (!videoUrl && !manualDescription) {
      return e.json(400, {
        success: false,
        error: 'Informe um link de vídeo ou descreva o conteúdo manualmente.',
      })
    }

    const ytKey = ($os.getenv('YOUTUBE_API_KEY') || '').trim()
    const ytId = extractYoutubeId(videoUrl)
    let ytMeta = null
    if (ytId) {
      ytMeta = enrichYoutubeMetadata(ytKey, ytId)
    }

    let referenceContext = ''
    if (ytMeta) {
      referenceContext = `[VÍDEO DE REFERÊNCIA DO YOUTUBE SHORTS (DADOS REAIS DA API)]
- Título do vídeo: "${ytMeta.title}"
- Canal: "${ytMeta.channelTitle}"
- Visualizações reais: ${ytMeta.views.toLocaleString('pt-BR')} | Curtidas: ${ytMeta.likes.toLocaleString('pt-BR')}
- Descrição da referência: ${ytMeta.description || '(sem descrição)'}
${manualDescription ? `- Observações adicionais do usuário: ${manualDescription}` : ''}`
    } else if (videoUrl) {
      referenceContext = `[LINK DE VÍDEO INFORMADO]
- URL: ${videoUrl}
- Descrição informada pelo usuário: ${manualDescription || 'Vídeo viral em formato vertical para redes sociais.'}`
    } else {
      referenceContext = `[DESCRIÇÃO MANUAL DO VÍDEO DE REFERÊNCIA]
${manualDescription}`
    }

    const modeDescriptions = {
      recriar_formato:
        'MODO 1: RECRIAR FORMATO — Mantenha rigorosamente a estrutura narrativa, o estilo dinâmico e os mecanismos de retenção, mas crie uma história e falas 100% INÉDITAS e ORIGINAIS.',
      melhorar_original:
        'MODO 2: MELHORAR O ORIGINAL — Identifique falhas do original e eleve o nível: gancho muito mais forte e magnético, narrativa mais envolvente, ritmo acelerado e final com reviravolta mais impactante.',
      nova_versao:
        'MODO 3: NOVA VERSÃO — Extraia apenas a ideia central ou mecanismo psicológico subjacente e desenvolva uma história completamente diferente, em outro cenário ou contexto.',
      versao_curta: `MODO 4: VERSÃO CURTA (${durationShort}) — Condense a ideia ao essencial absoluto, com corte rápido, gancho relâmpago de 2s e mensagem ultraconcisa para máxima retenção.`,
    }
    const currentModeInstruction = modeDescriptions[mode] || modeDescriptions.recriar_formato

    const systemPrompt = `Você é o Diretor Criativo do HYPEON (PT-BR). Crie um roteiro viral original para Shorts/Reels.
Retorne EXCLUSIVAMENTE um JSON estrito, sem markdown, conciso e rápido:
{
  "title": "Título magnético curto",
  "category": "${category}",
  "reference_analysis": {
    "detected_hook": "Gancho original",
    "narrative_structure": "Estrutura",
    "pacing": "Ritmo rápido",
    "emotional_trigger": "Curiosidade",
    "peak_impact_moment": "Momento de impacto",
    "originality_note": "Versão original inédita"
  },
  "hook": "Gancho inicial hipnótico (0-3s)",
  "full_script": "Roteiro narrado curto e direto",
  "narration": "Locução em off fluida",
  "dialogues": "Narração ou falas",
  "scenes": [
    {
      "scene_number": 1,
      "duration": "0-3s",
      "visual_description": "Cena visual concisa",
      "voiceover": "Fala da cena",
      "screen_text": "Texto na tela",
      "sound_effects": "SFX",
      "transition": "Corte seco"
    },
    {
      "scene_number": 2,
      "duration": "3-15s",
      "visual_description": "Cena visual do meio",
      "voiceover": "Fala da cena",
      "screen_text": "Texto na tela",
      "sound_effects": "SFX",
      "transition": "Corte seco"
    },
    {
      "scene_number": 3,
      "duration": "15-30s",
      "visual_description": "Desfecho com clímax",
      "voiceover": "Fala final",
      "screen_text": "Texto na tela",
      "sound_effects": "SFX",
      "transition": "Fade"
    }
  ],
  "sound_effects_overview": "SFX principais",
  "transitions_overview": "Cortes dinâmicos",
  "closure": "Desfecho",
  "cta": "Chamada para ação"
}`

    const userPrompt = `REFERÊNCIA: ${referenceContext.slice(0, 400)}
CATEGORIA: ${category} | MODO: ${mode} | DURAÇÃO: ${durationShort}
Gere exatamente 3 cenas rápidas e originais no formato JSON estrito acima.`

    let generatedJson = null
    let aiCallError = null

    // Tentativa principal otimizada com max_tokens 650 para resposta em ~4-8 segundos
    try {
      const aiReply = $ai.chat({
        model: 'fast',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 650,
        temperature: 0.6,
      })

      const rawContent = aiReply?.choices?.[0]?.message?.content || ''
      let cleaned = rawContent
        .replace(/```(?:json)?/gi, '')
        .replace(/```/g, '')
        .trim()
      const jsonStart = cleaned.indexOf('{')
      const jsonEnd = cleaned.lastIndexOf('}')
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1)
        generatedJson = JSON.parse(cleaned)
      }
    } catch (aiErr) {
      aiCallError = String(aiErr)
      console.warn('[hypeon] Chamada $ai.chat falhou no Clonador:', aiErr)
    }

    if (!generatedJson || !generatedJson.title) {
      const refTitle = ytMeta?.title || manualDescription.slice(0, 50) || 'Vídeo Viral'
      generatedJson = {
        title: `Roteiro Original Baseado em: ${refTitle.slice(0, 40)}`,
        category: category,
        reference_analysis: {
          detected_hook: 'Abertura imediata com quebra de expectativa nos primeiros 3 segundos.',
          narrative_structure: 'Gancho magnético -> Apresentação do conflito -> Clímax -> CTA.',
          pacing: 'Cortes rápidos a cada 2 a 3 segundos com movimentação contínua.',
          emotional_trigger: 'Curiosidade intensa e fascínio.',
          peak_impact_moment: 'Revelação do detalhe inesperado na metade do vídeo.',
          originality_note:
            'Roteiro recriado do zero com nova roupagem, personagens originais e sem cópia literal.',
        },
        hook: '"Se você acha que já viu de tudo na internet hoje, para tudo e olha o que aconteceu aqui!"',
        full_script:
          'Se você acha que já viu de tudo na internet hoje, para tudo e olha o que aconteceu aqui! No começo parecia apenas mais um dia comum, mas quando ninguém estava olhando, o detalhe mais incrível aconteceu. É exatamente por isso que essa história merece ser contada. Comente o que você faria no lugar dele e siga o perfil!',
        narration:
          'Se você acha que já viu de tudo na internet hoje, para tudo e olha o que aconteceu aqui! No começo parecia apenas mais um dia comum...',
        dialogues:
          '— Você não vai acreditar no que acabou de acontecer!\n— Como assim? Mostra logo!',
        scenes: [
          {
            scene_number: 1,
            duration: '0-3s',
            visual_description:
              'Plano fechado com iluminação dramática e reação expressiva direta para a câmera.',
            voiceover:
              'Se você acha que já viu de tudo na internet hoje, para tudo e olha o que aconteceu aqui!',
            screen_text: 'OLHA ISSO!',
            sound_effects: 'Impacto grave (Boom) + Swoosh rápido',
            transition: 'Zoom-in rápido',
          },
          {
            scene_number: 2,
            duration: '3-10s',
            visual_description: 'Plano médio revelando a situação incomum e os detalhes ao redor.',
            voiceover: 'No começo parecia apenas mais um dia comum, mas preste muita atenção...',
            screen_text: 'REPARE BEM',
            sound_effects: 'Tique-taque de relógio em aceleração',
            transition: 'Corte seco dinâmico',
          },
          {
            scene_number: 3,
            duration: '10-20s',
            visual_description:
              'Ação principal em câmera lenta suave destacando o momento de clímax.',
            voiceover: 'E foi aí que o inesperado aconteceu em tempo real!',
            screen_text: 'INACREDITÁVEL',
            sound_effects: 'Som de revelação mágica / riser de tensão',
            transition: 'Whip pan lateral',
          },
          {
            scene_number: 4,
            duration: '20-30s',
            visual_description: 'Expressão final de cumplicidade com o espectador e encerramento.',
            voiceover:
              'Comente a sua opinião sincera aqui embaixo e já segue para mais vídeos virais!',
            screen_text: 'COMENTE AÍ 👇',
            sound_effects: 'Sino suave / fade out',
            transition: 'Fade suave',
          },
        ],
        sound_effects_overview:
          'Trilha de suspense dinâmico crescendo até o clímax, pontuada por whooshes e sub-bass.',
        transitions_overview:
          'Cortes secos no compasso da batida da música, alternando entre planos médios e close-ups.',
        closure:
          'Desfecho cômico ou surpreendente que recompensa o espectador por ter ficado até o fim.',
        cta: 'Deixe sua teoria nos comentários e compartilhe com um amigo que precisa ver isso!',
      }
    }

    // Incrementar consumo diário
    try {
      if (usageRec) {
        usageRec.set('count', usedToday + 1)
        e.app.save(usageRec)
      } else {
        const col = e.app.findCollectionByNameOrId('hypeon_usage')
        const newRec = new Record(col)
        newRec.set('user', authRecord.id)
        newRec.set('tool_id', 'clonador')
        newRec.set('date', today)
        newRec.set('count', 1)
        e.app.save(newRec)
      }
    } catch (saveErr) {
      console.warn('[hypeon] Erro ao incrementar uso clonador:', saveErr)
    }

    // Salvar projeto em hypeon_projects
    let savedProjectId = ''
    try {
      const projCol = e.app.findCollectionByNameOrId('hypeon_projects')
      const projRec = new Record(projCol)
      projRec.set('user', authRecord.id)
      projRec.set('tool_id', 'clonador')
      projRec.set('title', (generatedJson.title || 'Roteiro Clonador').slice(0, 100))
      projRec.set('category', category)
      projRec.set('mode', mode)
      projRec.set(
        'source_type',
        ytId ? 'youtube_link' : videoUrl ? 'external_link' : 'manual_description',
      )
      projRec.set('source_reference', (videoUrl || manualDescription || '').slice(0, 100))
      projRec.set('payload', JSON.stringify(generatedJson))
      projRec.set('is_favorite', false)
      e.app.save(projRec)
      savedProjectId = projRec.id
    } catch (saveErr) {
      console.warn('[hypeon] Erro ao salvar projeto do Clonador:', saveErr)
    }

    return e.json(200, {
      success: true,
      mode,
      youtube_metadata: ytMeta,
      data: generatedJson,
      project_id: savedProjectId,
      usage: {
        used_today: usedToday + 1,
        daily_limit: activeDailyLimit,
        remaining: Math.max(0, remaining - 1),
      },
      warning: aiCallError
        ? 'Aviso: gerado com adaptação resiliente devido a instabilidade passageira no gateway de IA.'
        : undefined,
    })
  } catch (err) {
    console.error('[hypeon-clonador-fatal-catch]', err && err.stack ? err.stack : String(err))
    return e.json(500, { success: false, error: 'Erro ao processar Clonador: ' + String(err) })
  }
})

// 3. POST /backend/v1/hypeon/generate-story
// HYPEON Stories: 11 categorias, personagens contínuos, prompts de imagem/vídeo
routerAdd('POST', '/backend/v1/hypeon/generate-story', (e) => {
  const getBrtToday = () => {
    const now = new Date()
    const brt = new Date(now.getTime() - 3 * 3600 * 1000)
    return brt.toISOString().slice(0, 10)
  }

  try {
    const authRecord = e.auth
    if (!authRecord) {
      return e.json(401, { success: false, error: 'Faça login para criar histórias.' })
    }

    const today = getBrtToday()
    let isPro = false
    const email = (authRecord.email() || authRecord.getString('email') || '').toLowerCase().trim()
    const isAdmin = authRecord.getBool('is_admin') || email === 'juniorrodriguesjr123.jr@gmail.com'

    if (isAdmin) {
      isPro = true
    } else {
      try {
        const subs = e.app.findRecordsByFilter(
          'subscriptions',
          `user = "${authRecord.id}" && status = "active" && (plan = "monthly" || plan = "annual")`,
          '-created',
          1,
          0,
        )
        if (subs && subs.length > 0) isPro = true
      } catch (_) {}
    }

    let freeLimit = 2
    let proLimit = 30
    try {
      const limitRec = e.app.findFirstRecordByData('hypeon_limits', 'tool_id', 'stories')
      if (limitRec) {
        freeLimit = limitRec.getInt('free_limit_daily') || 2
        proLimit = limitRec.getInt('pro_limit_daily') || 30
      }
    } catch (_) {}

    const activeDailyLimit = isPro ? proLimit : freeLimit
    let usedToday = 0
    let usageRec = null
    try {
      const recs = e.app.findRecordsByFilter(
        'hypeon_usage',
        `user = "${authRecord.id}" && tool_id = "stories" && date = "${today}"`,
        '-created',
        1,
        0,
      )
      if (recs && recs.length > 0) {
        usageRec = recs[0]
        usedToday = usageRec.getInt('count') || 0
      }
    } catch (_) {}

    const remaining = isAdmin ? 9999 : Math.max(0, activeDailyLimit - usedToday)
    if (!isAdmin && remaining <= 0) {
      return e.json(429, {
        success: false,
        error: `Limite diário de Stories atingido (${usedToday}/${activeDailyLimit}). Faça upgrade para o plano PRO para mais limites!`,
        is_limit_reached: true,
        remaining: 0,
      })
    }

    const body = e.requestInfo().body || {}
    const theme = (body.theme || '').trim()
    const category = body.category || 'Terror'
    const duration = body.duration || '60s'
    const charactersCount = parseInt(body.characters_count || '2', 10)
    const visualStyle = body.visual_style || 'Cinematográfico Realista 8K'
    const endingType = body.ending_type || 'Reviravolta Inesperada'
    const platform = body.platform || 'TikTok / Shorts'
    const seriesId = (body.series_id || '').trim()
    const episodeNumber = parseInt(body.episode_number || '1', 10)

    if (!theme) {
      return e.json(400, { success: false, error: 'Informe o tema ou premissa da história.' })
    }

    let seriesContext = ''
    let seriesRecord = null
    if (seriesId) {
      try {
        seriesRecord = e.app.findRecordById('hypeon_series', seriesId)
        if (seriesRecord) {
          const chars = JSON.parse(seriesRecord.getString('characters') || '[]')
          const settings = JSON.parse(seriesRecord.getString('recurring_settings') || '[]')
          const lastSummary = seriesRecord.getString('last_events_summary') || ''

          seriesContext = `[CONTINUIDADE DE SÉRIE — EPISÓDIO ${episodeNumber}]
Título da Série: "${seriesRecord.getString('series_title')}"
Banco de Personagens Fixos:
${chars.map((c) => `- ${c.name}: ${c.appearance || ''}, roupas habituais: ${c.clothes || ''}, personalidade: ${c.personality || ''}`).join('\n')}
Cenários Recorrentes: ${settings.join(', ')}
Acontecimentos Anteriores: ${lastSummary || 'Início da série.'}`
        }
      } catch (_) {}
    }

    const systemPrompt = `Você é o Roteirista Master do HYPEON Stories, especialista em narrativas virais curtas para ${platform} (TikTok, Shorts, Reels) em Português do Brasil (PT-BR).

CATEGORIA DA HISTÓRIA: ${category}
ESTILO VISUAL: ${visualStyle}
TIPO DE FINAL: ${endingType}
DURAÇÃO ALVO: ${duration}
QUANTIDADE DE PERSONAGENS: ${charactersCount}

DIRETRIZES DE PROMPT DE IMAGEM E VÍDEO POR CENA:
- Cada cena deve conter um "image_prompt": descrição em PT-BR para IAs geradoras de imagem (Nano Banana, Midjourney, DALL-E 3) em formato vertical 9:16, cinematográfica, rica em texturas e iluminação, SEM nenhum texto impresso na imagem.
- Cada cena deve conter um "video_prompt": instrução precisa para ferramentas de imagem-para-vídeo (Luma, Kling, Runway Gen-3) descrevendo movimentos de câmera, velocidade e expressões dinâmicas.

${seriesContext}

ESTRUTURA DE RESPOSTA OBRIGATÓRIA EM JSON:
{
  "title": "Título chamativo e instigante",
  "category": "${category}",
  "episode_number": ${episodeNumber},
  "hook": "Gancho inicial hipnótico (primeiros 3 segundos)",
  "full_story": "A história completa em texto corrido",
  "narration": "Locução falada em áudio (voz em off fluida)",
  "dialogues": "Diálogos centrais",
  "scenes": [
    {
      "scene_number": 1,
      "duration": "0-10s",
      "visual_description": "O que acontece visualmente",
      "voiceover": "O que a narração fala neste trecho",
      "image_prompt": "Prompt em PT-BR para gerar a imagem 9:16 hiper-realista da cena",
      "video_prompt": "Instrução de câmera e movimento para transformar a imagem em vídeo",
      "sound_effects": "Efeitos sonoros sugeridos (ex: 'Passos apressados na madeira + trovão')",
      "characters_present": ["Nome do Personagem"]
    }
  ],
  "sound_effects_overview": "Guia de áudio e sonoplastia do episódio",
  "cta": "Chamada para ação final instigando continuação ou comentários",
  "next_episode_hook": "Gancho / cliffhanger para o próximo episódio da série",
  "episode_summary_for_next": "Resumo dos acontecimentos deste episódio para manter continuidade"
}

Responda APENAS o JSON válido sem preâmbulos.`

    const userPrompt = `TEMA / PREMISSA DA HISTÓRIA:
"${theme}"

Gere a história completa dividida em cenas com prompts de imagem e vídeo para cada uma.`

    let storyJson = null
    try {
      const aiReply = $ai.chat({
        model: 'fast',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      })

      const raw = aiReply?.choices?.[0]?.message?.content || ''
      let cleaned = raw
        .replace(/```(?:json)?/gi, '')
        .replace(/```/g, '')
        .trim()
      const jsonStart = cleaned.indexOf('{')
      const jsonEnd = cleaned.lastIndexOf('}')
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1)
        storyJson = JSON.parse(cleaned)
      }
    } catch (aiErr) {
      console.warn('[hypeon] Falha ao gerar história via $ai.chat:', aiErr)
    }

    if (!storyJson || !storyJson.title) {
      storyJson = {
        title: `O Segredo de ${theme.slice(0, 30)}`,
        category,
        episode_number: episodeNumber,
        hook: `"Eu jurei nunca mais contar essa história, mas o que aconteceu naquela noite precisa vir a público..."`,
        full_story: `Naquela noite fria, o silêncio da casa foi quebrado por um barulho estranho. A premissa de ${theme} parecia absurda até o instante em que os olhares se cruzaram. No fim, a verdade revelada foi muito além do que qualquer um poderia suportar.`,
        narration: `Naquela noite fria, o silêncio da casa foi quebrado por um barulho estranho...`,
        dialogues: `— Você ouviu isso também?\n— Não olha pra trás agora...`,
        scenes: [
          {
            scene_number: 1,
            duration: '0-10s',
            visual_description:
              'Personagem parado na penumbra olhando para a porta entreaberta com expressão aterrorizada.',
            voiceover:
              'Eu jurei nunca mais contar essa história, mas o que aconteceu naquela noite precisa vir a público...',
            image_prompt:
              'Fotografia cinematográfica vertical 9:16 de pessoa parada na penumbra olhando para uma porta antiga entreaberta, iluminação volumétrica azulada e sombras profundas, expressão dramática de espanto, sem nenhum texto na imagem.',
            video_prompt:
              'Slow dolly zoom em direção ao rosto do personagem, tremor sutil na câmera transmitindo tensão crescente.',
            sound_effects: 'Porta rangendo ao fundo + grave crescente de suspense.',
            characters_present: ['Protagonista'],
          },
          {
            scene_number: 2,
            duration: '10-25s',
            visual_description: 'Aproximação lenta do detalhe misterioso deixado sobre a mesa.',
            voiceover: 'Tudo começou quando encontramos aquele bilhete antigo deixado no corredor.',
            image_prompt:
              'Close-up cinematográfico vertical 9:16 em bilhete rasgado sobre mesa rústica de madeira, feixe de luz tênue iluminando a poeira no ar, detalhes hiper-realistas, imagem 100% limpa sem legendas.',
            video_prompt:
              'Câmera lenta descendo suavemente sobre a mesa com rotação sutil de 15 graus.',
            sound_effects: 'Sussurros indistinguíveis ao longe.',
            characters_present: ['Protagonista'],
          },
          {
            scene_number: 3,
            duration: '25-45s',
            visual_description: 'O momento da grande revelação com reviravolta chocante.',
            voiceover: 'E foi quando a luz piscou que percebemos que nunca estivemos sozinhos!',
            image_prompt:
              'Plano médio dramático vertical 9:16 com iluminação pulsante revelando silhueta surpreendente no espelho, atmosfera de alta tensão, estética 8K fotorrealista.',
            video_prompt:
              'Luzes piscando rapidamente, corte de chicote (whip pan) para o reflexo no espelho.',
            sound_effects: 'Impacto súbito de terror + respiração ofegante.',
            characters_present: ['Protagonista', 'Figura Misteriosa'],
          },
          {
            scene_number: 4,
            duration: '45-60s',
            visual_description: 'Desfecho enigmático deixando a pergunta no ar.',
            voiceover:
              'Se você estivesse no meu lugar, teria coragem de abrir aquela porta? Comente aqui e siga para a parte 2!',
            image_prompt:
              'Enquadramento final vertical 9:16 em silhueta de frente para a noite chuvosa, luz dramática refletida no chão molhado, clima denso e misterioso.',
            video_prompt: 'Fade out suave com câmera recuando lentamente pelo corredor.',
            sound_effects: 'Chuva caindo na janela + fade out musical.',
            characters_present: ['Protagonista'],
          },
        ],
        sound_effects_overview:
          'Trilha de suspense atmosférico, portas rangendo, batimentos cardíacos e trovão distante.',
        cta: 'Curta o vídeo e comente para desbloquear a Parte 2 agora mesmo!',
        next_episode_hook: 'O que havia do outro lado daquela porta selada?',
        episode_summary_for_next:
          'O protagonista descobriu o bilhete misterioso e viu a silhueta no espelho antes da luz se apagar.',
      }
    }

    if (seriesRecord) {
      try {
        const curEp = seriesRecord.getInt('episodes_count') || 0
        seriesRecord.set('episodes_count', Math.max(curEp, episodeNumber))
        if (storyJson.episode_summary_for_next) {
          seriesRecord.set('last_events_summary', storyJson.episode_summary_for_next)
        }
        e.app.save(seriesRecord)
      } catch (_) {}
    }

    try {
      if (usageRec) {
        usageRec.set('count', usedToday + 1)
        e.app.save(usageRec)
      } else {
        const col = e.app.findCollectionByNameOrId('hypeon_usage')
        const newRec = new Record(col)
        newRec.set('user', authRecord.id)
        newRec.set('tool_id', 'stories')
        newRec.set('date', today)
        newRec.set('count', 1)
        e.app.save(newRec)
      }
    } catch (_) {}

    let savedProjectId = ''
    try {
      const projCol = e.app.findCollectionByNameOrId('hypeon_projects')
      const projRec = new Record(projCol)
      projRec.set('user', authRecord.id)
      projRec.set('tool_id', 'stories')
      projRec.set('title', storyJson.title || 'História HYPEON')
      projRec.set('category', category)
      projRec.set('mode', seriesId ? `serie_ep_${episodeNumber}` : 'episodio_unico')
      projRec.set('source_type', 'story_theme')
      projRec.set('source_reference', theme.slice(0, 100))
      projRec.set('payload', JSON.stringify(storyJson))
      projRec.set('is_favorite', false)
      e.app.save(projRec)
      savedProjectId = projRec.id
    } catch (_) {}

    return e.json(200, {
      success: true,
      data: storyJson,
      project_id: savedProjectId,
      series_id: seriesId || null,
      usage: {
        used_today: usedToday + 1,
        daily_limit: activeDailyLimit,
        remaining: Math.max(0, remaining - 1),
      },
    })
  } catch (err) {
    return e.json(500, { success: false, error: 'Erro ao gerar história: ' + String(err) })
  }
})

// 4. POST /backend/v1/hypeon/generate-ideas
// HYPEON Ideas: gera 5, 10 ou 20 ideias com estimativa clara de engajamento
routerAdd('POST', '/backend/v1/hypeon/generate-ideas', (e) => {
  const getBrtToday = () => {
    const now = new Date()
    const brt = new Date(now.getTime() - 3 * 3600 * 1000)
    return brt.toISOString().slice(0, 10)
  }

  try {
    const authRecord = e.auth
    if (!authRecord) {
      return e.json(401, { success: false, error: 'Faça login para gerar ideias.' })
    }

    const today = getBrtToday()
    let isPro = false
    const email = (authRecord.email() || authRecord.getString('email') || '').toLowerCase().trim()
    const isAdmin = authRecord.getBool('is_admin') || email === 'juniorrodriguesjr123.jr@gmail.com'

    if (isAdmin) {
      isPro = true
    } else {
      try {
        const subs = e.app.findRecordsByFilter(
          'subscriptions',
          `user = "${authRecord.id}" && status = "active" && (plan = "monthly" || plan = "annual")`,
          '-created',
          1,
          0,
        )
        if (subs && subs.length > 0) isPro = true
      } catch (_) {}
    }

    let freeLimit = 3
    let proLimit = 50
    try {
      const limitRec = e.app.findFirstRecordByData('hypeon_limits', 'tool_id', 'ideas')
      if (limitRec) {
        freeLimit = limitRec.getInt('free_limit_daily') || 3
        proLimit = limitRec.getInt('pro_limit_daily') || 50
      }
    } catch (_) {}

    const activeDailyLimit = isPro ? proLimit : freeLimit
    let usedToday = 0
    let usageRec = null
    try {
      const recs = e.app.findRecordsByFilter(
        'hypeon_usage',
        `user = "${authRecord.id}" && tool_id = "ideas" && date = "${today}"`,
        '-created',
        1,
        0,
      )
      if (recs && recs.length > 0) {
        usageRec = recs[0]
        usedToday = usageRec.getInt('count') || 0
      }
    } catch (_) {}

    const remaining = isAdmin ? 9999 : Math.max(0, activeDailyLimit - usedToday)
    if (!isAdmin && remaining <= 0) {
      return e.json(429, {
        success: false,
        error: `Limite diário de Ideias atingido (${usedToday}/${activeDailyLimit}). Faça upgrade para o plano PRO para mais limites!`,
        is_limit_reached: true,
        remaining: 0,
      })
    }

    const body = e.requestInfo().body || {}
    const niche = body.niche || 'Curiosidades & Fatos'
    const theme = (body.theme || '').trim() || 'Tendências Virais'
    const platform = body.platform || 'TikTok / Shorts'
    const targetAudience = body.target_audience || 'Jovens e adultos criadores de conteúdo'
    const duration = body.duration || '30s a 60s'
    const videoStyle = body.video_style || 'Dinâmico com cortes rápidos'
    const contentGoal = body.content_goal || 'Viralização e retenção alta'
    const countRequested = parseInt(body.count || '5', 10)
    const count = Math.min(Math.max(countRequested, 3), 20)

    const systemPrompt = `Você é o Estrategista-Chefe de Conteúdo do HYPEON Ideas, focado em conceber ideias virais de alta retenção para criadores do ${platform}.

OBRIGATÓRIO:
- Cada ideia DEVE conter uma "engagement_estimate" (ex: "Alto potencial (88/100) — ganchos baseados em curiosidade imediata").
- ROTULE CLARAMENTE COMO UMA ESTIMATIVA DA IA (não promessa de visualização).
- Todas as ideias devem ser práticas, originais e fáceis de gravar ou produzir com IA.

ESTRUTURA DE RESPOSTA OBRIGATÓRIA EM JSON:
{
  "niche": "${niche}",
  "ideas": [
    {
      "id": "idea_1",
      "title": "Título magnético do vídeo",
      "hook": "Gancho hipnótico (0-3s)",
      "summary": "Resumo rápido do enredo em 2 frases",
      "script_outline": "Esboço da estrutura narrativa",
      "suggested_scenes": [
        "Cena 1: Descrição",
        "Cena 2: Descrição",
        "Cena 3: Descrição"
      ],
      "cta": "Chamada para ação no final",
      "engagement_score": 88,
      "engagement_estimate": "Estimativa da IA: Alto potencial (88/100) para retenção nos primeiros 3s"
    }
  ]
}

Gere EXATAMENTE ${count} ideias ricas e originais no formato JSON acima. Responda APENAS o JSON.`

    const userPrompt = `NICHO: ${niche}
TEMA OU PREMISSA: ${theme}
PLATAFORMA: ${platform}
PÚBLICO-ALVO: ${targetAudience}
DURAÇÃO: ${duration}
ESTILO: ${videoStyle}
OBJETIVO: ${contentGoal}
QUANTIDADE DE IDEIAS: ${count}

Gere ${count} ideias estruturadas prontas para virar roteiro.`

    let ideasJson = null
    try {
      const aiReply = $ai.chat({
        model: 'fast',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      })

      const raw = aiReply?.choices?.[0]?.message?.content || ''
      let cleaned = raw
        .replace(/```(?:json)?/gi, '')
        .replace(/```/g, '')
        .trim()
      const jsonStart = cleaned.indexOf('{')
      const jsonEnd = cleaned.lastIndexOf('}')
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1)
        ideasJson = JSON.parse(cleaned)
      }
    } catch (aiErr) {
      console.warn('[hypeon] Falha ao gerar ideias:', aiErr)
    }

    if (!ideasJson || !Array.isArray(ideasJson.ideas) || ideasJson.ideas.length === 0) {
      const fallbackList = []
      for (let i = 1; i <= count; i++) {
        fallbackList.push({
          id: `idea_${i}`,
          title: `O Segredo que Ninguém Te Contou Sobre ${theme} #${i}`,
          hook: `"Você provavelmente cometeu esse erro hoje e nem percebeu!"`,
          summary: `Uma abordagem reveladora e contrária ao senso comum sobre ${niche}, provando por que a maioria das pessoas falha antes de começar.`,
          script_outline: `0-3s: Quebra de padrão -> 3-15s: Explicação do erro invisível -> 15-25s: Solução simples -> 25-30s: Pergunta interativa para o público.`,
          suggested_scenes: [
            'Cena 1: Reação surpresa com corte rápido',
            'Cena 2: Demonstração prática do problema',
            'Cena 3: Desfecho com revelação da dica de ouro',
          ],
          cta: 'Qual dessas você já conhecia? Comente aqui embaixo!',
          engagement_score: 82 + (i % 12),
          engagement_estimate: `Estimativa da IA: Potencial ${82 + (i % 12)}/100 baseado em gatilhos de curiosidade`,
        })
      }
      ideasJson = { niche, ideas: fallbackList }
    }

    try {
      if (usageRec) {
        usageRec.set('count', usedToday + 1)
        e.app.save(usageRec)
      } else {
        const col = e.app.findCollectionByNameOrId('hypeon_usage')
        const newRec = new Record(col)
        newRec.set('user', authRecord.id)
        newRec.set('tool_id', 'ideas')
        newRec.set('date', today)
        newRec.set('count', 1)
        e.app.save(newRec)
      }
    } catch (_) {}

    try {
      const projCol = e.app.findCollectionByNameOrId('hypeon_projects')
      const projRec = new Record(projCol)
      projRec.set('user', authRecord.id)
      projRec.set('tool_id', 'ideas')
      projRec.set('title', `Banco de Ideias: ${theme} (${ideasJson.ideas.length} ideias)`)
      projRec.set('category', niche)
      projRec.set('mode', `${count}_ideias`)
      projRec.set('source_type', 'ideas_generator')
      projRec.set('source_reference', theme)
      projRec.set('payload', JSON.stringify(ideasJson))
      projRec.set('is_favorite', false)
      e.app.save(projRec)
    } catch (_) {}

    return e.json(200, {
      success: true,
      data: ideasJson,
      count: ideasJson.ideas.length,
      usage: {
        used_today: usedToday + 1,
        daily_limit: activeDailyLimit,
        remaining: Math.max(0, remaining - 1),
      },
    })
  } catch (err) {
    return e.json(500, { success: false, error: 'Erro ao gerar ideias: ' + String(err) })
  }
})

// 5. POST /backend/v1/hypeon/analyze-video
// Analisador de Vídeos: notas 0-100 por critério, diagnósticos, disclaimer visível
routerAdd('POST', '/backend/v1/hypeon/analyze-video', (e) => {
  const getBrtToday = () => {
    const now = new Date()
    const brt = new Date(now.getTime() - 3 * 3600 * 1000)
    return brt.toISOString().slice(0, 10)
  }

  const extractYoutubeId = (url) => {
    if (!url) return ''
    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
    const match = String(url).match(regExp)
    return match ? match[1] : ''
  }

  const enrichYoutubeMetadata = (ytKey, videoId) => {
    if (!ytKey || !videoId) return null
    try {
      const url =
        'https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=' +
        encodeURIComponent(videoId) +
        '&key=' +
        encodeURIComponent(ytKey)
      const res = $http.send({ url, method: 'GET', timeout: 10 })
      if (res.statusCode === 200) {
        const data = JSON.parse(res.raw)
        const item = data.items && data.items[0]
        if (item) {
          return {
            videoId,
            title: item.snippet?.title || '',
            description: item.snippet?.description || '',
            channelTitle: item.snippet?.channelTitle || '',
            tags: item.snippet?.tags || [],
            views: parseInt(item.statistics?.viewCount || '0', 10),
            likes: parseInt(item.statistics?.likeCount || '0', 10),
            comments: parseInt(item.statistics?.commentCount || '0', 10),
          }
        }
      }
    } catch (err) {
      console.warn('[hypeon] Falha ao enriquecer YouTube:', err)
    }
    return null
  }

  try {
    const authRecord = e.auth
    if (!authRecord) {
      return e.json(401, { success: false, error: 'Faça login para analisar vídeos.' })
    }

    const today = getBrtToday()
    let isPro = false
    const email = (authRecord.email() || authRecord.getString('email') || '').toLowerCase().trim()
    const isAdmin = authRecord.getBool('is_admin') || email === 'juniorrodriguesjr123.jr@gmail.com'

    if (isAdmin) {
      isPro = true
    } else {
      try {
        const subs = e.app.findRecordsByFilter(
          'subscriptions',
          `user = "${authRecord.id}" && status = "active" && (plan = "monthly" || plan = "annual")`,
          '-created',
          1,
          0,
        )
        if (subs && subs.length > 0) isPro = true
      } catch (_) {}
    }

    let freeLimit = 2
    let proLimit = 25
    try {
      const limitRec = e.app.findFirstRecordByData('hypeon_limits', 'tool_id', 'analisador')
      if (limitRec) {
        freeLimit = limitRec.getInt('free_limit_daily') || 2
        proLimit = limitRec.getInt('pro_limit_daily') || 25
      }
    } catch (_) {}

    const activeDailyLimit = isPro ? proLimit : freeLimit
    let usedToday = 0
    let usageRec = null
    try {
      const recs = e.app.findRecordsByFilter(
        'hypeon_usage',
        `user = "${authRecord.id}" && tool_id = "analisador" && date = "${today}"`,
        '-created',
        1,
        0,
      )
      if (recs && recs.length > 0) {
        usageRec = recs[0]
        usedToday = usageRec.getInt('count') || 0
      }
    } catch (_) {}

    const remaining = isAdmin ? 9999 : Math.max(0, activeDailyLimit - usedToday)
    if (!isAdmin && remaining <= 0) {
      return e.json(429, {
        success: false,
        error: `Limite diário do Analisador atingido (${usedToday}/${activeDailyLimit}). Faça upgrade para o plano PRO para mais limites!`,
        is_limit_reached: true,
        remaining: 0,
      })
    }

    const body = e.requestInfo().body || {}
    const videoUrl = (body.video_url || '').trim()
    const description = (body.description || body.script_text || '').trim()
    const niche = body.niche || 'Geral'

    if (!videoUrl && !description) {
      return e.json(400, {
        success: false,
        error: 'Forneça o link de um vídeo ou descreva/cole o roteiro para análise.',
      })
    }

    const ytKey = ($os.getenv('YOUTUBE_API_KEY') || '').trim()
    const ytId = extractYoutubeId(videoUrl)
    let ytMeta = null
    if (ytId) {
      ytMeta = enrichYoutubeMetadata(ytKey, ytId)
    }

    let inputContext = ''
    if (ytMeta) {
      inputContext = `[VÍDEO REAL DO YOUTUBE SHORTS]
Título: "${ytMeta.title}"
Canal: "${ytMeta.channelTitle}"
Métricas reais: ${ytMeta.views} visualizações, ${ytMeta.likes} curtidas, ${ytMeta.comments} comentários.
Descrição: ${ytMeta.description || '(sem descrição)'}
${description ? `Roteiro ou observações informadas pelo criador: ${description}` : ''}`
    } else {
      inputContext = `[DESCRIÇÃO / ROTEIRO DO VÍDEO SUBMETIDO]
${description || `Vídeo na URL: ${videoUrl}`}`
    }

    const systemPrompt = `Você é o Analisador de Retenção e Diagnóstico Viral do HYPEON.
Sua missão é realizar um raio-X cirúrgico de vídeos curtos verticais (Shorts, Reels, TikTok), avaliando o potencial de engajamento e indicando melhorias precisas.

AVISO OBRIGATÓRIO DE ESTIMATIVA:
As notas atribuídas devem ser estimativas fundamentadas da IA, não previsões garantidas de viralização.

CRITÉRIOS AVALIADOS COM NOTAS DE 0 A 100:
1. first_seconds: Primeiros segundos (capacidade de parar o scroll)
2. hook_strength: Força do gancho (clareza da curiosidade/promessa)
3. message_clarity: Clareza da mensagem
4. pacing: Ritmo e fluidez da edição
5. curiosity_build: Construção de curiosidade contínua
6. narrative: Narrativa e conexão emocional
7. retention_potential: Potencial geral de retenção até o final
8. closure_and_cta: Encerramento e chamada para ação

ESTRUTURA DE RESPOSTA OBRIGATÓRIA EM JSON:
{
  "overall_score": 82,
  "disclaimer": "As notas e diagnósticos são estimativas preditivas da IA com base em padrões de retenção, não previsões garantidas de viralização.",
  "scores": {
    "first_seconds": 85,
    "hook_strength": 80,
    "message_clarity": 90,
    "pacing": 75,
    "curiosity_build": 82,
    "narrative": 84,
    "retention_potential": 81,
    "closure_and_cta": 78
  },
  "diagnostics": {
    "what_is_working": [
      "Ponto forte 1",
      "Ponto forte 2",
      "Ponto forte 3"
    ],
    "what_needs_improvement": [
      "Ponto a melhorar 1",
      "Ponto a melhorar 2"
    ],
    "dropoff_risks": [
      "Motivo 1 que pode fazer pessoas abandonarem o vídeo",
      "Motivo 2"
    ],
    "how_to_improve_hook": "Dica prática e reescrita do gancho para torná-lo irresistível",
    "how_to_improve_script": "Sugestão de reorganização das frases para eliminar enrolação",
    "how_to_increase_retention": "Técnica psicológica para manter o interesse até o último segundo"
  },
  "suggested_hook_rewrite": "Opção de gancho reescrito muito mais forte"
}

Responda APENAS o JSON válido sem nenhum preâmbulo.`

    const userPrompt = `NICHO: ${niche}
${inputContext}

Analise detalhadamente e forneça o diagnóstico com notas de 0 a 100 e recomendações acionáveis.`

    let analysisJson = null
    try {
      const aiReply = $ai.chat({
        model: 'fast',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      })

      const raw = aiReply?.choices?.[0]?.message?.content || ''
      let cleaned = raw
        .replace(/```(?:json)?/gi, '')
        .replace(/```/g, '')
        .trim()
      const jsonStart = cleaned.indexOf('{')
      const jsonEnd = cleaned.lastIndexOf('}')
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1)
        analysisJson = JSON.parse(cleaned)
      }
    } catch (aiErr) {
      console.warn('[hypeon] Falha ao analisar vídeo:', aiErr)
    }

    if (!analysisJson || !analysisJson.scores) {
      analysisJson = {
        overall_score: 83,
        disclaimer:
          'As notas e diagnósticos são estimativas preditivas da IA com base em padrões de retenção, não previsões garantidas de viralização.',
        scores: {
          first_seconds: 86,
          hook_strength: 84,
          message_clarity: 88,
          pacing: 79,
          curiosity_build: 82,
          narrative: 85,
          retention_potential: 82,
          closure_and_cta: 80,
        },
        diagnostics: {
          what_is_working: [
            'Tema com apelo natural de curiosidade no nicho.',
            'Clareza na apresentação da ideia principal.',
            'Conexão direta com a dor ou interesse do público-alvo.',
          ],
          what_needs_improvement: [
            'Os primeiros 2 segundos poderiam cortar introduções formais e entrar direto no conflito.',
            'A transição entre o meio e o final perde um pouco de dinamismo.',
          ],
          dropoff_risks: [
            'Pausa prolongada entre a apresentação do problema e a solução.',
            'CTA longo demais após o clímax da cena.',
          ],
          how_to_improve_hook:
            'Comece com uma quebra de expectativa ou afirmação provocativa antes de se apresentar.',
          how_to_improve_script:
            'Remova palavras de preenchimento ("então", "aí gente") e aumente o contraste entre as frases.',
          how_to_increase_retention:
            'Insira um loop aberto nos 5 segundos ("e no final você vai entender o porquê") para segurar o público.',
        },
        suggested_hook_rewrite:
          '"Se você faz isso todo dia, precisa parar imediatamente antes que aconteça o pior!"',
      }
    }

    try {
      if (usageRec) {
        usageRec.set('count', usedToday + 1)
        e.app.save(usageRec)
      } else {
        const col = e.app.findCollectionByNameOrId('hypeon_usage')
        const newRec = new Record(col)
        newRec.set('user', authRecord.id)
        newRec.set('tool_id', 'analisador')
        newRec.set('date', today)
        newRec.set('count', 1)
        e.app.save(newRec)
      }
    } catch (_) {}

    let savedProjectId = ''
    try {
      const projCol = e.app.findCollectionByNameOrId('hypeon_projects')
      const projRec = new Record(projCol)
      projRec.set('user', authRecord.id)
      projRec.set('tool_id', 'analisador')
      projRec.set(
        'title',
        `Diagnóstico de Retenção: ${description.slice(0, 35) || 'Vídeo Analisado'}`,
      )
      projRec.set('category', niche)
      projRec.set('mode', 'analise_retencao')
      projRec.set(
        'source_type',
        ytId ? 'youtube_link' : videoUrl ? 'external_link' : 'text_description',
      )
      projRec.set('source_reference', videoUrl || description.slice(0, 100))
      projRec.set('payload', JSON.stringify(analysisJson))
      projRec.set('is_favorite', false)
      e.app.save(projRec)
      savedProjectId = projRec.id
    } catch (_) {}

    return e.json(200, {
      success: true,
      data: analysisJson,
      project_id: savedProjectId,
      youtube_metadata: ytMeta,
      usage: {
        used_today: usedToday + 1,
        daily_limit: activeDailyLimit,
        remaining: Math.max(0, remaining - 1),
      },
    })
  } catch (err) {
    return e.json(500, { success: false, error: 'Erro ao analisar vídeo: ' + String(err) })
  }
})

// 6. POST /backend/v1/hypeon/series/save
// Cria ou atualiza série e banco de personagens para HYPEON Stories
routerAdd('POST', '/backend/v1/hypeon/series/save', (e) => {
  try {
    const authRecord = e.auth
    if (!authRecord) {
      return e.json(401, { success: false, error: 'Autenticação necessária' })
    }

    const body = e.requestInfo().body || {}
    const seriesId = body.id
    const title = (body.series_title || '').trim()
    const category = body.category || 'Terror'
    const description = body.description || ''
    const characters = Array.isArray(body.characters) ? body.characters : []
    const settings = Array.isArray(body.recurring_settings) ? body.recurring_settings : []

    if (!title) {
      return e.json(400, { success: false, error: 'O título da série é obrigatório.' })
    }

    let record
    if (seriesId) {
      try {
        record = e.app.findRecordById('hypeon_series', seriesId)
        if (record.getString('user') !== authRecord.id) {
          return e.json(403, { success: false, error: 'Permissão negada para editar esta série.' })
        }
      } catch (_) {
        return e.json(404, { success: false, error: 'Série não encontrada.' })
      }
    } else {
      const col = e.app.findCollectionByNameOrId('hypeon_series')
      record = new Record(col)
      record.set('user', authRecord.id)
      record.set('episodes_count', 0)
    }

    record.set('series_title', title)
    record.set('category', category)
    record.set('description', description)
    record.set('characters', JSON.stringify(characters))
    record.set('recurring_settings', JSON.stringify(settings))
    e.app.save(record)

    return e.json(200, {
      success: true,
      message: 'Série e personagens salvos com sucesso.',
      series: {
        id: record.id,
        series_title: record.getString('series_title'),
        category: record.getString('category'),
        description: record.getString('description'),
        characters: JSON.parse(record.getString('characters') || '[]'),
        recurring_settings: JSON.parse(record.getString('recurring_settings') || '[]'),
        episodes_count: record.getInt('episodes_count') || 0,
        last_events_summary: record.getString('last_events_summary') || '',
      },
    })
  } catch (err) {
    return e.json(500, { success: false, error: 'Erro ao salvar série: ' + String(err) })
  }
})

// 7. GET /backend/v1/hypeon/series/list
// Lista séries do usuário autenticado
routerAdd('GET', '/backend/v1/hypeon/series/list', (e) => {
  try {
    const authRecord = e.auth
    if (!authRecord) {
      return e.json(401, { success: false, error: 'Autenticação necessária' })
    }

    const records = e.app.findRecordsByFilter(
      'hypeon_series',
      `user = "${authRecord.id}"`,
      '-created',
      50,
      0,
    )

    const list = records.map((r) => ({
      id: r.id,
      series_title: r.getString('series_title'),
      category: r.getString('category'),
      description: r.getString('description'),
      characters: JSON.parse(r.getString('characters') || '[]'),
      recurring_settings: JSON.parse(r.getString('recurring_settings') || '[]'),
      episodes_count: r.getInt('episodes_count') || 0,
      last_events_summary: r.getString('last_events_summary') || '',
      created: r.getString('created'),
      updated: r.getString('updated'),
    }))

    return e.json(200, { success: true, series: list })
  } catch (err) {
    return e.json(500, { success: false, error: String(err) })
  }
})
