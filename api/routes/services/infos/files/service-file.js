let router = require('express').Router({ mergeParams: true });
const server = require('../../../../server')
const route_name = "/services/file"
const textParser = server.parser.text()
const jsonParser = server.parser.json()
const permissions_manager = require("../../../../utils/permissions-manager")
const config = require('../../../../config.json')
server.logger(" [INFO] /api" + route_name + " route loaded !")


// GET CONTENT //

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
                let id = req.params.service_name
                if (id == undefined) { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 101 }) }
                if (id == "") { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 102 }) }
                let path = req.query.path
                if (path == undefined) { return res.json({ 'error': true, 'msg': "Path query is required", "code": 101 }) }
                if (path == "") { return res.json({ 'error': true, 'msg': "Path query is required", "code": 102 }) }
                let sql = `SELECT * FROM services WHERE id = '${id}'`;
                server.con.query(sql, function (err, result) {
                    if (err) { server.logger(" [ERROR] Database error\n  " + err) };
                    if (result.length > 0) {
                        if (result[0].uuid == req.cookies.uuid) {
                            if (result[0].category == 'pterodactyl') {
                                service_config = JSON.parse(result[0].configuration)
                                if (path.endsWith(".png") || path.endsWith(".jpg") || path.endsWith(".jpeg") || path.endsWith(".pdf")) {
                                    server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/files/download?file=" + path, {
                                        "method": "GET",
                                        "headers": {
                                            "Accept": "application/json",
                                            "Content-Type": "application/json",
                                            "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                                        }
                                    }).then(response => {
                                        return response.json()
                                    }).then(data => {
                                        return res.send(data.attributes.url)
                                    }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
                                } else {
                                    server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/files/contents?file=" + path, {
                                        "method": "GET",
                                        "headers": {
                                            "Accept": "application/json",
                                            "Content-Type": "application/json",
                                            "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                                        }
                                    }).then(response => {
                                        return response.text()
                                    }).then(data => {
                                        return res.send(data)
                                    }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
                                }
                            }
                        } else {
                            permissions_manager.has_permission(req.cookies.uuid, "LISTSERVICES").then(function (result_perm) {
                                if (result_perm) {
                                    if (result[0].category == 'pterodactyl') {
                                        service_config = JSON.parse(result[0].configuration)
                                        if (path.endsWith(".png") || path.endsWith(".jpg") || path.endsWith(".jpeg") || path.endsWith(".pdf")) {
                                            server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/files/download?file=" + path, {
                                                "method": "GET",
                                                "headers": {
                                                    "Accept": "application/json",
                                                    "Content-Type": "application/json",
                                                    "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                                                }
                                            }).then(response => {
                                                return response.json()
                                            }).then(data => {
                                                return res.send(data.attributes.url)
                                            }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
                                        } else {
                                            server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/files/contents?file=" + path, {
                                                "method": "GET",
                                                "headers": {
                                                    "Accept": "application/json",
                                                    "Content-Type": "application/json",
                                                    "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                                                }
                                            }).then(response => {
                                                return response.text()
                                            }).then(data => {
                                                return res.send(data)
                                            }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
                                        }
                                    }
                                } else {
                                    return res.json({
                                        "error": true,
                                        "code": 403
                                    })
                                }
                            })
                        }
                    } else {
                        return res.json({
                            'error': false, 'data': {
                                'id': 404
                            }
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

// SAVE CONTENT //

router.post('', textParser, function (req, res) {
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
                let id = req.params.service_name
                if (id == undefined) { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 101 }) }
                if (id == "") { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 102 }) }
                let path = req.query.path
                if (path == undefined) { return res.json({ 'error': true, 'msg': "Path query is required", "code": 101 }) }
                if (path == "") { return res.json({ 'error': true, 'msg': "Path query is required", "code": 102 }) }
                let sql = `SELECT * FROM services WHERE id = '${id}'`;
                server.con.query(sql, function (err, result) {
                    if (err) { server.logger(" [ERROR] Database error\n  " + err) };
                    if (result.length > 0) {
                        if (result[0].uuid == req.cookies.uuid) {
                            if (result[0].category == 'pterodactyl') {
                                service_config = JSON.parse(result[0].configuration)
                                server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/files/write?file=" + path, {
                                    "method": "POST",
                                    "headers": {
                                        "Accept": "application/json",
                                        "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                                    },
                                    "body": req.body
                                }).then(response => {
                                    return response.text()
                                }).then(data => {
                                    return res.json({
                                        'error': false,
                                        'data': "OK"
                                    })
                                }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
                            }
                        } else {
                            permissions_manager.has_permission(req.cookies.uuid, "EDITSERVICE").then(function (result_perm) {
                                if (result_perm) {
                                    if (result[0].category == 'pterodactyl') {
                                        service_config = JSON.parse(result[0].configuration)
                                        server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/files/write?file=" + path, {
                                            "method": "POST",
                                            "headers": {
                                                "Accept": "application/json",
                                                "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                                            },
                                            "body": req.body
                                        }).then(response => {
                                            return response.text()
                                        }).then(data => {
                                            return res.json({
                                                'error': false,
                                                'data': "OK"
                                            })
                                        }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
                                    }
                                } else {
                                    return res.json({
                                        "error": true,
                                        "code": 403
                                    })
                                }
                            })
                        }
                    } else {
                        return res.json({
                            'error': false, 'data': {
                                'id': 404
                            }
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

// RENAME FILE //

router.put('', jsonParser, function (req, res) {
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
                let id = req.params.service_name
                if (id == undefined) { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 101 }) }
                if (id == "") { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 102 }) }
                let root = req.body.root
                if (root == undefined) { return res.json({ 'error': true, 'msg': "Root params is required in the body", "code": 101 }) }
                if (root == "") { return res.json({ 'error': true, 'msg': "Root params is required in the body", "code": 102 }) }
                let from = req.body.from
                if (from == undefined) { return res.json({ 'error': true, 'msg': "From params is required", "code": 101 }) }
                if (from == "") { return res.json({ 'error': true, 'msg': "Path params is required in the body", "code": 102 }) }
                let to = req.body.to
                if (to == undefined) { return res.json({ 'error': true, 'msg': "To params is required in the body", "code": 101 }) }
                if (to == "") { return res.json({ 'error': true, 'msg': "To params is required in the body", "code": 102 }) }
                let sql = `SELECT * FROM services WHERE id = '${id}'`;
                server.con.query(sql, function (err, result) {
                    if (err) { server.logger(" [ERROR] Database error\n  " + err) };
                    if (result.length > 0) {
                        if (result[0].uuid == req.cookies.uuid) {
                            if (result[0].category == 'pterodactyl') {
                                service_config = JSON.parse(result[0].configuration)
                                let body = {
                                    "root": root,
                                    "files": [
                                        {
                                            "from": from,
                                            "to": to
                                        }
                                    ]
                                }
                                server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/files/rename", {
                                    "method": "PUT",
                                    "headers": {
                                        "Accept": "application/json",
                                        "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                                    },
                                    "body": body.toString()
                                }).then(response => {
                                    return response.text()
                                }).then(data => {
                                    console.log(data)
                                    return res.json({
                                        'error': false,
                                        'data': "OK"
                                    })
                                }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
                            }
                        } else {
                            permissions_manager.has_permission(req.cookies.uuid, "EDITSERVICE").then(function (result_perm) {
                                if (result_perm) {
                                    if (result[0].category == 'pterodactyl') {
                                        service_config = JSON.parse(result[0].configuration)
                                        let body = {
                                            "root": root,
                                            "files": [
                                                {
                                                    "from": from,
                                                    "to": to
                                                }
                                            ]
                                        }
                                        server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/files/rename", {
                                            "method": "PUT",
                                            "headers": {
                                                "Accept": "application/json",
                                                "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                                            },
                                            "body": body.toString()
                                        }).then(response => {
                                            return response.text()
                                        }).then(data => {
                                            console.log(data)
                                            return res.json({
                                                'error': false,
                                                'data': "OK"
                                            })
                                        }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
                                    }
                                } else {
                                    return res.json({
                                        "error": true,
                                        "code": 403
                                    })
                                }
                            })
                        }
                    } else {
                        return res.json({
                            'error': false, 'data': {
                                'id': 404
                            }
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