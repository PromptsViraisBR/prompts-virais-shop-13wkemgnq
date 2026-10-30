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

    // Cache simples em memória usando o objeto global de cache
    const cacheKey = `yt_radar_${platform}_${niche}_${period}_${sort}`
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

    // Mapeamento semântico dos 16 nichos para termos de busca Shorts Brasil
    const nicheQueries = {
      all: 'shorts viral brasil',
      historias: '#historias #relatos shorts brasil',
      terror: '#terror #suspense shorts brasil',
      suspense: '#suspense #mistério shorts brasil',
      misterio: '#misterio #curiosidades shorts brasil',
      humor: '#humor #comedia shorts brasil',
      comedia: '#comedia #humor shorts brasil',
      curiosidades: '#curiosidades #fatos shorts brasil',
      ia: '#ia #inteligenciaartificial shorts brasil',
      animacoes: '#animacao shorts brasil',
      personagens: '#personagens shorts brasil',
      animais: '#pets #animais shorts brasil',
      relacionamentos: '#relacionamento shorts brasil',
      motivacao: '#motivacao #reflexao shorts brasil',
      conhecimento: '#educacao #conhecimento shorts brasil',
      tecnologia: '#tecnologia #tech shorts brasil',
      experimentos: '#experimentos shorts brasil',
      satisfatorios: '#satisfatorio #asmr shorts brasil',
      outros: 'viral shorts brasil',
    }
    const queryTerm = nicheQueries[niche] || `${niche} shorts brasil`

    // Período
    let daysAgo = 7
    if (period === '24h') daysAgo = 1
    if (period === '30d') daysAgo = 30
    const publishedAfter = new Date(nowTs - daysAgo * 24 * 60 * 60 * 1000).toISOString()

    // Ordenação do search
    let ytOrder = 'viewCount'
    if (sort === 'recent') ytOrder = 'date'
    if (sort === 'growth' || sort === 'engagement') ytOrder = 'relevance'

    // 1. Busca por vídeos curtos (Shorts) no Brasil
    const searchUrl =
      'https://www.googleapis.com/youtube/v3/search?' +
      'part=snippet&type=video&videoDuration=short&maxResults=24' +
      '&regionCode=BR' +
      '&relevanceLanguage=pt' +
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
        connected: false,
        error: 'A YouTube Data API retornou erro HTTP ' + searchRes.statusCode,
        filters_applied: { platform, niche, period, sort },
        items: [],
      })
    }

    const searchData = JSON.parse(searchRes.raw)
    const items = searchData.items || []
    const videoIds = items.map((it) => it.id && it.id.videoId).filter(Boolean)

    // 2. Buscar estatísticas reais completas (views, likes, comments) via /videos
    let statsMap = {}
    if (videoIds.length > 0) {
      const statsUrl =
        'https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=' +
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
          statsMap[s.id] = {
            statistics: s.statistics || {},
            snippet: s.snippet || {},
            contentDetails: s.contentDetails || {},
          }
        }
      }
    }

    // 3. Formatar vídeos com dados 100% REAIS
    let formatted = items
      .map((it) => {
        const vId = it.id?.videoId
        if (!vId) return null

        const details = statsMap[vId] || {}
        const st = details.statistics || {}
        const sn = details.snippet || it.snippet || {}

        const views = parseInt(st.viewCount || '0', 10)
        const likes = parseInt(st.likeCount || '0', 10)
        const comments = parseInt(st.commentCount || '0', 10)

        // Score de engajamento calculado sobre métricas reais
        const engagementRatio = views > 0 ? ((likes + comments * 2) / views) * 100 : 0
        const growthScore = Math.min(
          100,
          Math.max(10, Math.round(engagementRatio * 8 + Math.log10(views + 1) * 7)),
        )

        return {
          id: vId,
          external_id: vId,
          platform: 'youtube',
          platform_name: 'YouTube Shorts',
          title: sn.title || it.snippet?.title || 'Short Sem Título',
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
          author_name: sn.channelTitle || it.snippet?.channelTitle || 'Canal',
          author_handle:
            '@' +
            (sn.channelTitle || it.snippet?.channelTitle || 'canal')
              .replace(/\s+/g, '')
              .toLowerCase(),
          channel_id: sn.channelId || it.snippet?.channelId || '',
          views_count: views,
          likes_count: likes,
          comments_count: comments,
          shares_count: null, // YouTube não expõe compartilhamentos na v3
          niche: niche === 'all' ? 'curiosidades' : niche,
          country: 'BR',
          language: 'pt',
          growth_score: growthScore,
          published_at: sn.publishedAt || it.snippet?.publishedAt || '',
        }
      })
      .filter(Boolean)

    // Reordenar em memória se necessário
    if (sort === 'views') {
      formatted.sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    } else if (sort === 'engagement' || sort === 'growth') {
      formatted.sort((a, b) => (b.growth_score || 0) - (a.growth_score || 0))
    } else if (sort === 'recent') {
      formatted.sort(
        (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
      )
    }

    const payload = {
      success: true,
      connected: true,
      source: 'youtube_data_api_v3',
      filters_applied: { platform, niche, period, sort },
      total_items: formatted.length,
      items: formatted,
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

    return e.json(200, {
      success: true,
      stats: {
        total_saved_videos: totalSaved,
        recent_events: recentEvents,
        active_tools_count: 3,
        planned_tools_count: 5,
      },
    })
  } catch (err) {
    return e.json(500, { success: false, error: String(err) })
  }
})
