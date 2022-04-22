const https = require('https');
const express = require('express');
var getIP = require('ipware')().get_ip;
const fs = require('fs')
const fetch = require('cross-fetch');
const request = require('request');
const req = require('express/lib/request');
const bodyParser = require('body-parser')
const app = express();
const PORT = 400
var ipInfo = ""
const pterodactyl_api_key = "n6ZIvdfORa4WOUE8xFFTSnB7s8atEHTAZKDdxFnjUW92kklK"

function logger() {
    let date_ob = new Date();;
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    console.log('[' + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + '] [DEBUG] GET from : ' + ipInfo.clientIp.split("::ffff:")[1])
    fs.appendFileSync('latest.log', '[' + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + '] [DEBUG] GET from : ' + ipInfo.clientIp.split("::ffff:")[1] + '\n')
}

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
    bodyParser.json();
});

var jsonParser = bodyParser.json()



app.post('/api/create_ptero_services', jsonParser, function (req, res) {
  
  let data = {
    'name': req.body.name,
    'user': req.body.user,
    'egg': req.body.egg,
    'docker_image': req.body.docker_image,
    'startup': req.body.startup,
    'limits': {
        'memory': req.body.limits.memory,
        'swap': req.body.limits.swap,
        'disk': req.body.limits.disk,
        'io': req.body.limits.io,
        'cpu': req.body.limits.cpu,
    },
    'feature_limits': {
        'databases': req.body.feature_limits.databases,
        'allocations': req.body.feature_limits.allocations,
        'backups': req.body.feature_limits.backups,
    },
    'environment': req.body.environment,
    'allocation': req.body.allocation,
    'deploy': req.body.deploy,
    'start_on_completion': req.body.start_on_completion,
    'skip_scripts': req.body.skip_scripts,
    'oom_disabled': req.body.oom_disabled,
  }
  console.log(req.body)
  
  fetch("https://admin.arkia-mc.fr/api/application/servers", {
    "method": "POST",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${pterodactyl_api_key}`,
    },
    "body": JSON.stringify(req.body)
  }).then(response => console.log(response))
  .catch(err => console.error(err)).then(() => {res.send("OK !")})
})

app.get('/', (req, res) => {
    ipInfo = getIP(req);
    logger()
    usertoken = req.query.token;
    if (usertoken === "0123456789") {

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
        return res.json(
            {
                "error": 403,
                "msg": "Unauthorized access"
            }
        )
    }
});
app.listen(PORT, () =>
	 console.log(`\n\n[INFO] Arkia API listening on port http://localhost:${PORT}/ !\n\n`),
);
