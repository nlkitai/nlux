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

const isProduction = process.env.NODE_ENV === 'production';
const packageName = '@nlux/nlux';
const outputFile = 'nlux';
const packageOutputFolder = outputFolder(outputFile);
const packageJsonData = readJsonFile(join(packageOutputFolder, 'package.json'));

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
            replace({
                values: {
                    'process.env.NLUX_DEBUG_ENABLED': JSON.stringify(isProduction ? 'false' : 'true'),
                },
                preventAssignment: true,
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
                    dependencies: {},
                    peerDependencies: {},
                },
            }),
        ],
        output: generateOutputConfig(packageName, outputFile, packageOutputFolder, isProduction),
    },
    generateDts(packageOutputFolder, outputFile),
]);

export default packageConfig;
