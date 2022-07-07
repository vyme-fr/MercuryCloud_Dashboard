var router = require('express').Router();
const server = require('../../server.js')
server.logger(" [INFO] /api/products/ptero-products route loaded !")

router.get('', function (req, res) {
  ipInfo = server.ip(req);
  server.logger(' [DEBUG] GET from : ' + ipInfo.clientIp.split("::ffff:")[1] + `, ${req.query.uuid}`)
  var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
  server.con.query(sql, function (err, result) {
    if (err) {server.logger(" [ERROR] Database error\n  " + err)};
    if (result.length == 0) {
      return res.json({'error': true, 'code': 404})
    } else {
      if (result[0].token === req.query.token) {
        var sql = `SELECT * FROM proxmox_products`;
        server.con.query(sql, function (err, result) {
            if (err) {server.logger(" [ERROR] Database error\n  " + err)};
            products = []
            for(var i= 0; i < result.length; i++)
            {
              products.push({
                "id": result[i].id,
                "name": result[i].name,
                "description": result[i].description,
                "price": result[i].price,
                "template_vmid": result[i].template_vmid,
                "cores": result[i].cores,
                "ram": result[i].ram,
                "storage": result[i].storage,
                "disk_size": result[i].disk_size,
                "add_conf": result[i].add_conf,
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

module.exports = router;