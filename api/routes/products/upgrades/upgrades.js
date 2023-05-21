const router = require('express').Router()
const server = require('../../../server.js')
const jsonParser = server.parser.json()
const route_name = "/products/upgrades"
const permissions_manager = require("../../../utils/permissions-manager.js")
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
      res.status(401)
      return res.json({ 'error': true, 'code': 401 })
    } else {
      if (result[0].token === req.cookies.token) {
        permissions_manager.has_permission(req.cookies.uuid, "LISTPRODUCTS").then(function (result) {
          if (result) {
            const sql = `SELECT * FROM upgrades`;
            server.con.query(sql, function (err, result) {
              if (err) { server.logger(" [ERROR] Database error\n  " + err) }
              let upgrades = []
              for (let i = 0; i < result.length; i++) {
                upgrades.push({
                  "id": result[i].id,
                  "category": result[i].category,
                  "name": result[i].name,
                  "description": result[i].description,
                  "price": result[i].price,
                  "param": result[i].param,
                  "value": result[i].value
                })
              }
              return res.json({ 'error': false, 'data': upgrades })
            })
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
  })
  res.on('finish', () => {
    const durationInMilliseconds = server.getDurationInMilliseconds(start)
    server.logger(` [DEBUG] ${req.method} ${route_name} [FINISHED] [FROM ${IP}] in ${durationInMilliseconds.toLocaleString()} ms`)
  })
})


// CREATE NEW UPGRADES //

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
            const sql = `INSERT INTO upgrades (id, category, name, description, price, param, value) VALUES('${server.crypto.randomBytes(3).toString('hex')}', '${req.body.category}', '${req.body.name}', '${req.body.description}', '${req.body.price}', '${req.body.param}', '${req.body.value}')`;
            server.con.query(sql, function (err) {
              if (err) { server.logger(" [ERROR] Database error\n  " + err) }
            })
            server.logger(" [DEBUG] Upgrade " + req.body.name + " created from " + IP + " !")
            return res.json({ "error": false, "response": "OK" })
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
  })
  res.on('finish', () => {
    const durationInMilliseconds = server.getDurationInMilliseconds(start)
    server.logger(` [DEBUG] ${req.method} ${route_name} [FINISHED] [FROM ${IP}] in ${durationInMilliseconds.toLocaleString()} ms`)
  })
})

module.exports = router;