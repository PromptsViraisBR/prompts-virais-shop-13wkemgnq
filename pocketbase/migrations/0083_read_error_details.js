migrate(
  (app) => {
    try {
      const ev = app.findRecordById('events', 'somoyzfvo0haw7a')
      const meta = JSON.parse(ev.getString('metadata') || '{}')

      // Divide o erro em pedaços e salva num novo evento
      const fullErr = meta.error || ''
      const ev2 = new Record(app.findCollectionByNameOrId('events'))
      ev2.set('event_type', 'diag_0083_error_details')
      ev2.set('session_id', fullErr.slice(0, 100))
      ev2.set(
        'metadata',
        JSON.stringify({
          err_part1: fullErr.slice(0, 200),
          err_part2: fullErr.slice(200, 400),
          err_part3: fullErr.slice(400, 600),
          clone_status: meta.clone_status,
          clone_raw: meta.clone_raw,
        }),
      )
      app.save(ev2)
    } catch (e) {}
  },
  (app) => {
    try {
      const evs = app.findRecordsByFilter(
        'events',
        "event_type = 'diag_0083_error_details'",
        '',
        10,
        0,
      )
      for (let i = 0; i < evs.length; i++) app.delete(evs[i])
    } catch (_) {}
  },
)
