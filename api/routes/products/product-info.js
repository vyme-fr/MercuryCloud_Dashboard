var router = require('express').Router();
const server = require('../../server.js')
const route_name = "/products/product-info"
server.logger(" [INFO] /api" + route_name + " route loaded !")

router.get('', function (req, res) {
    ipInfo = server.ip(req);
      var forwardedIpsStr = req.header('x-forwarded-for');
  var IP = '';

  if (forwardedIpsStr) {
     IP = forwardedIps = forwardedIpsStr.split(',')[0];  
  }
  server.logger(' [DEBUG] GET /api' + route_name + ' from ' + IP + ` with uuid ${req.query.uuid}`)
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
            var sql = `SELECT * FROM products WHERE id = '${id}'`;
            server.con.query(sql, function (err, result) {
                if (err) {server.logger(" [ERROR] Database error\n  " + err)};
                if (result.length > 0) {
                  if (result[0].category == 'pterodactyl') {
                    var env = []
                    configuration = JSON.parse(result[0].configuration)
                    env_json = configuration.env
                    Object.keys(env_json).forEach((key)=>{
                        env.push(env_json[key])
                    })
                    return res.json({
                        'error': false,
                        'data': {
                            'id': result[0].id,
                            'category': result[0].category,
                            'name': result[0].name,
                            'description': result[0].description,
                            'price': result[0].price,
                            'cpu': configuration.cpu,
                            'cpu_pinning': configuration.cpu_pinning,
                            'ram': configuration.ram,
                            'disk': configuration.disk,
                            'swap': configuration.swap,
                            'io': configuration.io,
                            'egg': configuration.egg,
                            'startup_command': configuration.startup_command,
                            'env': env
                        }
                    })
                } else if (result[0].category == 'proxmox') {
                  configuration = JSON.parse(result[0].configuration)
                  return res.json({
                    'error': false,
                    'data': {
                      'id': result[0].id,
                      'category': result[0].category,
                      'name': result[0].name,
                      'description': result[0].description,
                      'price': result[0].price,
                      'node': configuration.node,
                      'template_vmid': configuration.template_vmid,
                      'cores': configuration.cores,
                      'ram': configuration.ram,
                      'storage': configuration.storage,
                      'disk_size': configuration.disk_size,
                      'add_conf': configuration.add_conf
                    }
                })
              }
              } else {
                return res.json({
                  'error': false,
                  'data': {
                    'id': 404
                  }
                })
              }
            });
        } else {
          return res.json({'error': true, 'code': 403})
        }
      }
    });
  })

module.exports = router;