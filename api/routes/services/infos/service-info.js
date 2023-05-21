let router = require('express').Router({ mergeParams: true });
const server = require('../../../server')
const route_name = "/services/:service_name"
const jsonParser = server.parser.json()
const permissions_manager = require("../../../utils/permissions-manager")
const config = require('../../../config.json')
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
        let id = req.params.service_name
        if (id == undefined) { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 101 }) }
        if (id == "") { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 102 }) }
        let sql = `SELECT * FROM services WHERE id = '${id}'`;
        server.con.query(sql, function (err, result) {
          if (err) { server.logger(" [ERROR] Database error\n  " + err) };
          if (result.length > 0) {
            if (result[0].uuid == req.cookies.uuid) {
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
                    server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier, {
                      "method": "GET",
                      "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                      }
                    }).then(response => {
                      return response.json()
                    }).then(data2 => {
                      server.fetch(config.pterodactyl_url + "/api/application/servers/" + service_config.id, {
                        "method": "GET",
                        "headers": {
                          "Accept": "application/json",
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                        }
                      }).then(response => {
                        return response.json()
                      }).then(data3 => {
                      let sql = `SELECT * FROM services_logs WHERE service_id = '${id}' ORDER BY timestamp DESC`;
                      server.con.query(sql, function (err, result1) {
                        let ii = 0
                        let service_logs = []
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
                            'environment': data3.attributes.container.environment,
                            'limits': data3.attributes.limits,
                            'statut': result[0].statut,
                            'resources': data.attributes,
                            'feature_limits': data2.feature_limits,
                            'allocations': data2.attributes.relationships.allocations.data,
                            'sftp_details': data2.attributes.sftp_details,
                            'websocket': {
                              'websocket_url': data1.data.socket,
                              'websocket_token': data1.data.token
                            }
                          }, 'logs': service_logs
                        })
                      })
                      })
                    })
                  }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
                }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
              } else if (result[0].category == 'proxmox') {
                service_config = JSON.parse(result[0].configuration)
                server.fetch(`${config.proxmox_url}/api2/json/nodes/${service_config.node}/qemu/${service_config.vmid}/status/current`, {
                  "method": "GET",
                  "headers": {
                    "CSRFPreventionToken": server.proxmox_CSRFPreventionToken,
                    "Cookie": "PVEAuthCookie=" + server.proxmox_ticket
                  },
                  "agent": server.httpsAgent
                }).then(response => {
                  return response.json()
                }).then(data => {
                  let sql = `SELECT * FROM services_logs WHERE service_id = '${id}' ORDER BY timestamp DESC`;
                  server.con.query(sql, function (err, result1) {
                    let ii = 0
                    let service_logs = []
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
                        'statut': result[0].statut,
                        'server_status': data.data.status,
                        'cpus': data.data.cpus,
                        'maxdisk': data.data.maxdisk,
                        'maxmem': data.data.maxmem,
                        'cpu_usage': data.data.cpu,
                        'mem_usage': data.data.mem,
                        'net_in': data.data.netin,
                        'net_out': data.data.netout,
                        'disk_read': data.data.diskread,
                        'disk_write': data.data.diskwrite,
                        'uptime': data.data.uptime
                      },'logs': service_logs
                    })
                  })
                }).catch(err => {
                  server.logger(" [ERROR] Proxmox API Error " + err)
                  return res.json({ "error": true, "code": 1000, "msg": err })
                });
              }
            } else {
              permissions_manager.has_permission(req.cookies.uuid, "LISTSERVICES").then(function (result_perm) {
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
                        server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier, {
                          "method": "GET",
                          "headers": {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                          }
                        }).then(response => {
                          return response.json()
                        }).then(data2 => {
                          server.fetch(config.pterodactyl_url + "/api/application/servers/" + service_config.id, {
                            "method": "GET",
                            "headers": {
                              "Accept": "application/json",
                              "Content-Type": "application/json",
                              "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                            }
                          }).then(response => {
                            return response.json()
                          }).then(data3 => {
                          let sql = `SELECT * FROM services_logs WHERE service_id = '${id}' ORDER BY timestamp DESC`;
                          server.con.query(sql, function (err, result1) {
                            let ii = 0
                            let service_logs = []
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
                                'environment': data3.attributes.container.environment,
                                'limits': data3.attributes.limits,
                                'statut': result[0].statut,
                                'resources': data.attributes,
                                'feature_limits': data2.feature_limits,
                                'allocations': data2.attributes.relationships.allocations.data,
                                'sftp_details': data2.attributes.sftp_details,
                                'websocket': {
                                  'websocket_url': data1.data.socket,
                                  'websocket_token': data1.data.token
                                }
                              }, 'logs': service_logs
                            })
                          })
                          })
                        })
                      }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
                    }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
                  } else if (result[0].category == 'proxmox') {
                    service_config = JSON.parse(result[0].configuration)
                    server.fetch(`${config.proxmox_url}/api2/json/nodes/${service_config.node}/qemu/${service_config.vmid}/status/current`, {
                      "method": "GET",
                      "headers": {
                        "CSRFPreventionToken": server.proxmox_CSRFPreventionToken,
                        "Cookie": "PVEAuthCookie=" + server.proxmox_ticket
                      },
                      "agent": server.httpsAgent
                    }).then(response => {
                      return response.json()
                    }).then(data => {
                      let sql = `SELECT * FROM services_logs WHERE service_id = '${id}' ORDER BY timestamp DESC`;
                      server.con.query(sql, function (err, result1) {
                        let ii = 0
                        let service_logs = []
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
                            'statut': result[0].statut,
                            'server_status': data.data.status,
                            'cpus': data.data.cpus,
                            'maxdisk': data.data.maxdisk,
                            'maxmem': data.data.maxmem,
                            'cpu_usage': data.data.cpu,
                            'mem_usage': data.data.mem,
                            'net_in': data.data.netin,
                            'net_out': data.data.netout,
                            'disk_read': data.data.diskread,
                            'disk_write': data.data.diskwrite,
                            'uptime': data.data.uptime
                          },'logs': service_logs
                        })
                      })
                    }).catch(err => {
                      server.logger(" [ERROR] Proxmox API Error " + err)
                      return res.json({ "error": true, "code": 1000, "msg": err })
                    });
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
  res.on('finish', () => {
    const durationInMilliseconds = server.getDurationInMilliseconds(start)
    server.logger(` [DEBUG] ${req.method} ${route_name} [FINISHED] [FROM ${IP}] in ${durationInMilliseconds.toLocaleString()} ms`)
  })
})

