
var assert = require('assert')

var templation = require('..')

describe('engines.octet', function () {
  var view = templation({
    root: 'test/fixtures'
  })
  view.use('octet', templation.engines.octet)

  it('should render with an extension', function () {
    view.render('index.octet', {user:{name:'Charlike'}}).then(function (html) {
      assert.equal(html.trim(), '<p>Charlike</p>')
    })
  })

  it('should render without an extension', function () {
    view.render('index', {user:{name:'Charlike'}}).then(function (html) {
      assert.equal(html.trim(), '<p>Charlike</p>')
    })
  })

  it('should throw if error and you can `.catch` it', function () {
    view.render('index', {hello: 'hi'})
    .then().catch(function(err) {
      assert(err instanceof Error)
    })
  })
})
