const https = require('https');
const express = require('express');
const getIP = require('ipware')().get_ip;
const fs = require('fs')
const crypto = require("crypto");
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const app = express();
const nodemailer = require("nodemailer");
const config = require("./config.json")
const fetch = require('node-fetch');
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});
const server_opt = {
  cert: fs.readFileSync(config.api_ssl_cert_path),
  key: fs.readFileSync(config.api_ssl_privkey_path)
}

let start_date = new Date();
let date = ("0" + start_date.getDate()).slice(-2);
let month = ("0" + (start_date.getMonth() + 1)).slice(-2);
let year = start_date.getFullYear();
let hours = start_date.getHours();
let minutes = start_date.getMinutes();
if (hours < 10) { hours = "0" + hours }
if (minutes < 10) { minutes = "0" + minutes }
const start_time = year + "-" + month + "-" + date

function logger(msg) {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  if (seconds < 10) { seconds = "0" + seconds }
  if (hours < 10) { hours = "0" + hours }
  if (minutes < 10) { minutes = "0" + minutes }
  console.log('[' + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + ']' + msg)
  fs.appendFileSync('logs/' + start_time + '.log', '[' + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + ']' + msg + '\n')
  fs.appendFileSync('logs/latest.log', '[' + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds + ']' + msg + '\n')
}

const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9
  const NS_TO_MS = 1e6
  const diff = process.hrtime(start)

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

logger(" [INFO] The API is starting...")

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: config.mysql_host,
  user: config.mysql_usr,
  password: config.mysql_passwd,
  database: config.mysql_db
});

exports.uuid = uuid
exports.fetch = fetch
exports.crypto = crypto
exports.bcrypt = bcrypt
exports.parser = bodyParser
exports.logger = logger
exports.con = connection
exports.ip = getIP
exports.httpsAgent = httpsAgent
exports.getDurationInMilliseconds = getDurationInMilliseconds

logger(`   



  ███╗   ███╗███████╗██████╗  ██████╗██╗   ██╗██████╗ ██╗   ██╗     ██████╗██╗      ██████╗ ██╗   ██╗██████╗      █████╗ ██████╗ ██╗
  ████╗ ████║██╔════╝██╔══██╗██╔════╝██║   ██║██╔══██╗╚██╗ ██╔╝    ██╔════╝██║     ██╔═══██╗██║   ██║██╔══██╗    ██╔══██╗██╔══██╗██║
  ██╔████╔██║█████╗  ██████╔╝██║     ██║   ██║██████╔╝ ╚████╔╝     ██║     ██║     ██║   ██║██║   ██║██║  ██║    ███████║██████╔╝██║
  ██║╚██╔╝██║██╔══╝  ██╔══██╗██║     ██║   ██║██╔══██╗  ╚██╔╝      ██║     ██║     ██║   ██║██║   ██║██║  ██║    ██╔══██║██╔═══╝ ██║
  ██║ ╚═╝ ██║███████╗██║  ██║╚██████╗╚██████╔╝██║  ██║   ██║       ╚██████╗███████╗╚██████╔╝╚██████╔╝██████╔╝    ██║  ██║██║     ██║
  ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝        ╚═════╝╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝     ╚═╝  ╚═╝╚═╝     ╚═╝`);
connection.connect(function (err) {
  if (err) {
    logger(` [ERROR] Database error !\n  ${err.stack}`);
    process.exit(1);
  }
  logger(` [INFO] Database successfully connected ! (${connection.threadId})`);

  function services_action_logger(service_id, uuid, ip, action) {
    let sql = `INSERT INTO services_logs (service_id, timestamp, uuid, ip, action) VALUES('${service_id}', '${Date.now()}', '${uuid}', '${ip}', '${action}')`;
    connection.query(sql, function (err) {
      if (err) { server.logger(" [ERROR] Database error\n  " + err) }
    });
  }
  exports.services_action_logger = services_action_logger


  fetch(`${config.proxmox_url}/api2/json/access/ticket?username=${config.proxmox_user}&password=${config.proxmox_passwd}`, {
    "method": "POST",
    "headers": {
    },
    "body": "",
    "agent": httpsAgent
  }).then((response) => response.json())
    .then((data) => {
      const proxmox_ticket = data.data.ticket
      const proxmox_CSRFPreventionToken = data.data.CSRFPreventionToken
      exports.proxmox_ticket = proxmox_ticket
      exports.proxmox_CSRFPreventionToken = proxmox_CSRFPreventionToken
      logger(" [INFO] Proxmox API loaded ! (" + data.data.username + ")");
      exports.mail_transporter = nodemailer.createTransport({
        host: config.smtp_host,
        port: config.smtp_port,
        secure: config.smtp_ssl,
        auth: {
          user: config.smtp_username,
          pass: config.smtp_pswd
        }
      })
      logger(" [INFO] SMTP Client loaded ! (" + config.smtp_host + ":" + config.smtp_port + ")");
      app.use((req, res, next) => {
        res.append('Access-Control-Allow-Origin', ['*']);
        res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.append("Access-Control-Allow-Headers", "auth-uuid, auth-token, Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        next();
        bodyParser.json();
      });
      app.use(require('./utils/rate-limit'));
      app.use(cookieParser());
      // app.use(require('./utils/sql-injection'));

      // index //
      app.use('/api/', require('./routes/index'));

      // products //
      app.use('/api/products', require('./routes/products/products'));
      app.use('/api/products/:product_id', require('./routes/products/infos/product-info'));
      app.use('/api/products/proxmox/qemu', require('./routes/products/infos/proxmox/qemu'));
      app.use('/api/products/proxmox/nodes', require('./routes/products/infos/proxmox/nodes'));
      app.use('/api/products/proxmox/storage', require('./routes/products/infos/proxmox/storage'));

      // users //
      app.use('/api/users', require('./routes/users/users'));
      app.use('/api/users/:user_uuid', require('./routes/users/infos/user-info'));
      app.use('/api/users/:user_mail/login', require('./routes/users/infos/user-login'));

      // roles //
      app.use('/api/roles', require('./routes/roles/roles'));
      app.use('/api/roles/:role_id', require('./routes/roles/infos/role-info'));


      // services //
      app.use('/api/services', require('./routes/services/services'));
      app.use('/api/services/:service_name', require('./routes/services/infos/service-info'));
      app.use('/api/services/:service_name/files', require('./routes/services/infos/files/service-files'));
      app.use('/api/services/:service_name/files/delete', require('./routes/services/infos/files/delete-files'));
      app.use('/api/services/:service_name/file', require('./routes/services/infos/files/service-file'));
      app.use('/api/services/:service_name/proxmox/vnc/ticket', require('./routes/services/infos/proxmox/vnc/ticket'));
      app.use('/api/services/:service_name/proxmox/vnc/websocket', require('./routes/services/infos/proxmox/vnc/websocket'));

      // upgrades //
      app.use('/api/upgrades', require('./routes/products/upgrades/upgrades'));


      // utils //
      app.use('/api/utils/send-mail', require('./routes/utils/send-mail'));

      https.createServer(server_opt, app).listen(config.api_port, config.api_bind_address, function () {
        logger(` [INFO] MercuryCloud API v${config.api_version} listening on ${config.api_url} !`)
      });
    }).catch((error) => {
      if (error.toString().includes("null (reading 'ticket')")) {
        logger(" [ERROR] Proxmox API error : Wrong user password or username !");
      } else {
        logger(" [ERROR] Proxmox API error : " + error);
      }
      process.exit(1);
    });
});
