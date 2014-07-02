
var fs = require('fs')
var jade = require('jade')

exports.compile = function (filename, options) {
  var str = fs.readFileSync(filename, 'utf8')
  options = options || {}
  options.filename = filename
  return jade.compile(str, options)
}

exports.render = function (fn, options) {
  return fn(options)
}
