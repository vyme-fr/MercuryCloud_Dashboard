var router = require('express').Router();
const server = require('../../server.js')
var jsonParser = server.parser.json()
const config = require('../../config.json')
server.logger(" [INFO] /api/order-form route loaded !")

router.post('', jsonParser, function (req, res) {
  var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
  server.con.query(sql, function (err, result) {
    if (err) {server.logger(" [ERROR] Database error\n  " + err)};
    if (result.length == 0) {
      return res.json({'error': true, 'code': 404})
    } else {
      if (result[0].token === req.query.token) {

        var sql = `SELECT * FROM mc_products WHERE id = '${req.body.product_id}'`;
        server.con.query(sql, function (err, result) {
          if (err) {server.logger(" [ERROR] Database error\n  " + err)};
          
          var docker_img = "ghcr.io/pterodactyl/yolks:java_17"        
        
          let data = {
            'name': result[0].name + " " + req.body.order[0].srv_name + " (" + req.body.order[1].first_name + ")",
            "user": 1,
            "egg": parseInt(result[0].egg),
            'docker_image': docker_img,
            'startup': result[0].startup_command,
            "limits": {
                "memory": parseInt(result[0].ram),
                "swap": parseInt(result[0].swap),
                "disk": parseInt(result[0].disk),
                "io": parseInt(result[0].io),
                "cpu": parseInt(result[0].cpu)
              },
              "feature_limits": {
                'databases': parseInt(req.body.order[0].db_sup),
                'allocations': 0,
                'backups': parseInt(req.body.order[0].bkp_sup),
              },
              "environment": JSON.parse(result[0].env),
              "allocation": {
                "default": 1,
                "addtional": []
              },
              "deploy": {
                "locations": [2],
                "dedicated_ip": false,
                "port_range": []
              },
              "start_on_completion": false,
              "skip_scripts": false,
              "oom_disabled": true
            }

            server.logger(JSON.stringify(data))
          
            server.fetch("https://panel.mercurycloud.fr/api/application/servers", {
              "method": "POST",
              "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${config.pterodactyl_api_key}`,
              },
              "body": JSON.stringify(data)
            }).then(response => console.log(response.body)).catch(err => console.error(err)).then(() => {
                server.logger(" [DEBUG] New service !" + "\n Name : " + req.body.order[0].srv_name + "\n Owner first name : " + req.body.order[1].first_name + "\n Owner last name : " + req.body.order[1].last_name + "\n Owner mail : " + req.body.order[1].mail) 
              return res.json({"error": false, "response": "OK"});
            })  
          });
          } else {
          return res.json({'error': true, 'code': 403})
        }
    }
  })
})

module.exports = router;