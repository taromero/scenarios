var conf = require('./conf')
var scenarios = require('./scenarios')

var utils = require('./utils')
var recorder = require('./recorder')
var tester = require('./tester')
var proxies = require('./proxies')
var targetServer = require('./target-server')

module.exports = {
  execute: function * () {
    var exitCode = 0
    if (conf.mode === 'record-again') {
      yield utils.removeDir(conf.frontendDir)
    }
    yield proxies.start()
    yield targetServer.start()
    yield recorder.record(scenarios)
    if (conf.mode === 'test') {
      var differences = yield tester.run()
      if (differences.length > 0) {
        exitCode = 1
      }
    }
    return exitCode
  }
}
