
var swig = require('swig')
var Promise = require('bluebird')

exports.compile = function (filename, options) {
  return new Promise(function (resolve, reject) {
    swig.compileFile(filename, options || {}, function (err, fn) {
      if (err) reject(err)
      else resolve(fn)
    })
  })
}

exports.render = function (fn, options) {
  return fn(options)
}
