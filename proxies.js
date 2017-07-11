var http = require('http')
var yakbak = require('yakbak')
var debug = require('debug')('scenarios')
var conf = require('./conf')

module.exports = {
  start: function * () {
    yield this.startFrontendProxy()
    yield this.startBackendProxy()
  },
  startFrontendProxy: function * () {
    yield this.createServerProxy(`http://localhost:${conf.targetServerPort}/`, conf.frontendProxyPort, conf.feOpts)
    debug('frontend proxy started')
  },
  startBackendProxy: function * () {
    yield this.createServerProxy(conf.proxiedApiUrl, conf.backendProxyPort, conf.beOpts)
    debug('backend proxy started')
  },
  _createServerProxy (proxiedUrl, port, opts) {
    return new Promise(function (resolve, reject) {
      http.createServer(yakbak(proxiedUrl, opts))
        .listen(port, (err) => err ? reject(err) : resolve())
    })
  }
}
