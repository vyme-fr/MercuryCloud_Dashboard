var router = require('express').Router();
const server = require('../../server.js')
const route_name = "/users/user-info"
server.logger(" [INFO] /api" + route_name + " route loaded !")


router.get('', function (req, res) {
    ipInfo = server.ip(req);
      var forwardedIpsStr = req.header('x-forwarded-for');
      var IP = '';
      if (forwardedIpsStr) {
        IP = forwardedIps = forwardedIpsStr.split(',')[0];  
    }
    server.logger(' [DEBUG] GET /api' + route_name + ' from ' + IP + ` with uuid ${req.query.uuid}`)
    var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
    server.con.query(sql, function (err, result) {
      if (err) {server.logger(" [ERROR] Database error\n  " + err)};
      if (result.length == 0) {
        return res.json({'error': true, 'code': 404})
      } else {
        if (result[0].token == req.query.token) {
            var id = req.query.id
            if (id == undefined) {return res.json({'error': true, 'msg': "User id query is required", "code": 101})}
            if (id == "") {return res.json({'error': true, 'msg': "User id query is required", "code": 102})}
            var sql = `SELECT * FROM users WHERE uuid = '${id}'`;
            server.con.query(sql, function (err, result) {
                if (err) {server.logger(" [ERROR] Database error\n  " + err)};
                if (result.length > 0) {
                    return res.json({
                        'error': false,
                        'data': {
                          'uuid': result[0].uuid,
                          'username':  result[0].username,
                          'mail':  result[0].mail,
                          'role': result[0].role,
                          'first_name':  result[0].first_name,
                          'last_name':  result[0].last_name,
                          'tel':  result[0].tel,
                          'address_1':  result[0].address_1,
                          'address_2':  result[0].address_2,
                          'city':  result[0].city,
                          'zip':  result[0].zip,
                          'country':  result[0].country,
                          'state':  result[0].state
                        }
                      })
                } else {
                    return res.json({
                      'error': false,
                      'data': {
                        'uuid': 404
                      }
                    })
                  }
                });
            } else {
                return res.json({'error': true, 'code': 403})
            }
        }
    });
})


module.exports = router;