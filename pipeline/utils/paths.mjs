import {join} from 'path';

const isProduction = process.env.NODE_ENV === 'production';

const fixedPaths = {
    distPath: join('dist', 'dev'),
    nodeModulesPath: join('node_modules'),
    devDistPath: join('dist', 'dev'),
    prodDistPath: join('dist', 'prod'),
};

export const nodeModulesPath = () => fixedPaths.nodeModulesPath;

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
