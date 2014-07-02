
var assert = require('assert')

var templation = require('..')

describe('.use()', function () {
  var view = templation({
    root: 'test/fixtures'
  })

  it('should register an engine', function () {
    view.use('html', templation.engines.html)
    assert.equal(view.engines.html, templation.engines.html)
  })

  it('should render a file with an extension', function () {
    return view.render('index.html').then(function (html) {
      assert.equal(html.trim(), '<p>hi</p>')
    })
  })

  it('should render a file without an extension', function () {
    return view.render('index').then(function (html) {
      assert.equal(html.trim(), '<p>hi</p>')
    })
  })

  it('should throw if no file was found', function () {
    assert.throws(function () {
      view.render('asdf')
    })
  })

  it('should throw if no extension matches', function () {
    assert.throws(function () {
      view.render('index.asdf')
    })
  })
})

describe('.cache', function () {
  describe('when true', function () {

  })

  describe('when false', function () {

  })
})
