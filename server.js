const https = require('https');
const express = require('express');
var getIP = require('ipware')().get_ip;
const fs = require('fs')
var crypto = require("crypto");
const uuid = require('uuid');
const fetch = require('cross-fetch');
const request = require('request');
const req = require('express/lib/request');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const app = express();

function logger(msg) {
  let date_ob = new Date();;
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  console.log('[' + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + '] ' + msg)
  fs.appendFileSync('latest.log', '[' + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + '] ' + msg + '\n')
}

const PORT = 400
var ipInfo = ""
const pterodactyl_api_key = "n6ZIvdfORa4WOUE8xFFTSnB7s8atEHTAZKDdxFnjUW92kklK"
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '192.168.50.17',
  user     : 'mercurycloud_api',
  password : 'r6z14kKL2tFDaU6G',
  database : 'mercurycloud_api'
});

logger(`   



  ███╗   ███╗███████╗██████╗  ██████╗██╗   ██╗██████╗ ██╗   ██╗     ██████╗██╗      ██████╗ ██╗   ██╗██████╗      █████╗ ██████╗ ██╗
  ████╗ ████║██╔════╝██╔══██╗██╔════╝██║   ██║██╔══██╗╚██╗ ██╔╝    ██╔════╝██║     ██╔═══██╗██║   ██║██╔══██╗    ██╔══██╗██╔══██╗██║
  ██╔████╔██║█████╗  ██████╔╝██║     ██║   ██║██████╔╝ ╚████╔╝     ██║     ██║     ██║   ██║██║   ██║██║  ██║    ███████║██████╔╝██║
  ██║╚██╔╝██║██╔══╝  ██╔══██╗██║     ██║   ██║██╔══██╗  ╚██╔╝      ██║     ██║     ██║   ██║██║   ██║██║  ██║    ██╔══██║██╔═══╝ ██║
  ██║ ╚═╝ ██║███████╗██║  ██║╚██████╗╚██████╔╝██║  ██║   ██║       ╚██████╗███████╗╚██████╔╝╚██████╔╝██████╔╝    ██║  ██║██║     ██║
  ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝        ╚═════╝╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝     ╚═╝  ╚═╝╚═╝     ╚═╝`);
connection.connect(function(err) {
  if (err) {
    logger(` [ERROR] Database error !\n  ${err.stack}`);
    return;
  }
  logger(` [INFO] Database succefull connected ! (${connection.threadId})`);


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
  logger(req.body)
  
  fetch("https://panel.mercucyrcloud.fr/api/application/servers", {
    "method": "POST",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${pterodactyl_api_key}`,
    },
    "body": JSON.stringify(req.body)
  }).then(response => logger(response))
  .catch(err => console.error(err)).then(() => {res.send("OK !")})
})

app.post('/api/order-form', jsonParser, function (req, res) {
  logger(req.body)
  res.json({"response": "OK"})
})

app.post('/api/login-user', jsonParser, function (req, res) {
  var sql = `SELECT password FROM users WHERE mail = '${req.body.mail}'`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    if (result.length == 0) {
      res.json({'error': true, 'code': 404})
    } else {
      bcrypt.compare(req.body.password, result[0].password, function(err, result) {
        if (result === true) {
          var sql = `SELECT * FROM users WHERE mail = '${req.body.mail}'`;
          connection.query(sql, function (err, result) {
            if (err) {logger(" [ERROR] Database error\n  " + err)};
            res.json({'error': false, 'uuid': result[0].uuid, 'token': result[0].token})
          });
        } else {
          res.json({'error': true, 'code': 403})
        }
      });
    }
  });
  logger(req.body)
})

app.post('/api/create-user', jsonParser, function (req, res) {
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    var sql = `INSERT INTO users (uuid, username, mail, token, password, balance, tickets, services, suspend_services, alerts) VALUES('${uuid.v4()}', '${req.body.username}', '${req.body.mail.toLowerCase()}', '${crypto.randomBytes(20).toString('hex')}', '${hash}', 0, 0, 0, 0, 0)`;
    connection.query(sql, function (err, result) {
        if (err) {logger(" [ERROR] Database error\n  " + err)};
    });
  });
  logger(" [INFO] User " + req.body.username + " created !")
  res.json({"response": "OK"})
})

app.get('/', (req, res) => {
    ipInfo = getIP(req);
    logger(' [DEBUG] GET from : ' + ipInfo.clientIp.split("::ffff:")[1])
    var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
    connection.query(sql, function (err, result) {
      if (err) {logger(" [ERROR] Database error\n  " + err)};
      if (result.length == 0) {
        res.json({'error': true, 'code': 404})
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
          res.json({'error': true, 'code': 403})
        }
      }
    });
});
app.listen(PORT, () =>
	 logger(` [INFO] MercuryCloud API listening on http://localhost:${PORT}/ !`));
});
