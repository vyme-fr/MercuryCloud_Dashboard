let router = require('express').Router();
const server = require('../../server.js')
let jsonParser = server.parser.json()
const route_name = "/roles"
const permissions_manager = require("../../utils/permissions-manager")
server.logger(" [INFO] /api" + route_name + " route loaded !")


// GET LIST //

router.get('', function (req, res) {
    const start = process.hrtime()
    ipInfo = server.ip(req);
    let IP = ""
    if (req.headers['x-forwarded-for'] == undefined) {
        IP = req.socket.remoteAddress.replace("::ffff:", "")
    } else {
        IP = req.headers['x-forwarded-for'].split(',')[0]
    }
    let sql = `SELECT token FROM users WHERE uuid = '${req.cookies.uuid}'`;
    server.con.query(sql, function (err, result) {
        if (err) { server.logger(" [ERROR] Database error\n  " + err) };
        if (result.length == 0) {
            return res.json({ 'error': true, 'code': 404 })
        } else {
            if (result[0].token === req.cookies.token) {
                permissions_manager.has_permission(req.cookies.uuid, "LISTROLES").then(function (result) {
                    if (result) {
                        let sql = `SELECT * FROM roles`;
                        server.con.query(sql, function (err, result) {
                            if (err) { server.logger(" [ERROR] Database error\n  " + err) };
                            roles = []
                            for (let i = 0; i < result.length; i++) {
                                roles.push({
                                    "id": result[i].id,
                                    "name": result[i].name
                                })
                            }
                            return res.json({ 'error': false, 'roles': roles })
                        });
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
    res.on('finish', () => {
        const durationInMilliseconds = server.getDurationInMilliseconds(start)
        server.logger(` [DEBUG] ${req.method} ${route_name} [FINISHED] [FROM ${IP}] in ${durationInMilliseconds.toLocaleString()} ms`)
    })
})


// POST ROLE //

router.post('', jsonParser, function (req, res) {
    const start = process.hrtime()
    ipInfo = server.ip(req);
    let IP = ""
    if (req.headers['x-forwarded-for'] == undefined) {
        IP = req.socket.remoteAddress.replace("::ffff:", "")
    } else {
        IP = req.headers['x-forwarded-for'].split(',')[0]
    }
    let sql = `SELECT token FROM users WHERE uuid = '${req.cookies.uuid}'`;
    server.con.query(sql, function (err, result) {
        if (err) { server.logger(" [ERROR] Database error\n  " + err) };
        if (result.length == 0) {
            return res.json({ 'error': true, 'code': 404 })
        } else {
            if (result[0].token === req.cookies.token) {
                permissions_manager.has_permission(req.cookies.uuid, "CREATEROLE").then(function (result) {
                    if (result) {
                        let permissions = ''
                        if (req.body.permissions.length < 1) {
                            permissions = "NONE"
                        } else {
                            permissions = req.body.permissions
                        }
                        let sql = `INSERT INTO roles (id, name, permissions) VALUES('${server.crypto.randomBytes(3).toString('hex')}', '${req.body.name}', '${permissions}')`;
                        server.con.query(sql, function (err, result) {
                            if (err) { server.logger(" [ERROR] Database error\n  " + err) };
                        });
                        server.logger(" [DEBUG] Role " + req.body.name + " created from " + IP + " !")
                        return res.json({ "error": false, "response": "OK" });
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
    res.on('finish', () => {
        const durationInMilliseconds = server.getDurationInMilliseconds(start)
        server.logger(` [DEBUG] ${req.method} ${route_name} [FINISHED] [FROM ${IP}] in ${durationInMilliseconds.toLocaleString()} ms`)
    })
})

module.exports = router;