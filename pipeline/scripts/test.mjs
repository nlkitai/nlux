import clc from 'cli-color';
import {info, nl} from '../utils/log.mjs';
import {symlinkBuiltPackageToEmulatorFolder, symlinkNodeModuleToEmulatorFolder} from '../utils/symLink.mjs';
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
        'mkdir dist/dev/emulator/examples',
        'mkdir dist/dev/emulator/examples-react',
        'mkdir dist/dev/emulator/packages',
        'mkdir dist/dev/emulator/packages/@nlux',
    ];

    for (let i = 0; i < commands.length; i++) {
        await run(commands[i]);
    }

    ['nlux-core', 'nlux-react', 'openai', 'openai-react', 'hf', 'hf-react', 'highlighter', 'themes'].forEach((name) => {
        symlinkBuiltPackageToEmulatorFolder(name);
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
