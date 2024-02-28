import {existsSync, lstatSync, readdirSync, rmSync, unlinkSync} from 'fs';
import {extname, join} from 'path';
import {error, info, nl} from '../utils/log.mjs';
import {packagesList} from './packages.mjs';

const dirNamesToRemove = [
    'node_modules',
    'build',
    'dist',
    '.cache',
    '.rollup.cache',
];

const cleanUp = (dirToCleanup) => {
    for (let dirName of dirNamesToRemove) {
        const dir = join(dirToCleanup, dirName);
        if (existsSync(dir)) {
            rmSync(dir, {recursive: true, force: true});
            info(`Removed ${dirName} from ${dir}`);
        }
    }

    const files = readdirSync(dirToCleanup);
    for (let file of files) {
        const filePath = join(dirToCleanup, file);
        const stat = lstatSync(filePath);

        if (stat.isDirectory()) {
            cleanUp(filePath);
        }
    }
};

function removeJsFiles(folder) {
    info('Deleting JS files from ' + folder);
    try {
        // Get array of files
        const files = readdirSync(folder);

        // Loop through each file
        for (const file of files) {
            // Check if JS file
            if (extname(file) === '.js' || extname(file) === '.mjs') {
                // Construct full path
                const filePath = join(folder, file);

                // Delete file
                unlinkSync(filePath);
            }
        }
    } catch (err) {
        error(err);
    }
}

function removeGeneratedPackageJson(folder) {
    info('Deleting package.json and tsconfig.json files from ' + folder);
    try {
        // Get array of files
        const files = readdirSync(folder);

        // Loop through each file
        for (const file of files) {
            // Check if JS file
            if (file === 'package.json') {
                unlinkSync(join(folder, file));
            }

            if (file === 'tsconfig.json') {
                unlinkSync(join(folder, file));
            }
        }
    } catch (err) {
        error(err);
    }
}

nl(1);
info('###############################################');
info(`# 🧹 Pipeline Step: Cleanup                   #`);
info('###############################################');
nl(1);

info('Starting cleanup 🧹 ...');

removeJsFiles('pipeline/utils/rollup');

packagesList.forEach(
    pkg => {
        removeGeneratedPackageJson(`packages/${pkg.directory}`);
        removeJsFiles(`packages/${pkg.directory}`);
    }
);

info('Removing build and dependency folders');
cleanUp('.');

info('\x1b[32mCleanup Done 🏃 ✓' + '\x1b[0m');

