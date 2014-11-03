
var fs = require('fs')
var octet = require('octet')

exports.compile = function (filename, options) {
  var str = fs.readFileSync(filename, 'utf8')
  
  return str;
}

exports.render = function (str, data) {
  var ret;
  octet(str, data, function(err, res) {
    if (err) {
      ret = err;
      return;
    }
    ret = res;
  })
  return ret;
}
