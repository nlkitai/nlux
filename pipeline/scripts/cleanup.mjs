import {existsSync, lstatSync, readdirSync, rmSync, unlinkSync} from 'fs';
import {extname, join} from 'path';
import {error, info, nl} from '../utils/log.mjs';

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
            if (extname(file) === '.js') {
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
    info('Deleting package.json files from ' + folder);
    try {
        // Get array of files
        const files = readdirSync(folder);

        // Loop through each file
        for (const file of files) {
            // Check if JS file
            if (file === 'package.json') {
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

nl(1);
info('###############################################');
info(`# 🧹 Pipeline Step: Cleanup                   #`);
info('###############################################');
nl(1);

info('Starting cleanup 🧹 ...');

removeJsFiles('pipeline/utils/rollup');

removeGeneratedPackageJson('packages/css/themes');
removeGeneratedPackageJson('packages/js/nlux');
removeGeneratedPackageJson('packages/js/openai');
removeGeneratedPackageJson('packages/js/hf');
removeGeneratedPackageJson('packages/react/nlux');
removeGeneratedPackageJson('packages/react/openai');
removeGeneratedPackageJson('packages/react/hf');

info('Removing build and dependency folders');
cleanUp('.');

info('Cleanup complete! ✅');
