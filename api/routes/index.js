var router = require('express').Router();
const server = require('../server.js')
const route_name = "/"
server.logger(" [INFO] /api" + route_name + " route loaded !")
function getRandomInt(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
}
router.get('', (req, res) => {
  var forwardedIpsStr = req.header('x-forwarded-for');
  var IP = '';

  if (forwardedIpsStr) {
    IP = forwardedIps = forwardedIpsStr.split(',')[0];
  }
  server.logger(' [DEBUG] GET /api' + route_name + ' from ' + IP + ` with uuid ${req.query.uuid}`)
  var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
  server.con.query(sql, function (err, result) {
    if (err) { logger(" [ERROR] Database error\n  " + err) };
    if (result.length == 0) {
      return res.json({ 'error': true, 'code': 404 })
    } else {
      if (result[0].token === req.query.token) {
        var sql = `SELECT * FROM users WHERE uuid = '${req.query.uuid}'`;
        server.con.query(sql, function (err, result1) {
          if (err) { server.logger(" [ERROR] Database error\n  " + err) };
          var sql = `SELECT * FROM roles WHERE id = '${result1[0].role}'`;
          server.con.query(sql, function (err, result2) {
            if (err) { server.logger(" [ERROR] Database error\n  " + err) };
            var activity = []
            activity.push({
              "name": "Maintenance Serveur PVE-1",
              "date": "17 FEV 15:59"
            })
            activity.push({
              "name": "Maintenance réseau",
              "date": "11 JUL 8:10"
            })
            activity.push({
              "name": "Maintenance DNS",
              "date": "15 JUN 11:00"
            })
            var cpu = []
            var ram = []
            for (let i = 0; i < 24; i++) {
              cpu.push(getRandomInt(80, 10))
            }
            for (let i = 0; i < 24; i++) {
              ram.push(getRandomInt(60, 30))
            }
            return res.json(
              {
                "error": false,
                "username": result1[0].username,
                "role": result1[0].role,
                "role_name": result2[0].name,
                "permissions": result2[0].permissions,
                "stats_array": {
                  "CPU": cpu,
                  "RAM": ram
                },
                "counters": [58.6 + '€', 68.5 + '€', 16, 3, 0, 0],
                "activity": activity,
                "invoices_table": [
                  {
                    "name": "Paiement par mois VPS5",
                    "date": "18/03/2022",
                    "price": 185.25,
                    "status": "Terminé"
                  },
                  {
                    "name": "Developpement site web",
                    "date": "22/02/2022",
                    "price": 18.80,
                    "status": "En Attente"
                  }, {
                    "name": "Paiement par mois DEDI1",
                    "date": "22/02/2022",
                    "price": 485.25,
                    "status": "Remboursé"
                  },
                  {
                    "name": "Paiement par mois VPS5",
                    "date": "18/02/2022",
                    "price": 185.25,
                    "status": "Terminé"
                  }
                ],
                "get_ip": IP
              });

          })
        })
      } else {
        return res.json({ 'error': true, 'code': 403 })
      }
    }
  });
});

module.exports = router;