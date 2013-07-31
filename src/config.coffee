"use strict"

exports.defaults = ->
  libraryPackage:
    packaging:
      shimmedNoDependencies: true
      shimmedWithDependencies: true
      noShimNoDependencies: true
      noShimWithDependencies: true
    name: null
    main: null
    removeDependencies: []

exports.placeholder = ->
  """
  \t

    # libraryPackage:           # Configuration for library packaging module
      ###
      # "packaging" provides four options for packaging your library. By default all are enabled.
      # Each option will deliver the compiled asset to a folder named for the packaging type.
      # - "shimmedNoDependencies" excludes dependencies configured with the removeDependencies
      # property below, and includes an AMD shim (Almond) for use when exporting the library to
      # non-AMD settings.
      # - "shimmedWithDependencies" a fully batteries included version of your library. Includes
      # an AMD shim (Almond) and does not exclude any dependencies.
      # - "noShimNoDependencies" does not provide an AMD shim and excludes those dependencies
      # listed in removeDependencies
      # - "noShimWithDependencies" does not provide a shim and does not excluded dependencies
      # listed in removeDependencies
      ###
      # packaging:
        # shimmedNoDependencies:true
        # shimmedWithDependencies:true
        # noShimNoDependencies:true
        # noShimWithDependencies:true
      # outFolder: "dist"       # the name of the folder to place the packaged output.
      # name:null               # Name of library.  Ex: "jquery.foo.js". This will be used as the
                                # output file name for the optimization.  Required.
      # main:null               # The AMD path to the root/entry point of your library.
      # removeDependencies: []  # A list of AMD paths to dependencies to exclude from the library.
                                # For instance, "jquery" or "vendor/openlayers". Libraries you
                                # expect users of the library to include themselves.

  """

exports.validate = (config, validators) ->
  errors = []
  if validators.ifExistsisObject(errors, "libraryPackage config", config.libraryPackage)
    if validators.ifExistsisObject(errors, "libraryPackage.packaging", config.libraryPackage.packaging)
      p = config.libraryPackage.packaging
      validators.booleanMustExist(errors, "libraryPackage.packaging.shimmedNoDependencies", p.shimmedNoDependencies)
      validators.booleanMustExist(errors, "libraryPackage.packaging.shimmedWithDependencies", p.shimmedWithDependencies)
      validators.booleanMustExist(errors, "libraryPackage.packaging.noShimNoDependencies", p.noShimNoDependencies)
      validators.booleanMustExist(errors, "libraryPackage.packaging.noShimWithDependencies", p.noShimWithDependencies)

    validators.stringMustExist(errors, "libraryPackage.outFolder", config.libraryPackage.outFolder)
    validators.stringMustExist(errors, "libraryPackage.name", config.libraryPackage.name)
    validators.stringMustExist(errors, "libraryPackage.main", config.libraryPackage.main)

    validators.isArrayOfStringsMustExist(errors, "libraryPackage.removeDependencies", config.libraryPackage.removeDependencies)

  errors
