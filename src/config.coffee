"use strict"

path = require "path"

exports.defaults = ->
  libraryPackage:
    packaging:
      shimmedWithDependencies: true
      noShimNoDependencies: true
      noShimWithDependencies: true
    overrides:
      shimmedWithDependencies: {}
      noShimNoDependencies: {}
      noShimWithDependencies: {}
    outFolder: "build"
    globalName: null
    name: null
    main: null
    removeDependencies: []

exports.placeholder = ->
  """
  \t

    # libraryPackage:           # Configuration for library packaging module
      ###
      # "packaging" provides three options for packaging your library. By default all are enabled.
      # Each option will deliver the compiled asset to a folder named for the packaging type.
      # - "shimmedWithDependencies" a fully batteries included version of your library. Includes
      # an AMD shim (Almond) and includes all dependencies.
      # - "noShimNoDependencies" does not provide an AMD shim and excludes those dependencies
      # listed in removeDependencies
      # - "noShimWithDependencies" does not provide a shim and does not excluded dependencies
      # listed in removeDependencies
      ###
      # packaging:
        # shimmedWithDependencies: true
        # noShimNoDependencies: true
        # noShimWithDependencies: true
      ###
      # Properties passed into the objects below are passed straight to the r.js optimizer for
      # the given packaging type
      ###
      # overrides:
        # shimmedWithDependencies: {}
        # noShimNoDependencies: {}
        # noShimWithDependencies: {}
      # outFolder: "build"      # the name of the folder, relative to the root of the project,
                                # to place the packaged output.
      # globalName: null        # Required if shimmedWithDependencies is set to true. The global
                                # name of the library for use in non module-managed situations.
                                # i.e. "$" or "Backbone"
      # name:null               # Name of library.  Ex: "jquery.foo.js". This will be used as the
                                # output file name for the optimization.  Required.
      # main:null               # The AMD path to the root/entry point of your library.
      # removeDependencies: []  # A list of AMD paths to dependencies to exclude from the library.
                                # For instance, "jquery" or "vendor/openlayers". Libraries you
                                # expect users of the library to include themselves.

  """

exports.validate = (config, validators) ->
  errors = []
  if validators.ifExistsIsObject(errors, "libraryPackage config", config.libraryPackage)
    if validators.ifExistsIsObject(errors, "libraryPackage.packaging", config.libraryPackage.packaging)
      p = config.libraryPackage.packaging
      if validators.booleanMustExist(errors, "libraryPackage.packaging.shimmedWithDependencies", p.shimmedWithDependencies)
        if p.shimmedWithDependencies
          validators.stringMustExist(errors, "libraryPackage.globalName", config.libraryPackage.globalName)
      validators.booleanMustExist(errors, "libraryPackage.packaging.noShimNoDependencies", p.noShimNoDependencies)
      validators.booleanMustExist(errors, "libraryPackage.packaging.noShimWithDependencies", p.noShimWithDependencies)

    if validators.ifExistsIsString(errors, "libraryPackage.outFolder", config.libraryPackage.outFolder)
      config.libraryPackage.outFolderFull = path.join config.root, config.libraryPackage.outFolder
    validators.stringMustExist(errors, "libraryPackage.name", config.libraryPackage.name)
    validators.stringMustExist(errors, "libraryPackage.main", config.libraryPackage.main)

    if validators.ifExistsIsObject(errors, "libraryPackage.overrides", config.libraryPackage.overrides)
      validators.ifExistsIsObject(errors, "libraryPackage.overrides.shimmedWithDependencies", config.libraryPackage.overrides.shimmedWithDependencies)
      validators.ifExistsIsObject(errors, "libraryPackage.overrides.noShimNoDependencies", config.libraryPackage.overrides.noShimNoDependencies)
      validators.ifExistsIsObject(errors, "libraryPackage.overrides.noShimWithDependencies", config.libraryPackage.overrides.noShimWithDependencies)

    validators.isArrayOfStrings(errors, "libraryPackage.removeDependencies", config.libraryPackage.removeDependencies)

  errors