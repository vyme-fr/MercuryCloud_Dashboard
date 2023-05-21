let router = require('express').Router();
const server = require('../../../../server.js')
const config = require('../../../../config.json');
const { response } = require('express');
const permissions_manager = require("../../../../utils/permissions-manager.js")
const route_name = "/products/proxmox/nodes"
server.logger(" [INFO] /api" + route_name + " route loaded !")

router.get('', function (req, res) {
  const start = process.hrtime()
  ipInfo = server.ip(req);
  let IP = ""
  if (req.headers['x-forwarded-for'] == undefined) {
    IP = req.socket.remoteAddress.replace("::ffff:", "")
  } else {
    IP = req.headers['x-forwarded-for'].split(',')[0]
  }
  let sql = `SELECT token FROM users WHERE uuid = '${req.cookies.uuid}'`;
  server.con.query(sql, function (err, result) {
    if (err) { server.logger(" [ERROR] Database error\n  " + err) };
    if (result.length == 0) {
      return res.json({ 'error': true, 'code': 404 })
    } else {
      if (result[0].token === req.cookies.token) {
        permissions_manager.has_permission(req.cookies.uuid, "LISTPRODUCTS").then(function (result) {
          if (result) {
            server.fetch(`${config.proxmox_url}/api2/json/nodes`, {
              "method": "GET",
              "headers": {
                "CSRFPreventionToken": server.proxmox_CSRFPreventionToken,
                "Cookie": "PVEAuthCookie=" + server.proxmox_ticket
              },
              "agent": server.httpsAgent
            }).then(response => {
              return response.json()
            })
              .then(data => {
                return res.json({ 'error': false, 'nodes': data.data })
              })
              .catch(err => {
                server.logger(" [ERROR] Proxmox API Error " + err)
                return res.json({ "error": true, "code": 1000, "msg": err })
              });
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