var router = require('express').Router();
const server = require('../../server.js')
server.logger(" [INFO] /api/users route loaded !")

router.get('', function (req, res) {
  ipInfo = server.ip(req);
  server.logger(' [DEBUG] GET from : ' + ipInfo.clientIp.split("::ffff:")[1] + `, ${req.query.uuid}`)
  var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
  server.con.query(sql, function (err, result) {
    if (err) {server.logger(" [ERROR] Database error\n  " + err)};
    if (result.length == 0) {
      return res.json({'error': true, 'code': 404})
    } else {
      if (result[0].token === req.query.token) {
        var sql = `SELECT * FROM users`;
        server.con.query(sql, function (err, result) {
            if (err) {server.logger(" [ERROR] Database error\n  " + err)};
            users = []
            for(var i= 0; i < result.length; i++)
            {
              users.push({
                "uuid": result[i].uuid,
                "username": result[i].username,
                "mail": result[i].mail,
                "balance": result[i].balance,
                "tickets": result[i].tickets,
                "services": result[i].services,
                "suspended_services": result[i].suspended_services,
                "alerts": result[i].alerts
              })
            }
            return res.json({'error': false, 'users': users})
          });
      } else {
        return res.json({'error': true, 'code': 403})
      }
    }
  });
})

module.exports = router;