const server = require('../server.js')

function has_permission(uuid, permission) {
    var sql = `SELECT role FROM users WHERE uuid = '${uuid}'`;
    server.con.query(sql, function (err, result) {
        if (result[0].role.length > 0) {
            var sql = `SELECT permissions FROM roles WHERE id = '${result[0].role}'`;
            server.con.query(sql, function (err, result) {
                permissions = result[0].permissions.split(",")
                if (permissions.includes("ADMIN")) {
                    return "true";
                } else if (permissions.includes(permission)) {
                    return "true";
                } else {
                    return "false";
                }
            })
        } else {
            return "false";
        }
    })
}

exports.has_permission = has_permission