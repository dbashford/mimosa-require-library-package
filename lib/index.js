"use strict";
var config, fs, logger, path, registration, _buildOptimizeConfigs, _generateConfig, _noShimEndFragment, _noShimNoDependencies, _noShimWithDependencies, _shimmedNoDependencies, _shimmedWithDependencies;

path = require("path");

fs = require("fs");

logger = require("logmimosa");

config = require('./config');

registration = function(mimosaConfig, register) {
  if (mimosaConfig.isOptimize && mimosaConfig.isPackage) {
    return register(['postBuild'], 'beforeOptimize', _buildOptimizeConfigs);
  }
};

_buildOptimizeConfigs = function(mimosaConfig, options, next) {
  var packs, rcs, _ref;
  rcs = (_ref = options.runConfigs) != null ? _ref : [];
  packs = mimosaConfig.libraryPackage.packaging;
  if (packs.shimmedNoDependencies) {
    rcs.push(_generateConfig(mimosaConfig, _shimmedNoDependencies));
  }
  if (packs.shimmedWithDependencies) {
    rcs.push(_generateConfig(mimosaConfig, _shimmedWithDependencies));
  }
  if (packs.noShimNoDependencies) {
    rcs.push(_generateConfig(mimosaConfig, _noShimNoDependencies));
  }
  if (packs.noShimWithDependencies) {
    rcs.push(_generateConfig(mimosaConfig, _noShimWithDependencies));
  }
  options.runConfigs = rcs;
  return next();
};

_generateConfig = function(mimosaConfig, cb) {
  var configFile, optimize, rc, _ref;
  configFile = fs.existsSync((_ref = mimosaConfig.require) != null ? _ref.commonConfig : void 0) ? mimosaConfig.require.commonConfig : mimosaConfig.libraryPackage.main;
  optimize = mimosaConfig.isOptimize && mimosaConfig.isMinify ? "none" : "uglify2";
  rc = {
    findNestedDependencies: true,
    mainConfigFile: configFile,
    optimize: optimize,
    baseUrl: path.join(mimosaConfig.watch.compiledDir, mimosaConfig.watch.javascriptDir)
  };
  cb(mimosaConfig, rc);
  return rc;
};

_shimmedNoDependencies = function(mimosaConfig, rc) {
  console.log(mimosaConfig.libraryPackage);
  rc.out = path.join(mimosaConfig.libraryPackage.outFolder, "shimmedNoDependencies", mimosaConfig.libraryPackage.name);
  rc.exclude = mimosaConfig.libraryPackage.removeDependencies;
  rc.include = [mimosaConfig.libraryPackage.main];
  rc.insertRequire = [mimosaConfig.libraryPackage.main];
  rc.wrap = true;
  return rc.name = "almond";
};

_shimmedWithDependencies = function(mimosaConfig, rc) {
  rc.out = path.join(mimosaConfig.libraryPackage.outFolder, "shimmedWithDependencies", mimosaConfig.libraryPackage.name);
  rc.include = [mimosaConfig.libraryPackage.main];
  rc.insertRequire = [mimosaConfig.libraryPackage.main];
  rc.wrap = true;
  return rc.name = "almond";
};

_noShimNoDependencies = function(mimosaConfig, rc) {
  rc.out = path.join(mimosaConfig.libraryPackage.outFolder, "noShimNoDependencies", mimosaConfig.libraryPackage.name);
  rc.exclude = mimosaConfig.libraryPackage.removeDependencies;
  rc.include = [mimosaConfig.libraryPackage.main];
  rc.name = mimosaConfig.libraryPackage.main;
  return rc.wrap = {
    begin: "(function () {",
    end: _noShimEndFragment(mimosaConfig)
  };
};

_noShimWithDependencies = function(mimosaConfig, rc) {
  rc.out = path.join(mimosaConfig.libraryPackage.outFolder, "noShimWithDependencies", mimosaConfig.libraryPackage.name);
  rc.include = [mimosaConfig.libraryPackage.main];
  rc.name = mimosaConfig.libraryPackage.main;
  return rc.wrap = {
    begin: "(function () {",
    end: _noShimEndFragment(mimosaConfig)
  };
};

_noShimEndFragment = function(mimosaConfig) {
  return "define(['" + mimosaConfig.libraryPackage.main + "'], function(lib) {\n  return lib;\n});\n})";
};

module.exports = {
  registration: registration,
  defaults: config.defaults,
  placeholder: config.placeholder,
  validate: config.validate
};
