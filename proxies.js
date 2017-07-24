var http = require('http')
var yakbak = require('yakbak')
var debug = require('debug')('scenarios')
var conf = require('./conf')
var tcp = require('tcp-port-used')

module.exports = {
  start: function * () {
    yield this.startFrontendProxy()
    yield this.startBackendProxy()
  },
  startFrontendProxy: function * () {
    yield this._createServerProxy(`http://localhost:${conf.targetServerPort}/`, conf.frontendProxyPort, conf.feOpts)
    debug('frontend proxy started')
  },
  startBackendProxy: function * () {
    yield this._createServerProxy(conf.proxiedApiUrl, conf.backendProxyPort, conf.beOpts)
    debug('backend proxy started')
  },
  _createServerProxy: function * (proxiedUrl, port, opts) {
    if (yield tcp.check(port)) return
    yield new Promise(function (resolve, reject) {
      http.createServer(yakbak(proxiedUrl, opts))
        .listen(port, (err) => err ? reject(err) : resolve())
    })
  }
}
