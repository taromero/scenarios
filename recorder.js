var path = require('path')
var request = require('request-promise')
var debug = require('debug')('scenarios:recorder')
var utils = require('./utils')
var conf = require('./conf')

module.exports = {
  record: function * (scenarios) {
    yield runSequentially(scenarios, runScenario)

    function * runScenario (scenario) {
      debug('recording scenario', scenario.label)
      yield runSequentially(scenario.useCases, runUseCase)

      function * runUseCase (useCase) {
        debug('recording use case', useCase.label)
        conf.feOpts.dirname = path.join(conf.feOpts.baseDir, scenario.label, useCase.label)

        if (useCase.recordOver) {
          debug('recording frontend of', useCase.label, 'again, as per use case configuration.')
          yield utils.removeDir(conf.feOpts.dirname)
        }

        return request('http://localhost:' + conf.frontendProxyPort + scenario.url + useCase.query)
          .catch((err) => conf.showErrors && console.log('error on request', err))
      }
    }

    function * runSequentially (array, generatorFn) {
      for (var i = 0; i < array.length; i++) {
        yield generatorFn(array[i])
      }
    }
  }
}
