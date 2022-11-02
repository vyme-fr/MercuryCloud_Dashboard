var router = require('express').Router({ mergeParams: true });
const server = require('../../../../server')
const route_name = "/services/files"
const jsonParser = server.parser.json()
const permissions_manager = require("../../../../utils/permissions-manager")
const config = require('../../../../config.json')
server.logger(" [INFO] /api" + route_name + " route loaded !")


// GET FILES //

router.get('', function (req, res) {
    ipInfo = server.ip(req);
    var IP = req.socket.remoteAddress;
    server.logger(' [DEBUG] GET /api' + route_name + ' from ' + IP + ` with uuid ${req.query.uuid}`)
    var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
    server.con.query(sql, function (err, result) {
        if (err) { server.logger(" [ERROR] Database error\n  " + err) };
        if (result.length == 0) {
            return res.json({ 'error': true, 'code': 404 })
        } else {
            if (result[0].token === req.query.token) {
                var id = req.params.service_name
                if (id == undefined) { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 101 }) }
                if (id == "") { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 102 }) }
                var directory = req.query.directory
                if (directory == undefined) { return res.json({ 'error': true, 'msg': "Directory query is required", "code": 101 }) }
                if (directory == "") { return res.json({ 'error': true, 'msg': "Directory query is required", "code": 102 }) }
                var sql = `SELECT * FROM services WHERE id = '${id}'`;
                server.con.query(sql, function (err, result) {
                    if (err) { server.logger(" [ERROR] Database error\n  " + err) };
                    if (result.length > 0) {
                        if (result[0].uuid == req.query.uuid) {
                            if (result[0].category == 'pterodactyl') {
                                service_config = JSON.parse(result[0].configuration)
                                server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/files/list?directory=" + directory, {
                                    "method": "GET",
                                    "headers": {
                                        "Accept": "application/json",
                                        "Content-Type": "application/json",
                                        "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                                    }
                                }).then(response => {
                                    return response.json()
                                }).then(data => {
                                    if (data.data.length >= 300) {
                                        return res.json({
                                            'error': false, 'data': [
                                                {
                                                    "object": "file_object",
                                                    "attributes": {
                                                        "name": "outof300fileslimit",
                                                        "mode": "xxxxx-xx-xx",
                                                        "mode_bits": "000",
                                                        "size": 0000,
                                                        "is_file": false,
                                                        "is_symlink": false,
                                                        "mimetype": "outof300fileslimit",
                                                        "created_at": "0000-00-00T00:00:41+00:00",
                                                        "modified_at": "0000-00-00T00:00:00+00:00"
                                                    }
                                                },
                                            ]
                                        })
                                    } else {
                                        return res.json({
                                            'error': false, 'data': data.data
                                        })
                                    }
                                }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
                            }
                        } else {
                            permissions_manager.has_permission(req.query.uuid, "LISTSERVICES").then(function (result_perm) {
                                if (result_perm) {
                                    if (result[0].category == 'pterodactyl') {
                                        service_config = JSON.parse(result[0].configuration)
                                        server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/files/list?directory=" + directory, {
                                            "method": "GET",
                                            "headers": {
                                                "Accept": "application/json",
                                                "Content-Type": "application/json",
                                                "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                                            }
                                        }).then(response => {
                                            return response.json()
                                        }).then(data => {
                                            if (data.data.length >= 300) {
                                                return res.json({
                                                    'error': false, 'data': [
                                                        {
                                                            "object": "file_object",
                                                            "attributes": {
                                                                "name": "outof300fileslimit",
                                                                "mode": "xxxxx-xx-xx",
                                                                "mode_bits": "000",
                                                                "size": 0000,
                                                                "is_file": false,
                                                                "is_symlink": false,
                                                                "mimetype": "outof300fileslimit",
                                                                "created_at": "0000-00-00T00:00:41+00:00",
                                                                "modified_at": "0000-00-00T00:00:00+00:00"
                                                            }
                                                        },
                                                    ]
                                                })
                                            } else {
                                                return res.json({
                                                    'error': false, 'data': data.data
                                                })
                                            }
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
})

// UPLOAD FILE //

router.post('', function (req, res) {
    ipInfo = server.ip(req);
    var IP = req.socket.remoteAddress;
    server.logger(' [DEBUG] GET /api' + route_name + ' from ' + IP + ` with uuid ${req.query.uuid}`)
    var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
    server.con.query(sql, function (err, result) {
        if (err) { server.logger(" [ERROR] Database error\n  " + err) };
        if (result.length == 0) {
            return res.json({ 'error': true, 'code': 404 })
        } else {
            if (result[0].token === req.query.token) {
                var id = req.params.service_name
                if (id == undefined) { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 101 }) }
                if (id == "") { return res.json({ 'error': true, 'msg': "Service id params is required", "code": 102 }) }
                var directory = req.query.directory
                if (directory == undefined) { return res.json({ 'error': true, 'msg': "Directory query is required", "code": 101 }) }
                if (directory == "") { return res.json({ 'error': true, 'msg': "Directory query is required", "code": 102 }) }
                var sql = `SELECT * FROM services WHERE id = '${id}'`;
                server.con.query(sql, function (err, result) {
                    if (err) { server.logger(" [ERROR] Database error\n  " + err) };
                    if (result.length > 0) {
                        if (result[0].uuid == req.query.uuid) {
                            if (result[0].category == 'pterodactyl') {
                                service_config = JSON.parse(result[0].configuration)
                                server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/files/upload", {
                                    "method": "GET",
                                    "headers": {
                                        "Accept": "application/json",
                                        "Content-Type": "application/json",
                                        "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                                    }
                                }).then(response => {
                                    return response.json()
                                }).then(data => {
                                    return res.json({
                                        'error': false, 'data': data.attributes.url
                                    })
                                }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 503, "msg": "Pterodactyl API error : " + err }) })
                            }
                        } else {
                            permissions_manager.has_permission(req.query.uuid, "LISTSERVICES").then(function (result_perm) {
                                if (result_perm) {
                                    if (result[0].category == 'pterodactyl') {
                                        service_config = JSON.parse(result[0].configuration)
                                        server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/files/upload", {
                                            "method": "GET",
                                            "headers": {
                                                "Accept": "application/json",
                                                "Content-Type": "application/json",
                                                "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                                            }
                                        }).then(response => {
                                            return response.json()
                                        }).then(data => {
                                            return res.json({
                                                'error': false, 'data': data.attributes.url
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
})

module.exports = router;