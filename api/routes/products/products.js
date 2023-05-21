const router = require('express').Router()
const server = require('../../server.js')
const jsonParser = server.parser.json()
const route_name = "/products"
const permissions_manager = require("../../utils/permissions-manager.js")
server.logger(" [INFO] /api" + route_name + " route loaded !")

// GET LIST //

router.get('', function (req, res) {
  const start = process.hrtime()
  let IP = ""
  if (req.headers['x-forwarded-for'] == undefined) {
    IP = req.socket.remoteAddress.replace("::ffff:", "")
  } else {
    IP = req.headers['x-forwarded-for'].split(',')[0]
  }
  const sql = `SELECT token FROM users WHERE uuid = '${req.cookies.uuid}'`;
  server.con.query(sql, function (err, result) {
    if (err) { server.logger(" [ERROR] Database error\n  " + err) }
    if (result.length === 0) {
      res.status(401);
      return res.json({ 'error': true, 'code': 401 })
    } else {
      if (result[0].token === req.cookies.token) {
        permissions_manager.has_permission(req.cookies.uuid, "LISTPRODUCTS").then(function (result) {
          if (result) {
            const sql = `SELECT * FROM products`;
            server.con.query(sql, function (err, result) {
              if (err) { server.logger(" [ERROR] Database error\n  " + err) }
              let products = []
              for (let i = 0; i < result.length; i++) {
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
          } else {
            res.status(403);
            return res.json({
              "error": true,
              "code": 403
            })
          }
        })
      } else {
        res.status(401);
        return res.json({ 'error': true, 'code': 401 })
      }
    }
  });
  res.on('finish', () => {
    const durationInMilliseconds = server.getDurationInMilliseconds(start)
    server.logger(` [DEBUG] ${req.method} ${route_name} [FINISHED] [FROM ${IP}] in ${durationInMilliseconds.toLocaleString()} ms`)
  })
})

// CREATE NEW PRODUCT //

router.post('', jsonParser, function (req, res) {
  const start = process.hrtime()
  let IP = ""
  if (req.headers['x-forwarded-for'] == undefined) {
    IP = req.socket.remoteAddress.replace("::ffff:", "")
  } else {
    IP = req.headers['x-forwarded-for'].split(',')[0]
  }
  server.logger(' [DEBUG] POST /api' + route_name + ' from ' + IP + ` with uuid ${req.cookies.uuid}`)
  const sql = `SELECT token FROM users WHERE uuid = '${req.cookies.uuid}'`;
  server.con.query(sql, function (err, result) {
    if (err) { server.logger(" [ERROR] Database error\n  " + err) }
    if (result.length === 0) {
      return res.json({ 'error': true, 'code': 404 })
    } else {
      if (result[0].token === req.cookies.token) {
        permissions_manager.has_permission(req.cookies.uuid, "CREATEPRODUCT").then(function (result) {
          if (result) {
            if (req.body.category === "pterodactyl") {
              const configuration = {
                'cpu': req.body.cpu,
                'cpu_pinning': req.body.cpu_pinning,
                'ram': req.body.ram,
                'disk': req.body.disk,
                'swap': req.body.swap,
                'io': req.body.io,
                'egg': req.body.egg,
                'startup_command': req.body.startup_command,
                'ipv6': req.body.ipv6,
                'ipv4': req.body.ipv4,
                'env': JSON.parse(req.body.env)
              }
              const sql = `INSERT INTO products (id, category, name, description, price, configuration, available_upgrades) VALUES('${server.crypto.randomBytes(3).toString('hex')}', 'pterodactyl', '${req.body.name}', '${req.body.description}', '${req.body.price}', '${JSON.stringify(configuration)}', '${req.body.upgrades}')`;
              server.con.query(sql, function (err) {
                if (err) { server.logger(" [ERROR] Database error\n  " + err) }
              });
              server.logger(" [DEBUG] Product " + req.body.name + " created from " + IP + " !")
              return res.json({ "error": false, "response": "OK" });
            } else if (req.body.category === "proxmox") {
              const configuration = {
                'node': req.body.node,
                'template_vmid': req.body.template_vm,
                'cores': req.body.cores,
                'ram': req.body.ram,
                'storage': req.body.storage,
                'disk_size': req.body.disk_size,
                'sup_bkp': req.body.sup_bkp,
                'ipv6': req.body.ipv6,
                'ipv4': req.body.ipv4,
                'add_conf': req.body.add_conf
              }
              const sql = `INSERT INTO products (id, category, name, description, price, configuration, available_upgrades) VALUES('${server.crypto.randomBytes(3).toString('hex')}', 'proxmox', '${req.body.name}', '${req.body.description}', '${req.body.price}', '${JSON.stringify(configuration)}', '${req.body.available_upgrades}')`;
              server.con.query(sql, function (err) {
                if (err) { server.logger(" [ERROR] Database error\n  " + err) }
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
  res.on('finish', () => {
    const durationInMilliseconds = server.getDurationInMilliseconds(start)
    server.logger(` [DEBUG] ${req.method} ${route_name} [FINISHED] [FROM ${IP}] in ${durationInMilliseconds.toLocaleString()} ms`)
  })
})

module.exports = router;