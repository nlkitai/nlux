import {info, nl} from '../utils/log.mjs';
import {packagesList} from './packages.mjs';
import {run} from './run.mjs';

nl(1);
info(' ############################################### ');
info(` # 🔎 Pipeline Step: Watch                     # `);
info(' ############################################### ');
nl(1);

try {
    packagesList.forEach(pkg => {
        run(`yarn workspace ${pkg.devName} watch`);
    });
} catch (e) {
    process.exit(1);
}
