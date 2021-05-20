/**
 * Inspiration
 * https://anthonymineo.com/docker-healthcheck-for-your-node-js-app/
 */
const http = require('http')

const requestOptions = {
    host: '0.0.0.0',
    port: process.env.HTTP_PORT,
    timeout: 1000,
    path: '/api/status'
}

const healthCheck = http.request(requestOptions, (res) => {
    console.log(`HEALTH CHECK STATUS: ${res.statusCode}`)
    if (res.statusCode == 200) {
        process.exit(0)
    } else {
        process.exit(1)
    }
})

healthCheck.on('error', function (err) {
    console.error('COULD NOT RESOLVE ENDPOINT')
    process.exit(1)
})

healthCheck.end()
