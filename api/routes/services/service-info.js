var router = require('express').Router();
const server = require('../../server.js')
const route_name = "/services/service-info"
const permissions_manager = require("../../utils/permissions-manager")
const config = require('../../config.json')
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
    if (err) { server.logger(" [ERROR] Database error\n  " + err) };
    if (result.length == 0) {
      return res.json({ 'error': true, 'code': 404 })
    } else {
      if (result[0].token === req.query.token) {
        var id = req.query.id
        if (id == undefined) { return res.json({ 'error': true, 'msg': "Service id query is required", "code": 101 }) }
        if (id == "") { return res.json({ 'error': true, 'msg': "Service id query is required", "code": 102 }) }

        var sql = `SELECT * FROM services WHERE id = '${id}'`;
        server.con.query(sql, function (err, result) {
          if (err) { server.logger(" [ERROR] Database error\n  " + err) };
          if (result.length > 0) {
            if (result[0].uuid == req.query.uuid) {
              if (result[0].category == 'pterodactyl') {
                service_config = JSON.parse(result[0].configuration)
                server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/resources", {
                  "method": "GET",
                  "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                  }
                }).then(response => {
                  return response.json()
                }).then(data => {
                  server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/websocket", {
                    "method": "GET",
                    "headers": {
                      "Accept": "application/json",
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                    }
                  }).then(response => {
                    return response.json()
                  }).then(data1 => {
                    var sql = `SELECT * FROM services_logs WHERE service_id = '${id}' ORDER BY timestamp DESC`;
                    server.con.query(sql, function (err, result1) {
                      let ii = 0
                      var service_logs = []
                      for (let i = 0; i < result1.length; i++) {
                        ii++
                        if (ii <= 25) {
                          service_logs.push({
                            'timestamp': result1[i].timestamp,
                            'uuid': result1[i].uuid,
                            'ip': result1[i].ip,
                            'action': result1[i].action
                          })
                        }
                      }
                      return res.json({
                        'error': false, 'data': {
                          'id': result[0].id,
                          'uuid': result[0].uuid,
                          'name': result[0].name,
                          'product_id': result[0].product_id,
                          'price': result[0].price,
                          'category': result[0].category,
                          'configuration': service_config,
                          'statut': result[0].statut,
                          'resources': data.attributes,
                          'websocket': {
                            'websocket_url': data1.data.socket,
                            'websocket_token': data1.data.token
                          }
                        }, 'logs': service_logs
                      })
                    })
                  }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
                }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
              }
            } else {
              permissions_manager.has_permission(req.query.uuid, "LISTSERVICES").then(function (result_perm) {
                if (result_perm) {
                  if (result[0].category == 'pterodactyl') {
                    service_config = JSON.parse(result[0].configuration)
                    server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/resources", {
                      "method": "GET",
                      "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                      }
                    }).then(response => {
                      return response.json()
                    }).then(data => {
                      server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/websocket", {
                        "method": "GET",
                        "headers": {
                          "Accept": "application/json",
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                        }
                      }).then(response => {
                        return response.json()
                      }).then(data1 => {
                        var sql = `SELECT * FROM services_logs WHERE service_id = '${id}' ORDER BY timestamp DESC`;
                        server.con.query(sql, function (err, result1) {
                          let ii = 0
                          var service_logs = []
                          for (let i = 0; i < result1.length; i++) {
                            ii++
                            if (ii <= 25) {
                              service_logs.push({
                                'timestamp': result1[i].timestamp,
                                'uuid': result1[i].uuid,
                                'ip': result1[i].ip,
                                'action': result1[i].action
                              })
                            }
                          }
                          return res.json({
                            'error': false, 'data': {
                              'id': result[0].id,
                              'uuid': result[0].uuid,
                              'name': result[0].name,
                              'product_id': result[0].product_id,
                              'price': result[0].price,
                              'category': result[0].category,
                              'configuration': service_config,
                              'statut': result[0].statut,
                              'resources': data.attributes,
                              'websocket': {
                                'websocket_url': data1.data.socket,
                                'websocket_token': data1.data.token
                              }
                            }, 'logs': service_logs
                          })
                        })
                      }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
                    }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
                  }
                } else {
                  return res.json({
                    "error": true,
                    "code": 403
                  })
                }
              })
            }
          } else {
            return res.json({
              'error': false, 'data': {
                'id': 404
              }
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