var router = require('express').Router();
const server = require('../../server.js')
var jsonParser = server.parser.json()
const route_name = "/products/proxmox-create-product"
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
        configuration = {
          'node': req.body.node,
          'template_vmid': req.body.template_vm,
          'cores': req.body.cores,
          'ram': req.body.ram,
          'storage': req.body.storage,
          'disk_size': req.body.disk_size,
          'add_conf': req.body.add_conf
        } 
        var sql = `INSERT INTO products (id, category, name, description, price, configuration) VALUES('${server.crypto.randomBytes(3).toString('hex')}', 'proxmox', '${req.body.name}', '${req.body.description}', '${req.body.price}', '${JSON.stringify(configuration)}')`;
        server.con.query(sql, function (err, result) {
            if (err) {server.logger(" [ERROR] Database error\n  " + err)};
        });
        server.logger(" [DEBUG] Product " + req.body.name + " created from " + IP + " !") 
        return res.json({"error": false, "response": "OK"});
      } else {
        return res.json({'error': true, 'code': 403})
      }
    }
  });
})

module.exports = router;