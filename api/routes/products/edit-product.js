var router = require('express').Router();
const server = require('../../server.js')
var jsonParser = server.parser.json()
const route_name = "/products/edit-product"
server.logger(" [INFO] /api" + route_name + " route loaded !")

router.post('', jsonParser, function (req, res) {
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
            var configuration = {}
            if (req.body.category == "pterodactyl") {
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
            }
            if (req.body.category == "proxmox") {
                configuration = {
                    'node': req.body.node,
                    'template_vmid': req.body.template_vm,
                    'cores': req.body.cores,
                    'ram': req.body.ram,
                    'storage': req.body.storage,
                    'disk_size': req.body.disk_size,
                    'add_conf': req.body.add_conf
                  } 
            }
            var sql = `UPDATE products SET name = '${req.body.name}', description = '${req.body.description}', price = '${req.body.price}', configuration = '${JSON.stringify(configuration)}' WHERE id = '${req.body.id}';`;
            server.con.query(sql, function (err, result) {
                if (err) {server.logger(" [ERROR] Database error\n  " + err); return res.json({"error": true, "msg": "Database error : " + err})};
            });
            server.logger(" [DEBUG] Product " + req.body.name + " updated from " + IP + " !")
            return res.json({"error": false, "response": "OK"});
          } else {
            return res.json({'error': true, 'code': 403})
          }
        }
    });
  })

module.exports = router;