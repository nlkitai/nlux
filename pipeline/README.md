# Development pipeline

Use **Node 24.21.0** (see `.nvmrc` or `.tool-versions`) and **Yarn 1.22.22**.
For example, `nvm install && nvm use` selects the pinned Node version when nvm is installed.
Install the pinned Yarn version with `npm install --global yarn@1.22.22` if needed.

## First run

From the repository root:

```sh
yarn install --frozen-lockfile
yarn set
yarn dev
```

`yarn set` generates local package manifests and TypeScript configurations, links the
workspaces, and builds development bundles in `dist/dev`. It replaces `dist/`, so rerun
`yarn build` afterwards if you also need production output.

`yarn dev` opens a Vite server at **http://127.0.0.1:9090**. The canonical demo in
`examples/baseline` imports the built `@nlux/core` and `@nlux/themes` packages and uses
a local streaming mock adapter. It needs no API key or external backend. Send two
messages to check streaming and conversation history: the replies are numbered.
Use `PORT=9091 yarn dev` to choose a different port.

## Working on the library

Keep `yarn dev` running and run this in a second terminal to rebuild library bundles:

```sh
yarn watch
```

After a library rebuild, refresh the demo if Vite has retained a cached dependency.
The other folders under `examples/` are older development and integration examples;
they are not part of this baseline setup and may need their own backend or dependencies.

## Verification

After `yarn set`:

```sh
yarn lint
yarn build
yarn test
yarn build-demo
```

- `yarn lint` checks library source with ESLint.
- `yarn build` produces production library bundles in `dist/prod`.
- `yarn test` runs the Vitest suite against the development setup.
- `yarn build-demo` bundles the mock demo into `dist/demo`.

CI runs the install, setup, lint, production build, tests, and demo build with the pinned
runtime. Tests require generated development packages; `yarn install` alone is not enough.

## Cleanup

`yarn cleanup` removes generated manifests, build output, and dependency directories.
`yarn reset` runs cleanup followed by setup. These are destructive rebuild commands,
not necessary for normal development; prefer the first-run commands above.

## Package configuration

Edit `packages/**/package.tpl.json`, `pipeline/npm/**/package.tpl.json`, and
`pipeline/npm/versions.json` rather than generated package manifests. Run `yarn set`
after changing templates. Intentional dependency changes require updating and reviewing
`yarn.lock` before verifying a frozen install.

The library build emits ESM, CommonJS, UMD, and TypeScript declaration files. The baseline
demo uses ESM. No bundler-mode environment variable is required to start it.
