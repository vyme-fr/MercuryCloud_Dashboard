const server = require('../server')
const fs = require('fs')
const config = require('../config.json')
fs.readdirSync('utils/rate-limit-windows/').forEach(f => fs.rmSync(`${'utils/rate-limit-windows/'}/${f}`))

function middleware(req, res, next) {
    var forwardedIpsStr = req.header('x-forwarded-for')
    var IP = ''
  
    if (forwardedIpsStr) {
       IP = forwardedIps = forwardedIpsStr.split(',')[0]; 
    }   

    if (fs.existsSync('utils/rate-limit-windows/' + IP + '.json')) {
        fs.readFile('utils/rate-limit-windows/' + IP + '.json', 'utf8', (err, data) => {
            data_parsed = JSON.parse(data)
            if (Date.now() >= data_parsed.start_time + config.rate_limit_time) {
                fs.rmSync('utils/rate-limit-windows/' + IP + ".json")
            } else {
                data_parsed.rate++
                fs.writeFileSync('utils/rate-limit-windows/' + IP + '.json', JSON.stringify(data_parsed))
            }
        });
    } else {
        fs.writeFileSync('utils/rate-limit-windows/' + IP + '.json', JSON.stringify({'ip' : IP, 'start_time' : Date.now(), 'rate': 1}))
    }
    next()
}

module.exports = middleware
server.logger(' [INFO] Rate Limit protect loaded !')