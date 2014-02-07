"use strict";
var config, fs, path, registration, wrench, _, _buildOptimizeConfigs, _cleanFolder, _generateConfig, _noShimFragment, _noShimNoDependencies, _noShimWithDependencies, _shimmedWithDependencies;

path = require("path");

fs = require("fs");

wrench = require("wrench");

_ = require("lodash");

config = require('./config');

registration = function(mimosaConfig, register) {
  if (mimosaConfig.isOptimize && mimosaConfig.isPackage) {
    register(['postBuild'], 'beforeOptimize', _buildOptimizeConfigs);
  }
  if (mimosaConfig.libraryPackage.cleanOutFolder) {
    return register(['postClean'], 'init', _cleanFolder);
  }
};

_cleanFolder = function(mimosaConfig, options, next) {
  var outFolderFull;
  outFolderFull = mimosaConfig.libraryPackage.outFolderFull;
  if (fs.existsSync(outFolderFull)) {
    if (outFolderFull !== mimosaConfig.watch.compiledDir) {
      wrench.rmdirSyncRecursive(outFolderFull);
      mimosaConfig.log.info("library-package removed [[ " + outFolderFull + " ]]");
    }
  }
  return next();
};

_buildOptimizeConfigs = function(mimosaConfig, options, next) {
  var packs, rcs;
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
  options.runConfigs = rcs;
  return next();
};

_generateConfig = function(mimosaConfig, cb) {
  var configFile, optimize, rc, _ref;
  configFile = mimosaConfig.libraryPackage.mainConfigFileFull ? mimosaConfig.libraryPackage.mainConfigFileFull : fs.existsSync((_ref = mimosaConfig.require) != null ? _ref.commonConfig : void 0) ? mimosaConfig.require.commonConfig : mimosaConfig.libraryPackage.main;
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

_shimmedWithDependencies = function(mimosaConfig, rc) {
  rc.out = path.join(mimosaConfig.libraryPackage.outFolder, "shimmedWithDependencies", mimosaConfig.libraryPackage.name);
  rc.include = [mimosaConfig.libraryPackage.main];
  rc.name = "almond";
  rc.wrap = {
    start: "(function (root, factory) {\n  if (typeof define === 'function' && define.amd) {\n    define(factory);\n  } else {\n    root." + mimosaConfig.libraryPackage.globalName + " = factory();\n  }\n}(this, function () {",
    end: "return require('" + mimosaConfig.libraryPackage.main + "');\n}))"
  };
  return _.extend(rc, mimosaConfig.libraryPackage.overrides.shimmedWithDependencies);
};

_noShimNoDependencies = function(mimosaConfig, rc) {
  rc.out = path.join(mimosaConfig.libraryPackage.outFolder, "noShimNoDependencies", mimosaConfig.libraryPackage.name);
  rc.exclude = mimosaConfig.libraryPackage.removeDependencies;
  rc.include = [mimosaConfig.libraryPackage.main];
  rc.name = mimosaConfig.libraryPackage.main;
  rc.wrap = _noShimFragment(mimosaConfig);
  return _.extend(rc, mimosaConfig.libraryPackage.overrides.noShimNoDependencies);
};

_noShimWithDependencies = function(mimosaConfig, rc) {
  rc.out = path.join(mimosaConfig.libraryPackage.outFolder, "noShimWithDependencies", mimosaConfig.libraryPackage.name);
  rc.include = [mimosaConfig.libraryPackage.main];
  rc.name = mimosaConfig.libraryPackage.main;
  rc.wrap = _noShimFragment(mimosaConfig);
  return _.extend(rc, mimosaConfig.libraryPackage.overrides.noShimWithDependencies);
};

_noShimFragment = function(mimosaConfig) {
  return {
    start: "(function () {",
    end: "\ndefine(['" + mimosaConfig.libraryPackage.main + "'], function(lib) {\n  return lib;\n});\n})()"
  };
};

module.exports = {
  registration: registration,
  defaults: config.defaults,
  placeholder: config.placeholder,
  validate: config.validate
};
