permissions_manager.has_permission(req.query.uuid, "CREATEPRODUCT").then(function(result) {
    if (result) {
    } else {
      return res.json({
        "error": true,
        "code": 403
      })
    }
  })