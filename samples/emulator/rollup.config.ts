import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import {join} from 'path';
import {RollupOptions} from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import {replaceImportedModules} from '../../pipeline/utils/rollup/replaceImportedModules';

const distPath = join('..', '..', 'dist');
const nodeModulesPath = join('..', '..', 'node_modules');
const outputFolder = join(distPath, 'dev', 'emulator');
const isProduction = process.env.NODE_ENV === 'production';

const externals = [
    '@nlux/nlux',
    '@nlux/openai',
    '@nlux/nlux-react',
    '@nlux/openai-react',
    'react',
    'react-dom',
];

const packageConfig: () => Promise<RollupOptions[]> = async () => ([
    {
        input: './src/examples/index.ts',
        logLevel: 'silent',
        treeshake: 'safest',
        strictDeprecations: true,
        plugins: [
            esbuild(),
            nodeResolve({
                modulePaths: [
                    distPath,
                ],
            }),
            !isProduction && replaceImportedModules(),
            replace({
                delimiters: ['', ''],
                preventAssignment: false,
                values: {
                    'process.env.NODE_ENV': JSON.stringify('development'),
                },
            }),
        ],
        external: externals,
        output: [
            {
                file: `${outputFolder}/examples/index.mjs`,
                format: 'esm',
                sourcemap: true,
                strict: true,
            },
        ],
    },
    {
        input: './src/examples-react/index.tsx',
        logLevel: 'silent',
        strictDeprecations: true,
        plugins: [
            esbuild({
                jsx: 'transform',
                jsxFactory: 'React.createElement',
                jsxFragment: 'React.Fragment',
            }),
            nodeResolve({
                modulePaths: [
                    distPath,
                    nodeModulesPath,
                ],
                browser: true,
            }),
            commonjs(),
            replace({
                delimiters: ['', ''],
                preventAssignment: false,
                values: {
                    'process.env.NODE_ENV': JSON.stringify('development'),
                },
            }),
        ],
        external: externals,
        output: [
            {
                file: `${outputFolder}/examples-react/index.js`,
                format: 'umd',
                sourcemap: true,
                strict: true,
                esModule: false,
                name: 'nluxEmulatorReactExample',
            },
        ],
    },
]);

export default packageConfig;
