var router = require('express').Router();
const server = require('../../server.js')
var jsonParser = server.parser.json()
const route_name = "/roles/create-role"
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
          permissions = "NONE, NONE"
        } else {
          permissions = req.body.permissions
        }
        var sql = `INSERT INTO roles (id, name, permissions) VALUES('${server.crypto.randomBytes(3).toString('hex')}', '${req.body.name}', '${permissions}')`;
        server.con.query(sql, function (err, result) {
            if (err) {server.logger(" [ERROR] Database error\n  " + err)};
        });
        server.logger(" [DEBUG] Role " + req.body.name + " created from " + IP + " !") 
        return res.json({"error": false, "response": "OK"});
      } else {
        return res.json({'error': true, 'code': 403})
      }
    }
  });
})

module.exports = router;