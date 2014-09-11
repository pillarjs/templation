
var Promise = require('native-or-bluebird')
var resolve = require('path').resolve
var extname = require('path').extname
var fs = require('fs')

Templation.engines = require('./engines')

module.exports = Templation

function Templation(options) {
  if (!(this instanceof Templation)) return new Templation(options)

  options = options || {}

  // flag whether to cache templates
  this._cache = typeof options.cache === 'boolean'
    ? options.cache
    : process.env.NODE_ENV === 'production'
  this.cache = Object.create(null) // cache lookup
  this.engines = {} // ext -> engine map
  this.root = resolve(options.root)
}

Templation.prototype.use = function (ext, engine) {
  if (typeof ext !== 'string') throw new TypeError('each engine must map to an extension')
  if (!engine) throw new Error('no engine defined')
  if (typeof engine.compile !== 'function') throw new TypeError('each engine must define a .compile()')
  if (typeof engine.render !== 'function') throw new TypeError('each engine must define a .render()')
  this.engines[ext] = engine
  return this
}

Templation.prototype.render = function (name, options, fn) {
  if (typeof options === 'function') {
    fn = options
    options = {}
  }

  var self = this
  var promise = this._compiled(name, options)
    .then(function (compiled) {
      return self._render(compiled.__templation_engine, compiled, options)
    })
    .then(validateOutput)
    
  if (typeof fn === 'function') {
    promise.then(function (out) {
      fn(null, out)
    }, fn)
  }
  return promise
}

// look up a template by a name
// these results should be cached!
Templation.prototype._lookup = function (name) {
  var filename = resolve(this.root, name)
  var engines = this.engines
  var ext = extname(name).slice(1)
  var engine

  if (ext) {
    engine = engines[ext]
    if (!engine) throw new Error('no view engine found for: ' + ext)
    return [filename, engine]
  }

  var exts = Object.keys(engines)
  for (var i = 0; i < exts.length; i++) {
    var _filename = filename + '.' + exts[i]
    if (!fs.existsSync(_filename)) continue
    return [_filename, engines[exts[i]]]
  }

  throw new Error('could not find a suitable engine for: ' + filename)
}

// asynchronously get a compiled and maybe cached template
Templation.prototype._compiled = function (name, options) {
  var filename
  var engine
  if (!this._cache) {
    var out = this._lookup(name)
    filename = out[0]
    engine = out[1]
    return this._compile(engine, filename, options).then(compile)
  }

  var cache = this.cache
  var compiled = cache[name]
  if (compiled) return Promise.resolve(compiled)

  var out = this._lookup(name)
  filename = out[0]
  engine = out[1]

  compiled = cache[filename]
  if (compiled) {
    // cache `name` as well
    cache[name] = compiled
    return Promise.resolve(compiled)
  }

  return this._compile(engine, filename, options)
    .then(compile)
    .then(function (compiled) {
      return cache[name] = cache[filename] = compiled
    })

  function compile(compiled) {
    // memoize stuff onto this thing
    // make sure you wrap the compiled template
    // in a function if it uses some sort of
    // constructor-prototype mechanism
    compiled.__templation_filename = filename
    compiled.__templation_engine = engine
    return compiled
  }
}

// asynchronously compile a template
Templation.prototype._compile = function (engine, filename, options) {
  return Promise.resolve(engine.compile(filename, options || {}))
}

// asynchronously render a template
Templation.prototype._render = function (engine, compiled, options) {
  return Promise.resolve(engine.render(compiled, options || {}))
}

function validateOutput(out) {
  if (!out) return ''
  if (typeof out === 'string') return out
  if (typeof out.pipe === 'function') return out
  if (Buffer.isBuffer(out)) return out
  throw new TypeError('templates may only render strings, buffers, or streams. Got: ' + String(out))
}
