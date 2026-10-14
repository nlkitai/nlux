import {cpSync, mkdirSync} from 'node:fs';
import {packagesList} from './packages.mjs';
import {applyDevVersion, applyReleaseVersion} from './version.mjs';
import {assertWorkspaceLayout} from './workspaces.mjs';

try {
    assertWorkspaceLayout();
    // Only write package metadata. Never remove bundles or run an install/build here.
    for (const env of ['dev', 'prod']) {
        for (const pkg of packagesList) {
            const directory = `dist/${env}/${pkg.name}`;
            mkdirSync(directory, {recursive: true});
            cpSync(pkg.npmConfigDirectory, directory, {recursive: true});
        }
    }
    applyDevVersion(packagesList.map(pkg => `packages/${pkg.directory}/package.tpl.json`));
    applyDevVersion(packagesList.map(pkg => `dist/dev/${pkg.name}/package.tpl.json`));
    applyReleaseVersion(packagesList.map(pkg => `dist/prod/${pkg.name}/package.tpl.json`));
    for (const pkg of packagesList) {
        cpSync('pipeline/config/packageLevelTsConfig.json', `packages/${pkg.directory}/tsconfig.json`);
    }
    console.log('Package metadata generated. Next: yarn install --frozen-lockfile --non-interactive');
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
