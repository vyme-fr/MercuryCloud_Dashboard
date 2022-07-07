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
          var sql = `INSERT INTO mc_products (id, name, description, price, cpu, cpu_pinning, ram, disk, swap, io, egg, startup_command, env) VALUES('${server.crypto.randomBytes(3).toString('hex')}', '${req.body.name}', '${req.body.description}', '${req.body.price}', '${req.body.cpu}', '${req.body.cpu_pinning}', '${req.body.ram}', '${req.body.disk}', '${req.body.swap}', '${req.body.io}', '${req.body.egg}', '${req.body.startup_command}', '${req.body.env}')`;
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