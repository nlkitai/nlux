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
const packageName = '@nlux/hf-react';
const outputFile = 'hf-react';
const packageOutputFolder = outputFolder(outputFile);

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
            !isProduction && replaceImportedModules(),
            replace({
                values: {
                    'process.env.NLUX_DEBUG_ENABLED': JSON.stringify(isProduction ? 'false' : 'true'),
                },
                preventAssignment: true,
            }),
            isProduction && terser(),
        ],
        external: [
            '@nlux/react',
            'react',
        ],
        output: generateOutputConfig(packageName, outputFile, packageOutputFolder, isProduction),
    },
    generateDts(packageOutputFolder, outputFile),
]);

export default packageConfig;
