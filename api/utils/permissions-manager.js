const server = require('../server.js')

function has_permission(uuid, permission) {
    let sql = `SELECT role FROM users WHERE uuid = '${uuid}'`;
    return new Promise(function(resolve, reject) {
        server.con.query(sql, function (err, result) {
            if (err) {reject(err)}
            if (result[0].role.length > 0) {
                let sql = `SELECT permissions FROM roles WHERE id = '${result[0].role}'`;
                server.con.query(sql, function (err, result) {
                    if (err) {reject(err)}
                    let permissions = result[0].permissions.split(",")
                    if (permissions.includes("ADMIN")) {
                        resolve(true)
                    } else if (permissions.includes(permission)) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
            } else {
                resolve(false)
            }
        })
    })
}

exports.has_permission = has_permission
