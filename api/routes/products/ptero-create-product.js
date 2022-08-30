var router = require('express').Router();
const server = require('../../server.js')
var jsonParser = server.parser.json()
const route_name = "/products/ptero-create-product"
const permissions_manager = require("../../utils/permissions-manager.js")
server.logger(" [INFO] /api" + route_name + " route loaded !")

router.post('', jsonParser, function (req, res) {
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
        permissions_manager.has_permission(req.query.uuid, "CREATEPRODUCT").then(function(result) {
          if (result) {
            configuration = {
              'cpu': req.body.cpu,
              'cpu_pinning': req.body.cpu_pinning,
              'ram': req.body.ram,
              'disk': req.body.disk,
              'swap': req.body.swap,
              'io': req.body.io,
              'egg': req.body.egg,
              'startup_command': req.body.startup_command,
              'env': JSON.parse(req.body.env)
            } 
            var sql = `INSERT INTO products (id, category, name, description, price, configuration) VALUES('${server.crypto.randomBytes(3).toString('hex')}', 'pterodactyl', '${req.body.name}', '${req.body.description}', '${req.body.price}', '${JSON.stringify(configuration)}')`;
            server.con.query(sql, function (err, result) {
              if (err) {server.logger(" [ERROR] Database error\n  " + err)};
            });
            server.logger(" [DEBUG] Product " + req.body.name + " created from " + IP + " !") 
            return res.json({"error": false, "response": "OK"});
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