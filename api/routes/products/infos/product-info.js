let router = require('express').Router({ mergeParams: true });
const server = require('../../../server.js')
let jsonParser = server.parser.json()
const route_name = "/products/:product_id"
const permissions_manager = require("../../../utils/permissions-manager.js")
server.logger(" [INFO] /api" + route_name + " route loaded !")


// GET INFOS //

router.get('', function (req, res) {
    const start = process.hrtime()
    server.ip(req);
    let IP = ""
    if (req.headers['x-forwarded-for'] == undefined) {
        IP = req.socket.remoteAddress.replace("::ffff:", "")
    } else {
        IP = req.headers['x-forwarded-for'].split(',')[0]
    }
    let sql = `SELECT token FROM users WHERE uuid = '${req.cookies.uuid}'`;
    server.con.query(sql, function (err, result) {
        if (err) { server.logger(" [ERROR] Database error\n  " + err) }
        if (result.length === 0) {
            return res.json({ 'error': true, 'code': 404 })
        } else {
            if (result[0].token === req.cookies.token) {
                permissions_manager.has_permission(req.cookies.uuid, "LISTPRODUCTS").then(function (result) {
                    if (result) {
                        let id = req.params.product_id
                        if (id === undefined) { return res.json({ 'error': true, 'msg': "Id params is required", "code": 101 }) }
                        if (id === "") { return res.json({ 'error': true, 'msg': "Id params is required", "code": 102 }) }
                        let sql = `SELECT * FROM products WHERE id = '${id}'`;
                        server.con.query(sql, function (err, result) {
                            if (err) { server.logger(" [ERROR] Database error\n  " + err) }
                            let configuration;
                            let env_json;
                            if (result.length > 0) {
                                if (result[0].category === 'pterodactyl') {
                                    let env = []
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
                                            'env': env,
                                            'upgrades': result[0].available_upgrades
                                        }
                                    })
                                } else if (result[0].category === 'proxmox') {
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
                                            'add_conf': configuration.add_conf,
                                            'upgrades': result[0].available_upgrades
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
    res.on('finish', () => {
        const durationInMilliseconds = server.getDurationInMilliseconds(start)
        server.logger(` [DEBUG] ${req.method} ${route_name} [FINISHED] [FROM ${IP}] in ${durationInMilliseconds.toLocaleString()} ms`)
    })
})


// EDIT PRODUCT //

router.put('', jsonParser, function (req, res) {
    const start = process.hrtime()
    let IP = ""
    if (req.headers['x-forwarded-for'] == undefined) {
        IP = req.socket.remoteAddress.replace("::ffff:", "")
    } else {
        IP = req.headers['x-forwarded-for'].split(',')[0]
    }
    let sql = `SELECT token FROM users WHERE uuid = '${req.cookies.uuid}'`;
    server.con.query(sql, function (err, result) {
        if (err) { server.logger(" [ERROR] Database error\n  " + err) }
        if (result.length === 0) {
            return res.json({ 'error': true, 'code': 404 })
        } else {
            if (result[0].token === req.cookies.token) {
                let id = req.params.product_id
                if (id === undefined) { return res.json({ 'error': true, 'msg': "Id params is required", "code": 101 }) }
                if (id === "") { return res.json({ 'error': true, 'msg': "Id params is required", "code": 102 }) }
                permissions_manager.has_permission(req.cookies.uuid, "EDITPRODUCT").then(function (result) {
                    if (result) {
                        let configuration = {}
                        if (req.body.category === "pterodactyl") {
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
                        if (req.body.category === "proxmox") {
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
                        let sql = `UPDATE products SET name = '${req.body.name}', description = '${req.body.description}', price = '${req.body.price}', configuration = '${JSON.stringify(configuration)}', available_upgrades = '${req.body.upgrades}' WHERE id = '${id}';`;
                        server.con.query(sql, function (err) {
                            if (err) { server.logger(" [ERROR] Database error\n  " + err); return res.json({ "error": true, "msg": "Database error : " + err }) }
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
    res.on('finish', () => {
        const durationInMilliseconds = server.getDurationInMilliseconds(start)
        server.logger(` [DEBUG] ${req.method} ${route_name} [FINISHED] [FROM ${IP}] in ${durationInMilliseconds.toLocaleString()} ms`)
    })
})


// DELETE PRODUCT //

router.delete('', jsonParser, function (req, res) {
    const start = process.hrtime()
    let IP = ""
    if (req.headers['x-forwarded-for'] == undefined) {
        IP = req.socket.remoteAddress.replace("::ffff:", "")
    } else {
        IP = req.headers['x-forwarded-for'].split(',')[0]
    }
    let sql = `SELECT token FROM users WHERE uuid = '${req.cookies.uuid}'`;
    server.con.query(sql, function (err, result) {
        if (err) { server.logger(" [ERROR] Database error\n  " + err) }
        if (result.length === 0) {
            return res.json({ 'error': true, 'code': 404 })
        } else {
            if (result[0].token === req.cookies.token) {
                let id = req.params.product_id
                if (id === undefined) { return res.json({ 'error': true, 'msg': "Id params is required", "code": 101 }) }
                if (id === "") { return res.json({ 'error': true, 'msg': "Id params is required", "code": 102 }) }
                permissions_manager.has_permission(req.cookies.uuid, "DELETEPRODUCT").then(function (result) {
                    if (result) {
                        let sql = `DELETE FROM products WHERE id='${id}'`;
                        server.con.query(sql, function (err) {
                            if (err) { server.logger(" [ERROR] Database error\n  " + err) }
                        });
                        server.logger(" [DEBUG] Product " + id + " deleted from " + IP + " !")
                        return res.json({ "error": true, "msg": "Database error" })
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