// EDIT //

router.put('', jsonParser, function (req, res) {
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
        permissions_manager.has_permission(req.cookies.uuid, "EDITSERVICE").then(function (result) {
          if (result) {
            let id = req.params.service_name
            if (id == undefined) { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 101 }) }
            if (id == "") { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 102 }) }
            let sql = `SELECT * FROM services WHERE id = '${id}'`;
            server.con.query(sql, function (err, result) {
              let sql = `UPDATE services SET uuid = '${req.body.uuid}', name = '${req.body.name}', product_id = '${req.body.product_id}', price = '${req.body.price}', statut = '${req.body.statut}' WHERE id = '${req.body.id}';`;
              server.con.query(sql, function (err) {
                if (err) { server.logger(" [ERROR] Database error\n  " + err); return res.json({ "error": true, "msg": "Database error : " + err }) };
              });
              server.logger(" [DEBUG] Service " + req.body.name + " updated from " + IP + " with uuid " + req.cookies.uuid + " !")
              if (result[0].name != req.body.name) { server.services_action_logger(req.body.id, req.cookies.uuid, IP, "Modification du nom du service " + result[0].name + " vers " + req.body.name) }
              if (result[0].uuid != req.body.uuid) { server.services_action_logger(req.body.id, req.cookies.uuid, IP, "Modification du propriétaire du service " + result[0].name + " passant de " + result[0].uuid + " à " + req.body.uuid) }
              if (result[0].product_id != req.body.product_id) { server.services_action_logger(req.body.id, req.cookies.uuid, IP, "Modification du produit du service " + result[0].name + " passant de " + result[0].product_id + " à " + req.body.product_id) }
              if (result[0].price != req.body.price) { server.services_action_logger(req.body.id, req.cookies.uuid, IP, "Modification du prix du service " + result[0].name + " passant de " + result[0].price + " à " + req.body.price) }
              if (result[0].statut != req.body.statut) { server.services_action_logger(req.body.id, req.cookies.uuid, IP, "Modification du status du service " + result[0].name + " passant de " + result[0].statut + " à " + req.body.statut) }
              return res.json({ "error": false, "response": "OK" });
            })
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

// DELETE //

router.delete('', jsonParser, function (req, res) {
  const start = process.hrtime()
  ipInfo = server.ip(req);
  let response = "OK"
  let error = false

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
        permissions_manager.has_permission(req.cookies.uuid, "DELETESERVICE").then(function (result) {
          if (result) {
            let id = req.params.service_name
            if (id == undefined) { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 101 }) }
            if (id == "") { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 102 }) }
            let sql = `SELECT * FROM services WHERE id = '${id}'`;
            server.con.query(sql, function (err, result) {
              if (err) { server.logger(" [ERROR] Database error\n  " + err), error = true, response = "Database error" };
              if (result[0].category == 'pterodactyl') {
                service_config = JSON.parse(result[0].configuration)
                server.fetch(config.pterodactyl_url + "/api/application/servers/" + service_config.id, {
                  "method": "DELETE",
                  "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${config.pterodactyl_api_key}`,
                  }
                }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
              }
              let sql = `DELETE FROM services WHERE id='${id}'`;
              server.con.query(sql, function (err) {
                if (err) { server.logger(" [ERROR] Database error\n  " + err), error = true, response = "Database error" };
              });
              server.logger(" [DEBUG] Service " + id + " deleted from " + IP + " !")
              return res.json({ "error": error, "response": response });
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