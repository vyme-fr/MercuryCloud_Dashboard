var router = require('express').Router();
const server = require('../../server.js')
var jsonParser = server.parser.json()
const route_name = "/roles/delete-role"
const permissions_manager = require("../../utils/permissions-manager")
server.logger(" [INFO] /api" + route_name + " route loaded !")

router.delete('', jsonParser, function (req, res) {
  ipInfo = server.ip(req);
  var response = "OK"
  var error = false
  var forwardedIpsStr = req.header('x-forwarded-for');
  var IP = '';

  if (forwardedIpsStr) {
     IP = forwardedIps = forwardedIpsStr.split(',')[0];  
  }
  var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
  server.con.query(sql, function (err, result) {
    if (err) {server.logger(" [ERROR] Database error\n  " + err)};
    if (result.length == 0) {
      return res.json({'error': true, 'code': 404})
    } else {
      if (result[0].token === req.query.token) {
        permissions_manager.has_permission(req.query.uuid, "DELETEROLE").then(function(result) {
          if (result) {
            var sql = `DELETE FROM roles WHERE id='${req.body.id}'`;
            server.con.query(sql, function (err, result) {
                if (err) {server.logger(" [ERROR] Database error\n  " + err), error = true, response = "Database error"};
            });
            server.logger(" [DEBUG] Role " + req.body.id + " deleted from " + IP + " !")
            return res.json({"error": error, "response": response});
          } else {
            return res.json({
              "error": true,
              "code": 403
            })
          }
        })
      } else {
        return res.json({'error': true, 'code': 403})
      }
    }
  });
})

module.exports = router;