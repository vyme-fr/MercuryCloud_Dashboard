var router = require('express').Router({ mergeParams: true });
const server = require('../../../server.js')
var jsonParser = server.parser.json()
const route_name = "/roles/:role_id"
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
      if (result[0].token === req.query.token) {
        permissions_manager.has_permission(req.query.uuid, "LISTROLES").then(function (result) {
          if (result) {
            var id = req.params.role_id
            if (id == undefined) { return res.json({ 'error': true, 'msg': "Role id params is required", "code": 101 }) }
            if (id == "") { return res.json({ 'error': true, 'msg': "Role id params is required", "code": 102 }) }
            var sql = `SELECT * FROM roles WHERE id = '${id}'`;
            server.con.query(sql, function (err, result) {
              if (err) { server.logger(" [ERROR] Database error\n  " + err) };
              if (result.length > 0) {
                return res.json({
                  'error': false, 'data': {
                    'id': result[0].id,
                    'name': result[0].name,
                    'permissions': result[0].permissions
                  }
                })
              } else {
                return res.json({
                  'error': false, 'data': {
                    'id': 404
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

// EDIT ROLE //

router.put('', jsonParser, function (req, res) {
  ipInfo = server.ip(req);

  var IP = req.socket.remoteAddress;
  var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
  server.con.query(sql, function (err, result) {
    if (err) { server.logger(" [ERROR] Database error\n  " + err) };
    if (result.length == 0) {
      return res.json({ 'error': true, 'code': 404 })
    } else {
      if (result[0].token === req.query.token) {
        var id = req.params.role_id
        if (id == undefined) { return res.json({ 'error': true, 'msg': "Role id params is required", "code": 101 }) }
        if (id == "") { return res.json({ 'error': true, 'msg': "Role id params is required", "code": 102 }) }
        permissions_manager.has_permission(req.query.uuid, "EDITROLE").then(function (result) {
          if (result) {
            var permissions = ''
            if (req.body.permissions.length < 1) {
              permissions = "NONE"
            } else {
              permissions = req.body.permissions
            }
            var sql = `UPDATE roles SET name = '${req.body.name}', permissions = '${permissions}' WHERE id = '${id}';`;
            server.con.query(sql, function (err, result) {
              if (err) { server.logger(" [ERROR] Database error\n  " + err); return res.json({ "error": true, "msg": "Database error : " + err }) };
            });
            server.logger(" [DEBUG] Role " + req.body.name + " updated from " + IP + " with uuid " + req.query.uuid + " !")
            return res.json({ "error": false, "response": "OK" });
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

// DELETE ROLE //

router.delete('', jsonParser, function (req, res) {
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
        var id = req.params.role_id
        if (id == undefined) { return res.json({ 'error': true, 'msg': "Role id params is required", "code": 101 }) }
        if (id == "") { return res.json({ 'error': true, 'msg': "Role id params is required", "code": 102 }) }
        permissions_manager.has_permission(req.query.uuid, "DELETEROLE").then(function (result) {
          if (result) {
            var sql = `DELETE FROM roles WHERE id='${id}'`;
            server.con.query(sql, function (err, result) {
              if (err) { server.logger(" [ERROR] Database error\n  " + err), error = true, response = "Database error" };
            });
            server.logger(" [DEBUG] Role " + id + " deleted from " + IP + " !")
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