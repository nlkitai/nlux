import clc from 'cli-color';
import {info, nl} from '../utils/log.mjs';
import {symlinkBuiltPackageToEmulatorFolder, symlinkNodeModuleToEmulatorFolder} from '../utils/symLink.mjs';
import {packagesList} from "./packages.mjs";
import {run} from './run.mjs';

nl(1);
info(clc.bgWhite.red(' ############################################### '));
info(clc.bgWhite.red(` # 🚂 Pipeline Step: Test                      # `));
info(clc.bgWhite.red(' ############################################### '));
nl(1);

try {
    const commands = [
        'rm -fr dist/dev/emulator',
        'mkdir dist/dev/emulator',
        'mkdir dist/dev/emulator/packages',
        'mkdir dist/dev/emulator/packages/@nlux',
    ];

    for (let i = 0; i < commands.length; i++) {
        await run(commands[i]);
    }

    packagesList.forEach(pkg => {
        symlinkBuiltPackageToEmulatorFolder(pkg.name);
    });

    //
    // Symlink dependencies to emulator folder
    //
    ['react', 'react-dom', 'openai', 'highlight.js'].forEach((name) => {
        symlinkNodeModuleToEmulatorFolder(name);
    });

    //
    // Run tests
    //
    run('cd specs && yarn test', true)
        .then(() => process.exitCode = 0)
        .catch(() => process.exitCode = 1);
} catch (e) {
    process.exit(1);
}
