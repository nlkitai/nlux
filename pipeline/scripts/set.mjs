import {cpSync, mkdirSync, rmSync} from 'fs';
import {info, nl} from '../utils/log.mjs';
import {packagesList} from './packages.mjs';
import {run} from './run.mjs';
import {applyDevVersion, applyReleaseVersion} from './version.mjs';

const copyStructure = async (env) => {
    mkdirSync(`dist/${env}`, {recursive: true});
    packagesList.forEach(pkg => {
        cpSync(pkg.npmConfigDirectory, `dist/${env}/${pkg.name}`, {recursive: true});
    });
};

nl(1);
info('###############################################');
info(`# 🚂 Pipeline Step: Set                       #`);
info('###############################################');
nl(1);

try {
    rmSync('dist', {recursive: true, force: true});
    mkdirSync(`dist`, {recursive: true});

    await copyStructure('dev');
    await copyStructure('prod');

    nl(1);

    info('Applying versions ⏲️ to source code packages:');
    applyDevVersion('packages/js');
    applyDevVersion('packages/extra');
    applyDevVersion('packages/react');
    applyDevVersion('packages/css');

    nl(1);
    info('Applying versions ⏲️ to dist packages:');
    applyDevVersion('dist/dev');
    applyReleaseVersion('dist/prod');

    //
    // Install dev packages
    //
    for (const pkg of packagesList) {
        await run(`yarn workspace ${pkg.devName} install`);
    }

    //
    // Run TSC on pipeline utils folder to generate JS files
    //
    await run('cd pipeline/utils && tsc --project tsconfig.json');

    //
    // Build dev packages
    //
    for (const pkg of packagesList) {
        await run(`yarn workspace ${pkg.devName} build`);
    }

} catch (e) {
    process.exit(1);
}
