var router = require('express').Router();
const server = require('../../server.js')
var jsonParser = server.parser.json()
server.logger(" [INFO] /api/delete-user route loaded !")

router.delete('', jsonParser, function (req, res) {
    ipInfo = server.ip(req);
    var response = "OK"
    var error = false
    var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
    server.con.query(sql, function (err, result) {
      if (err) {server.logger(" [ERROR] Database error\n  " + err)};
      if (result.length == 0) {
        returnres.json({'error': true, 'code': 404})
      } else {
        if (result[0].token === req.query.token) {
          var sql = `DELETE FROM users WHERE uuid='${req.body.user_uuid}'`;
          server.con.query(sql, function (err, result) {
              if (err) {server.logger(" [ERROR] Database error\n  " + err), error = true, response = "Database error"};
          });
          server.logger(" [DEBUG] User " + toString(req.body.user_uuid) + " deleted by " + toString(req.query.uuid) + " !")
          return res.json({"error": error, "response": response});
        } else {
          return res.json({'error': true, 'code': 403})
        }
      }
    });
  })

module.exports = router;