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
  if (seconds < 10) {seconds = "0" + seconds}
  if (hours < 10) {hours = "0" + hours}
  if (minutes < 10) {minutes = "0" + minutes}
  console.log('[' + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + '] ' + msg)
  fs.appendFileSync('latest.log', '[' + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + '] ' + msg + '\n')
}

const PORT = 400
var ipInfo = ""
const pterodactyl_api_key = "ptla_28BCpHTsEFDr80yyNU4WLsdkSbGwxnT5kqFuzEHjx81"
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '192.168.20.22',
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

app.post('/api/order-form', jsonParser, function (req, res) {
  var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
  connection.query(sql, function (err, result) {
    if (err) {logger(" [ERROR] Database error\n  " + err)};
    if (result.length == 0) {
      return res.json({'error': true, 'code': 404})
    } else {
      if (result[0].token === req.query.token) {

        var sql = `SELECT * FROM mc_products WHERE id = '${req.body.product_id}'`;
        connection.query(sql, function (err, result) {
          if (err) {logger(" [ERROR] Database error\n  " + err)};
          
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

            logger(JSON.stringify(data))
          
            fetch("https://panel.mercurycloud.fr/api/application/servers", {
              "method": "POST",
              "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${pterodactyl_api_key}`,
              },
              "body": JSON.stringify(data)
            }).then(response => console.log(response)).catch(err => console.error(err)).then(() => {
              logger(" [DEBUG] New service !" + "\n Name : " + req.body.order[0].srv_name + "\n Owner first name : " + req.body.order[1].first_name + "\n Owner last name : " + req.body.order[1].last_name + "\n Owner mail : " + req.body.order[1].mail) 
              return res.json({"error": false, "response": "OK"});
            })  
          });
          } else {
          return res.json({'error': true, 'code': 403})
        }
    }
  })
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
            return res.json({'error': false, 'uuid': result[0].uuid, 'token': result[0].token})
          });
        } else {
          return res.json({'error': true, 'code': 403})
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
  logger(" [INFO] User " + toString(req.body.username) + " created !")
  return res.json({"response": "OK"})
})

app.post('/api/create-product', jsonParser, function (req, res) {
  ipInfo = getIP(req);
  logger(' [DEBUG] GET from : ' + ipInfo.clientIp.split("::ffff:")[1] + `, ${req.query.uuid}`)
  var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
  connection.query(sql, function (err, result) {
    if (err) {logger(" [ERROR] Database error\n  " + err)};
    if (result.length == 0) {
      return res.json({'error': true, 'code': 404})
    } else {
      if (result[0].token === req.query.token) {
        var sql = `INSERT INTO mc_products (id, name, description, price, cpu, cpu_pinning, ram, disk, swap, io, egg, startup_command, env) VALUES('${crypto.randomBytes(3).toString('hex')}', '${req.body.name}', '${req.body.description}', '${req.body.price}', '${req.body.cpu}', '${req.body.cpu_pinning}', '${req.body.ram}', '${req.body.disk}', '${req.body.swap}', '${req.body.io}', '${req.body.egg}', '${req.body.startup_command}', '${req.body.env}')`;
        connection.query(sql, function (err, result) {
            if (err) {logger(" [ERROR] Database error\n  " + err)};
        });
        logger(" [DEBUG] Product " + toString(req.body.name) + " created !")
        return res.json({"error": false, "response": "OK"});
      } else {
        return res.json({'error': true, 'code': 403})
      }
    }
  });
})

app.delete('/api/delete-product', jsonParser, function (req, res) {
  ipInfo = getIP(req);
  var response = "OK"
  var error = false
  logger(' [DEBUG] GET from : ' + ipInfo.clientIp.split("::ffff:")[1] + `, ${req.query.uuid}`)
  var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
  connection.query(sql, function (err, result) {
    if (err) {logger(" [ERROR] Database error\n  " + err)};
    if (result.length == 0) {
      res.json({'error': true, 'code': 404})
    } else {
      if (result[0].token === req.query.token) {
        var sql = `DELETE FROM mc_products WHERE id='${req.body.id}'`;
        connection.query(sql, function (err, result) {
            if (err) {logger(" [ERROR] Database error\n  " + err), error = true, response = "Database error"};
        });
        logger(" [DEBUG] Product " + toString(req.body.id) + " deleted !")
        return res.json({"error": error, "response": response});
      } else {
        res.json({'error': true, 'code': 403})
      }
    }
  });
})

app.get('/api/mc-products', jsonParser, function (req, res) {
  ipInfo = getIP(req);
  logger(' [DEBUG] GET from : ' + ipInfo.clientIp.split("::ffff:")[1] + `, ${req.query.uuid}`)
  var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
  connection.query(sql, function (err, result) {
    if (err) {logger(" [ERROR] Database error\n  " + err)};
    if (result.length == 0) {
      return res.json({'error': true, 'code': 404})
    } else {
      if (result[0].token === req.query.token) {
        var sql = `SELECT * FROM mc_products`;
        connection.query(sql, function (err, result) {
            if (err) {logger(" [ERROR] Database error\n  " + err)};
            products = []
            for(var i= 0; i < result.length; i++)
            {
              products.push({
                "id": result[i].id,
                "name": result[i].name,
                "description": result[i].description,
                "price": result[i].price
              })
            }
            return res.json({'error': false, 'products': products})
          });
      } else {
        return res.json({'error': true, 'code': 403})
      }
    }
  });
})


app.get('/', (req, res) => {
    ipInfo = getIP(req);
    logger(' [DEBUG] GET from : ' + ipInfo.clientIp.split("::ffff:")[1] + `, ${req.query.uuid}`)
    var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
    connection.query(sql, function (err, result) {
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
  app.listen(PORT, () =>
     logger(` [INFO] MercuryCloud API listening on https://api.mercurycloud.fr/ !`)
  );
});