var router = require('express').Router();
const server = require('../../server.js')
var jsonParser = server.parser.json()
const route_name = "/users/edit-user"
server.logger(" [INFO] /api" + route_name + " route loaded !")

router.post('', jsonParser, function (req, res) {
    ipInfo = server.ip(req);
    var response = "OK"
    var error = false
    var forwardedIpsStr = req.header('x-forwarded-for');
    var IP = '';
  
    if (forwardedIpsStr) {
       IP = forwardedIps = forwardedIpsStr.split(',')[0];  
    }
    var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
    server.con.query(sql, function (err, result) {
      if (err) {server.logger(" [ERROR] Database error\n  " + err)};
      if (result.length == 0) {
        return res.json({'error': true, 'code': 404})
      } else {
        if (result[0].token === req.query.token) {
            if (req.body.password != "Q@4%738r$7") {
                server.bcrypt.hash(req.body.password, 10, function(err, hash) {
                    var sql = `UPDATE users SET username = '${req.body.username}', token = '${server.crypto.randomBytes(20).toString('hex')}', password = '${hash}', role = '${req.body.role}', mail = '${req.body.mail}', first_name = '${req.body.first_name}', last_name = '${req.body.last_name}', tel = '${req.body.tel}', address_1 = '${req.body.address_1}', address_2 = '${req.body.address_2}', city = '${req.body.city}', zip = '${req.body.zip}', country = '${req.body.country}', state = '${req.body.state}' WHERE uuid = '${req.body.uuid}';`;
                    server.con.query(sql, function (err, result) {
                        if (err) {server.logger(" [ERROR] Database error\n  " + err); return res.json({"error": true, "msg": "Database error : " + err})};
                    });
                    server.logger(" [DEBUG] User " + toString(req.body.username) + " updated !")
                    return res.json({"error": false, "response": "OK"});
                })
            } else {
                var sql = `UPDATE users SET username = '${req.body.username}', role = '${req.body.role}', mail = '${req.body.mail.toLowerCase()}', first_name = '${req.body.first_name}', last_name = '${req.body.last_name}', tel = '${req.body.tel}', address_1 = '${req.body.address_1}', address_2 = '${req.body.address_2}', city = '${req.body.city}', zip = '${req.body.zip}', country = '${req.body.country}', state = '${req.body.state}' WHERE uuid = '${req.body.uuid}';`;
                server.con.query(sql, function (err, result) {
                    if (err) {server.logger(" [ERROR] Database error\n  " + err); return res.json({"error": true, "msg": "Database error : " + err})};
                });
                server.logger(" [DEBUG] User " + toString(req.body.username) + " updated !")
                return res.json({"error": false, "response": "OK"});
            }
          } else {
            return res.json({'error': true, 'code': 403})
          }
        }
    });
  })

module.exports = router;