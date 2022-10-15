var router = require('express').Router({ mergeParams: true });
const server = require('../../../server.js')
var jsonParser = server.parser.json()
const route_name = "/products/:product_id"
const permissions_manager = require("../../../utils/permissions-manager.js")
server.logger(" [INFO] /api" + route_name + " route loaded !")


// GET INFOS //

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
            if (result[0].token == req.query.token) {
                permissions_manager.has_permission(req.query.uuid, "LISTPRODUCTS").then(function (result) {
                    if (result) {
                        var id = req.params.product_id
                        if (id == undefined) { return res.json({ 'error': true, 'msg': "Id params is required", "code": 101 }) }
                        if (id == "") { return res.json({ 'error': true, 'msg': "Id params is required", "code": 102 }) }
                        var sql = `SELECT * FROM products WHERE id = '${id}'`;
                        server.con.query(sql, function (err, result) {
                            if (err) { server.logger(" [ERROR] Database error\n  " + err) };
                            if (result.length > 0) {
                                if (result[0].category == 'pterodactyl') {
                                    var env = []
                                    configuration = JSON.parse(result[0].configuration)
                                    env_json = configuration.env
                                    Object.keys(env_json).forEach((key) => {
                                        env.push(env_json[key])
                                    })
                                    return res.json({
                                        'error': false,
                                        'data': {
                                            'id': result[0].id,
                                            'category': result[0].category,
                                            'name': result[0].name,
                                            'description': result[0].description,
                                            'price': result[0].price,
                                            'cpu': configuration.cpu,
                                            'cpu_pinning': configuration.cpu_pinning,
                                            'ram': configuration.ram,
                                            'disk': configuration.disk,
                                            'swap': configuration.swap,
                                            'io': configuration.io,
                                            'egg': configuration.egg,
                                            'startup_command': configuration.startup_command,
                                            'env': env
                                        }
                                    })
                                } else if (result[0].category == 'proxmox') {
                                    configuration = JSON.parse(result[0].configuration)
                                    return res.json({
                                        'error': false,
                                        'data': {
                                            'id': result[0].id,
                                            'category': result[0].category,
                                            'name': result[0].name,
                                            'description': result[0].description,
                                            'price': result[0].price,
                                            'node': configuration.node,
                                            'template_vmid': configuration.template_vmid,
                                            'cores': configuration.cores,
                                            'ram': configuration.ram,
                                            'storage': configuration.storage,
                                            'disk_size': configuration.disk_size,
                                            'add_conf': configuration.add_conf
                                        }
                                    })
                                }
                            } else {
                                return res.json({
                                    'error': false,
                                    'data': {
                                        'id': 404
                                    }
                                })
                            }
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
})


// EDIT PRODUCT //

router.put('', jsonParser, function (req, res) {
    ipInfo = server.ip(req);
    var response = "OK"
    var error = false
    var IP = req.socket.remoteAddress;
    var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
    server.con.query(sql, function (err, result) {
        if (err) { server.logger(" [ERROR] Database error\n  " + err) };
        if (result.length == 0) {
            return res.json({ 'error': true, 'code': 404 })
        } else {
            if (result[0].token === req.query.token) {
                var id = req.params.product_id
                if (id == undefined) { return res.json({ 'error': true, 'msg': "Id params is required", "code": 101 }) }
                if (id == "") { return res.json({ 'error': true, 'msg': "Id params is required", "code": 102 }) }
                permissions_manager.has_permission(req.query.uuid, "EDITPRODUCT").then(function (result) {
                    if (result) {
                        var configuration = {}
                        if (req.body.category == "pterodactyl") {
                            configuration = {
                                'cpu': req.body.cpu,
                                'cpu_pinning': req.body.cpu_pinning,
                                'ram': req.body.ram,
                                'disk': req.body.disk,
                                'swap': req.body.swap,
                                'io': req.body.io,
                                'egg': req.body.egg,
                                'startup_command': req.body.startup_command,
                                'env': JSON.parse(req.body.env)
                            }
                        }
                        if (req.body.category == "proxmox") {
                            configuration = {
                                'node': req.body.node,
                                'template_vmid': req.body.template_vm,
                                'cores': req.body.cores,
                                'ram': req.body.ram,
                                'storage': req.body.storage,
                                'disk_size': req.body.disk_size,
                                'add_conf': req.body.add_conf
                            }
                        }
                        var sql = `UPDATE products SET name = '${req.body.name}', description = '${req.body.description}', price = '${req.body.price}', configuration = '${JSON.stringify(configuration)}' WHERE id = '${id}';`;
                        server.con.query(sql, function (err, result) {
                            if (err) { server.logger(" [ERROR] Database error\n  " + err); return res.json({ "error": true, "msg": "Database error : " + err }) };
                        });
                        server.logger(" [DEBUG] Product " + req.body.name + " updated from " + IP + " !")
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
})


// DELETE PRODUCT //

router.delete('', jsonParser, function (req, res) {
    ipInfo = server.ip(req);
    var response = "OK"
    var error = false
    var IP = req.socket.remoteAddress;
    var sql = `SELECT token FROM users WHERE uuid = '${req.query.uuid}'`;
    server.con.query(sql, function (err, result) {
        if (err) { server.logger(" [ERROR] Database error\n  " + err) };
        if (result.length == 0) {
            return res.json({ 'error': true, 'code': 404 })
        } else {
            if (result[0].token === req.query.token) {
                var id = req.params.product_id
                if (id == undefined) { return res.json({ 'error': true, 'msg': "Id params is required", "code": 101 }) }
                if (id == "") { return res.json({ 'error': true, 'msg': "Id params is required", "code": 102 }) }
                permissions_manager.has_permission(req.query.uuid, "DELETEPRODUCT").then(function (result) {
                    if (result) {
                        var sql = `DELETE FROM products WHERE id='${id}'`;
                        server.con.query(sql, function (err, result) {
                            if (err) { server.logger(" [ERROR] Database error\n  " + err), error = true, response = "Database error" };
                        });
                        server.logger(" [DEBUG] Product " + id + " deleted from " + IP + " !")
                        return res.json({ "error": error, "response": response });
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