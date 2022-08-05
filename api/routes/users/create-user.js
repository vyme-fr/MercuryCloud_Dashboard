var router = require('express').Router();
const server = require('../../server.js')
var jsonParser = server.parser.json()
const route_name = "/users/create-user"
server.logger(" [INFO] /api" + route_name + " route loaded !")

router.post('', jsonParser, function (req, res) {
  server.bcrypt.hash(req.body.password, 10, function(err, hash) {
      var sql = `INSERT INTO users (uuid, username, role, mail, token, password, first_name, last_name, tel, address_1, address_2, city, zip, country, state, balance, tickets, services, suspend_services, alerts) VALUES('${server.uuid.v4()}', '${req.body.username}', '${req.body.role}', '${req.body.mail.toLowerCase()}', '${server.crypto.randomBytes(20).toString('hex')}', '${hash}', '${req.body.first_name}', '${req.body.last_name}', '${req.body.tel}', '${req.body.address_1}', '${req.body.address_2}', '${req.body.city}', '${req.body.zip}', '${req.body.country}', '${req.body.state}', 0, 0, 0, 0, 0)`;
      server.con.query(sql, function (err, result) {
          if (err) {server.logger(" [ERROR] Database error\n  " + err); return res.json({"error": true, "msg": "Database error " + err})};
      });
    });
    server.logger(" [DEBUG] User " + req.body.username + " created !")
    return res.json({"error": false, "response": "OK"})
  })

module.exports = router;