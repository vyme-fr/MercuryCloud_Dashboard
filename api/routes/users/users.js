let router = require('express').Router();
const server = require('../../server.js')
let jsonParser = server.parser.json()
const route_name = "/users"
const permissions_manager = require("../../utils/permissions-manager")
server.logger(" [INFO] /api" + route_name + " route loaded !")


// USERS LIST //

router.get('', function (req, res) {
    const start = process.hrtime()
    let IP = ""
    if (req.headers['x-forwarded-for'] == undefined) {
        IP = req.socket.remoteAddress.replace("::ffff:", "")
    } else {
        IP = req.headers['x-forwarded-for'].split(',')[0]
    }
    const sql = `SELECT token FROM users WHERE uuid = '${req.cookies.uuid}'`;
    server.con.query(sql, function (err, result) {
        if (err) { server.logger(" [ERROR] Database error\n  " + err) };
        if (result.length == 0) {
            return res.json({ 'error': true, 'code': 401 })
        } else {
            if (result[0].token === req.cookies.token) {
                permissions_manager.has_permission(req.cookies.uuid, "LISTUSERS").then(function (result) {
                    if (result) {
                        let sql = `SELECT * FROM users`;
                        server.con.query(sql, function (err, result) {
                            if (err) { server.logger(" [ERROR] Database error\n  " + err) };
                            users = []
                            for (let i = 0; i < result.length; i++) {
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
    res.on('finish', () => {
        const durationInMilliseconds = server.getDurationInMilliseconds(start)
        server.logger(` [DEBUG] ${req.method} ${route_name} [FINISHED] [FROM ${IP}] in ${durationInMilliseconds.toLocaleString()} ms`)
    })
})


// CREATE //

router.post('', jsonParser, function (req, res) {
    const start = process.hrtime()
    let IP = ""
    if (req.headers['x-forwarded-for'] == undefined) {
        IP = req.socket.remoteAddress.replace("::ffff:", "")
    } else {
        IP = req.headers['x-forwarded-for'].split(',')[0]
    }
    let sql = `SELECT mail FROM users WHERE mail = '${req.body.mail.toLowerCase()}'`;
    server.con.query(sql, function (err, result) {
        if (err) { server.logger(" [ERROR] Database error\n  " + err) };
        if (result.length > 0) {
            return res.json({ "error": true, "msg": "Mail already used" })
        } else {
            let sql = `SELECT username FROM users WHERE username = '${req.body.username}'`;
            server.con.query(sql, function (err, result) {
                if (err) { server.logger(" [ERROR] Database error\n  " + err) };
                if (result.length > 0) {
                    return res.json({ "error": true, "msg": "Username already exist" })
                } else {
                    server.bcrypt.hash(req.body.password, 10, function (err, hash) {
                        let sql = `INSERT INTO users (uuid, username, role, mail, token, password, first_name, last_name, tel, address_1, address_2, city, zip, country, state, balance, tickets, services, suspend_services, alerts) VALUES('${server.uuid.v4()}', '${req.body.username}', '${req.body.role}', '${req.body.mail.toLowerCase()}', '${server.crypto.randomBytes(20).toString('hex')}', '${hash}', '${req.body.first_name}', '${req.body.last_name}', '${req.body.tel}', '${req.body.address_1}', '${req.body.address_2}', '${req.body.city}', '${req.body.zip}', '${req.body.country}', '${req.body.state}', 0, 0, 0, 0, 0)`;
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
    res.on('finish', () => {
        const durationInMilliseconds = server.getDurationInMilliseconds(start)
        server.logger(` [DEBUG] ${req.method} ${route_name} [FINISHED] [FROM ${IP}] in ${durationInMilliseconds.toLocaleString()} ms`)
    })
})


module.exports = router;