var router = require('express').Router();
const server = require('../../server.js')
const route_name = "/users/mail-exist"
server.logger(" [INFO] /api" + route_name + " route loaded !")

router.get('', function (req, res) {
    ipInfo = server.ip(req);
      var forwardedIpsStr = req.header('x-forwarded-for');
  var IP = '';

  if (forwardedIpsStr) {
     IP = forwardedIps = forwardedIpsStr.split(',')[0];  
  }
  server.logger(' [DEBUG] GET /api' + route_name + ' from ' + IP + ` with uuid ${req.query.uuid}`)
    var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
    server.con.query(sql, function (err, result) {
      if (err) {server.logger(" [ERROR] Database error\n  " + err)};
      if (result.length == 0) {
        return res.json({'error': true, 'code': 404})
      } else {
        if (result[0].token == req.query.token) {
            var mail = req.query.mail
            if (mail == undefined) {return res.json({'error': true, 'msg': "Mail query is required", "code": 101})}
            if (mail == "") {return res.json({'error': true, 'msg': "Mail query is required", "code": 102})}
            var sql = `SELECT mail FROM users WHERE mail = '${mail}'`;
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