import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import strip from '@rollup/plugin-strip';
import terser from '@rollup/plugin-terser';
import alias from '@rollup/plugin-alias';
import {RollupOptions} from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import {generateDts} from '../../../pipeline/utils/rollup/generateDts';
import {generateOutputConfig} from '../../../pipeline/utils/rollup/generateOutputConfig';
import {resolve} from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const packageName = '@nlux/react';
const outputFile = 'nlux-react';

const absolutePath = (path: string) => resolve('..', '..', '..', path);
const packageConfig: () => Promise<RollupOptions[]> = async () => ([
    {
        input: './src/index.tsx',
        logLevel: 'silent',
        treeshake: 'smallest',
        strictDeprecations: true,
        plugins: [
            alias({
                entries: [
                    {find: /^@shared\/(.*)/, replacement: `${absolutePath('packages/shared/src')}/$1.ts`},
                ],
            }),
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
            'react-dom',
        ],
        output: generateOutputConfig(packageName, outputFile, isProduction),
    },
    generateDts(outputFile, isProduction, './src/index.tsx'),
]);

export default packageConfig;
