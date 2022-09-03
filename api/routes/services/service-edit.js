var router = require('express').Router();
const server = require('../../server.js')
var jsonParser = server.parser.json()
const route_name = "/services/edit-service"
const permissions_manager = require("../../utils/permissions-manager")
server.logger(" [INFO] /api" + route_name + " route loaded !")

router.post('', jsonParser, function (req, res) {
  ipInfo = server.ip(req);
  var forwardedIpsStr = req.header('x-forwarded-for');
  var IP = '';

  if (forwardedIpsStr) {
    IP = forwardedIps = forwardedIpsStr.split(',')[0];
  }
  var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
  server.con.query(sql, function (err, result) {
    if (err) { server.logger(" [ERROR] Database error\n  " + err) };
    if (result.length == 0) {
      return res.json({ 'error': true, 'code': 404 })
    } else {
      if (result[0].token === req.query.token) {
        permissions_manager.has_permission(req.query.uuid, "EDITSERVICE").then(function (result) {
          if (result) {
            var sql = `SELECT * FROM services WHERE id = '${req.body.id}'`;
            server.con.query(sql, function (err, result) {
              var sql = `UPDATE services SET uuid = '${req.body.uuid}', name = '${req.body.name}', product_id = '${req.body.product_id}', price = '${req.body.price}', statut = '${req.body.statut}' WHERE id = '${req.body.id}';`;
              server.con.query(sql, function (err) {
                if (err) { server.logger(" [ERROR] Database error\n  " + err); return res.json({ "error": true, "msg": "Database error : " + err }) };
              });
              server.logger(" [DEBUG] Service " + req.body.name + " updated from " + IP + " with uuid " + req.query.uuid + " !")
              if (result[0].name != req.body.name) { server.services_action_logger(req.body.id, req.query.uuid, IP, "Modification du nom du service " + result[0].name + " vers " + req.body.name) }
              if (result[0].uuid != req.body.uuid) { server.services_action_logger(req.body.id, req.query.uuid, IP, "Modification du propriétaire du service " + result[0].name + " passant de " + result[0].uuid + " à " + req.body.uuid) }
              if (result[0].product_id != req.body.product_id) { server.services_action_logger(req.body.id, req.query.uuid, IP, "Modification du produit du service " + result[0].name + " passant de " + result[0].product_id + " à " + req.body.product_id) }
              if (result[0].price != req.body.price) { server.services_action_logger(req.body.id, req.query.uuid, IP, "Modification du prix du service " + result[0].name + " passant de " + result[0].price + " à " + req.body.price) }
              if (result[0].statut != req.body.statut) { server.services_action_logger(req.body.id, req.query.uuid, IP, "Modification du status du service " + result[0].name + " passant de " + result[0].statut + " à " + req.body.statut) }
              return res.json({ "error": false, "response": "OK" });
            })
          } else {
            return res.json({
              "error": true,
              "code": 403
            })
          }
        })

      } else {
        return res.json({ 'error': true, 'code': 403 })
      }
    }
  });
})

module.exports = router;