var conf = require('./conf')
var utils = require('./utils')
var debug = require('debug')('scenarios:test')
var diff = require('deep-diff')
var deepReaddir = require('recursive-readdir')
var path = require('path')
var fs = require('fs')
var dotprop = require('dot-prop')

module.exports = {
  run: function * () {
    debug('running assertions')
    var comparisonPaths = yield listJsonPaths(conf.frontendTestingDir)
    var comparisons = yield comparisonPaths.map(compareResults)
    var differences = comparisons.filter((difference) => difference)
    differences.forEach((difference) => {
      var useCase = difference.useCase
      delete difference.useCase
      console.log('difference for use case', useCase, difference)
    })
    debug(`${comparisons.length} tests run, ${differences.length} failed`)
    yield utils.removeDir(conf.frontendTestingDir)
    return differences
  }
}

function * compareResults (comparisonPath) {
  var expectedPath = comparisonPath.replace(conf.frontendTestingDir, conf.frontendDir)
  var useCase = comparisonPath.substring(0, comparisonPath.lastIndexOf('/'))
  debug('running test for', useCase)
  var actual = yield getJson(comparisonPath)
  var expected = yield getJson(expectedPath)

  removeIgnoredFields([actual, expected])

  var difference = diff(actual, expected)
  if (difference) {
    difference.useCase = useCase
  }
  return difference

  function removeIgnoredFields (objects) {
    conf.doNotCompare && conf.doNotCompare.forEach(removeIgnoredField)

    function removeIgnoredField (ignoredFieldPath) {
      objects.forEach((object) => dotprop.delete(object, ignoredFieldPath))
    }
  }
}

function * listJsonPaths (dirname) {
  var allFilePaths = yield listAllFiles(dirname)
  return allFilePaths.filter((filename) => filename.endsWith('.json'))

  function listAllFiles (dirname) {
    return new Promise(function (resolve, reject) {
      deepReaddir(dirname, (err, filepaths) => err ? reject(err) : resolve(filepaths))
    })
  }
}

function * getJson (filepath) {
  var jsonString = yield loadFile(path.join(process.cwd(), filepath))
  return JSON.parse(jsonString)

  function loadFile (filepath) {
    return new Promise(function (resolve, reject) {
      fs.readFile(filepath, 'utf-8', (err, contents) => err ? reject(err) : resolve(contents))
    })
  }
}
