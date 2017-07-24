var co = require('co')
var proxies = require('./proxies')

co(function * () {
    yield proxies.startBackendProxy()
}).catch((err) => console.error(err))
