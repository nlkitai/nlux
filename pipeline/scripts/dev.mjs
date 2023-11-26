import {existsSync} from 'fs';
import clc from 'cli-color';
import {run} from './run.mjs';
import {info, nl, throwError} from '../utils/log.mjs';
import {devDistPath} from '../utils/paths.mjs';
import {symlinkBuiltPackageToEmulatorFolder, symlinkNodeModuleToEmulatorFolder} from '../utils/symLink.mjs';

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
    if (['nlux', 'openai', 'hf', 'nlux-react', 'openai-react', 'hf-react', 'themes'].some(
        (buildFolder) => !existsSync(devDistPath(buildFolder))
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
        'mkdir dist/dev/emulator/examples',
        'mkdir dist/dev/emulator/examples-react',
        'mkdir dist/dev/emulator/examples-react-hf',
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
    await run('cp -r samples/emulator/src/examples/index.html dist/dev/emulator/examples/index.html');
    await run('cp -r samples/emulator/src/examples-react/index.html dist/dev/emulator/examples-react/index.html');
    await run('cp -r samples/emulator/src/examples-react/require.min.js dist/dev/emulator/examples-react/require.min.js');
    await run('cp -r samples/emulator/src/examples-react-hf/index.html dist/dev/emulator/examples-react-hf/index.html');
    await run('cp -r samples/emulator/src/examples-react-hf/require.min.js dist/dev/emulator/examples-react-hf/require.min.js');

    info('Symlinking packages to emulator folder');

    //
    // Symlink built NLUX packages to emulator folder
    //
    ['nlux', 'nlux-react', 'openai', 'openai-react', 'hf', 'hf-react', 'themes'].forEach((name) => {
        symlinkBuiltPackageToEmulatorFolder(name);
    });

    //
    // Symlink dependencies to emulator folder
    //
    ['react', 'react-dom', 'openai'].forEach((name) => {
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
