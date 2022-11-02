var router = require('express').Router({ mergeParams: true });
const server = require('../../../../server')
const route_name = "/services/files/delete"
const jsonParser = server.parser.json()
const permissions_manager = require("../../../../utils/permissions-manager")
const config = require('../../../../config.json')
server.logger(" [INFO] /api" + route_name + " route loaded !")


// DELETE FILES //

router.post('', jsonParser, function (req, res) {
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
                var root = req.body.root
                if (root == undefined) { return res.json({ 'error': true, 'msg': "Root params is required in the json body", "code": 101 }) }
                if (root == "") { return res.json({ 'error': true, 'msg': "Root params is required", "code": 102 }) }
                var files = req.body.files
                if (files == undefined) { return res.json({ 'error': true, 'msg': "Root params is required in the json body", "code": 101 }) }
                if (files == "") { return res.json({ 'error': true, 'msg': "Root params is required", "code": 102 }) }
                var sql = `SELECT * FROM services WHERE id = '${id}'`;
                server.con.query(sql, function (err, result) {
                    if (err) { server.logger(" [ERROR] Database error\n  " + err) };
                    if (result.length > 0) {
                        if (result[0].uuid == req.query.uuid) {
                            if (result[0].category == 'pterodactyl') {
                                service_config = JSON.parse(result[0].configuration)
                                let body = {
                                    'root': root,
                                    'files': files
                                }
                                server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/files/delete", {
                                    "method": "POST",
                                    "headers": {
                                        "Accept": "application/json",
                                        "Content-Type": "application/json",
                                        "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                                    },
                                    "body": JSON.stringify(body)
                                }).then(response => {
                                    return response.text()
                                }).then(data => {
                                    return res.json({ "error": false, "msg": "OK!" })
                                }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 500, "msg": "Pterodactyl API error : " + err }) })
                            }
                        } else {
                            permissions_manager.has_permission(req.query.uuid, "LISTSERVICES").then(function (result_perm) {
                                if (result_perm) {
                                    if (result[0].category == 'pterodactyl') {
                                        service_config = JSON.parse(result[0].configuration)
                                        let body = {
                                            'root': root,
                                            'files': files
                                        }
                                        server.fetch(config.pterodactyl_url + "/api/client/servers/" + service_config.identifier + "/files/delete", {
                                            "method": "POST",
                                            "headers": {
                                                "Accept": "application/json",
                                                "Content-Type": "application/json",
                                                "Authorization": `Bearer ${config.pterodactyl_user_api_key}`,
                                            },
                                            "body": JSON.stringify(body)
                                        }).then(response => {
                                            return response.text()
                                        }).then(data => {
                                            return res.json({ "error": false, "msg": "OK!" })
                                        }).catch(err => { server.logger(" [ERROR] Pterodactyl API error : " + err); return res.json({ "error": true, "code": 500, "msg": "Pterodactyl API error : " + err }) })
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