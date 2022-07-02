var router = require('express').Router();
const server = require('../../server.js')
var jsonParser = server.parser.json()
server.logger(" [INFO] /api/create-user route loaded !")

router.post('', jsonParser, function (req, res) {
  server.bcrypt.hash(req.body.password, 10, function(err, hash) {
      var sql = `INSERT INTO users (uuid, username, mail, token, password, balance, tickets, services, suspend_services, alerts) VALUES('${server.uuid.v4()}', '${req.body.username}', '${req.body.mail.toLowerCase()}', '${server.crypto.randomBytes(20).toString('hex')}', '${hash}', 0, 0, 0, 0, 0)`;
      server.con.query(sql, function (err, result) {
          if (err) {server.logger(" [ERROR] Database error\n  " + err)};
      });
    });
    server.logger(" [INFO] User " + toString(req.body.username) + " created !")
    return res.json({"response": "OK"})
  })

module.exports = router;