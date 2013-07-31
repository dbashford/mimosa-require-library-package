"use strict";
var path;

path = require("path");

exports.defaults = function() {
  return {
    libraryPackage: {
      packaging: {
        shimmedWithDependencies: true,
        noShimNoDependencies: true,
        noShimWithDependencies: true
      },
      outFolder: "dist",
      globalName: null,
      name: null,
      main: null,
      removeDependencies: []
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n  # libraryPackage:           # Configuration for library packaging module\n    ###\n    # \"packaging\" provides four options for packaging your library. By default all are enabled.\n    # Each option will deliver the compiled asset to a folder named for the packaging type.\n    # - \"shimmedWithDependencies\" a fully batteries included version of your library. Includes\n    # an AMD shim (Almond) and does not exclude any dependencies.\n    # - \"noShimNoDependencies\" does not provide an AMD shim and excludes those dependencies\n    # listed in removeDependencies\n    # - \"noShimWithDependencies\" does not provide a shim and does not excluded dependencies\n    # listed in removeDependencies\n    ###\n    # packaging:\n      # shimmedWithDependencies:true\n      # noShimNoDependencies:true\n      # noShimWithDependencies:true\n    # outFolder: \"dist\"       # the name of the folder, relative to the root of the project,\n                              # to place the packaged output.\n    # globalName: null        # Required if shimmedWithDependencies is set to true. The global\n                              # name of the library for use in non module-managed situations.\n                              # i.e. \"$\" or \"Backbone\"\n    # name:null               # Name of library.  Ex: \"jquery.foo.js\". This will be used as the\n                              # output file name for the optimization.  Required.\n    # main:null               # The AMD path to the root/entry point of your library.\n    # removeDependencies: []  # A list of AMD paths to dependencies to exclude from the library.\n                              # For instance, \"jquery\" or \"vendor/openlayers\". Libraries you\n                              # expect users of the library to include themselves.\n";
};

exports.validate = function(config, validators) {
  var errors, p;
  errors = [];
  if (validators.ifExistsIsObject(errors, "libraryPackage config", config.libraryPackage)) {
    if (validators.ifExistsIsObject(errors, "libraryPackage.packaging", config.libraryPackage.packaging)) {
      p = config.libraryPackage.packaging;
      if (validators.booleanMustExist(errors, "libraryPackage.packaging.shimmedWithDependencies", p.shimmedWithDependencies)) {
        if (p.shimmedWithDependencies) {
          validators.stringMustExist(errors, "libraryPackage.globalName", config.libraryPackage.globalName);
        }
      }
      validators.booleanMustExist(errors, "libraryPackage.packaging.noShimNoDependencies", p.noShimNoDependencies);
      validators.booleanMustExist(errors, "libraryPackage.packaging.noShimWithDependencies", p.noShimWithDependencies);
    }
    if (validators.ifExistsIsString(errors, "libraryPackage.outFolder", config.libraryPackage.outFolder)) {
      config.libraryPackage.outFolderFull = path.join(config.root, config.libraryPackage.outFolder);
    }
    validators.stringMustExist(errors, "libraryPackage.name", config.libraryPackage.name);
    validators.stringMustExist(errors, "libraryPackage.main", config.libraryPackage.main);
    validators.isArrayOfStrings(errors, "libraryPackage.removeDependencies", config.libraryPackage.removeDependencies);
  }
  return errors;
};
