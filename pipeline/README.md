# Development pipeline

Use **Node 24.21.0** (see `.nvmrc` or `.tool-versions`) and **Yarn 1.22.22**.
For example, `nvm install && nvm use` selects the pinned Node version when nvm is installed.
Install the pinned Yarn version with `npm install --global yarn@1.22.22` if needed.

## First run

From the repository root:

```sh
yarn generate
yarn install --frozen-lockfile --non-interactive
yarn build:dev
yarn dev
```

Generation must happen **before installation**: Yarn needs all package manifests to
resolve and link the workspace in one pass. `yarn generate` uses only Node built-ins,
so it works without `node_modules`. The install guard reports missing metadata instead
of allowing an incomplete workspace install. There are no automatic generation or build
hooks during installation.

The server is at **http://127.0.0.1:9090**. The demo in `examples/baseline` imports built
`@nlux/core` and `@nlux/themes` packages and uses a local streaming mock adapter. It needs
no API key or external backend. Send two messages to check streaming and history: replies
are numbered. Use `PORT=9091 yarn dev` to choose a different port.

## Commands and their boundaries

| Command | Responsibility |
| --- | --- |
| `yarn generate` | Write source and distribution manifests, package metadata, and TypeScript configs; preserve existing bundles; never install or compile |
| `yarn install --frozen-lockfile --non-interactive` | Install and link all declared workspaces once; never build library packages |
| `yarn build:dev` | Compile pipeline helpers and development packages in dependency order into `dist/dev`; never install or regenerate manifests |
| `yarn build` | Compile pipeline helpers and production packages into `dist/prod`; requires development output for local package type resolution |
| `yarn cleanup` | Remove owned build output and compiled pipeline helpers; preserve dependencies, manifests, links, source files, and unrelated folders |
| `yarn watch` | Compile pipeline helpers and watch development packages after an initial development build |
| `yarn test:pipeline` | Run dependency-free Node tests of generation, workspace scope, cleanup, and build command boundaries |
| `yarn test` | Run Vitest after checking that the development packages exist |
| `yarn build-demo` | Type-check and bundle the mock demo into `dist/demo` |

Builds select their own mode explicitly: an inherited `NODE_ENV=production` cannot turn
`yarn build:dev` or `yarn watch` into a production build. Build failures stop the command
and report the failed package command.

## Workspace scope

Root `package.json` lists exactly 32 workspace paths: 15 source packages, their 15 generated
`dist/dev` packages, `docs`, and `specs`. The package catalog in `pipeline/scripts/packages.mjs`
defines the library packages and their build order. Generation validates the workspace list
against this catalog. Add new packages to both files deliberately.

`dist/prod`, `packages/shared` (shared source, not a package), and legacy examples are not
workspaces. The maintained baseline demo has no package manifest; it uses the root toolchain
and the generated local packages. Other `examples/` projects remain standalone and may need
their own dependencies or backend. Creating an unrelated folder cannot silently enroll it
in the root install.

## Daily development

After installation, run `yarn build:dev` whenever you need a complete development rebuild.
Keep `yarn dev` running and run `yarn watch` in another terminal for incremental rebuilds.
Refresh the demo after a library rebuild if Vite has retained a cached dependency.

After editing package templates or `pipeline/npm/versions.json`:

```sh
yarn generate
yarn install --frozen-lockfile --non-interactive
yarn build:dev
```

Shared build dependency ranges live in the `devDependencies` map in
`pipeline/npm/versions.json`. Source templates reference them by exact package name,
for example `"rollup": "{versions.devDependencies.rollup}"`. Generation resolves only
those dependencies a package declares; it does not add tools to every package or to
published manifests. Package-specific tools may keep literal ranges. For a dependency
already in the shared map, use its reference in every source template; generation rejects
literal overrides and missing or malformed references. To centralize another tool, add
its existing range to the map and replace its literal ranges in the source templates.

If you intentionally changed dependency requirements and the frozen install fails, run
`yarn install --non-interactive`, review and commit the lockfile changes, then verify a
frozen install. Edit template files rather than generated package manifests.

## Verification

After the first-run sequence:

```sh
yarn test:pipeline
yarn lint
yarn build
yarn test
yarn build-demo
```

CI uses the same explicit generation, single install, and build steps. The pipeline tests
also run before dependencies are installed. Library bundles include ESM, CommonJS, UMD,
and TypeScript declarations; the demo consumes ESM.

## Cleanup and compatibility

`yarn cleanup` removes development/production bundles, demo output, documentation output,
coverage, and compiled pipeline helpers. Generated workspace metadata stays in place, so
Yarn's existing links remain valid. Run `yarn build:dev` afterwards; no reinstall is needed.
Cleanup does not recursively delete arbitrary `node_modules`, `build`, or `.next` folders.

`yarn set` remains a compatibility alias for **`yarn build:dev` only**. It no longer generates,
installs, or deletes `dist/`. `yarn reset` now runs cleanup and the development build; it does
not reinstall dependencies. Existing contributors should run the new first-run sequence once.
To reproduce a completely fresh installation, use a fresh checkout and that sequence.
