
var fs = require('fs')

exports.compile = function (filename) {
  return {
    string: fs.readFileSync(filename, 'utf8')
  }
}

exports.render = function (compiled) {
  return compiled.string
}
