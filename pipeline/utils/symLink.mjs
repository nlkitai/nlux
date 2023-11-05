import {existsSync, symlinkSync} from 'fs';
import {throwError} from './log.mjs';
import {join} from 'path';
import {devDistPath, nodeModulesPath} from './paths.mjs';

export const symlinkBuiltPackageToEmulatorFolder = (name) => {
    const builtPackagePath = devDistPath(name);
    if (!existsSync(builtPackagePath)) {
        throwError(`Could not find built package: ${name}`);
    }

    symlinkSync(builtPackagePath, join(devDistPath(), 'emulator', 'packages', '@nlux', name), 'dir');
}

export const symlinkNodeModuleToEmulatorFolder = (name) => {
    const modulePath = join(nodeModulesPath(), name);
    if (!existsSync(modulePath)) {
        throwError(`Could not find built package: ${name}`);
    }

    symlinkSync(modulePath, join(devDistPath(), 'emulator', 'packages', name), 'dir');
};
