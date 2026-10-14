import {existsSync, readdirSync, rmSync} from 'node:fs';
import {packagesList} from './packages.mjs';

// Retain generated workspace metadata and node_modules so rebuilding needs no reinstall.
for (const pkg of packagesList) {
    const metadata = new Set([...readdirSync(pkg.npmConfigDirectory), 'package.json', 'node_modules']);
    for (const env of ['dev', 'prod']) {
        const directory = `dist/${env}/${pkg.name}`;
        if (!existsSync(directory)) continue;
        for (const entry of readdirSync(directory)) {
            if (!metadata.has(entry)) rmSync(`${directory}/${entry}`, {recursive: true, force: true});
        }
    }
    rmSync(`packages/${pkg.directory}/.rollup.cache`, {recursive: true, force: true});
}
for (const file of readdirSync('pipeline/utils/rollup').filter(file => file.endsWith('.ts'))) {
    rmSync(`pipeline/utils/rollup/${file.slice(0, -3)}.js`, {force: true});
}
for (const directory of ['dist/demo', 'docs/build', 'docs/dist', 'docs/.docusaurus', 'coverage', 'specs/coverage']) {
    rmSync(directory, {recursive: true, force: true});
}
console.log('Build output removed. Workspace metadata and installed dependencies were preserved.');
