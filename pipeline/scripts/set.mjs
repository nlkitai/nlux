import {info, nl} from '../utils/log.mjs';
import {run} from './run.mjs';
import {applyDevVersion, applyReleaseVersion} from './version.mjs';

const copyStructure = async (env) => {
    await run(`mkdir dist/${env}`);
    await run(`cp -r pipeline/npm/nlux dist/${env}/nlux`);
    await run(`cp -r pipeline/npm/nlux-react dist/${env}/nlux-react`);
    await run(`cp -r pipeline/npm/openai dist/${env}/openai`);
    await run(`cp -r pipeline/npm/openai-react dist/${env}/openai-react`);
    await run(`cp -r pipeline/npm/themes dist/${env}/themes`);
};


nl(1);
info('###############################################');
info(`# 🚂 Pipeline Step: Set                       #`);
info('###############################################');
nl(1);

try {
    await run('rm -fr dist');
    await run('mkdir dist');

    await copyStructure('dev');
    await copyStructure('prod');

    nl(1);

    info('Applying versions ⏲️ to source code packages:');
    applyDevVersion('packages/js');
    applyDevVersion('packages/react');
    applyDevVersion('packages/css');

    nl(1);
    info('Applying versions ⏲️ to dist packages:');
    applyDevVersion('dist/dev');
    applyReleaseVersion('dist/prod');

    await run('yarn workspace @nlux-dev/nlux install');
    await run('yarn workspace @nlux-dev/openai install');
    await run('yarn workspace @nlux-dev/nlux-react install');
    await run('yarn workspace @nlux-dev/openai-react install');
    await run('yarn workspace @nlux-dev/themes install');

    await run('cd pipeline/utils && tsc --project tsconfig.json');

    await run('yarn workspace @nlux-dev/nlux build');
    await run('yarn workspace @nlux-dev/openai build');
    await run('yarn workspace @nlux-dev/nlux-react build');
    await run('yarn workspace @nlux-dev/openai-react build');
    await run('yarn workspace @nlux-dev/themes build');

} catch (e) {
    process.exit(1);
}
