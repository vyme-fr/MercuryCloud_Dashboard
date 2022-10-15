var router = require('express').Router();
const server = require('../../server.js')
var jsonParser = server.parser.json()
const route_name = "/users"
const permissions_manager = require("../../utils/permissions-manager")
server.logger(" [INFO] /api" + route_name + " route loaded !")


// USERS LIST //

router.get('', function (req, res) {
    ipInfo = server.ip(req);

    var IP = req.socket.remoteAddress;
    server.logger(' [DEBUG] GET /api' + route_name + ' from ' + IP + ` with uuid ${req.query.uuid}`)
    var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
    server.con.query(sql, function (err, result) {
        if (err) { server.logger(" [ERROR] Database error\n  " + err) };
        if (result.length == 0) {
            return res.json({ 'error': true, 'code': 401 })
        } else {
            if (result[0].token === req.query.token) {
                permissions_manager.has_permission(req.query.uuid, "LISTUSERS").then(function (result) {
                    if (result) {
                        var sql = `SELECT * FROM users`;
                        server.con.query(sql, function (err, result) {
                            if (err) { server.logger(" [ERROR] Database error\n  " + err) };
                            users = []
                            for (var i = 0; i < result.length; i++) {
                                users.push({
                                    "uuid": result[i].uuid,
                                    "username": result[i].username,
                                    "mail": result[i].mail,
                                    "role": result[i].role,
                                    "balance": result[i].balance,
                                    "tickets": result[i].tickets,
                                    "services": result[i].services,
                                    "suspended_services": result[i].suspended_services,
                                    "alerts": result[i].alerts
                                })
                            }
                            return res.json({ 'error': false, 'users': users })
                        });
                    } else {
                        return res.json({
                            "error": true,
                            "code": 403
                        })
                    }
                })
            } else {
                return res.json({ 'error': true, 'code': 401 })
            }
        }
    });
})


// CREATE //

router.post('', jsonParser, function (req, res) {
    var IP = req.socket.remoteAddress;
    var sql = `SELECT mail FROM users WHERE mail = '${req.body.mail.toLowerCase()}'`;
    server.con.query(sql, function (err, result) {
        if (err) { server.logger(" [ERROR] Database error\n  " + err) };
        if (result.length > 0) {
            return res.json({ "error": true, "msg": "Mail already used" })
        } else {
            var sql = `SELECT username FROM users WHERE username = '${req.body.username}'`;
            server.con.query(sql, function (err, result) {
                if (err) { server.logger(" [ERROR] Database error\n  " + err) };
                if (result.length > 0) {
                    return res.json({ "error": true, "msg": "Username already exist" })
                } else {
                    server.bcrypt.hash(req.body.password, 10, function (err, hash) {
                        var sql = `INSERT INTO users (uuid, username, role, mail, token, password, first_name, last_name, tel, address_1, address_2, city, zip, country, state, balance, tickets, services, suspend_services, alerts) VALUES('${server.uuid.v4()}', '${req.body.username}', '${req.body.role}', '${req.body.mail.toLowerCase()}', '${server.crypto.randomBytes(20).toString('hex')}', '${hash}', '${req.body.first_name}', '${req.body.last_name}', '${req.body.tel}', '${req.body.address_1}', '${req.body.address_2}', '${req.body.city}', '${req.body.zip}', '${req.body.country}', '${req.body.state}', 0, 0, 0, 0, 0)`;
                        server.con.query(sql, function (err, result) {
                            if (err) { server.logger(" [ERROR] Database error\n  " + err); return res.json({ "error": true, "msg": "Database error " + err }) };
                        });
                    });
                    server.logger(" [DEBUG] User " + req.body.username + " created from " + IP + " !")
                    return res.json({ "error": false, "response": "User successfully created !" })
                }
            });
        }
    });
})


module.exports = router;