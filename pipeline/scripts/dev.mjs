import {existsSync, symlinkSync} from 'fs';
import {join} from 'path';
import {cwd} from 'process';
import {run} from './run.mjs';
import {info, nl, throwError} from '../utils/log.mjs';

const distPath = join(cwd(), 'dist', 'dev');
const nodeModulesPath = join(cwd(), 'node_modules');

const nluxJsBuildPath = join(distPath, 'nlux');
const openAiAdapterJsBuildPath = join(distPath, 'openai');

const nluxReactBuildPath = join(distPath, 'nlux-react');
const openAiAdapterReactBuildPath = join(distPath, 'openai-react');

const themesBuildPath = join(distPath, 'themes');

const symlinkBuiltPackageToEmulatorFolder = (name) => {
    const builtPackagePath = join(distPath, name);
    if (!existsSync(builtPackagePath)) {
        throwError(`Could not find built package: ${name}`);
    }

    symlinkSync(builtPackagePath, join(distPath, 'emulator', 'packages', '@nlux', name), 'dir');
}

const symlinkNodeModuleToEmulatorFolder = (name) => {
    const modulePath = join(nodeModulesPath, name);
    if (!existsSync(modulePath)) {
        throwError(`Could not find built package: ${name}`);
    }

    symlinkSync(modulePath, join(distPath, 'emulator', 'packages', name), 'dir');
};

try {
    nl(1);
    info('###############################################');
    info(`# 🍦 Pipeline Step: Starting Dev Server       #`);
    info('###############################################');
    nl(1);

    info('Starting dev server 🚀 ...');
    info('Checking if build folders exist');

    if (
        !existsSync(nluxJsBuildPath) ||
        !existsSync(nluxReactBuildPath) ||
        !existsSync(openAiAdapterJsBuildPath) ||
        !existsSync(openAiAdapterReactBuildPath) ||
        !existsSync(themesBuildPath)
    ) {
        const errorMessage = 'Error ❗️ One or multiple build folders are missing.\n' +
            'Please build the packages first using [yarn set] before running dev server.';

        throwError(errorMessage);
    }


    info('Creating emulator folder structure');
    await run('rm -fr dist/dev/emulator');
    await run('mkdir dist/dev/emulator');
    await run('mkdir dist/dev/emulator/examples');
    await run('mkdir dist/dev/emulator/examples-react');
    await run('mkdir dist/dev/emulator/packages');
    await run('mkdir dist/dev/emulator/packages/@nlux');

    info('Building emulator code');
    await run('yarn workspace @nlux-dev/emulator build');

    info('Copying emulator static files');
    await run('cp -r samples/emulator/src/index.html dist/dev/emulator/index.html');
    await run('cp -r samples/emulator/src/examples/index.html dist/dev/emulator/examples/index.html');
    await run('cp -r samples/emulator/src/examples-react/index.html dist/dev/emulator/examples-react/index.html');
    await run('cp -r samples/emulator/src/examples-react/require.min.js dist/dev/emulator/examples-react/require.min.js');

    info('Symlinking packages to emulator folder');

    // Symlink built NLUX packages to emulator folder
    symlinkBuiltPackageToEmulatorFolder('nlux');
    symlinkBuiltPackageToEmulatorFolder('nlux-react');
    symlinkBuiltPackageToEmulatorFolder('openai');
    symlinkBuiltPackageToEmulatorFolder('openai-react');
    symlinkBuiltPackageToEmulatorFolder('themes');

    // Symlink dependencies to emulator folder
    symlinkNodeModuleToEmulatorFolder('react');
    symlinkNodeModuleToEmulatorFolder('react-dom');
    symlinkNodeModuleToEmulatorFolder('openai');

    info('Emulator ready! Starting dev server ✅ 💫 ...');

    const port = process.env.PORT || 9999;

    nl(1);
    info('###############################################');
    info(`#     Starting dev server on port ${port} 🚀     #`);
    info('###############################################');
    nl(1);

    await run(`yarn serve --symlinks -p ${port} dist/dev/emulator`);
} catch (e) {
    process.exit(1);
}
