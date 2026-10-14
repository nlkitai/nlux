import {packagesList} from './packages.mjs';
import {run} from './run.mjs';
import {assertDevelopmentBuild} from './workspaces.mjs';

try {
    assertDevelopmentBuild();
    await run('yarn run tsc --project pipeline/utils/tsconfig.json');
    await Promise.all(packagesList.map(pkg =>
        run(`yarn workspace ${pkg.devName} watch`, false, {NODE_ENV: 'development'}),
    ));
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
