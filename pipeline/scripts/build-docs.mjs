import {info, nl} from '../utils/log.mjs';
import {packagesList} from './packages.mjs';
import {run} from './run.mjs';

nl(1);
info(' ############################################### ');
info(` # 🏗️  Pipeline Step: Build Docs               # `);
info(' ############################################### ');
nl(1);

try {
    for (const pkg of packagesList) {
        await run(
            `docusaurus build && ` +
            `rm -fr dist && ` +
            `mkdir dist && ` +
            `mv build dist/nlux &&` +
            `mv dist/nlux/root.html dist/index.html &&` +
            `mv dist/nlux/404.html dist/404.html &&` +
            `cp dist/nlux/favicon.ico dist/favicon.ico`
        );
    }
} catch (_error) {
    process.exit(1);
}
