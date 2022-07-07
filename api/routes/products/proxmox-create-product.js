var router = require('express').Router();
const server = require('../../server.js')
var jsonParser = server.parser.json()
server.logger(" [INFO] /api/products/ptero-create-product route loaded !")

router.post('', jsonParser, function (req, res) {
  ipInfo = server.ip(req);
  server.logger(' [DEBUG] GET from : ' + ipInfo.clientIp.split("::ffff:")[1] + `, ${req.query.uuid}`)
  var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
  server.con.query(sql, function (err, result) {
    if (err) {server.logger(" [ERROR] Database error\n  " + err)};
    if (result.length == 0) {
      return res.json({'error': true, 'code': 404})
    } else {
      if (result[0].token === req.query.token) {
        var sql = `INSERT INTO proxmox_products (id, name, description, price, template_vmid, cores, ram, storage, disk_size, add_conf) VALUES('${server.crypto.randomBytes(3).toString('hex')}', '${req.body.name}', '${req.body.description}', '${req.body.price}', '${req.body.template_vmid}', '${req.body.cores}', '${req.body.ram}', '${req.body.storage}', '${req.body.disk_size}', '${req.body.add_conf}')`;
        server.con.query(sql, function (err, result) {
            if (err) {server.logger(" [ERROR] Database error\n  " + err)};
        });
        server.logger(" [DEBUG] Product " + toString(req.body.name) + " created !")
        return res.json({"error": false, "response": "OK"});
      } else {
        return res.json({'error': true, 'code': 403})
      }
    }
  });
})

module.exports = router;