const server = require('../server')
const fs = require('fs')
const config = require('../config.json')
// fs.readdirSync('utils/rate-limit-windows/').forEach(f => fs.rmSync(`${'utils/rate-limit-windows/'}/${f}`))

function middleware(req, res, next) {
    var IP = req.socket.remoteAddress;
    if (fs.existsSync('utils/rate-limit-windows/' + IP + '.json')) {
        fs.readFile('utils/rate-limit-windows/' + IP + '.json', 'utf8', (err, data) => {
            data_parsed = JSON.parse(data)
            if (Date.now() > data_parsed.start_time + (config.rate_limit_time * 1000)) {
                if (fs.existsSync('utils/rate-limit-windows/' + IP + '.json')) {
                    fs.rmSync('utils/rate-limit-windows/' + IP + ".json")
                }
                return next()
            } else {
                if (data_parsed.rate >= config.rate_limit_max_rate) {
                    server.logger(" [DEBUG] " + IP + " rate limit !")
                    return res.json({ "error": true, "code": 429, "msg": "Your IP has been rate limit! This incident will be reported to the administrators." })
                } else {
                    data_parsed.rate++
                    fs.writeFileSync('utils/rate-limit-windows/' + IP + '.json', JSON.stringify(data_parsed))
                    return next()
                }
            }
        });
    } else {
        fs.writeFileSync('utils/rate-limit-windows/' + IP + '.json', JSON.stringify({ 'ip': IP, 'start_time': Date.now(), 'rate': 1 }))
        return next()
    }
}

module.exports = middleware
server.logger(' [INFO] Rate Limit protect loaded !')