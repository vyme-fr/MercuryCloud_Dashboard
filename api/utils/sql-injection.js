const rawbody = require('raw-body');
const server = require('../server')

function validateInput(data) {
    // Échappez tous les caractères spéciaux et les commentaires
    // data = data.replace(/[-'`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    // data = data.replace(/\/\*[\s\S]*?\*\//g, '');

    // Vérifiez si la chaîne contient des mots-clés SQL
    const sqlKeywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE'];
    const normalizedData = data.toUpperCase();
    for (const keyword of sqlKeywords) {
        if (normalizedData.includes(keyword)) {
            return true;
        }
    }

    // Si aucune erreur n'a été levée jusqu'à présent, cela signifie que les données sont valides
    return false;
}


function middleware(req, res, next) {
    var containsSql = false;
    if (req.originalUrl !== null && req.originalUrl !== undefined) {
        if (validateInput(req.originalUrl) === true) {
            containsSql = true;
        }
    }

    if (containsSql === false) {
        rawbody(req, {
            encoding: 'utf8'
        }, function (err, body) {

            if (err) {
                return next(err);
            }

            if (body !== null && body !== undefined) {

                if (typeof body !== 'string') {
                    body = JSON.stringify(body);
                }

                if (validateInput(body) === true) {
                    containsSql = true;
                }
            }

            if (containsSql === true) {
                let IP = ""
                if (req.headers['x-forwarded-for'] == undefined) {
                    IP = req.socket.remoteAddress.replace("::ffff:", "")
                } else {
                    IP = req.headers['x-forwarded-for'].split(',')[0]
                }
                server.logger(" [DEBUG] Request body or params is not secure! [FROM " + IP + "] Body: " + body)
                return res.status(500).json({
                    'error': true,
                    'code': 500,
                    'msg': 'Request body or params is not secure! This incident will be reported to the administrators.'
                });
            } else {
                next();
            }
        });
    } else {
        let IP = ""
        if (req.headers['x-forwarded-for'] == undefined) {
            IP = req.socket.remoteAddress.replace("::ffff:", "")
        } else {
            IP = req.headers['x-forwarded-for'].split(',')[0]
        }
        server.logger(" [DEBUG] Request body or params is not secure! [FROM " + IP + "] URL: " + req.originalUrl)
        return res.status(500).json({
            'error': true,
            'code': 500,
            'msg': 'Request body or params is not secure! This incident will be reported to the administrators.'
        });
    }
}

module.exports = middleware;
server.logger(" [INFO] SQL Injection protect loaded !")