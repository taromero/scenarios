var rimraf = require('rimraf')
var fs = require('fs')

module.exports = {
  removeDir: function (dirname) {
    return new Promise(function (resolve, reject) {
      rimraf(dirname, fs, (err) => err ? reject(err) : resolve())
    })
  }
}
