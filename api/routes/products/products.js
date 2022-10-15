var router = require('express').Router();
const server = require('../../server.js')
var jsonParser = server.parser.json()
const route_name = "/products"
const permissions_manager = require("../../utils/permissions-manager.js")
server.logger(" [INFO] /api" + route_name + " route loaded !")

// GET LIST //

router.get('', function (req, res) {
  ipInfo = server.ip(req);

  var IP = req.socket.remoteAddress;
  server.logger(' [DEBUG] GET /api' + route_name + ' from ' + IP)
  var sql = `SELECT * FROM products`;
  server.con.query(sql, function (err, result) {
    if (err) { server.logger(" [ERROR] Database error\n  " + err) };
    products = []
    for (var i = 0; i < result.length; i++) {
      products.push({
        "id": result[i].id,
        "category": result[i].category,
        "name": result[i].name,
        "description": result[i].description,
        "price": result[i].price,
        "configuration": JSON.parse(result[i].configuration)
      })
    }
    return res.json({ 'error': false, 'data': products })
  });
})

// POST NEW PRODUCT //

router.post('', jsonParser, function (req, res) {
  ipInfo = server.ip(req);
  var IP = req.socket.remoteAddress;
  server.logger(' [DEBUG] POST /api' + route_name + ' from ' + IP + ` with uuid ${req.query.uuid}`)
  var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
  server.con.query(sql, function (err, result) {
    if (err) { server.logger(" [ERROR] Database error\n  " + err) };
    if (result.length == 0) {
      return res.json({ 'error': true, 'code': 404 })
    } else {
      if (result[0].token === req.query.token) {
        permissions_manager.has_permission(req.query.uuid, "CREATEPRODUCT").then(function (result) {
          if (result) {
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
              var sql = `INSERT INTO products (id, category, name, description, price, configuration) VALUES('${server.crypto.randomBytes(3).toString('hex')}', 'pterodactyl', '${req.body.name}', '${req.body.description}', '${req.body.price}', '${JSON.stringify(configuration)}')`;
              server.con.query(sql, function (err, result) {
                if (err) { server.logger(" [ERROR] Database error\n  " + err) };
              });
              server.logger(" [DEBUG] Product " + req.body.name + " created from " + IP + " !")
              return res.json({ "error": false, "response": "OK" });
            } else if (req.body.category == "proxmox") {
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
                if (err) { server.logger(" [ERROR] Database error\n  " + err) };
              });
              server.logger(" [DEBUG] Product " + req.body.name + " created from " + IP + " !")
              return res.json({ "error": false, "response": "OK" });
            }
          } else {
            return res.json({
              "error": true,
              "code": 403
            })
          }
        })
      } else {
        return res.json({ 'error': true, 'code': 403 })
      }
    }
  });
})

module.exports = router;