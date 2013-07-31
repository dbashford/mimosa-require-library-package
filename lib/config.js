"use strict";
exports.defaults = function() {
  return {
    libraryPackage: {
      packaging: {
        shimmedNoDependencies: true,
        shimmedWithDependencies: true,
        noShimNoDependencies: true,
        noShimWithDependencies: true
      },
      name: null,
      main: null,
      removeDependencies: []
    }
  };
};

exports.placeholder = function() {
  return "\t\n\n  # libraryPackage:           # Configuration for library packaging module\n    ###\n    # \"packaging\" provides four options for packaging your library. By default all are enabled.\n    # Each option will deliver the compiled asset to a folder named for the packaging type.\n    # - \"shimmedNoDependencies\" excludes dependencies configured with the removeDependencies\n    # property below, and includes an AMD shim (Almond) for use when exporting the library to\n    # non-AMD settings.\n    # - \"shimmedWithDependencies\" a fully batteries included version of your library. Includes\n    # an AMD shim (Almond) and does not exclude any dependencies.\n    # - \"noShimNoDependencies\" does not provide an AMD shim and excludes those dependencies\n    # listed in removeDependencies\n    # - \"noShimWithDependencies\" does not provide a shim and does not excluded dependencies\n    # listed in removeDependencies\n    ###\n    # packaging:\n      # shimmedNoDependencies:true\n      # shimmedWithDependencies:true\n      # noShimNoDependencies:true\n      # noShimWithDependencies:true\n    # outFolder: \"dist\"       # the name of the folder to place the packaged output.\n    # name:null               # Name of library.  Ex: \"jquery.foo.js\". This will be used as the\n                              # output file name for the optimization.  Required.\n    # main:null               # The AMD path to the root/entry point of your library.\n    # removeDependencies: []  # A list of AMD paths to dependencies to exclude from the library.\n                              # For instance, \"jquery\" or \"vendor/openlayers\". Libraries you\n                              # expect users of the library to include themselves.\n";
};

exports.validate = function(config, validators) {
  var errors, p;
  errors = [];
  if (validators.ifExistsisObject(errors, "libraryPackage config", config.libraryPackage)) {
    if (validators.ifExistsisObject(errors, "libraryPackage.packaging", config.libraryPackage.packaging)) {
      p = config.libraryPackage.packaging;
      validators.booleanMustExist(errors, "libraryPackage.packaging.shimmedNoDependencies", p.shimmedNoDependencies);
      validators.booleanMustExist(errors, "libraryPackage.packaging.shimmedWithDependencies", p.shimmedWithDependencies);
      validators.booleanMustExist(errors, "libraryPackage.packaging.noShimNoDependencies", p.noShimNoDependencies);
      validators.booleanMustExist(errors, "libraryPackage.packaging.noShimWithDependencies", p.noShimWithDependencies);
    }
    validators.stringMustExist(errors, "libraryPackage.outFolder", config.libraryPackage.outFolder);
    validators.stringMustExist(errors, "libraryPackage.name", config.libraryPackage.name);
    validators.stringMustExist(errors, "libraryPackage.main", config.libraryPackage.main);
    validators.isArrayOfStringsMustExist(errors, "libraryPackage.removeDependencies", config.libraryPackage.removeDependencies);
  }
  return errors;
};
