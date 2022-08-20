var router = require('express').Router();
const server = require('../../server.js')
var jsonParser = server.parser.json()
const route_name = "/roles/edit-role"
server.logger(" [INFO] /api" + route_name + " route loaded !")

router.post('', jsonParser, function (req, res) {
  ipInfo = server.ip(req);
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
        var permissions = ''
        if (req.body.permissions.length < 1) {
          permissions = "NONE"
        } else {
          permissions = req.body.permissions
        }
        var sql = `UPDATE roles SET name = '${req.body.name}', permissions = '${permissions}' WHERE id = '${req.body.id}';`;
        server.con.query(sql, function (err, result) {
          if (err) {server.logger(" [ERROR] Database error\n  " + err); return res.json({"error": true, "msg": "Database error : " + err})};
        });
        server.logger(" [DEBUG] Role " + req.body.name + " updated from " + IP + " with uuid " + req.query.uuid + " !")
        return res.json({"error": false, "response": "OK"});
      } else {
        return res.json({'error': true, 'code': 403})
      }
    }
  });
})

module.exports = router;