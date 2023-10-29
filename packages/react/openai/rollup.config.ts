import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import strip from '@rollup/plugin-strip';
import {join} from 'path';
import {RollupOptions} from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import {terser} from 'rollup-plugin-terser';
import {generateDts} from '../../../pipeline/utils/rollup/generateDts';
import {generateOutputConfig} from '../../../pipeline/utils/rollup/generateOutputConfig';
import {readJsonFile} from '../../../pipeline/utils/rollup/readJsonFile';
import {replaceImportedModules} from '../../../pipeline/utils/rollup/replaceImportedModules';

const distPath = join('..', '..', '..', 'dist');
const prodDistFolder = join(distPath, 'prod', 'openai-react');
const devDistFolder = join(distPath, 'dev', 'openai-react');

const isProduction = process.env.NODE_ENV === 'production';

const packageName = '@nlux/openai-react';
const outputFile = 'openai-react';
const outputFolder = isProduction ? prodDistFolder : devDistFolder;
const packageJsonData = readJsonFile(join(outputFolder, 'package.json'));

const packageConfig: () => Promise<RollupOptions[]> = async () => ([
    {
        input: './src/index.ts',
        logLevel: 'silent',
        treeshake: 'smallest',
        strictDeprecations: true,
        plugins: [
            commonjs(),
            esbuild(),
            isProduction && strip({
                include: '**/*.(mjs|js|ts)',
                functions: ['debug', 'console.log', 'console.info'],
            }),
            !isProduction && nodeResolve(),
            !isProduction && replaceImportedModules(),
            isProduction && terser(),
            generatePackageJson({
                outputFolder,
                baseContents: {
                    ...packageJsonData,
                    main: `index.js`,
                    types: `${outputFile}.d.ts`,
                    module: `esm/${outputFile}.js`,
                    browser: `umd/${outputFile}.js`,
                },
                additionalDependencies: {
                    ...packageJsonData.dependencies,
                },
            }),
        ],
        external: [
            '@nlux/nlux',
            'react',
            'react-dom',
        ],
        output: generateOutputConfig(packageName, outputFile, outputFolder, isProduction),
    },
    generateDts(outputFolder, outputFile),
]);

export default packageConfig;
