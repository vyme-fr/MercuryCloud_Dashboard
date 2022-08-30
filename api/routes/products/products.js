var router = require('express').Router();
const server = require('../../server.js')
const route_name = "/products/products"
const permissions_manager = require("../../utils/permissions-manager.js")
server.logger(" [INFO] /api" + route_name + " route loaded !")
router.get('', function (req, res) {
  ipInfo = server.ip(req);
    var forwardedIpsStr = req.header('x-forwarded-for');
  var IP = '';

  if (forwardedIpsStr) {
     IP = forwardedIps = forwardedIpsStr.split(',')[0];  
  }
  server.logger(' [DEBUG] GET /api' + route_name + ' from ' + IP)
  var sql = `SELECT * FROM products`;
  server.con.query(sql, function (err, result) {
      if (err) {server.logger(" [ERROR] Database error\n  " + err)};
      products = []
      for(var i= 0; i < result.length; i++)
      {
        products.push({
          "id": result[i].id,
          "category": result[i].category,
          "name": result[i].name,
          "description": result[i].description,
          "price": result[i].price,
          "configuration": JSON.parse(result[i].configuration)
        })
      }
      return res.json({'error': false, 'data': products})
    });
})

module.exports = router;