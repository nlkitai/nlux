import {existsSync, symlinkSync} from 'fs';
import {throwError} from './log.mjs';
import {join} from 'path';
import {devDistPath, nodeModulesPath} from './paths.mjs';

export const symlinkBuiltPackageToEmulatorFolder = (packageFolder) => {
    const builtPackagePath = devDistPath(packageFolder);
    if (!existsSync(builtPackagePath)) {
        throwError(`Could not find built package: ${packageFolder}`);
    }

    // stripe 'nlux-' from package name
    const packageBuiltName = packageFolder.replace('nlux-', '');
    symlinkSync(builtPackagePath, join(devDistPath(), 'emulator', 'packages', '@nlux', packageBuiltName), 'dir');
}

export const symlinkNodeModuleToEmulatorFolder = (name) => {
    const modulePath = join(nodeModulesPath(), name);
    if (!existsSync(modulePath)) {
        throwError(`Could not find built node module: ${name}`);
    }

    symlinkSync(modulePath, join(devDistPath(), 'emulator', 'packages', name), 'dir');
};
