const https = require('https');
const express = require('express');
var getIP = require('ipware')().get_ip;
const fs = require('fs')
var crypto = require("crypto");
const uuid = require('uuid');
const request = require('request');
const req = require('express/lib/request');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const app = express();
const config = require("./config.json")
const fetch = require('cross-fetch');

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});


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
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : config.mysql_host,
  user     : config.mysql_usr,
  password : config.mysql_passwd,
  database : config.mysql_db
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

    
    app.use((req, res, next) => {
      res.append('Access-Control-Allow-Origin', ['*']);
      res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.append('Access-Control-Allow-Headers', 'Content-Type');
      next();
      bodyParser.json();
    });
  
    // index //
    app.use('/api/', require('./routes/index.js'));
  
    // products //
    app.use('/api/products/ptero-product-info', require('./routes/products/ptero-product-info.js'));
    app.use('/api/products/ptero-products', require('./routes/products/ptero-products.js'));
    app.use('/api/products/ptero-create-product', require('./routes/products/ptero-create-product.js'));
    app.use('/api/products/ptero-delete-product', require('./routes/products/ptero-delete-product.js'));
    app.use('/api/products/proxmox-product-info', require('./routes/products/proxmox-product-info.js'));
    app.use('/api/products/proxmox-products', require('./routes/products/proxmox-products.js'));
    app.use('/api/products/proxmox-create-product', require('./routes/products/proxmox-create-product.js'));
    app.use('/api/products/proxmox-delete-product', require('./routes/products/proxmox-delete-product.js'));
    app.use('/api/products/proxmox-qemu-list', require('./routes/products/proxmox-qemu-list.js'));
    app.use('/api/products/proxmox-nodes-list', require('./routes/products/proxmox-nodes-list.js'));
    app.use('/api/products/proxmox-storage-list', require('./routes/products/proxmox-storage-list.js'));



  
    // users //
    app.use('/api/users/create-user', require('./routes/users/create-user.js'));
    app.use('/api/users/login-user', require('./routes/users/login-user.js'));
    app.use('/api/users/users-list', require('./routes/users/users-list.js'));
    app.use('/api/users/user-info', require('./routes/users/user-info.js'));
    app.use('/api/users/username-exist', require('./routes/users/username-exist.js'));
    app.use('/api/users/mail-exist', require('./routes/users/mail-exist.js'));
    app.use('/api/users/delete-user', require('./routes/users/delete-user.js'));
  
    // services //
    app.use('/api/services/order-form', require('./routes/services/order-form.js'));
  
    app.listen(PORT, () =>
       logger(` [INFO] MercuryCloud API listening on https://api.mercurycloud.fr/ !`)
    );
    })
  .catch((error) => {
    logger(" [ERROR] Proxmox API error : "  + error);
  });
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