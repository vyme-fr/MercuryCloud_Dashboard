var router = require('express').Router();
const server = require('../../server.js')
const config = require('../../config.json');
const { response } = require('express');
const route_name = "/products/proxmox-qemu-list"
server.logger(" [INFO] /api" + route_name + " route loaded !")

router.get('', function (req, res) {
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
            server.fetch(`${config.proxmox_url}/api2/json/nodes/${req.query.node}/qemu`, {
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
              return res.json({'error': false, 'vms': data.data})            
            })
            .catch(err => {
                server.logger(" [ERROR] Proxmox API Error " + err)
                return res.json({"error": true, "code": 1000, "msg": err})
            });
        } else {
          return res.json({'error': true, 'code': 403})
        }
      }
    });
})
  
module.exports = router;