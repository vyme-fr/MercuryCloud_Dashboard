var router = require('express').Router();
const server = require('../../server.js')
const route_name = "/roles/roles-list"
const permissions_manager = require("../../utils/permissions-manager")
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
        permissions_manager.has_permission(req.query.uuid, "LISTROLES").then(function(result) {
          if (result) {
            var sql = `SELECT * FROM roles`;
            server.con.query(sql, function (err, result) {
                if (err) {server.logger(" [ERROR] Database error\n  " + err)};
                roles = []
                for(var i= 0; i < result.length; i++)
                {
                    roles.push({
                    "id": result[i].id,
                    "name": result[i].name
                  })
                }
                return res.json({'error': false, 'roles': roles})
              });
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