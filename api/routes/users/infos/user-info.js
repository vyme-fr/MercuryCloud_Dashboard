var router = require('express').Router({ mergeParams: true });
const server = require('../../../server.js')
var jsonParser = server.parser.json()
const route_name = "/users/:user_uuid"
const permissions_manager = require("../../../utils/permissions-manager")
server.logger(" [INFO] /api" + route_name + " route loaded !")

// GET INFOS //

router.get('', function (req, res) {
  ipInfo = server.ip(req);

  var IP = req.socket.remoteAddress;

  server.logger(' [DEBUG] GET /api' + route_name + ' from ' + IP + ` with uuid ${req.query.uuid}`)
  var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
  server.con.query(sql, function (err, result) {
    if (err) { server.logger(" [ERROR] Database error\n  " + err) };
    if (result.length == 0) {
      return res.json({ 'error': true, 'code': 404 })
    } else {
      if (result[0].token == req.query.token) {
        permissions_manager.has_permission(req.query.uuid, "LISTUSERS").then(function (result) {
          if (result) {
            var id = req.params.user_uuid
            if (id == undefined) { return res.json({ 'error': true, 'msg': "User id params is required", "code": 101 }) }
            if (id == "") { return res.json({ 'error': true, 'msg': "User id params is required", "code": 102 }) }
            var sql = `SELECT * FROM users WHERE uuid = '${id}'`;
            server.con.query(sql, function (err, result) {
              if (err) { server.logger(" [ERROR] Database error\n  " + err) };
              if (result.length > 0) {
                var sql = `SELECT * FROM roles WHERE id = '${result[0].role}'`;
                server.con.query(sql, function (err, result1) {
                  if (err) { server.logger(" [ERROR] Database error\n  " + err) };
                  return res.json({
                    'error': false,
                    'data': {
                      'uuid': result[0].uuid,
                      'username': result[0].username,
                      'mail': result[0].mail,
                      'role': result[0].role,
                      'role_name': result1[0].name,
                      'permissions': result1[0].permissions,
                      'first_name': result[0].first_name,
                      'last_name': result[0].last_name,
                      'tel': result[0].tel,
                      'address_1': result[0].address_1,
                      'address_2': result[0].address_2,
                      'city': result[0].city,
                      'zip': result[0].zip,
                      'country': result[0].country,
                      'state': result[0].state
                    }
                  })
                })
              } else {
                return res.json({
                  'error': false,
                  'data': {
                    'uuid': 404
                  }
                })
              }
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
})


// EDIT //

router.put('', jsonParser, function (req, res) {
  ipInfo = server.ip(req);
  var response = "OK"
  var error = false

  var IP = req.socket.remoteAddress;


  var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
  server.con.query(sql, function (err, result) {
    if (err) { server.logger(" [ERROR] Database error\n  " + err) };
    if (result.length == 0) {
      return res.json({ 'error': true, 'code': 404 })
    } else {
      if (result[0].token === req.query.token) {
        permissions_manager.has_permission(req.query.uuid, "EDITUSER").then(function (result) {
          if (result) {
            var id = req.params.user_uuid
            if (id == undefined) { return res.json({ 'error': true, 'msg': "User id params is required", "code": 101 }) }
            if (id == "") { return res.json({ 'error': true, 'msg': "User id params is required", "code": 102 }) }
            if (req.body.password != "Q@4%738r$7") {
              server.bcrypt.hash(req.body.password, 10, function (err, hash) {
                var sql = `UPDATE users SET username = '${req.body.username}', token = '${server.crypto.randomBytes(20).toString('hex')}', password = '${hash}', role = '${req.body.role}', mail = '${req.body.mail}', first_name = '${req.body.first_name}', last_name = '${req.body.last_name}', tel = '${req.body.tel}', address_1 = '${req.body.address_1}', address_2 = '${req.body.address_2}', city = '${req.body.city}', zip = '${req.body.zip}', country = '${req.body.country}', state = '${req.body.state}' WHERE uuid = '${id}';`;
                server.con.query(sql, function (err, result) {
                  if (err) { server.logger(" [ERROR] Database error\n  " + err); return res.json({ "error": true, "msg": "Database error : " + err }) };
                });
                server.logger(" [DEBUG] User " + req.body.username + " updated !")
                return res.json({ "error": false, "response": "OK" });
              })
            } else {
              var sql = `UPDATE users SET username = '${req.body.username}', role = '${req.body.role}', mail = '${req.body.mail.toLowerCase()}', first_name = '${req.body.first_name}', last_name = '${req.body.last_name}', tel = '${req.body.tel}', address_1 = '${req.body.address_1}', address_2 = '${req.body.address_2}', city = '${req.body.city}', zip = '${req.body.zip}', country = '${req.body.country}', state = '${req.body.state}' WHERE uuid = '${id}';`;
              server.con.query(sql, function (err, result) {
                if (err) { server.logger(" [ERROR] Database error\n  " + err); return res.json({ "error": true, "msg": "Database error : " + err }) };
              });
              server.logger(" [DEBUG] User " + req.body.username + " updated !")
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


// DELETE //

router.delete('', jsonParser, function (req, res) {
  ipInfo = server.ip(req);
  var response = "OK"
  var error = false
  var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
  server.con.query(sql, function (err, result) {
    var IP = req.socket.remoteAddress;
    if (err) { server.logger(" [ERROR] Database error\n  " + err) };
    if (result.length == 0) {
      returnres.json({ 'error': true, 'code': 404 })
    } else {
      if (result[0].token === req.query.token) {
        permissions_manager.has_permission(req.query.uuid, "DELETEUSER").then(function (result) {
          var id = req.params.user_uuid
          if (id == undefined) { return res.json({ 'error': true, 'msg': "User id params is required", "code": 101 }) }
          if (id == "") { return res.json({ 'error': true, 'msg': "User id params is required", "code": 102 }) }
          if (result) {
            var sql = `DELETE FROM users WHERE uuid='${id}'`;
            server.con.query(sql, function (err, result) {
              if (err) { server.logger(" [ERROR] Database error\n  " + err), error = true, response = "Database error" };
            });
            server.logger(" [DEBUG] User " + id + " deleted by " + req.query.uuid + " from " + IP + " !")
            return res.json({ "error": error, "response": response });
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