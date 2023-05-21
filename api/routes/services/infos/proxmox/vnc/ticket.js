const router = require('express').Router({ mergeParams: true });
const server = require('../../../../../server')
const config = require('../../../../../config.json');
const { response } = require('express');
const permissions_manager = require("../../../../../utils/permissions-manager")
const route_name = "/services/:service_name/proxmox/vnc/ticket"
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
            let id = req.params.service_name
            if (id == undefined) { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 101 }) }
            if (id == "") { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 102 }) }
            server.fetch(`${config.proxmox_url}/api2/json/nodes/pve-1/qemu/10012/termproxy`, {
              "method": "POST",
              "headers": {
                "CSRFPreventionToken": server.proxmox_CSRFPreventionToken,
                "Cookie": "PVEAuthCookie=" + server.proxmox_ticket
              },
              "agent": server.httpsAgent
            }).then(response => {
              return response.json()
            })
              .then(data => {
                console.log(data)
                data.data.pveticket = server.proxmox_ticket
                data.data.socket_url = "wss://r1-access.mercurycloud.fr:8006/api2/json/nodes/pve-1/qemu/10012/vncwebsocket?port=5900&vncticket=" + encodeURIComponent(data.data.ticket)
                return res.json({ 'error': false, 'data': data.data })
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