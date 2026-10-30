/**
 * HYPEON Sources & Radar Engine (PocketBase Hook)
 *
 * Provê endpoints server-side para o HYPEON:
 * 1. GET  /backend/v1/hypeon/sources-status   -> status das fontes (YouTube Data API, etc.)
 * 2. GET  /backend/v1/hypeon/radar            -> feed do Radar Viral com dados reais
 * 3. GET  /backend/v1/hypeon/limits           -> lista de limites por ferramenta
 * 4. POST /backend/v1/hypeon/admin/update-limit -> atualização de limites (admin)
 * 5. GET  /backend/v1/hypeon/usage-stats      -> estatísticas de uso (admin)
 *
 * REGRA SAGRADA DE DADOS REAIS:
 * Nunca retorna vídeos ou métricas fictícios como se fossem reais.
 * Se YOUTUBE_API_KEY ou fonte correspondente não estiver configurada nos segredos,
 * a API retorna status `connected: false` com instrução clara e lista vazia de vídeos.
 */

// 1. GET /backend/v1/hypeon/sources-status
routerAdd('GET', '/backend/v1/hypeon/sources-status', (e) => {
  try {
    const ytKey = $os.getenv('YOUTUBE_API_KEY') || ''
    const ttKey = $os.getenv('TIKTOK_API_KEY') || ''
    const igKey = $os.getenv('INSTAGRAM_API_KEY') || ''

    return e.json(200, {
      success: true,
      sources: {
        youtube: {
          id: 'youtube',
          name: 'YouTube Data API v3 (Shorts)',
          connected: Boolean(ytKey && ytKey.trim().length > 5),
          required_secret: 'YOUTUBE_API_KEY',
          type: 'official_api',
          description:
            'Busca oficial de Shorts virais, estatísticas reais de visualizações e curtidas',
        },
        tiktok: {
          id: 'tiktok',
          name: 'TikTok Commercial / Research API',
          connected: Boolean(ttKey && ttKey.trim().length > 5),
          required_secret: 'TIKTOK_API_KEY',
          type: 'partner_api',
          description: 'Tendências e vídeos virais do TikTok por nicho',
        },
        instagram: {
          id: 'instagram',
          name: 'Instagram Graph API (Reels)',
          connected: Boolean(igKey && igKey.trim().length > 5),
          required_secret: 'INSTAGRAM_API_KEY',
          type: 'meta_api',
          description: 'Reels públicos de alto engajamento',
        },
      },
      message: ytKey
        ? 'Fontes de tendências ativas'
        : 'Nenhuma chave de API de vídeo configurada nos segredos',
    })
  } catch (err) {
    return e.json(500, { success: false, error: String(err) })
  }
})

