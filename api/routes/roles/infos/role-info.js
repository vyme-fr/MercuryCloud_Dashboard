let router = require('express').Router({ mergeParams: true });
const server = require('../../../server.js')
let jsonParser = server.parser.json()
const route_name = "/roles/:role_id"
const permissions_manager = require("../../../utils/permissions-manager")
server.logger(" [INFO] /api" + route_name + " route loaded !")

// GET INFOS //

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
        permissions_manager.has_permission(req.cookies.uuid, "LISTROLES").then(function (result) {
          if (result) {
            let id = req.params.role_id
            if (id == undefined) { return res.json({ 'error': true, 'msg': "Role id params is required", "code": 101 }) }
            if (id == "") { return res.json({ 'error': true, 'msg': "Role id params is required", "code": 102 }) }
            let sql = `SELECT * FROM roles WHERE id = '${id}'`;
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
  res.on('finish', () => {
    const durationInMilliseconds = server.getDurationInMilliseconds(start)
    server.logger(` [DEBUG] ${req.method} ${route_name} [FINISHED] [FROM ${IP}] in ${durationInMilliseconds.toLocaleString()} ms`)
  })
})

// EDIT ROLE //

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
        let id = req.params.role_id
        if (id == undefined) { return res.json({ 'error': true, 'msg': "Role id params is required", "code": 101 }) }
        if (id == "") { return res.json({ 'error': true, 'msg': "Role id params is required", "code": 102 }) }
        permissions_manager.has_permission(req.cookies.uuid, "EDITROLE").then(function (result) {
          if (result) {
            let permissions = ''
            if (req.body.permissions.length < 1) {
              permissions = "NONE"
            } else {
              permissions = req.body.permissions
            }
            let sql = `UPDATE roles SET name = '${req.body.name}', permissions = '${permissions}' WHERE id = '${id}';`;
            server.con.query(sql, function (err, result) {
              if (err) { server.logger(" [ERROR] Database error\n  " + err); return res.json({ "error": true, "msg": "Database error : " + err }) };
            });
            server.logger(" [DEBUG] Role " + req.body.name + " updated from " + IP + " with uuid " + req.cookies.uuid + " !")
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
        let id = req.params.role_id
        if (id == undefined) { return res.json({ 'error': true, 'msg': "Role id params is required", "code": 101 }) }
        if (id == "") { return res.json({ 'error': true, 'msg': "Role id params is required", "code": 102 }) }
        permissions_manager.has_permission(req.cookies.uuid, "DELETEROLE").then(function (result) {
          if (result) {
            let sql = `DELETE FROM roles WHERE id='${id}'`;
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
  res.on('finish', () => {
    const durationInMilliseconds = server.getDurationInMilliseconds(start)
    server.logger(` [DEBUG] ${req.method} ${route_name} [FINISHED] [FROM ${IP}] in ${durationInMilliseconds.toLocaleString()} ms`)
  })
})

module.exports = router;