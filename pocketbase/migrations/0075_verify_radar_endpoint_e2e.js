migrate(
  (app) => {
    try {
      const res = $http.send({
        url: 'http://127.0.0.1:8090/backend/v1/hypeon/radar?platform=youtube&niche=all&period=7d&sort=views',
        method: 'GET',
        timeout: 15,
      })

      let parsed = null
      try {
        parsed = JSON.parse(res.raw)
      } catch (_) {}

      const eventsCol = app.findCollectionByNameOrId('events')
      const rec = new Record(eventsCol)
      rec.set('event_type', 'hypeon_radar_e2e_test')
      rec.set(
        'metadata',
        JSON.stringify({
          status: res.statusCode,
          connected: parsed?.connected,
          source: parsed?.source,
          total_items: parsed?.total_items || 0,
          first_item_title: parsed?.items?.[0]?.title || null,
          first_item_channel: parsed?.items?.[0]?.author_name || null,
          first_item_views: parsed?.items?.[0]?.views_count || 0,
          first_item_likes: parsed?.items?.[0]?.likes_count || 0,
          first_item_comments: parsed?.items?.[0]?.comments_count || 0,
          first_item_embed: parsed?.items?.[0]?.embed_url || null,
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
