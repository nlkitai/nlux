import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import strip from '@rollup/plugin-strip';
import {join} from 'path';
import {RollupOptions} from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import {terser} from 'rollup-plugin-terser';
// @ts-ignore
import {outputFolder} from '../../../pipeline/utils/paths.mjs';
import {generateDts} from '../../../pipeline/utils/rollup/generateDts';
import {generateOutputConfig} from '../../../pipeline/utils/rollup/generateOutputConfig';
import {readJsonFile} from '../../../pipeline/utils/rollup/readJsonFile';
import {replaceImportedModules} from '../../../pipeline/utils/rollup/replaceImportedModules';

const isProduction = process.env.NODE_ENV === 'production';
const packageName = '@nlux/nlux-react';
const outputFile = 'nlux-react';
const packageOutputFolder = outputFolder(outputFile);
const packageJsonData = readJsonFile(join(packageOutputFolder, 'package.json'));

const packageConfig: () => Promise<RollupOptions[]> = async () => ([
    {
        input: './src/index.tsx',
        logLevel: 'silent',
        treeshake: 'smallest',
        strictDeprecations: true,
        plugins: [
            commonjs(),
            esbuild({
                jsx: 'transform',
                jsxFactory: 'React.createElement',
                jsxFragment: 'React.Fragment',
            }),
            isProduction && strip({
                include: '**/*.(mjs|js|ts)',
                functions: ['debug', 'console.log', 'console.info'],
            }),
            !isProduction && replaceImportedModules(),
            replace({
                delimiters: ['', ''],
                preventAssignment: false,
                values: {
                    'process.env.NLUX_DEBUG_ENABLED': JSON.stringify(isProduction ? 'false' : 'true'),
                    'process.env.NODE_ENV': isProduction ? JSON.stringify('production') : JSON.stringify('development'),
                },
            }),
            isProduction && terser(),
            generatePackageJson({
                outputFolder: packageOutputFolder,
                baseContents: {
                    ...packageJsonData,
                    main: `index.js`,
                    types: `${outputFile}.d.ts`,
                    module: `esm/${outputFile}.js`,
                    browser: `umd/${outputFile}.js`,
                },
            }),
        ],
        external: [
            '@nlux/nlux',
            '@nlux/openai',
            'react',
            'react-dom',
        ],
        output: generateOutputConfig(packageName, outputFile, packageOutputFolder, isProduction),
    },
    generateDts(packageOutputFolder, outputFile, './src/index.tsx'),
]);

export default packageConfig;
