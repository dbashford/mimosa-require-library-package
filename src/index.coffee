"use strict"

config = require './config'

registration = (mimosaConfig, register) ->
  ###
  if mimosaConfig.isMinify
    e = mimosaConfig.extensions
    register ['add','update','buildFile'],      'afterCompile', _minifyJS, e.javascript
    register ['add','update','buildExtension'], 'beforeWrite',  _minifyJS, e.template
  ###

_minifyJS = (mimosaConfig, options, next) ->
  next()

module.exports =
  registration:    registration
  defaults:        config.defaults
  placeholder:     config.placeholder
  validate:        config.validate