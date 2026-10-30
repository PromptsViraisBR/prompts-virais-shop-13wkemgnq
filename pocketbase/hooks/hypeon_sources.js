/**
 * HYPEON Sources & Radar Engine (PocketBase Hook)
 *
 * Provê endpoints server-side para o HYPEON:
 * 1. GET  /backend/v1/hypeon/sources-status   -> status das fontes (YouTube Data API v3, etc.)
 * 2. GET  /backend/v1/hypeon/radar            -> feed do Radar Viral com dados REAIS do YouTube
 * 3. GET  /backend/v1/hypeon/limits           -> lista de limites por ferramenta
 * 4. POST /backend/v1/hypeon/admin/update-limit -> atualização de limites (admin)
 * 5. GET  /backend/v1/hypeon/usage-stats      -> estatísticas de uso (admin)
 *
 * REGRA SAGRADA DE DADOS REAIS:
 * Nunca retorna vídeos ou métricas fictícios como se fossem reais.
 * Se YOUTUBE_API_KEY falhar ou não estiver configurada, a API retorna
 * status `connected: false` com instrução clara e lista vazia de vídeos.
 * Chave nunca exposta nem logada.
 */

// 1. GET /backend/v1/hypeon/sources-status
routerAdd('GET', '/backend/v1/hypeon/sources-status', (e) => {
  try {
    const ytKey = ($os.getenv('YOUTUBE_API_KEY') || '').trim()
    const ttKey = ($os.getenv('TIKTOK_API_KEY') || '').trim()
    const igKey = ($os.getenv('INSTAGRAM_API_KEY') || '').trim()

    let ytStatusActive = false
    let ytStatusDetails = 'Chave YOUTUBE_API_KEY não cadastrada nos segredos'

    if (ytKey && ytKey.length > 5) {
      try {
        // Teste leve oficial à API do YouTube (1 unidade de cota)
        const probeUrl =
          'https://www.googleapis.com/youtube/v3/videos?part=id&chart=mostPopular&regionCode=BR&maxResults=1&key=' +
          encodeURIComponent(ytKey)
        const probeRes = $http.send({
          url: probeUrl,
          method: 'GET',
          timeout: 8,
        })
        ytStatusActive = probeRes.statusCode === 200
        ytStatusDetails = ytStatusActive
          ? 'YouTube Data API v3 conectada e ativa (BR)'
          : 'Falha na validação: HTTP ' + probeRes.statusCode
      } catch (probeErr) {
        ytStatusActive = false
        ytStatusDetails = 'Erro de rede ao validar chave'
      }
    }

    return e.json(200, {
      success: true,
      sources: {
        youtube: {
          id: 'youtube',
          name: 'YouTube Data API v3 (Shorts)',
          connected: ytStatusActive,
          status_detail: ytStatusDetails,
          required_secret: 'YOUTUBE_API_KEY',
          type: 'official_api',
          description:
            'Busca oficial de Shorts virais do Brasil com métricas reais de visualizações, curtidas e comentários',
        },
        tiktok: {
          id: 'tiktok',
          name: 'TikTok Commercial / Research API',
          connected: Boolean(ttKey && ttKey.length > 5),
          required_secret: 'TIKTOK_API_KEY',
          type: 'partner_api',
          description:
            'Tendências e vídeos virais do TikTok (ativação futura com provedor de dados oficial)',
        },
        instagram: {
          id: 'instagram',
          name: 'Instagram Graph API (Reels)',
          connected: Boolean(igKey && igKey.length > 5),
          required_secret: 'INSTAGRAM_API_KEY',
          type: 'meta_api',
          description: 'Reels públicos de alto engajamento',
        },
      },
      message: ytStatusActive
        ? 'Fonte do YouTube Data API ativa e conectada'
        : 'YouTube Data API pendente de validação nos segredos',
    })
  } catch (err) {
    return e.json(500, { success: false, error: String(err) })
  }
})

