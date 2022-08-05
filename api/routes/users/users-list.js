var router = require('express').Router();
const server = require('../../server.js')
const route_name = "/users/users-list"
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
                "role": result[i].role,
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