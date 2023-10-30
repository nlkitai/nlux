import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import strip from '@rollup/plugin-strip';
import {join} from 'path';
import {LogLevelOption, RollupOptions} from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import {terser} from 'rollup-plugin-terser';
import {generateDts} from '../../../pipeline/utils/rollup/generateDts';
import {generateOutputConfig} from '../../../pipeline/utils/rollup/generateOutputConfig';
import {readJsonFile} from '../../../pipeline/utils/rollup/readJsonFile';

const distPath = join('..', '..', '..', 'dist');
const prodDistFolder = join(distPath, 'prod', 'nlux');
const devDistFolder = join(distPath, 'dev', 'nlux');

const isProduction = process.env.NODE_ENV === 'production';

const packageName = '@nlux/nlux';
const outputFile = 'nlux';
const outputFolder = isProduction ? prodDistFolder : devDistFolder;
const packageJsonData = readJsonFile(join(outputFolder, 'package.json'));

const packageConfig: () => Promise<RollupOptions[]> = async () => ([
    {
        input: './src/index.ts',
        logLevel: 'silent' as LogLevelOption,
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
                    'process.env.NLUX_DEBUG_ENABLED': isProduction ? 'false' : 'true',
                },
                preventAssignment: true,
            }),
            isProduction && terser(),
            generatePackageJson({
                outputFolder,
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
        output: generateOutputConfig(packageName, outputFile, outputFolder, isProduction),
    },
    generateDts(outputFolder, outputFile),
]);

export default packageConfig;
