import {cpSync, existsSync, mkdirSync, rmSync} from 'fs';
import {join} from 'path';
import symlinkDir from 'symlink-dir';
import {info, nl, throwError} from '../utils/log.mjs';
import {devDistPath} from '../utils/paths.mjs';
import {packagesList} from './packages.mjs';
import {run} from './run.mjs';

try {
    nl(1);
    info(' ############################################### ');
    info(` # 🍦 Pipeline Step: Starting Dev Server       # `);
    info(' ############################################### ');
    nl(1);

    info('Starting dev server 🚀 ...');
    info('Checking if build folders exist');

    //
    // Check that all build folders exist
    //
    if (packagesList.some(
        pkg => !existsSync(devDistPath(pkg.name))
    )) {
        const errorMessage = 'Error ❗️ One or multiple build folders are missing.\n' +
            'Please build the packages first using [yarn set/reset] before running dev server for the first time.';

        throwError(errorMessage);
    }

    //
    // Run commands to create emulator folder structure
    //
    info('Creating emulator folder structure');
    rmSync('dist/public', {recursive: true, force: true});
    mkdirSync('dist/public/packages/@nlux', {recursive: true});

    //
    // Build emulator code once
    // The result of this build will emit built JS files to the emulator folder
    //
    info('Building emulator code');
    await run('yarn workspace @nlux-dev/emulator build');

    //
    // Copy static files to emulator folder
    //
    info('Copying emulator static files');
    cpSync('samples/emulator/src/index.html', 'dist/public/index.html');

    await Promise.all([
        '01-vanilla-js-with-adapters',
        '02-vanilla-js-with-events',
        '03-react-js-with-hugging-face',
        '04-react-js-with-langserve',
        '05-react-js-with-adapters',
        '06-react-js-personas',
        '07-react-js-events',
        '08-react-js-with-conv-history',
    ].map(async (name) => {
        cpSync(`samples/emulator/src/${name}/index.html`, `dist/public/${name}/index.html`);
        cpSync(`samples/emulator/dep/loaders/require.min.js`, `dist/public/${name}/require.min.js`);

        [
            'index.mjs',
            'index.mjs.map',
            'index.js',
            'index.js.map',
        ].forEach((fileToCopy) => {
            if (existsSync(`dist/dev/emulator/${name}/${fileToCopy}`)) {
                cpSync(`dist/dev/emulator/${name}/${fileToCopy}`, `dist/public/${name}/${fileToCopy}`);
            }
        });
    }));

    info('Sym-linking packages to emulator folder');

    //
    // Symlink built nlux packages to emulator folder
    //
    await Promise.all(packagesList.map(async (pkg) => {
        await symlinkDir(
            join('dist', 'dev', pkg.name),
            join('dist', 'public', 'packages', pkg.npmName),
            {overwrite: true}
        );
    }));

    //
    // Symlink dependencies to emulator folder
    //
    await Promise.all([
        'react', 'react-dom', 'openai', 'highlight.js',
    ].map(async (name) => {
        await symlinkDir(
            join('node_modules', name),
            join('dist', 'public', 'packages', name),
            {overwrite: true}
        );
    }));

    info('Emulator ready! Starting dev server ✅ 💫 ...');
    const port = process.env.PORT || 9090;

    nl(1);
    info(' ############################################### ');
    info(` #     Starting dev server on port ${port} 🚀     # `);
    info(' ############################################### ');
    nl(1);

    //
    // Start dev server
    //
    await run(`vite --port ${port} dist/public`);
} catch (e) {
    process.exit(1);
}
