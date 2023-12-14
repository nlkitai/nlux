import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import strip from '@rollup/plugin-strip';
import terser from '@rollup/plugin-terser';
import {RollupOptions} from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
// @ts-ignore
import {outputFolder} from '../../../pipeline/utils/paths.mjs';
import {generateDts} from '../../../pipeline/utils/rollup/generateDts';
import {generateOutputConfig} from '../../../pipeline/utils/rollup/generateOutputConfig';
import {replaceImportedModules} from '../../../pipeline/utils/rollup/replaceImportedModules';

const isProduction = process.env.NODE_ENV === 'production';
const packageName = '@nlux/react';
const outputFile = 'nlux-react';
const packageOutputFolder = outputFolder(outputFile);

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
        ],
        external: [
            'react',
        ],
        output: generateOutputConfig(packageName, outputFile, packageOutputFolder, isProduction),
    },
    generateDts(packageOutputFolder, outputFile, './src/index.tsx'),
]);

export default packageConfig;
