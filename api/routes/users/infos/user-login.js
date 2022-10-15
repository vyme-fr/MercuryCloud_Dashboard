var router = require('express').Router({ mergeParams: true });
const server = require('../../../server.js')
var jsonParser = server.parser.json()
const route_name = "/users/login/:user_mail"
server.logger(" [INFO] /api" + route_name + " route loaded !")

router.post('', jsonParser, function (req, res) {
  ipInfo = server.ip(req);

  var IP = req.socket.remoteAddress;

  var mail = req.params.user_mail
  if (mail == undefined) { return res.json({ 'error': true, 'msg': "User mail params is required", "code": 101 }) }
  if (mail == "") { return res.json({ 'error': true, 'msg': "User mail params is required", "code": 102 }) }
  var sql = `SELECT password FROM users WHERE mail = '${mail}'`;
  server.con.query(sql, function (err, result) {
    if (err) throw err;
    if (result.length == 0) {
      return res.json({ 'error': true, 'code': 404 })
    } else {
      server.bcrypt.compare(req.body.password, result[0].password, function (err, result) {
        if (result === true) {
          var sql = `SELECT * FROM users WHERE mail = '${mail}'`;
          server.con.query(sql, function (err, result) {
            if (err) { server.logger(" [ERROR] Database error\n  " + err) };
            res.json({ 'error': false, 'uuid': result[0].uuid, 'token': result[0].token })
            return server.logger(' [DEBUG] User ' + mail + ' successful login from ' + IP)
          });
        } else {
          res.json({ 'error': true, 'code': 403 })
          return server.logger(' [DEBUG] User ' + mail + ' unsuccessful login from ' + IP + '!')
        }
      });
    }
  });
})

module.exports = router;