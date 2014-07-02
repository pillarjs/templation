
var fs = require('fs')
fs.readdirSync(__dirname).forEach(function (name) {
  if (name[0] === '.') return
  if (name === 'index.js') return
  Object.defineProperty(exports, name.replace('.js', ''), {
    get: function () {
      return require('./' + name)
    }
  })
})
