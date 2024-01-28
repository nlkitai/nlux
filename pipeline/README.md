# Pipeline

This folder contains build scripts, config, and utils for the dev pipeline.
It also includes `npm` preset and README files for published packages.

## Dev Pipeline

The repository was designed to be used with `yarn`.<br />
For example, we use `yarn` for mono-repo packages structure instead of lerna.

### Running The Dev Server

In order to run the dev server, you can follow the following steps (that
should be run from the root of the repository):

```bash
yarn run reset
yarn run dev
```

`yarn run reset` will reset the repository to a clean state.<br />
It will remove all the `node_modules` folders and install all the dependencies
It will also symlink all the packages in the repository.

`yarn run dev` will build the examples present under `samples` folder and will run
the dev server on port `9090`.

### Running The Specs / Unit Tests

The specs / unit tests are located under `specs/nlux` folder.<br />
In order to run the specs, you need to first build the project by running:

```bash
yarn run set

// or
yarn run reset
```

Then you can run the specs using the following command:

```bash
yarn run test
```

### Watching File Changes

If you're editing code when the dev server is running, you can use the following
command to watch for file changes and rebuild the examples:

```bash
yarn run watch
```

## Bundle Types

The build script will always emit `ESM`, `CJS`, and `UMD` bundles.

By default, the dev server will run with `ESM` bundling.

If you would like to run the dev script in `CJS` or `UMD` mode, you can use
the environment variable `NLUX_BUNDLER_PACKAGE_TYPE` as following:

### Dev Server With `CJS` Bundling:

```bash
NLUX_BUNDLER_PACKAGE_TYPE=cjs yarn reset
NLUX_BUNDLER_PACKAGE_TYPE=cjs yarn dev
```

### Dev Server With `UMD` Bundling:

```bash
NLUX_BUNDLER_PACKAGE_TYPE=umd yarn reset
NLUX_BUNDLER_PACKAGE_TYPE=umd yarn dev
```
