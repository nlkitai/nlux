# Developer Documentation Website

This folder contains the source code for `NLUX`'s developer documentation website:  
[docs.nlkit.com/nlux](https://docs.nlkit.com/nlux)

### Installation

```
$ yarn
```

### Local Development

```
$ yarn dev
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Contributing

If you would like to contribute to the documentation, please make sure that your changes are consistent with the 
existing documentation. Please run `yarn build` to ensure that your changes will pass the build process, as the dev 
server may not catch all errors.
