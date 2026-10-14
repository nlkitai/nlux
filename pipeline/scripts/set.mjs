import {buildPackages} from './build.mjs';

console.log('`yarn set` is a compatibility alias for `yarn build:dev`. ' +
    'Run `yarn generate` and one root `yarn install --frozen-lockfile --non-interactive` first.');
try {
    await buildPackages('development');
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
