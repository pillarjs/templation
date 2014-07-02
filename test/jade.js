
var assert = require('assert')

var templation = require('..')

describe('engines.jade', function () {
  var view = templation({
    root: 'test/fixtures'
  })
  view.use('jade', templation.engines.jade)

  it('should render with an extension', function () {
    view.render('index.jade').then(function (html) {
      assert.equal(html.trim(), '<p>hi</p>')
    })
  })

  it('should render without an extension', function () {
    view.render('index').then(function (html) {
      assert.equal(html.trim(), '<p>hi</p>')
    })
  })
})
