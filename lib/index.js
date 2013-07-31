"use strict";
var config, fs, logger, path, registration, wrench, _buildOptimizeConfigs, _generateConfig, _noShimFragment, _noShimNoDependencies, _noShimWithDependencies, _shimmedWithDependencies;

path = require("path");

fs = require("fs");

logger = require("logmimosa");

wrench = require("wrench");

config = require('./config');

registration = function(mimosaConfig, register) {
  if (mimosaConfig.isOptimize && mimosaConfig.isPackage) {
    return register(['postBuild'], 'beforeOptimize', _buildOptimizeConfigs);
  }
};

_buildOptimizeConfigs = function(mimosaConfig, options, next) {
  var packs, rcs;
  if (fs.existsSync(mimosaConfig.libraryPackage.outFolderFull)) {
    wrench.rmdirSyncRecursive(mimosaConfig.libraryPackage.outFolderFull);
    logger.info("library-package removed outFolder [[ " + mimosaConfig.libraryPackage.outFolderFull + " ]]");
  }
  packs = mimosaConfig.libraryPackage.packaging;
  rcs = [];
  if (packs.shimmedWithDependencies) {
    rcs.push(_generateConfig(mimosaConfig, _shimmedWithDependencies));
  }
  if (packs.noShimNoDependencies) {
    rcs.push(_generateConfig(mimosaConfig, _noShimNoDependencies));
  }
  if (packs.noShimWithDependencies) {
    rcs.push(_generateConfig(mimosaConfig, _noShimWithDependencies));
  }
  /*
  if packs.shimmedNoDependencies
    rcs.push _generateConfig(mimosaConfig, _shimmedNoDependencies)
  */

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

/*
_shimmedNoDependencies = (mimosaConfig, rc) ->
  rc.out = path.join mimosaConfig.libraryPackage.outFolder, "shimmedNoDependencies", mimosaConfig.libraryPackage.name
  rc.exclude = mimosaConfig.libraryPackage.removeDependencies
  rc.include = [mimosaConfig.libraryPackage.main]
  rc.insertRequire = [mimosaConfig.libraryPackage.main]
  rc.wrap = true
  rc.name = "almond"
*/


_shimmedWithDependencies = function(mimosaConfig, rc) {
  rc.out = path.join(mimosaConfig.libraryPackage.outFolder, "shimmedWithDependencies", mimosaConfig.libraryPackage.name);
  rc.include = [mimosaConfig.libraryPackage.main];
  rc.name = "almond";
  return rc.wrap = {
    start: "(function (root, factory) {\n  if (typeof define === 'function' && define.amd) {\n    define(factory);\n  } else {\n    root." + mimosaConfig.libraryPackage.globalName + " = factory();\n  }\n}(this, function () {",
    end: "return require('" + mimosaConfig.libraryPackage.main + "');\n}))\""
  };
};

_noShimNoDependencies = function(mimosaConfig, rc) {
  rc.out = path.join(mimosaConfig.libraryPackage.outFolder, "noShimNoDependencies", mimosaConfig.libraryPackage.name);
  rc.exclude = mimosaConfig.libraryPackage.removeDependencies;
  rc.include = [mimosaConfig.libraryPackage.main];
  rc.name = mimosaConfig.libraryPackage.main;
  return rc.wrap = _noShimFragment(mimosaConfig);
};

_noShimWithDependencies = function(mimosaConfig, rc) {
  rc.out = path.join(mimosaConfig.libraryPackage.outFolder, "noShimWithDependencies", mimosaConfig.libraryPackage.name);
  rc.include = [mimosaConfig.libraryPackage.main];
  rc.name = mimosaConfig.libraryPackage.main;
  return rc.wrap = _noShimFragment(mimosaConfig);
};

_noShimFragment = function(mimosaConfig) {
  return {
    start: "(function () {",
    end: "define(['" + mimosaConfig.libraryPackage.main + "'], function(lib) {\n  return lib;\n});\n})"
  };
};

module.exports = {
  registration: registration,
  defaults: config.defaults,
  placeholder: config.placeholder,
  validate: config.validate
};
