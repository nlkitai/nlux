import clc from 'cli-color';
import {run} from './run.mjs';
import {info, nl} from '../utils/log.mjs';
import {symlinkBuiltPackageToEmulatorFolder, symlinkNodeModuleToEmulatorFolder} from '../utils/symLink.mjs';

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

    ['nlux', 'nlux-react', 'openai', 'openai-react', 'hf', 'hf-react', 'themes'].forEach((name) => {
        symlinkBuiltPackageToEmulatorFolder(name);
    });

    //
    // Symlink dependencies to emulator folder
    //
    ['react', 'react-dom', 'openai'].forEach((name) => {
        symlinkNodeModuleToEmulatorFolder(name);
    });

    await run('cd specs && yarn test', false);
} catch (e) {
    process.exit(1);
}
