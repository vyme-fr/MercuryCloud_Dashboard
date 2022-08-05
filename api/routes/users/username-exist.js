var router = require('express').Router();
const server = require('../../server.js')
const route_name = "/users/usernale-exist"
server.logger(" [INFO] /api" + route_name + " route loaded !")

router.get('', function (req, res) {
    ipInfo = server.ip(req);
    server.logger(' [DEBUG] GET from : ' + ipInfo.clientIp.split("::ffff:")[1] + `, ${req.query.uuid}`)
    var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
    server.con.query(sql, function (err, result) {
      if (err) {server.logger(" [ERROR] Database error\n  " + err)};
      if (result.length == 0) {
        return res.json({'error': true, 'code': 404})
      } else {
        if (result[0].token == req.query.token) {
            var username = req.query.username
            if (username == undefined) {return res.json({'error': true, 'msg': "Username query is required", "code": 101})}
            if (username == "") {return res.json({'error': true, 'msg': "Username query is required", "code": 102})}
            var sql = `SELECT username FROM users WHERE username = '${username}'`;
            server.con.query(sql, function (err, result) {
                if (err) {server.logger(" [ERROR] Database error\n  " + err)};
                if (result.length > 0) {
                  return res.json({'error': false, 'exist': true, "code": 100})
                } else {
                  return res.json({'error': false, 'exist': false, "code": 100})
                }
            });
        } else {
          return res.json({'error': true, 'code': 403})
        }
      }
    });
  })

module.exports = router;