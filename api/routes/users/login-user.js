var router = require('express').Router();
const server = require('../../server.js')
var jsonParser = server.parser.json()
server.logger(" [INFO] /api/users/login-user route loaded !")

router.post('', jsonParser, function (req, res) {
    var sql = `SELECT password FROM users WHERE mail = '${req.body.mail}'`;
    server.con.query(sql, function (err, result) {
      if (err) throw err;
      if (result.length == 0) {
        return res.json({'error': true, 'code': 404})
      } else {
        server.bcrypt.compare(req.body.password, result[0].password, function(err, result) {
          if (result === true) {
            var sql = `SELECT * FROM users WHERE mail = '${req.body.mail}'`;
            server.con.query(sql, function (err, result) {
              if (err) {server.logger(" [ERROR] Database error\n  " + err)};
              return res.json({'error': false, 'uuid': result[0].uuid, 'token': result[0].token})
            });
          } else {
            return res.json({'error': true, 'code': 403})
          }
        });
      }
    });
  })

module.exports = router;