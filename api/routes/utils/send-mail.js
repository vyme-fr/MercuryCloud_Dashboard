let router = require('express').Router();
const server = require('../../server.js')
let jsonParser = server.parser.json()
const config = require('../../config.json');
const route_name = "/utils/send-mail"
server.logger(" [INFO] /api" + route_name + " route loaded !")

router.post('', jsonParser, function (req, res) {
    const start = process.hrtime()
    ipInfo = server.ip(req);
    let sql = `SELECT token FROM users WHERE uuid = '${req.cookies.uuid}'`;
    server.con.query(sql, function (err, result) {
      if (err) {server.logger(" [ERROR] Database error\n  " + err)};
      if (result.length == 0) {
        return res.json({'error': true, 'code': 404})
      } else {
        if (result[0].token === req.cookies.token) {
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
    res.on('finish', () => {
        const durationInMilliseconds = server.getDurationInMilliseconds (start)
        server.logger(` [DEBUG] ${req.method} ${route_name} [FINISHED] [FROM ${IP}] in ${durationInMilliseconds.toLocaleString()} ms`)
    })
})

module.exports = router;