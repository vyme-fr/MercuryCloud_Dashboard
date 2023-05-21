const router = require('express').Router({ mergeParams: true });
const server = require('../../../server.js')
const jsonParser = server.parser.json()
const route_name = "/users/login/:user_mail"
server.logger(" [INFO] /api" + route_name + " route loaded !")

router.post('', jsonParser, function (req, res) {
  const start = process.hrtime()
  let IP = ""
  if (req.headers['x-forwarded-for'] == undefined) {
    IP = req.socket.remoteAddress.replace("::ffff:", "")
  } else {
    IP = req.headers['x-forwarded-for'].split(',')[0]
  }
  let mail = req.params.user_mail
  if (mail === undefined) { return res.json({ 'error': true, 'msg': "User mail params is required", "code": 101 }) }
  if (mail === "") { return res.json({ 'error': true, 'msg': "User mail params is required", "code": 102 }) }
  let sql = `SELECT password FROM users WHERE mail = '${mail}'`;
  server.con.query(sql, function (err, result) {
    if (err) throw err;
    if (result.length === 0) {
      return res.json({ 'error': true, 'code': 404 })
    } else {
      server.bcrypt.compare(req.body.password, result[0].password, function (err, result) {
        if (result === true) {
          const sql = `SELECT * FROM users WHERE mail = '${mail}'`;
          server.con.query(sql, function (err, result) {
            if (err) { server.logger(" [ERROR] Database error\n  " + err) }
            res.json({ 'error': false, 'uuid': result[0].uuid, 'token': result[0].token })
            return server.logger(' [INFO] User ' + mail + ' successful logged in from ' + IP)
          });
        } else {
          res.json({ 'error': true, 'code': 403 })
          return server.logger(' [INFO] User ' + mail + ' unsuccessful logged in from ' + IP + '!')
        }
      });
    }
  });
  res.on('finish', () => {
    const durationInMilliseconds = server.getDurationInMilliseconds(start)
    server.logger(` [DEBUG] ${req.method} ${route_name} [FINISHED] [FROM ${IP}] in ${durationInMilliseconds.toLocaleString()} ms`)
  })
})

module.exports = router;