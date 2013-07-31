"use strict"

path = require "path"
fs = require "fs"

logger = require "logmimosa"
wrench = require "wrench"

config = require './config'

registration = (mimosaConfig, register) ->
  if mimosaConfig.isOptimize and mimosaConfig.isPackage
    register ['postBuild'], 'beforeOptimize', _buildOptimizeConfigs

_buildOptimizeConfigs = (mimosaConfig, options, next) ->

  if fs.existsSync mimosaConfig.libraryPackage.outFolderFull
    wrench.rmdirSyncRecursive mimosaConfig.libraryPackage.outFolderFull
    logger.info "library-package removed outFolder [[ #{mimosaConfig.libraryPackage.outFolderFull} ]]"

  packs = mimosaConfig.libraryPackage.packaging
  rcs = []
  if packs.shimmedWithDependencies
    rcs.push _generateConfig(mimosaConfig, _shimmedWithDependencies)
  if packs.noShimNoDependencies
    rcs.push _generateConfig(mimosaConfig, _noShimNoDependencies)
  if packs.noShimWithDependencies
    rcs.push _generateConfig(mimosaConfig, _noShimWithDependencies)
  ###
  if packs.shimmedNoDependencies
    rcs.push _generateConfig(mimosaConfig, _shimmedNoDependencies)
  ###

  options.runConfigs = rcs
  next()

_generateConfig = (mimosaConfig, cb) ->
  configFile = if fs.existsSync mimosaConfig.require?.commonConfig
    mimosaConfig.require.commonConfig
  else
    mimosaConfig.libraryPackage.main

  optimize = if mimosaConfig.isOptimize and mimosaConfig.isMinify
    "none"
  else
    "uglify2"

  rc =
    findNestedDependencies: true
    mainConfigFile: configFile
    optimize: optimize
    baseUrl: path.join mimosaConfig.watch.compiledDir, mimosaConfig.watch.javascriptDir

  cb mimosaConfig, rc

  rc

###
_shimmedNoDependencies = (mimosaConfig, rc) ->
  rc.out = path.join mimosaConfig.libraryPackage.outFolder, "shimmedNoDependencies", mimosaConfig.libraryPackage.name
  rc.exclude = mimosaConfig.libraryPackage.removeDependencies
  rc.include = [mimosaConfig.libraryPackage.main]
  rc.insertRequire = [mimosaConfig.libraryPackage.main]
  rc.wrap = true
  rc.name = "almond"
###

_shimmedWithDependencies = (mimosaConfig, rc) ->
  rc.out = path.join mimosaConfig.libraryPackage.outFolder, "shimmedWithDependencies", mimosaConfig.libraryPackage.name
  rc.include = [mimosaConfig.libraryPackage.main]
  rc.name = "almond"
  rc.wrap =
    start: """
           (function (root, factory) {
             if (typeof define === 'function' && define.amd) {
               define(factory);
             } else {
               root.#{mimosaConfig.libraryPackage.globalName} = factory();
             }
           }(this, function () {
           """
    end: """
         return require('#{mimosaConfig.libraryPackage.main}');
         }))"
         """

_noShimNoDependencies = (mimosaConfig, rc) ->
  rc.out = path.join mimosaConfig.libraryPackage.outFolder, "noShimNoDependencies", mimosaConfig.libraryPackage.name
  rc.exclude = mimosaConfig.libraryPackage.removeDependencies
  rc.include = [mimosaConfig.libraryPackage.main]
  rc.name = mimosaConfig.libraryPackage.main
  rc.wrap = _noShimFragment mimosaConfig

_noShimWithDependencies = (mimosaConfig, rc) ->
  rc.out = path.join mimosaConfig.libraryPackage.outFolder, "noShimWithDependencies", mimosaConfig.libraryPackage.name
  rc.include = [mimosaConfig.libraryPackage.main]
  rc.name = mimosaConfig.libraryPackage.main
  rc.wrap = _noShimFragment mimosaConfig

_noShimFragment = (mimosaConfig) ->
  start: "(function () {"
  end: """

       define(['#{mimosaConfig.libraryPackage.main}'], function(lib) {
         return lib;
       });
       })
       """

module.exports =
  registration:    registration
  defaults:        config.defaults
  placeholder:     config.placeholder
  validate:        config.validate