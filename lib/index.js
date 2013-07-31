"use strict";
var config, registration, _minifyJS;

config = require('./config');

registration = function(mimosaConfig, register) {
  /*
  if mimosaConfig.isMinify
    e = mimosaConfig.extensions
    register ['add','update','buildFile'],      'afterCompile', _minifyJS, e.javascript
    register ['add','update','buildExtension'], 'beforeWrite',  _minifyJS, e.template
  */

};

_minifyJS = function(mimosaConfig, options, next) {
  return next();
};

module.exports = {
  registration: registration,
  defaults: config.defaults,
  placeholder: config.placeholder,
  validate: config.validate
};
