migrate(
  (app) => {
    try {
      const records = app.findRecordsByFilter('feedback', "name ~ 'DIAG_'", '-created', 50, 0)
      for (let i = 0; i < records.length; i++) {
        app.delete(records[i])
      }
    } catch (err) {}
  },
  (app) => {},
)
