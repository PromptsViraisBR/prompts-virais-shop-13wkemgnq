migrate(
  (app) => {
    try {
      const recs = app.findRecordsByFilter(
        'events',
        "event_type = 'hypeon_radar_e2e_test'",
        '',
        10,
        0,
      )
      for (const r of recs) {
        app.delete(r)
      }

      const ytKey = ($os.getenv('YOUTUBE_API_KEY') || '').trim()
      const queryTerm = 'shorts viral brasil'
      const nowTs = Date.now()
      const publishedAfter = new Date(nowTs - 7 * 24 * 60 * 60 * 1000).toISOString()

      const searchUrl =
        'https://www.googleapis.com/youtube/v3/search?' +
        'part=snippet&type=video&videoDuration=short&maxResults=5' +
        '&regionCode=BR' +
        '&relevanceLanguage=pt' +
        '&q=' +
        encodeURIComponent(queryTerm) +
        '&order=viewCount' +
        '&publishedAfter=' +
        encodeURIComponent(publishedAfter) +
        '&key=' +
        encodeURIComponent(ytKey)

      const searchRes = $http.send({
        url: searchUrl,
        method: 'GET',
        timeout: 10,
      })

      const searchData = JSON.parse(searchRes.raw)
      const items = searchData.items || []
      const videoIds = items.map((it) => it.id && it.id.videoId).filter(Boolean)

      let statsMap = {}
      if (videoIds.length > 0) {
        const statsUrl =
          'https://www.googleapis.com/youtube/v3/videos?part=statistics&id=' +
          encodeURIComponent(videoIds.join(',')) +
          '&key=' +
          encodeURIComponent(ytKey)

        const statsRes = $http.send({
          url: statsUrl,
          method: 'GET',
          timeout: 10,
        })

        if (statsRes.statusCode === 200) {
          const statsData = JSON.parse(statsRes.raw)
          const statItems = statsData.items || []
          for (const s of statItems) {
            statsMap[s.id] = s.statistics || {}
          }
        }
      }

      const first = items[0]
      const vId = first?.id?.videoId
      const st = statsMap[vId] || {}

      const eventsCol = app.findCollectionByNameOrId('events')
      const rec = new Record(eventsCol)
      rec.set('event_type', 'hypeon_radar_e2e_test')
      rec.set(
        'metadata',
        JSON.stringify({
          search_status: searchRes.statusCode,
          total_items: items.length,
          sample_id: vId,
          sample_title: first?.snippet?.title || null,
          sample_channel: first?.snippet?.channelTitle || null,
          sample_views: parseInt(st.viewCount || '0', 10),
          sample_likes: parseInt(st.likeCount || '0', 10),
          sample_comments: parseInt(st.commentCount || '0', 10),
          sample_embed: 'https://www.youtube-nocookie.com/embed/' + vId,
        }),
      )
      app.save(rec)
    } catch (err) {
      const eventsCol = app.findCollectionByNameOrId('events')
      const rec = new Record(eventsCol)
      rec.set('event_type', 'hypeon_radar_e2e_test')
      rec.set('metadata', JSON.stringify({ error: String(err) }))
      app.save(rec)
    }
  },
  () => {},
)
