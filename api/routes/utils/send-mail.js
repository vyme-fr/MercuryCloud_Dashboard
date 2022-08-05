var router = require('express').Router();
const server = require('../../server.js')
var jsonParser = server.parser.json()
const config = require('../../config.json');
const route_name = "/utils/send-mail"
server.logger(" [INFO] /api" + route_name + " route loaded !")

router.post('', jsonParser, function (req, res) {
    ipInfo = server.ip(req);
    server.logger(' [DEBUG] GET from : ' + ipInfo.clientIp.split("::ffff:")[1] + `, ${req.query.uuid}`)
    var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
    server.con.query(sql, function (err, result) {
      if (err) {server.logger(" [ERROR] Database error\n  " + err)};
      if (result.length == 0) {
        return res.json({'error': true, 'code': 404})
      } else {
        if (result[0].token === req.query.token) {
          server.mail_transporter.sendMail({
            from: config.smtp_username,
            to: req.body.to,
            subject: req.body.subject,
            html: req.body.message,
          })
          server.logger(" [DEBUG] Email to " + req.body.to + " from " + config.smtp_username + " sent !")
          return res.json({"error": false, "response": "OK"});
        } else {
          return res.json({'error': true, 'code': 403})
        }
    }
})
})

module.exports = router;