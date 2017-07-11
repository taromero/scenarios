var debug = require('debug')('scenarios')
var conf = require('./conf')
var spawn = require('child_process').spawn
var tcp = require('tcp-port-used')

module.exports = {
  start: function * () {
    if (yield tcp.check(conf.targetServerPort)) {
      debug('target server already running')
    } else {
      yield startTargetServer()
    }

    function startTargetServer () {
      return new Promise(function (resolve, reject) {
        debug('starting server')
        var serverProcess = spawn(conf.command.base, conf.command.args)

        // Kill child process on target process exit.
        process.on('exit', () => serverProcess.kill())
        serverProcess.stderr.on('data', (err) => reject(new Error('error while starting the target server' + err)))

        return tcp.waitUntilUsed(conf.targetServerPort).then(resolve)
      }).then(function () {
        debug('target server started')
      })
    }
  }
}
