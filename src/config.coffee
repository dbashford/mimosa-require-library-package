"use strict"

path = require "path"

exports.defaults = ->
  libraryPackage:
    packaging:
      # shimmedNoDependencies: true
      shimmedWithDependencies: true
      noShimNoDependencies: true
      noShimWithDependencies: true
    outFolder: "dist"
    name: null
    main: null
    removeDependencies: []


# - "shimmedNoDependencies" excludes dependencies configured with the removeDependencies
# property below, and includes an AMD shim (Almond) for use when exporting the library to
# non-AMD settings.
# shimmedNoDependencies:true

exports.placeholder = ->
  """
  \t

    # libraryPackage:           # Configuration for library packaging module
      ###
      # "packaging" provides four options for packaging your library. By default all are enabled.
      # Each option will deliver the compiled asset to a folder named for the packaging type.
      # - "shimmedWithDependencies" a fully batteries included version of your library. Includes
      # an AMD shim (Almond) and does not exclude any dependencies.
      # - "noShimNoDependencies" does not provide an AMD shim and excludes those dependencies
      # listed in removeDependencies
      # - "noShimWithDependencies" does not provide a shim and does not excluded dependencies
      # listed in removeDependencies
      ###
      # packaging:
        # shimmedWithDependencies:true
        # noShimNoDependencies:true
        # noShimWithDependencies:true
      # outFolder: "dist"       # the name of the folder, relative to the root of the project,
                                # to place the packaged output.
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
      # validators.booleanMustExist(errors, "libraryPackage.packaging.shimmedNoDependencies", p.shimmedNoDependencies)
      validators.booleanMustExist(errors, "libraryPackage.packaging.shimmedWithDependencies", p.shimmedWithDependencies)
      validators.booleanMustExist(errors, "libraryPackage.packaging.noShimNoDependencies", p.noShimNoDependencies)
      validators.booleanMustExist(errors, "libraryPackage.packaging.noShimWithDependencies", p.noShimWithDependencies)

    if validators.ifExistsIsString(errors, "libraryPackage.outFolder", config.libraryPackage.outFolder)
      config.libraryPackage.outFolderFull = path.join config.root, config.libraryPackage.outFolder
    validators.stringMustExist(errors, "libraryPackage.name", config.libraryPackage.name)
    validators.stringMustExist(errors, "libraryPackage.main", config.libraryPackage.main)

    validators.isArrayOfStrings(errors, "libraryPackage.removeDependencies", config.libraryPackage.removeDependencies)

  errors
