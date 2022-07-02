var router = require('express').Router();
const server = require('../../server.js')
server.logger(" [INFO] /api/mc-product-info route loaded !")


router.get('', function (req, res) {
    ipInfo = server.ip(req);
    server.logger(' [DEBUG] GET from : ' + ipInfo.clientIp.split("::ffff:")[1] + `, ${req.query.uuid}`)
    var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
    server.con.query(sql, function (err, result) {
      if (err) {server.logger(" [ERROR] Database error\n  " + err)};
      if (result.length == 0) {
        return res.json({'error': true, 'code': 404})
      } else {
        if (result[0].token == req.query.token) {
            var id = req.query.id
            if (id == undefined) {return res.json({'error': true, 'msg': "Id query is required", "code": 101})}
            if (id == "") {return res.json({'error': true, 'msg': "Id query is required", "code": 102})}
            var sql = `SELECT * FROM mc_products WHERE id = '${id}'`;
            server.con.query(sql, function (err, result) {
                if (err) {server.logger(" [ERROR] Database error\n  " + err)};
                var env = []
                env_json = JSON.parse(result[0].env)
                Object.keys(env_json).forEach((key)=>{
                    env.push(env_json[key])
                })
                return res.json({
                    'error': false,
                    'id': result[0].id,
                    'name': result[0].name,
                    'description': result[0].description,
                    'price': result[0].price,
                    'cpu': result[0].cpu,
                    'cpu_pinning': result[0].cpu_pinning,
                    'ram': result[0].ram,
                    'disk': result[0].disk,
                    'swap': result[0].swap,
                    'io': result[0].io,
                    'egg': result[0].egg,
                    'startup_command': result[0].startup_command,
                    'env': env
                })
            });
        } else {
          return res.json({'error': true, 'code': 403})
        }
      }
    });
  })

module.exports = router;