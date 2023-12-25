import {existsSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync} from 'fs';
import {join} from 'path';
import {info, rawLog, throwError} from '../utils/log.mjs';

let versionsFileContent = null;

const readAllPackageTemplates = (packagesPath) => {
    const result = [];

    readdirSync(packagesPath).forEach(file => {
        const filePath = join(packagesPath, file);
        if (statSync(filePath).isDirectory()) {
            const packageJsonPath = join(filePath, 'package.template.json');
            if (existsSync(packageJsonPath)) {
                result.push(packageJsonPath);
            }
        }
    });

    return result;
};

const readVersionsFile = () => {
    const versionsPath = 'pipeline/npm/versions.json';

    if (!existsSync(versionsPath)) {
        throwError(`PeerDependencies file cannot be found: ${versionsPath}`);
    }

    const result = JSON.parse(readFileSync(versionsPath, 'utf8'));

    if (!result.nlux) {
        throwError(`Invalid versions file: ${versionsPath} - Missing main version!`);
    }

    if (!result.peerDependencies) {
        throwError(`Invalid versions file: ${versionsPath} - Missing peerDependencies!`);
    }

    info('Versions file read successfully! ✅ ' + versionsPath);
    info('NLUX version 🌟 : ' + result.nlux);
    info('PeerDependencies versions: ');
    rawLog(JSON.stringify(result.peerDependencies));
    rawLog(JSON.stringify(result.dependencies));

    return {
        nlux: result.nlux,
        peerDependencies: result.peerDependencies,
        dependencies: result.dependencies,
    };
}

const replacePeerDependencyVersions = (peerDependencies, nluxVersion, peerDependenciesVersions) => {
    if (typeof peerDependencies !== 'object' || !peerDependencies) {
        return peerDependencies;
    }

    let peerDependenciesAsString = JSON.stringify(peerDependencies);
    peerDependenciesAsString = peerDependenciesAsString.replace('{versions.nlux}', nluxVersion);

    Object.keys(peerDependenciesVersions).forEach(peerDependency => {
        const peerDependencyCamelCase = peerDependency.replace(/-/g, ' ').replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');

        const peerDependencyVersion = peerDependenciesVersions[peerDependency];
        peerDependenciesAsString = peerDependenciesAsString.replace(
            `{versions.peerDependencies.${peerDependencyCamelCase}}`,
            peerDependencyVersion,
        );
    });

    const updatedPeerDependencies = JSON.parse(peerDependenciesAsString);
    Object.keys(updatedPeerDependencies).forEach(peerDependency => {
        if (peerDependency.startsWith('@nlux/')) {
            updatedPeerDependencies[peerDependency] = nluxVersion;
        }
    });

    return updatedPeerDependencies;
};

const replaceDependencyVersions = (dependencies, nluxVersion, dependenciesVersions) => {
    if (typeof dependencies !== 'object' || !dependencies || !dependenciesVersions || Object.keys(dependencies).length === 0) {
        return dependencies;
    }

    let dependenciesAsString = JSON.stringify(dependencies);

    Object.keys(dependenciesVersions).forEach(dependency => {
        const dependencyVersion = dependenciesVersions[dependency];
        dependenciesAsString = dependenciesAsString.replace(
            `{versions.dependencies.${dependency}}`,
            dependencyVersion,
        );
    });

    const updatedDependencies = JSON.parse(dependenciesAsString);
    Object.keys(updatedDependencies).forEach(peerDependency => {
        if (peerDependency.startsWith('@nlux/')) {
            updatedDependencies[peerDependency] = nluxVersion;
        }
    });

    return updatedDependencies;
};

export const applyDevVersion = (packagesPath) => {
    info('Applying dev version to packages: ' + packagesPath);
    const packageJsonTemplateFiles = readAllPackageTemplates(packagesPath);
    const nluxVersion = '0.0.0-latest';
    if (!versionsFileContent) {
        versionsFileContent = readVersionsFile();
    }

    const {
        peerDependencies: peerDependenciesVersions,
        dependencies: dependenciesVersions,
    } = versionsFileContent;

    packageJsonTemplateFiles.forEach(packageJsonTemplatePath => {
        info('Reading Dev Template: ' + packageJsonTemplatePath);
        const packageJson = JSON.parse(readFileSync(packageJsonTemplatePath, 'utf8'));
        packageJson.version = nluxVersion;

        packageJson.peerDependencies = replacePeerDependencyVersions(
            packageJson.peerDependencies,
            nluxVersion,
            peerDependenciesVersions
        ) ?? {};

        packageJson.dependencies = replaceDependencyVersions(
            packageJson.dependencies,
            nluxVersion,
            dependenciesVersions
        ) ?? {};

        console.log('packageJson', packageJson);

        const newPackageJsonPath = packageJsonTemplatePath.replace('package.template.json', 'package.json');
        writeFileSync(newPackageJsonPath, JSON.stringify(packageJson, null, 2));
        info(`New package.json created: ${newPackageJsonPath}`);
    });
};

export const applyReleaseVersion = (packagesPath) => {
    const packageJsonFiles = readAllPackageTemplates(packagesPath);
    rawLog(packageJsonFiles);

    if (!versionsFileContent) {
        versionsFileContent = readVersionsFile();
    }

    info('Applying release version to packages: ' + packagesPath);
    info(versionsFileContent);

    const {
        nlux: nluxVersion,
        peerDependencies: peerDependenciesVersions,
        dependencies: dependenciesVersions,
    } = versionsFileContent;

    packageJsonFiles.forEach(packageJsonPath => {
        let packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        packageJson.version = nluxVersion;

        packageJson.peerDependencies = replacePeerDependencyVersions(
            packageJson.peerDependencies,
            nluxVersion,
            peerDependenciesVersions
        ) ?? {};

        packageJson.dependencies = replaceDependencyVersions(
            packageJson.dependencies,
            nluxVersion,
            dependenciesVersions
        ) ?? {};

        const packageTemplateJson = JSON.parse(readFileSync('pipeline/npm/package-template.json', 'utf8'));
        packageTemplateJson.version = nluxVersion;

        if (packageJson.repository && packageTemplateJson.repository && !packageTemplateJson.repository.directory) {
            packageJson.repository = {
                ...packageTemplateJson.repository,
                ...packageJson.repository
            };
        }

        packageJson = {
            ...packageTemplateJson,
            ...packageJson
        };

        info('File to be created: ' + packageJsonPath.replace('package.template.json', 'package.json'));

        const newPackageJsonPath = packageJsonPath.replace('package.template.json', 'package.json');

        writeFileSync(newPackageJsonPath, JSON.stringify(packageJson, null, 2));
        unlinkSync(packageJsonPath);
    });
};
