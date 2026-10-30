migrate(
  (app) => {
    try {
      const ytKey = $os.getenv('YOUTUBE_API_KEY') || ''
      const keyPreview = ytKey ? `length=${ytKey.length}, starts=${ytKey.slice(0, 4)}` : 'missing'

      const testUrl =
        'https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=BR&maxResults=1&key=' +
        encodeURIComponent(ytKey)
      const res = $http.send({
        url: testUrl,
        method: 'GET',
        timeout: 10,
      })

      let parsed = null
      try {
        parsed = JSON.parse(res.raw)
      } catch (_) {}

      const eventsCol = app.findCollectionByNameOrId('events')
      const rec = new Record(eventsCol)
      rec.set('event_type', 'hypeon_yt_diagnostic')
      rec.set(
        'metadata',
        JSON.stringify({
          status: res.statusCode,
          key_present: Boolean(ytKey),
          key_preview: keyPreview,
          items_count: parsed?.items?.length || 0,
          error: parsed?.error || null,
          sample_title: parsed?.items?.[0]?.snippet?.title || null,
          sample_channel: parsed?.items?.[0]?.snippet?.channelTitle || null,
          sample_id: parsed?.items?.[0]?.id || null,
        }),
      )
      app.save(rec)
    } catch (err) {
      const eventsCol = app.findCollectionByNameOrId('events')
      const rec = new Record(eventsCol)
      rec.set('event_type', 'hypeon_yt_diagnostic')
      rec.set('metadata', JSON.stringify({ error: String(err) }))
      app.save(rec)
    }
  },
  () => {},
)
