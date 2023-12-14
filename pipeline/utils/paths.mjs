import { URL } from 'url';
import {join} from 'path';

const currentDir = new URL('.', import.meta.url).pathname;
const absoluteRootPath = join(currentDir, '..', '..');
const isProduction = process.env.NODE_ENV === 'production';

const fixedPaths = {
    distPath: join(absoluteRootPath, 'dist', 'dev'),
    nodeModulesPath: join(absoluteRootPath, 'node_modules'),
    devDistPath: join(absoluteRootPath, 'dist', 'dev'),
    prodDistPath: join(absoluteRootPath, 'dist', 'prod'),
};

export const nodeModulesPath = () => fixedPaths.nodeModulesPath;
export const distPath = () => fixedPaths.distPath;

export const devDistPath = (packageName = undefined) => {
    if (packageName) {
        return join(fixedPaths.devDistPath, packageName);
    }

    return fixedPaths.devDistPath;
};

const prodDistPath = (packageName = undefined) => {
    if (packageName) {
        return join(fixedPaths.prodDistPath, packageName);
    }

    return fixedPaths.prodDistPath;
};

export const outputFolder = (packageNameOrFolder = undefined) => {
    const basePath = isProduction ? prodDistPath() : devDistPath();
    if (packageNameOrFolder) {
        return join(basePath, packageNameOrFolder);
    }

    return basePath;
};