// 2. GET /backend/v1/hypeon/radar
routerAdd('GET', '/backend/v1/hypeon/radar', (e) => {
  try {
    const platform = e.request.url.query().get('platform') || 'all' // all | tiktok | instagram | youtube | facebook
    const niche = e.request.url.query().get('niche') || 'all'
    const period = e.request.url.query().get('period') || '7d' // 24h | 7d | 30d
    const sort = e.request.url.query().get('sort') || 'recent' // recent | views | engagement | growth

    const ytKey = $os.getenv('YOUTUBE_API_KEY') || ''
    const isYtConnected = Boolean(ytKey && ytKey.trim().length > 5)

    // Se não há fonte real configurada, cumpre a regra de ouro:
    // NUNCA gerar dados fake! Retornar aviso honesto e estruturado.
    if (!isYtConnected) {
      return e.json(200, {
        success: true,
        connected: false,
        source: null,
        message:
          'Fonte de tendências não conectada — conecte a YouTube Data API (YOUTUBE_API_KEY) nos segredos do Skip Cloud para ver vídeos e métricas reais.',
        required_secret: 'YOUTUBE_API_KEY',
        filters_applied: { platform, niche, period, sort },
        total_items: 0,
        items: [],
      })
    }

    // Provider real YouTube Data API v3
    // Mapeamento de query por nicho e plataforma
    let queryTerm = 'shorts viral'
    if (niche && niche !== 'all') {
      const nicheTerms = {
        historias: '#historias #relatos shorts',
        terror: '#terror #suspense shorts',
        comedia: '#comedia #humor shorts',
        curiosidades: '#curiosidades #fatos shorts',
        ia: '#ia #ai #tecnologia shorts',
        animacoes: '#animacao shorts',
        personagens: '#personagens shorts',
        animais: '#pets #animais shorts',
        relacionamentos: '#relacionamento shorts',
        motivacao: '#motivacao shorts',
        conhecimento: '#educacao #conhecimento shorts',
        tecnologia: '#tecnologia shorts',
        experimentos: '#experimentos shorts',
        satisfatorios: '#satisfatorio #asmr shorts',
        outros: 'viral shorts',
      }
      queryTerm = nicheTerms[niche] || `${niche} shorts viral`
    }

    // Cálculo da data publishedAfter
    const now = new Date()
    let daysAgo = 7
    if (period === '24h') daysAgo = 1
    if (period === '30d') daysAgo = 30
    const publishedAfter = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString()

    let ytOrder = 'date'
    if (sort === 'views') ytOrder = 'viewCount'
    if (sort === 'growth' || sort === 'engagement') ytOrder = 'relevance'

    const searchUrl =
      'https://www.googleapis.com/youtube/v3/search?' +
      'part=snippet&type=video&videoDuration=short&maxResults=24' +
      '&q=' +
      encodeURIComponent(queryTerm) +
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
      return e.json(502, {
        success: false,
        connected: true,
        error: 'Falha ao consultar a YouTube Data API: HTTP ' + searchRes.statusCode,
        details: searchRes.raw,
        items: [],
      })
    }

    const searchData = JSON.parse(searchRes.raw)
    const items = searchData.items || []
    const videoIds = items.map((it) => it.id && it.id.videoId).filter(Boolean)

    // Buscar métricas reais (views, likes, comments) via videos endpoint
    let statsMap = {}
    if (videoIds.length > 0) {
      const statsUrl =
        'https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=' +
        encodeURIComponent(videoIds.join(',')) +
        '&key=' +
        encodeURIComponent(ytKey)

      const statsRes = $http.send({
        url: statsUrl,
        method: 'GET',
        timeout: 15,
      })

      if (statsRes.statusCode === 200) {
        const statsData = JSON.parse(statsRes.raw)
        const statItems = statsData.items || []
        for (const s of statItems) {
          statsMap[s.id] = s.statistics || {}
        }
      }
    }

    // Formatar itens para a resposta limpa e padronizada do Radar
    const formatted = items.map((it) => {
      const vId = it.id?.videoId
      const st = statsMap[vId] || {}
      const views = parseInt(st.viewCount || '0', 10)
      const likes = parseInt(st.likeCount || '0', 10)
      const comments = parseInt(st.commentCount || '0', 10)

      // Score de engajamento calculado com base em métricas reais
      const engagementRatio = views > 0 ? ((likes + comments * 2) / views) * 100 : 0
      const growthScore = Math.min(100, Math.round(engagementRatio * 8 + Math.log10(views + 1) * 6))

      return {
        id: vId,
        external_id: vId,
        platform: 'youtube', // no futuro: tiktok / instagram conforme chave presente
        platform_name: 'YouTube Shorts',
        title: it.snippet?.title || 'Short Sem Título',
        description: it.snippet?.description || '',
        thumbnail_url:
          it.snippet?.thumbnails?.high?.url ||
          it.snippet?.thumbnails?.medium?.url ||
          it.snippet?.thumbnails?.default?.url ||
          '',
        original_url: 'https://www.youtube.com/shorts/' + vId,
        author_name: it.snippet?.channelTitle || 'Canal',
        author_handle: '@' + (it.snippet?.channelTitle || '').replace(/\s+/g, '').toLowerCase(),
        views_count: views,
        likes_count: likes,
        comments_count: comments,
        shares_count: null, // YouTube não expõe compartilhamentos via API v3
        niche: niche === 'all' ? 'curiosidades' : niche,
        country: 'BR',
        language: 'pt',
        growth_score: growthScore,
        published_at: it.snippet?.publishedAt || '',
      }
    })

    return e.json(200, {
      success: true,
      connected: true,
      source: 'youtube_data_api_v3',
      filters_applied: { platform, niche, period, sort },
      total_items: formatted.length,
      items: formatted,
    })
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

    // Contagem de vídeos salvos
    let totalSaved = 0
    try {
      totalSaved = e.app.countRecords('viral_saved')
    } catch (_) {}

    // Eventos recentes do HYPEON
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

    return e.json(200, {
      success: true,
      stats: {
        total_saved_videos: totalSaved,
        recent_events: recentEvents,
        active_tools_count: 3, // radar, tendencias, biblioteca
        planned_tools_count: 5, // clonador, stories, ideas, analisador, cenas
      },
    })
  } catch (err) {
    return e.json(500, { success: false, error: String(err) })
  }
})
