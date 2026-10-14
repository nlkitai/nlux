import {existsSync, realpathSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {packagesList} from './packages.mjs';
import {run} from './run.mjs';
import {assertDevelopmentBuild, assertInstalledWorkspaces} from './workspaces.mjs';

export async function buildPackages(mode) {
    if (!['development', 'production'].includes(mode)) {
        throw new Error('Build mode must be development or production.');
    }
    assertInstalledWorkspaces();
    if (mode === 'production') {
        assertDevelopmentBuild();
        for (const pkg of packagesList) {
            if (!existsSync(`dist/prod/${pkg.name}/package.json`)) {
                throw new Error('Production package metadata is missing. Run `yarn generate`.');
            }
        }
    }
    await run('yarn run tsc --project pipeline/utils/tsconfig.json');
    for (const pkg of packagesList) {
        await run(`yarn workspace ${pkg.devName} build`, true, {NODE_ENV: mode});
    }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
    try {
        await buildPackages(process.argv[2] ?? 'production');
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
