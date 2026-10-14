import {existsSync, readFileSync, realpathSync} from 'node:fs';
import {packagesList} from './packages.mjs';

export const workspacePaths = [
    ...packagesList.map(pkg => `packages/${pkg.directory}`),
    ...packagesList.map(pkg => `dist/dev/${pkg.name}`),
    'docs',
    'specs',
];

export function assertWorkspaceLayout() {
    const {workspaces} = JSON.parse(readFileSync('package.json', 'utf8'));
    if (!Array.isArray(workspaces) || workspaces.length !== workspacePaths.length ||
        new Set(workspaces).size !== workspaces.length ||
        workspacePaths.some(path => !workspaces.includes(path))) {
        throw new Error('Root workspaces must match the explicit package catalog plus docs and specs. ' +
            'Update package.json and pipeline/scripts/packages.mjs together.');
    }
}

export function assertGeneratedWorkspaces() {
    assertWorkspaceLayout();
    for (const pkg of packagesList) {
        for (const [directory, name] of [
            [`packages/${pkg.directory}`, pkg.devName],
            [`dist/dev/${pkg.name}`, pkg.npmName],
        ]) {
            const file = `${directory}/package.json`;
            if (!existsSync(file) || JSON.parse(readFileSync(file, 'utf8')).name !== name) {
                throw new Error(`Missing or invalid ${file}. Run \`yarn generate\` before installing or building.`);
            }
        }
        if (!existsSync(`packages/${pkg.directory}/tsconfig.json`)) {
            throw new Error('Generated TypeScript configuration is missing. Run `yarn generate`.');
        }
    }
}

export function assertInstalledWorkspaces() {
    assertGeneratedWorkspaces();
    for (const pkg of packagesList) {
        for (const [name, directory] of [
            [pkg.devName, `packages/${pkg.directory}`],
            [pkg.npmName, `dist/dev/${pkg.name}`],
        ]) {
            const link = `node_modules/${name}`;
            if (!existsSync(link) || realpathSync(link) !== realpathSync(directory)) {
                throw new Error(`${name} is not linked to its local workspace. ` +
                    'Run `yarn install --frozen-lockfile --non-interactive`.');
            }
        }
    }
    if (!existsSync('node_modules/.bin/tsc')) {
        throw new Error('Build tools are missing. Run `yarn install --frozen-lockfile --non-interactive`.');
    }
}

export function assertDevelopmentBuild() {
    assertInstalledWorkspaces();
    for (const pkg of packagesList) {
        const directory = `dist/dev/${pkg.name}`;
        const manifest = JSON.parse(readFileSync(`${directory}/package.json`, 'utf8'));
        for (const entry of [manifest.module ?? manifest.main, manifest.types].filter(Boolean)) {
            if (!existsSync(`${directory}/${entry}`)) {
                throw new Error(`Missing development output: ${directory}/${entry}. Run \`yarn build:dev\` first.`);
            }
        }
    }
}
