var router = require('express').Router();
const server = require('../server.js')
router.get('', (req, res) => {
    ipInfo = server.ip(req);
    server.logger(' [DEBUG] GET from : ' + ipInfo.clientIp.split("::ffff:")[1] + `, ${req.query.uuid}`)
    var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
    server.con.query(sql, function (err, result) {
      if (err) {logger(" [ERROR] Database error\n  " + err)};
      if (result.length == 0) {
        return res.json({'error': true, 'code': 404})
      } else {
        if (result[0].token === req.query.token) {
            var activity = []
            activity.push({
                "name": "Maintenance Serveur Epsilon",
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
            return res.json(
            {
              "error": false,
              "username": "Savalet",
              "stats_array": {
                  "CPU": [15, 5, 25, 86, 45, 66, 15],
                  "RAM": [72, 96, 56, 60, 74, 60, 78]
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
                },              {
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
                "get_ip": ipInfo.clientIp.split("::ffff:")[1]
              });
          } else {
              return res.json({'error': true, 'code': 403})
          }
        }
    });
});

module.exports = router;