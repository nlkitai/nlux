import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import {join} from 'path';
import {cwd} from 'process';
import {RollupOptions} from 'rollup';
import esbuild from 'rollup-plugin-esbuild';

const distPath = join(cwd(), '..', '..', 'dist');
const outputFolder = join(distPath, 'dev', 'emulator');
const nodeModulesPath = join(outputFolder, 'packages');

const externals = [
    '@nlux/nlux',
    '@nlux/openai',
    '@nlux/hf',
    '@nlux/nlux-react',
    '@nlux/openai-react',
    '@nlux/hf-react',
    '@nlux/highlighter',
    'highlight.js',
    'openai',
    'react',
    'react-dom',
];

const isProduction = process.env.NODE_ENV === 'production';

const packageConfig: () => Promise<RollupOptions[]> = async () => ([
    //
    // Pure JS in ESM format
    //
    {
        input: './src/examples/index.ts',
        logLevel: 'silent',
        external: externals,
        plugins: [
            esbuild(),
            nodeResolve({
                modulePaths: [
                    join(distPath, 'dev'),
                    join(cwd(), '..', '..', 'node_modules'),
                ],
                browser: true,
            }),
            replace({
                delimiters: ['', ''],
                preventAssignment: false,
                values: {
                    'process.env.NODE_ENV': JSON.stringify('development'),
                    'from \'@nlux/nlux\'': `from '/packages/@nlux/nlux/esm/nlux.js'`,
                    'from \'@nlux/openai\'': `from '/packages/@nlux/openai/esm/openai.js'`,
                    'from \'@nlux/hf\'': `from '/packages/@nlux/hf/esm/hf.js'`,
                    'from \'@nlux/highlighter\'': `from '/packages/@nlux/highlighter/esm/highlighter.js'`,
                    'from \'openai\'': `from '/packages/openai/index.mjs'`,
                },
            }),
        ],
        output: [
            {
                file: `${outputFolder}/examples/index.mjs`,
                format: 'esm',
                sourcemap: true,
                strict: true,
            },
        ],
    },
    //
    // React JS in UMD format
    //
    {
        input: './src/examples-react/index.tsx',
        plugins: [
            esbuild({
                jsx: 'transform',
                jsxFactory: 'React.createElement',
                jsxFragment: 'React.Fragment',
            }),
            nodeResolve({
                modulePaths: [
                    nodeModulesPath,
                ],
                rootDir: '/packages',
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
    //
    // React JS + HF in UMD format
    //
    {
        input: './src/examples-react-hf/index.tsx',
        plugins: [
            esbuild({
                jsx: 'transform',
                jsxFactory: 'React.createElement',
                jsxFragment: 'React.Fragment',
            }),
            nodeResolve({
                modulePaths: [
                    nodeModulesPath,
                ],
                rootDir: '/packages',
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
                file: `${outputFolder}/examples-react-hf/index.js`,
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
