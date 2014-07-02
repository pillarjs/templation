
# Templation

A view system similar to what you're used to with Express' `res.render()`.
Inspired by [co-views](https://github.com/visionmedia/co-views) and
[consolidate.js](https://github.com/visionmedia/consolidate.js/).

- First-class async support. `.render()` always returns a Promise.
- Streams are supported.
- Template adapters are integrated, but are retrieved lazily to avoid code bloat.
- Easier plugin system for custom renderers.

## API

```bash
npm i templation
```

```js
var Templation = require('templation')
var view = new Templation()
```

### var view = new Templation([options])

Create a new view system.
Options are:

- `cache` - whether to cache the templates.
  Defaults to `true` in production.
- `root` - the root folder to look for templates.
  Defaults to `process.cwd()`, so __you should set this__.

### view.use(extension, engine)

Use a custom view engine.
`extension` is a file extension to map this engine to.
`engine` is an object with the following methods:

- `.compile(filename, options)` - it should return (optionally via promise)
  a "compiled template". The "compiled template" must be an object or function.
  This gets cached when `cache: true`!
- `.render(compiled, options)` - `compiled` is whatever is compiled from `.compile()`.
  It should return (optionally via promise) a `String`, `Buffer`, or `Stream`

### view.render(name, options)

Render the template `name`, which resolves against `root`.
Returns a promise, which then returns a `String`, `Buffer`, or `Stream`.

Example node.js usage:

```js
var templation = require('templation')
var view = templation()
view.use('html', templation.engines.html)

http.createServer(function (req, res) {
  view.render('home').then(function (html) {
    // assuming html is a string
    res.setHeader('Content-Length', Buffer.byteLength(html))
    res.setHeader('Content-Type', 'text/html')
    res.end(html)
  }, function (err) {
    res.statusCode = err.status || 500
    res.end('Internal Server Error')
  })
})
```

### view.cache=

Enable or disable the caching system.

### templation.engines

A list of included engines.
Generally, the API usage is:

```js
view.use('html', templation.engines.html)
```

Included adapters are:

- [jade](http://jade-lang.com)
- [then-jade](https://github.com/then/then-jade) - for streaming templates
- [swig](http://paularmstrong.github.io/swig/)
- html - just returns the file
