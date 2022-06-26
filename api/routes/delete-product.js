var router = require('express').Router();
const server = require('../server.js')
var jsonParser = server.parser.json()

router.delete('', jsonParser, function (req, res) {
    ipInfo = server.ip(req);
    var response = "OK"
    var error = false
    server.logger(' [DEBUG] GET from : ' + ipInfo.clientIp.split("::ffff:")[1] + `, ${req.query.uuid}`)
    var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
    server.con.query(sql, function (err, result) {
      if (err) {server.logger(" [ERROR] Database error\n  " + err)};
      if (result.length == 0) {
        res.json({'error': true, 'code': 404})
      } else {
        if (result[0].token === req.query.token) {
          var sql = `DELETE FROM mc_products WHERE id='${req.body.id}'`;
          server.con.query(sql, function (err, result) {
              if (err) {server.logger(" [ERROR] Database error\n  " + err), error = true, response = "Database error"};
          });
          server.logger(" [DEBUG] Product " + toString(req.body.id) + " deleted !")
          return res.json({"error": error, "response": response});
        } else {
          res.json({'error': true, 'code': 403})
        }
      }
    });
  })

module.exports = router;