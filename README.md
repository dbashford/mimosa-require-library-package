mimosa-require-library-package
===========

## Overview

Use this module with Mimosa to package library code built using AMD/RequireJS into a single file for use in other applications.  This module, when used in tandem with the `mimosa-require` module will package up several versions of your library for distribution and use outside of your library project.

For more information regarding Mimosa, see http://mimosajs.com

## Usage

Add `'require-library-package'` to your list of modules _AFTER_ the `require` module.  That's all!  Mimosa will install the module for you when you start up.

## Functionality

By default this module will create three versions of your library.

1. One with the Almond AMD shim and a wrapper that allows for exporting your library as a global property to be used in containing apps.
2. One for use in other RequireJS applications, but not containing libraries to be included by containing apps, like, for instance, jquery or Backbone.
3. One for use in other RequireJS applications but containing all of the dependent libraries and code.

This module executes during a `mimosa build` when both the `--optimize` and `--package` flags are used.

## Default Config

```
libraryPackage:
  packaging:
    shimmedWithDependencies:true
    noShimNoDependencies:true
    noShimWithDependencies:true
  overrides:
    shimmedWithDependencies: {}
    noShimNoDependencies: {}
    noShimWithDependencies: {}
  outFolder: "build"
  cleanOutFolder: true
  globalName: null
  name:null
  main:null
  mainConfigFile: null
  removeDependencies: []
```

- `packaging` - provides three options for packaging your library. By default all are enabled. Each option will deliver the compiled asset to a folder named for the packaging type.
- `packaging.shimmedWithDependencies` - when set to `true` a fully batteries included version of your library is generated. Includes an AMD shim (Almond) and all dependencies.
- `packaging.noShimNoDependencies` - when set to `true` an optimized file is created with shim and dependencies excluded.
- `packaging.noShimWithDependencies` - when set to `true` an optimized file is created without a shim but including dependencies.
- `overrides` - Properties passed the `overrides` objects are passed straight to the r.js optimizer for the given packaging type. Any settings in `overrides` will overwrite all other settings, including, for instance, the `name` property.
- `outFolder` - the name of the folder, relative to the root of the project, to place the packaged output.
- `cleanOutFolder` - when or not to clean the `outFolder` as part of a build
- `globalName` - Required if `shimmedWithDependencies` is set to `true`. The global name of the library for use in non module-managed situations. i.e. "$" or "Backbone"
- `name` - Name of library. Ex: "jquery.foo.js". This will be used as the output file name for the optimization.  Required.
- `main` - The AMD path to the root/entry point of your library.
- `mainConfigFile` - A string, the location of the requirejs configuration. Relative to the `watch.compiledDir` directory. By default, if `require.commonConfig` (from the mimosa-require module) is used and exists, this is set to that file. If `mainConfigFile` is not provided, and `require.commonConfig` does not exist, this is set to the `main` file.
- `removeDependencies` - A list of AMD paths to dependencies to exclude from the library. For instance, "jquery" or "vendor/openlayers". Libraries you expect users of the library to include themselves.