var router = require('express').Router();
const server = require('../../server.js')
server.logger(" [INFO] /api/mail-exist route loaded !")


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