// 2. GET /backend/v1/hypeon/radar
routerAdd('GET', '/backend/v1/hypeon/radar', (e) => {
  try {
    const platform = e.request.url.query().get('platform') || 'youtube'
    const niche = e.request.url.query().get('niche') || 'all'
    const period = e.request.url.query().get('period') || '7d'
    const sort = e.request.url.query().get('sort') || 'views'

    const ytKey = ($os.getenv('YOUTUBE_API_KEY') || '').trim()
    const isYtConnected = Boolean(ytKey && ytKey.length > 5)

    // Se o usuário selecionou uma plataforma sem fonte oficial conectada ainda (TikTok, Instagram, Facebook):
    if (platform !== 'all' && platform !== 'youtube') {
      return e.json(200, {
        success: true,
        connected: false,
        source: null,
        message: `Fonte para ${platform} ainda não possui provedor de dados oficial conectado. Selecione YouTube para ver tendências reais em tempo real.`,
        required_secret: `${platform.toUpperCase()}_API_KEY`,
        filters_applied: { platform, niche, period, sort },
        total_items: 0,
        items: [],
      })
    }

    // Se a chave não existe nos segredos:
    if (!isYtConnected) {
      return e.json(200, {
        success: true,
        connected: false,
        source: null,
        message:
          'Fonte de tendências não conectada — configure a chave YOUTUBE_API_KEY nos segredos do Skip Cloud para ver vídeos e métricas reais.',
        required_secret: 'YOUTUBE_API_KEY',
        filters_applied: { platform, niche, period, sort },
        total_items: 0,
        items: [],
      })
    }

    // Cache simples em memória usando o objeto global de cache (v3 com multi-busca ampliada)
    const cacheKey = `yt_radar_v3_${platform}_${niche}_${period}_${sort}`
    const cacheTtlMs = 20 * 60 * 1000 // 20 minutos
    const nowTs = Date.now()

    if (!globalThis.__hypeonRadarCache) {
      globalThis.__hypeonRadarCache = {}
    }
    const cachedEntry = globalThis.__hypeonRadarCache[cacheKey]
    if (cachedEntry && nowTs - cachedEntry.time < cacheTtlMs) {
      return e.json(200, {
        ...cachedEntry.payload,
        cached: true,
      })
    }

    // Helper de normalização (remove acentos, pontuação e transforma em minúsculas)
    const normalizeText = (text) => {
      if (!text) return ''
      return String(text)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    }

    // 1. REFINAR TERMOS DE BUSCA: foco 100% em formatos de ENTRETENIMENTO para criadores
    // 2 a 3 variações por nicho para coletar um volume abundante de vídeos reais + termos de reforço
    const nicheQueries = {
      all: {
        queries: [
          '"você sabia" OR "curiosidades" shorts brasil',
          '"como fazer" OR "experimento caseiro" shorts brasil',
          '"fatos curiosos" OR "história narrada" shorts brasil',
        ],
        fallback: [
          'truques incríveis você sabia shorts brasil',
          'curiosidades impressionantes shorts brasil',
        ],
      },
      historias: {
        queries: [
          'história narrada shorts brasil relatos',
          'relatos reais histórias narradas shorts',
          'histórias incríveis reflexão shorts brasil',
        ],
        fallback: [
          'histórias de superação narradas shorts',
          'contos narrados animação shorts brasil',
        ],
      },
      terror: {
        queries: [
          'história de terror narrada shorts brasil contos',
          'relatos assustadores narrados shorts brasil',
          'lendas urbanas histórias de terror shorts',
        ],
        fallback: [
          'casos sobrenaturais histórias curtas shorts',
          'contos de suspense e terror narrados shorts',
        ],
      },
      suspense: {
        queries: [
          'suspense mistério história narrada shorts',
          'casos misteriosos curiosidades shorts brasil',
          'histórias de suspense intrigantes shorts',
        ],
        fallback: [
          'enigmas e suspense histórias shorts brasil',
          'casos sem explicação mistério shorts',
        ],
      },
      misterio: {
        queries: [
          'mistério revelado curiosidades fatos shorts',
          'segredos e mistérios você sabia shorts',
          'mistérios do mundo fatos curiosos shorts',
        ],
        fallback: [
          'fatos misteriosos que ninguém explica shorts',
          'segredos ocultos você sabia shorts brasil',
        ],
      },
      humor: {
        queries: [
          'comédia esquetes engraçado humor shorts brasil',
          'piadas engraçadas meme criativo shorts',
          'situações engraçadas paródia comédia shorts',
        ],
        fallback: [
          'memes engraçados esquetes shorts brasil',
          'humor criativo shorts brasil comédia',
        ],
      },
      comedia: {
        queries: [
          'comédia esquetes engraçado shorts brasil',
          'situações engraçadas paródia shorts',
          'humor dia a dia esquetes curtas shorts',
        ],
        fallback: [
          'piadas curtas e engraçadas shorts brasil',
          'esquetes de comédia criativa shorts',
        ],
      },
      curiosidades: {
        queries: [
          '"você sabia" curiosidades fatos incríveis shorts',
          'curiosidades que você não sabia shorts brasil',
          'fatos curiosos shorts você sabia',
        ],
        fallback: [
          'curiosidades incríveis do mundo shorts',
          'coisas que você não sabia fatos shorts brasil',
        ],
      },
      ia: {
        queries: [
          'inteligência artificial tutorial dicas como fazer shorts',
          'ferramentas de IA incríveis truques shorts',
          'como usar IA dicas e truques shorts brasil',
        ],
        fallback: [
          'novidades de inteligência artificial shorts',
          'prompts e ferramentas IA passo a passo shorts',
        ],
      },
      animacoes: {
        queries: [
          'animação curta história em desenho shorts brasil',
          'desenho animado história narrada shorts',
          'curta de animação engraçado shorts brasil',
        ],
        fallback: ['animação criativa historinha shorts', 'desenhos animados curtos virais shorts'],
      },
      personagens: {
        queries: [
          'frutas humanizadas animais humanizados história shorts',
          'personagens humanizados animação shorts brasil',
          'historinhas de frutas personagens shorts',
        ],
        fallback: [
          'comida humanizada história engraçada shorts',
          'objetos com vida história animada shorts',
        ],
      },
      animais: {
        queries: [
          'animais fofos engraçados curiosidades pet shorts',
          'cães e gatos engraçados dublagem shorts',
          'curiosidades sobre animais selvagens shorts',
        ],
        fallback: ['pets engraçados e fofos shorts brasil', 'fatos curiosos sobre animais shorts'],
      },
      relacionamentos: {
        queries: [
          'dicas de relacionamento conselhos história shorts',
          'relacionamento amoroso reflexão histórias shorts',
          'conselhos sobre namoro e casal shorts',
        ],
        fallback: [
          'psicologia dos relacionamentos dicas shorts',
          'histórias de amor e lição shorts brasil',
        ],
      },
      motivacao: {
        queries: [
          'motivação reflexão lição de vida história shorts',
          'mensagem motivacional para o dia shorts',
          'disciplina e foco reflexão estoicismo shorts',
        ],
        fallback: [
          'histórias inspiradoras lição de vida shorts',
          'frases de motivação e sabedoria shorts brasil',
        ],
      },
      conhecimento: {
        queries: [
          'como fazer tutorial aprenda dica truque shorts',
          'conhecimento prático você sabia como funciona shorts',
          'dicas úteis para o dia a dia shorts',
        ],
        fallback: [
          'aprenda em 1 minuto dicas fáceis shorts',
          'como funciona na prática você sabia shorts',
        ],
      },
      tecnologia: {
        queries: [
          'dicas de tecnologia truques celular pc shorts',
          'tecnologia segredos recursos incríveis shorts',
          'recursos escondidos no celular truques shorts',
        ],
        fallback: [
          'funções secretas no celular e pc shorts',
          'dicas de tech truques fáceis shorts brasil',
        ],
      },
      experimentos: {
        queries: [
          'experimento caseiro teste na prática ciência shorts',
          'experiência incrível testando truques shorts',
          'experimentos científicos fáceis shorts brasil',
        ],
        fallback: [
          'testando truques da internet na prática shorts',
          'ciência divertida experimentos caseiros shorts',
        ],
      },
      satisfatorios: {
        queries: [
          'vídeo satisfatório asmr relaxante shorts',
          'oddly satisfying asmr visual shorts',
          'processo de corte satisfatório asmr shorts',
        ],
        fallback: [
          'vídeos que relaxam visual satisfatório shorts',
          'asmr visual relaxante sons shorts brasil',
        ],
      },
      outros: {
        queries: [
          'curiosidades como fazer você sabia shorts brasil',
          'truques criativos tutoriais shorts brasil',
          'fatos impressionantes você sabia shorts',
        ],
        fallback: [
          'dicas incríveis e curiosidades shorts',
          'coisas satisfatórias e tutoriais shorts brasil',
        ],
      },
    }

    const currentNicheConfig = nicheQueries[niche] || {
      queries: [
        `${niche} como fazer curiosidades shorts brasil`,
        `${niche} dicas tutorial shorts brasil`,
        `${niche} você sabia fatos shorts brasil`,
      ],
      fallback: [`${niche} truques e curiosidades shorts brasil`],
    }

    // Período padrão: 30 dias (30d) para garantir volume robusto
    let daysAgo = 30
    if (period === '24h') daysAgo = 1
    if (period === '7d') daysAgo = 7
    if (period === '30d') daysAgo = 30
    const publishedAfter = new Date(nowTs - daysAgo * 24 * 60 * 60 * 1000).toISOString()

    // Ordenação da YouTube API
    let ytOrder = 'viewCount'
    if (sort === 'recent') ytOrder = 'date'
    if (sort === 'growth' || sort === 'engagement') ytOrder = 'relevance'

    // 2. FILTRO DE EXCLUSÃO DURO: NUNCA notícia, política, jornalismo, tragédias, agenda esportiva
    // Termos normalizados (sem acentos) para bater contra título e canal
    const excludedPhrases = [
      'noticia',
      'noticias',
      'jornal',
      'jornalismo',
      'cnn',
      'bbc',
      'globonews',
      'globo news',
      'bandnews',
      'band news',
      'record news',
      'uol',
      'g1',
      'metropoles',
      'jovem pan',
      'ao vivo',
      'plantao',
      'politica',
      'politico',
      'eleicao',
      'eleicoes',
      'presidente',
      'lula',
      'bolsonaro',
      'tarcisio',
      'governo',
      'congresso',
      'senado',
      'stf',
      'deputado',
      'vereador',
      'prefeito',
      'ministro',
      'guerra',
      'ataque',
      'atentado',
      'protesto',
      'greve',
      'tragedia',
      'acidente',
      'naufragio',
      'incendio',
      'chacina',
      'fuzilamento',
      'tiroteio',
      'morre',
      'morte de',
      'morte do',
      'morte da',
      'assassinato',
      'assassinado',
      'executado',
      'jogo de',
      'jogo do',
      'campeonato',
      'copa do',
      'placar',
      'escalacao',
      'brasileirao',
      'rodada',
      'melhores momentos',
      'gols da rodada',
    ]

    const isExcluded = (titleNorm, channelNorm) => {
      for (let i = 0; i < excludedPhrases.length; i++) {
        const p = excludedPhrases[i]
        // Se a frase proibida aparecer no canal
        if (channelNorm.includes(p)) return true

        // Se for frase multi-palavra, busca direta no título
        if (p.includes(' ')) {
          if (titleNorm.includes(p)) return true
        } else {
          // Palavra única: regex com limites para evitar falso positivo (ex.: morte vs morte de)
          // Exceção controlada: "morre" bloqueia "morre hoje", etc.
          const rx = new RegExp(`(^|[^a-z0-9])${p}([^a-z0-9]|$)`)
          if (rx.test(titleNorm)) return true
        }
      }
      return false
    }

    // 3. SCORE DE RELEVÂNCIA: bônus para formatos autênticos de entretenimento
    const entertainmentKeywords = [
      'curiosidade',
      'curiosidades',
      'voce sabia',
      'sabia que',
      'como fazer',
      'fazer em casa',
      'aprenda',
      'tutorial',
      'dica',
      'dicas',
      'truque',
      'truques',
      'historia',
      'historias',
      'narrada',
      'relato',
      'relatos',
      'conto',
      'desenho',
      'animacao',
      'personagem',
      'humanizada',
      'humanizado',
      'fruta',
      'engracado',
      'comedia',
      'esquete',
      'teste',
      'testando',
      'experimento',
      'segredo',
      'revelado',
      'passo a passo',
      'fatos',
      'incrivel',
      'satisfatorio',
      'asmr',
    ]

    const computeEntertainmentScore = (titleNorm) => {
      let score = 0
      for (let i = 0; i < entertainmentKeywords.length; i++) {
        const kw = entertainmentKeywords[i]
        if (kw.includes(' ')) {
          if (titleNorm.includes(kw)) score += 15
        } else {
          const rx = new RegExp(`(^|[^a-z0-9])${kw}([^a-z0-9]|$)`)
          if (rx.test(titleNorm)) score += 8
        }
      }
      return score
    }

    // Helper para buscar vídeos na YouTube API v3 com maxResults = 50 (máximo suportado por requisição)
    const fetchYouTubeVideos = (term) => {
      const searchUrl =
        'https://www.googleapis.com/youtube/v3/search?' +
        'part=snippet&type=video&videoDuration=short&maxResults=50' +
        '&regionCode=BR' +
        '&relevanceLanguage=pt' +
        '&q=' +
        encodeURIComponent(term) +
        '&order=' +
        ytOrder +
        '&publishedAfter=' +
        encodeURIComponent(publishedAfter) +
        '&key=' +
        encodeURIComponent(ytKey)

      const searchRes = $http.send({
        url: searchUrl,
        method: 'GET',
        timeout: 15,
      })

      if (searchRes.statusCode !== 200) {
        return { error: 'HTTP ' + searchRes.statusCode, items: [] }
      }

      try {
        const data = JSON.parse(searchRes.raw)
        return { items: data.items || [] }
      } catch (e) {
        return { error: 'parse_error', items: [] }
      }
    }

    // Executa as buscas principais (2 a 3 termos por nicho) agregando resultados sem duplicatas
    const queryList = currentNicheConfig.queries || [currentNicheConfig.primary || 'shorts brasil']
    const combinedRawItems = []
    const seenRawVideoIds = {}

    for (let qIdx = 0; qIdx < queryList.length; qIdx++) {
      const qTerm = queryList[qIdx]
      const qRes = fetchYouTubeVideos(qTerm)
      const qItems = qRes.items || []
      for (let i = 0; i < qItems.length; i++) {
        const item = qItems[i]
        const vId = item.id && item.id.videoId
        if (vId && !seenRawVideoIds[vId]) {
          seenRawVideoIds[vId] = true
          combinedRawItems.push(item)
        }
      }
    }

    if (combinedRawItems.length === 0) {
      return e.json(200, {
        success: true,
        connected: true,
        source: 'youtube_data_api_v3',
        filters_applied: { platform, niche, period, sort },
        total_items: 0,
        items: [],
      })
    }

    // Coletar IDs para buscar estatísticas
    const extractIds = (list) => list.map((it) => it.id && it.id.videoId).filter(Boolean)

    let initialIds = extractIds(combinedRawItems)

    // Helper para buscar estatísticas (/videos) em lotes de até 50 IDs (limite máximo da YouTube API)
    const fetchStats = (ids) => {
      if (!ids || ids.length === 0) return {}
      const statsMap = {}

      for (let offset = 0; offset < ids.length; offset += 50) {
        const batchIds = ids.slice(offset, offset + 50)
        const statsUrl =
          'https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=' +
          encodeURIComponent(batchIds.join(',')) +
          '&key=' +
          encodeURIComponent(ytKey)

        const statsRes = $http.send({
          url: statsUrl,
          method: 'GET',
          timeout: 15,
        })

        if (statsRes.statusCode === 200) {
          try {
            const statsData = JSON.parse(statsRes.raw)
            const statItems = statsData.items || []
            for (let i = 0; i < statItems.length; i++) {
              const s = statItems[i]
              statsMap[s.id] = {
                statistics: s.statistics || {},
                snippet: s.snippet || {},
                contentDetails: s.contentDetails || {},
              }
            }
          } catch (_) {}
        }
      }

      return statsMap
    }

    let allStatsMap = fetchStats(initialIds)

    // Formatar e filtrar itens preservando rigorosamente o filtro de entretenimento
    const processItems = (rawItems, statsMap) => {
      const valid = []
      const seen = {}

      for (let i = 0; i < rawItems.length; i++) {
        const it = rawItems[i]
        const vId = it.id?.videoId
        if (!vId || seen[vId]) continue
        seen[vId] = true

        const details = statsMap[vId] || {}
        const st = details.statistics || {}
        const sn = details.snippet || it.snippet || {}

        const title = sn.title || it.snippet?.title || 'Short Sem Título'
        const channelTitle = sn.channelTitle || it.snippet?.channelTitle || 'Canal'
        const titleNorm = normalizeText(title)
        const channelNorm = normalizeText(channelTitle)

        // Filtro rígido de exclusão (notícia/política/tragédia/agenda esportiva)
        if (isExcluded(titleNorm, channelNorm)) {
          continue
        }

        const views = parseInt(st.viewCount || '0', 10)
        const likes = parseInt(st.likeCount || '0', 10)
        const comments = parseInt(st.commentCount || '0', 10)

        // Score de engajamento base
        const engagementRatio = views > 0 ? ((likes + comments * 2) / views) * 100 : 0
        const baseGrowth = Math.min(
          100,
          Math.max(10, Math.round(engagementRatio * 8 + Math.log10(views + 1) * 7)),
        )

        // Score de entretenimento
        const entertainmentScore = computeEntertainmentScore(titleNorm)

        valid.push({
          id: vId,
          external_id: vId,
          platform: 'youtube',
          platform_name: 'YouTube Shorts',
          title: title,
          description: sn.description || it.snippet?.description || '',
          thumbnail_url:
            sn.thumbnails?.maxres?.url ||
            sn.thumbnails?.high?.url ||
            sn.thumbnails?.medium?.url ||
            it.snippet?.thumbnails?.high?.url ||
            it.snippet?.thumbnails?.medium?.url ||
            `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
          original_url: 'https://www.youtube.com/shorts/' + vId,
          embed_url: 'https://www.youtube-nocookie.com/embed/' + vId,
          author_name: channelTitle,
          author_handle: '@' + channelTitle.replace(/\s+/g, '').toLowerCase(),
          channel_id: sn.channelId || it.snippet?.channelId || '',
          views_count: views,
          likes_count: likes,
          comments_count: comments,
          shares_count: null,
          niche: niche === 'all' ? 'curiosidades' : niche,
          country: 'BR',
          language: 'pt',
          growth_score: baseGrowth,
          entertainment_score: entertainmentScore,
          published_at: sn.publishedAt || it.snippet?.publishedAt || '',
        })
      }
      return valid
    }

    let filtered = processItems(combinedRawItems, allStatsMap)

    // 4. REFORÇO: se após curadoria sobrarem MENOS DE 20 VÍDEOS, dispara busca adicional com termos alternativos
    const fallbackList = Array.isArray(currentNicheConfig.fallback)
      ? currentNicheConfig.fallback
      : currentNicheConfig.fallback
        ? [currentNicheConfig.fallback]
        : []

    if (filtered.length < 20 && fallbackList.length > 0) {
      const existingIds = {}
      for (let i = 0; i < filtered.length; i++) {
        existingIds[filtered[i].id] = true
      }

      const additionalRaw = []
      for (let fbIdx = 0; fbIdx < fallbackList.length; fbIdx++) {
        if (filtered.length + additionalRaw.length >= 35) break // já tem volume excelente
        const fbTerm = fallbackList[fbIdx]
        const fallbackResult = fetchYouTubeVideos(fbTerm)
        const fbItems = fallbackResult.items || []
        for (let j = 0; j < fbItems.length; j++) {
          const vId = fbItems[j].id?.videoId
          if (vId && !existingIds[vId] && !seenRawVideoIds[vId]) {
            seenRawVideoIds[vId] = true
            existingIds[vId] = true
            additionalRaw.push(fbItems[j])
          }
        }
      }

      if (additionalRaw.length > 0) {
        const newIds = additionalRaw.map((it) => it.id.videoId)
        const newStatsMap = fetchStats(newIds)
        const additional = processItems(additionalRaw, newStatsMap)
        filtered = filtered.concat(additional)
      }
    }

    // Ordenação com Score de Relevância de Entretenimento no topo
    // Critério: vídeos com maior aderência aos formatos de entretenimento ganham destaque,
    // desempatando pela ordenação selecionada (views, crescimento/engajamento ou data).
    filtered.sort((a, b) => {
      // Prioridade 1: se um tem score de entretenimento relevante e o outro não
      const entDiff = (b.entertainment_score || 0) - (a.entertainment_score || 0)
      if (Math.abs(entDiff) >= 15) {
        return entDiff
      }

      // Desempate / ordenação pelo critério escolhido pelo criador
      if (sort === 'views') {
        const vDiff = (b.views_count || 0) - (a.views_count || 0)
        if (vDiff !== 0) return vDiff
        return entDiff
      } else if (sort === 'engagement' || sort === 'growth') {
        const gDiff = (b.growth_score || 0) - (a.growth_score || 0)
        if (gDiff !== 0) return gDiff
        return entDiff
      } else if (sort === 'recent') {
        const tDiff = new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        if (tDiff !== 0) return tDiff
        return entDiff
      }

      // Default: views
      return (b.views_count || 0) - (a.views_count || 0)
    })

    const payload = {
      success: true,
      connected: true,
      source: 'youtube_data_api_v3',
      filters_applied: { platform, niche, period, sort },
      total_items: filtered.length,
      items: filtered,
    }

    // Salvar no cache
    globalThis.__hypeonRadarCache[cacheKey] = {
      time: nowTs,
      payload,
    }

    return e.json(200, payload)
  } catch (err) {
    return e.json(500, {
      success: false,
      error: 'Erro interno ao processar Radar Viral: ' + String(err),
      items: [],
    })
  }
})

// 3. GET /backend/v1/hypeon/limits
routerAdd('GET', '/backend/v1/hypeon/limits', (e) => {
  try {
    const records = e.app.findRecordsByFilter('hypeon_limits', '', 'tool_name', 50, 0)
    const list = records.map((r) => ({
      id: r.id,
      tool_id: r.getString('tool_id'),
      tool_name: r.getString('tool_name'),
      free_limit_daily: r.getInt('free_limit_daily'),
      pro_limit_daily: r.getInt('pro_limit_daily'),
      credit_cost: r.getInt('credit_cost'),
      is_active: r.getBool('is_active'),
      description: r.getString('description'),
    }))

    return e.json(200, {
      success: true,
      limits: list,
    })
  } catch (err) {
    return e.json(500, { success: false, error: String(err) })
  }
})

// 4. POST /backend/v1/hypeon/admin/update-limit
routerAdd('POST', '/backend/v1/hypeon/admin/update-limit', (e) => {
  try {
    const authRecord = e.auth
    if (!authRecord) {
      return e.json(401, { success: false, error: 'Autenticação necessária' })
    }

    const email = (authRecord.email || '').toLowerCase().trim()
    const isAdmin = Boolean(
      authRecord.getBool('is_admin') || email === 'juniorrodriguesjr123.jr@gmail.com',
    )
    if (!isAdmin) {
      return e.json(403, { success: false, error: 'Permissão negada (apenas administradores)' })
    }

    const body = e.requestInfo().body || {}
    const toolId = body.tool_id
    if (!toolId) {
      return e.json(400, { success: false, error: 'tool_id é obrigatório' })
    }

    let record
    try {
      record = e.app.findFirstRecordByData('hypeon_limits', 'tool_id', toolId)
    } catch (_) {
      return e.json(404, { success: false, error: 'Ferramenta não encontrada' })
    }

    if (body.free_limit_daily !== undefined) {
      record.set('free_limit_daily', parseInt(body.free_limit_daily, 10))
    }
    if (body.pro_limit_daily !== undefined) {
      record.set('pro_limit_daily', parseInt(body.pro_limit_daily, 10))
    }
    if (body.credit_cost !== undefined) {
      record.set('credit_cost', parseInt(body.credit_cost, 10))
    }
    if (body.is_active !== undefined) {
      record.set('is_active', Boolean(body.is_active))
    }
    if (body.description !== undefined) {
      record.set('description', String(body.description))
    }

    e.app.save(record)

    return e.json(200, {
      success: true,
      message: 'Limites da ferramenta atualizados com sucesso',
      tool: {
        tool_id: record.getString('tool_id'),
        tool_name: record.getString('tool_name'),
        free_limit_daily: record.getInt('free_limit_daily'),
        pro_limit_daily: record.getInt('pro_limit_daily'),
        credit_cost: record.getInt('credit_cost'),
        is_active: record.getBool('is_active'),
      },
    })
  } catch (err) {
    return e.json(500, { success: false, error: String(err) })
  }
})

// 5. GET /backend/v1/hypeon/usage-stats
routerAdd('GET', '/backend/v1/hypeon/usage-stats', (e) => {
  try {
    const authRecord = e.auth
    if (!authRecord) {
      return e.json(401, { success: false, error: 'Autenticação necessária' })
    }

    const email = (authRecord.email || '').toLowerCase().trim()
    const isAdmin = Boolean(
      authRecord.getBool('is_admin') || email === 'juniorrodriguesjr123.jr@gmail.com',
    )
    if (!isAdmin) {
      return e.json(403, { success: false, error: 'Permissão negada' })
    }

    let totalSaved = 0
    try {
      totalSaved = e.app.countRecords('viral_saved')
    } catch (_) {}

    let recentEvents = []
    try {
      const eventRecs = e.app.findRecordsByFilter(
        'events',
        "event_type ~ 'hypeon_'",
        '-created',
        20,
        0,
      )
      recentEvents = eventRecs.map((r) => ({
        id: r.id,
        event_type: r.getString('event_type'),
        user: r.getString('user'),
        metadata: JSON.parse(r.getString('metadata') || '{}'),
        created: r.getString('created'),
      }))
    } catch (_) {}

    let usageByTool = {
      clonador: 0,
      stories: 0,
      ideas: 0,
      analisador: 0,
      radar: 0,
    }
    const userTotals = {}
    try {
      const allUsage = e.app.findRecordsByFilter('hypeon_usage', '', '-date', 500, 0)
      for (let i = 0; i < allUsage.length; i++) {
        const u = allUsage[i]
        const tid = u.getString('tool_id')
        const cnt = u.getInt('count') || 0
        const uid = u.getString('user')
        usageByTool[tid] = (usageByTool[tid] || 0) + cnt
        if (uid) {
          userTotals[uid] = (userTotals[uid] || 0) + cnt
        }
      }
    } catch (_) {}

    // Radar Viral conta também referências salvas como consumo de curadoria
    usageByTool['radar'] = totalSaved

    // Top usuários consumidores
    const topUsersList = []
    const sortedUserIds = Object.keys(userTotals)
      .sort((a, b) => userTotals[b] - userTotals[a])
      .slice(0, 5)
    for (let j = 0; j < sortedUserIds.length; j++) {
      const uid = sortedUserIds[j]
      let uEmail = 'Usuário ' + uid.slice(0, 5)
      let uName = ''
      try {
        const uRec = e.app.findRecordById('users', uid)
        if (uRec) {
          uEmail = uRec.getString('email') || uEmail
          uName = uRec.getString('name') || ''
        }
      } catch (_) {}
      topUsersList.push({
        user_id: uid,
        email: uEmail,
        name: uName,
        total_generations: userTotals[uid],
      })
    }

    let totalProjects = 0
    try {
      totalProjects = e.app.countRecords('hypeon_projects')
    } catch (_) {}

    // Status da fonte YouTube (cache, data e erros recentes)
    const ytKey = ($os.getenv('YOUTUBE_API_KEY') || '').trim()
    const cacheKeys = globalThis.__hypeonRadarCache
      ? Object.keys(globalThis.__hypeonRadarCache)
      : []
    let lastCollectionTime = null
    for (let k = 0; k < cacheKeys.length; k++) {
      const entry = globalThis.__hypeonRadarCache[cacheKeys[k]]
      if (entry && entry.time) {
        if (!lastCollectionTime || entry.time > lastCollectionTime) {
          lastCollectionTime = entry.time
        }
      }
    }

    const youtubeStatus = {
      connected: Boolean(ytKey && ytKey.length > 20),
      has_key: Boolean(ytKey),
      key_preview: ytKey ? `${ytKey.slice(0, 6)}...${ytKey.slice(-4)}` : 'Não configurada',
      cache_entries_count: cacheKeys.length,
      last_collection_at: lastCollectionTime ? new Date(lastCollectionTime).toISOString() : null,
      recent_errors_count: 0,
    }

    return e.json(200, {
      success: true,
      stats: {
        total_saved_videos: totalSaved,
        total_projects: totalProjects,
        recent_events: recentEvents,
        active_tools_count: 7,
        planned_tools_count: 1,
        usage_by_tool: usageByTool,
        top_users: topUsersList,
        youtube_source_status: youtubeStatus,
      },
    })
  } catch (err) {
    return e.json(500, { success: false, error: String(err) })
  }
})
