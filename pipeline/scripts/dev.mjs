import clc from 'cli-color';
import {existsSync} from 'fs';
import {info, nl, throwError} from '../utils/log.mjs';
import {devDistPath} from '../utils/paths.mjs';
import {symlinkBuiltPackageToEmulatorFolder, symlinkNodeModuleToEmulatorFolder} from '../utils/symLink.mjs';
import {packagesList} from "./packages.mjs";
import {run} from './run.mjs';

try {
    nl(1);
    info(clc.bgWhite.red(' ############################################### '));
    info(clc.bgWhite.red(` # 🍦 Pipeline Step: Starting Dev Server       # `));
    info(clc.bgWhite.red(' ############################################### '));
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
    const commands = [
        'rm -fr dist/dev/emulator',
        'mkdir dist/dev/emulator',
        'mkdir dist/dev/emulator/packages',
        'mkdir dist/dev/emulator/packages/@nlux',
    ];

    for (let i = 0; i < commands.length; i++) {
        await run(commands[i]);
    }

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
    await run('cp -r samples/emulator/src/index.html dist/dev/emulator/index.html');
    await run('cp -r samples/emulator/src/01-vanilla-js-with-adapters/index.html dist/dev/emulator/01-vanilla-js-with-adapters/index.html');
    await run('cp -r samples/emulator/src/02-vanilla-js-with-events/index.html dist/dev/emulator/02-vanilla-js-with-events/index.html');

    await Promise.all([
        '03-react-js-with-hugging-face',
        '04-react-js-with-langserve',
        '05-react-js-with-adapters',
        '06-react-js-personas',
        '07-react-js-events',
        '08-react-js-with-conv-history',
    ].map(async (name) => {
        await run(`cp -r samples/emulator/src/${name}/index.html dist/dev/emulator/${name}/index.html`);
        await run(`cp -r samples/emulator/dep/loaders/require.min.js dist/dev/emulator/${name}/require.min.js`);
    }));

    info('Symlinking packages to emulator folder');

    //
    // Symlink built NLUX packages to emulator folder
    //
    packagesList.forEach(
        pkg => symlinkBuiltPackageToEmulatorFolder(pkg.name)
    );

    //
    // Symlink dependencies to emulator folder
    //
    ['react', 'react-dom', 'openai', 'highlight.js'].forEach((name) => {
        symlinkNodeModuleToEmulatorFolder(name);
    });

    info('Emulator ready! Starting dev server ✅ 💫 ...');
    const port = process.env.PORT || 9090;

    nl(1);
    info(clc.bgWhite.red(' ############################################### '));
    info(clc.bgWhite.red(` #     Starting dev server on port ${port} 🚀     # `));
    info(clc.bgWhite.red(' ############################################### '));
    nl(1);

    //
    // Start dev server
    //
    await run(`yarn serve --symlinks -p ${port} dist/dev/emulator`);
} catch (e) {
    process.exit(1);
}
