import clc from 'cli-color';
import {info, nl} from '../utils/log.mjs';
import {run} from './run.mjs';

nl(1);
info(clc.bgWhite.red(' ############################################### '));
info(clc.bgWhite.red(` # 🚂 Pipeline Step: Test                      # `));
info(clc.bgWhite.red(' ############################################### '));
nl(1);

try {
    //
    // Run tests
    //
    run('cd specs && yarn test', true)
        .then(() => process.exitCode = 0)
        .catch(() => process.exitCode = 1);
} catch (e) {
    process.exit(1);
}
