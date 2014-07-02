
var fs = require('fs')
var jade = require('then-jade')

exports.compile = function (filename, options) {
  var str = fs.readFileSync(filename, 'utf8')
  options = options || {}
  options.filename = filename
  return jade.compileStreaming(str, options)
}

exports.render = function (fn, options) {
  return fn(options)
}
