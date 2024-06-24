import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import {join} from 'path';
import {cwd} from 'process';
import {RollupOptions} from 'rollup';
import esbuild from 'rollup-plugin-esbuild';

const distPath = join('..', '..', 'dist');
const outputFolder = join(distPath, 'dev', 'emulator');
const nodeModulesPath = join(outputFolder, 'packages');

const externals = [
    '@nlux/core',
    '@nlux/langchain',
    '@nlux/openai',
    '@nlux/hf',
    '@nlux/react',
    '@nlux/langchain-react',
    '@nlux/openai-react',
    '@nlux/hf-react',
    '@nlux/highlighter',
    'react',
    'react-dom',
];

const isProduction = process.env.NODE_ENV === 'production';

const packageConfig: () => Promise<RollupOptions[]> = async () => ([
    //
    // 01 - Pure JS in ESM format
    //
    {
        input: './src/01-vanilla-js-with-adapters/index.ts',
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
                    'from \'@nlux/core\'': `from '/packages/@nlux/core/esm/nlux-core.js'`,
                    'from \'@nlux/langchain\'': `from '/packages/@nlux/langchain/esm/langchain.js'`,
                    'from \'@nlux/openai\'': `from '/packages/@nlux/openai/esm/openai.js'`,
                    'from \'@nlux/hf\'': `from '/packages/@nlux/hf/esm/hf.js'`,
                    'from \'@nlux/highlighter\'': `from '/packages/@nlux/highlighter/esm/highlighter.js'`,
                },
            }),
        ],
        output: [
            {
                file: `${outputFolder}/01-vanilla-js-with-adapters/index.mjs`,
                format: 'esm',
                sourcemap: true,
                strict: true,
            },
        ],
    },
    //
    // 02 - Pure JS in ESM format with Event Listeners
    //
    {
        input: './src/02-vanilla-js-with-events/index.ts',
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
                    'from \'@nlux/core\'': `from '/packages/@nlux/core/esm/nlux-core.js'`,
                    'from \'@nlux/langchain\'': `from '/packages/@nlux/langchain/esm/langchain.js'`,
                    'from \'@nlux/openai\'': `from '/packages/@nlux/openai/esm/openai.js'`,
                    'from \'@nlux/hf\'': `from '/packages/@nlux/hf/esm/hf.js'`,
                    'from \'@nlux/highlighter\'': `from '/packages/@nlux/highlighter/esm/highlighter.js'`,
                },
            }),
        ],
        output: [
            {
                file: `${outputFolder}/02-vanilla-js-with-events/index.mjs`,
                format: 'esm',
                sourcemap: true,
                strict: true,
            },
        ],
    },
    //
    // 03 - React JS + nlbridge adapter in UMD format
    //
    {
        input: './src/03-react-js-with-nlbridge/index.tsx',
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
                file: `${outputFolder}/03-react-js-with-nlbridge/index.js`,
                format: 'umd',
                sourcemap: true,
                strict: true,
                esModule: false,
                name: 'nluxEmulatorReactExample',
            },
        ],
    },
    //
    // 04 - React JS + HF Chat Adapter in UMD format
    //
    {
        input: './src/04-react-js-with-hugging-face/index.tsx',
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
                file: `${outputFolder}/04-react-js-with-hugging-face/index.js`,
                format: 'umd',
                sourcemap: true,
                strict: true,
                esModule: false,
                name: 'nluxEmulatorReactExample',
            },
        ],
    },
    //
    // 05 - React JS + LangServe Chat Adapter in UMD format
    //
    {
        input: './src/05-react-js-with-langserve/index.tsx',
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
                file: `${outputFolder}/05-react-js-with-langserve/index.js`,
                format: 'umd',
                sourcemap: true,
                strict: true,
                esModule: false,
                name: 'nluxEmulatorReactExample',
            },
        ],
    },
    //
    // 06 - React JS in UMD format + Custom Adapters
    //
    {
        input: './src/06-react-js-with-adapters/index.tsx',
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
                file: `${outputFolder}/06-react-js-with-adapters/index.js`,
                format: 'umd',
                sourcemap: true,
                strict: true,
                esModule: false,
                name: 'nluxEmulatorReactExample',
            },
        ],
    },
    //
    // 07 - React JS + OpenAI in UMD format + Persona Demo
    //
    {
        input: './src/07-react-js-personas/index.tsx',
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
                file: `${outputFolder}/07-react-js-personas/index.js`,
                format: 'umd',
                sourcemap: true,
                strict: true,
                esModule: false,
                name: 'nluxEmulatorReactExample',
            },
        ],
    },
    //
    // 08 - React JS + OpenAI in UMD format + Event Listeners
    //
    {
        input: './src/08-react-js-events/index.tsx',
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
                file: `${outputFolder}/08-react-js-events/index.js`,
                format: 'umd',
                sourcemap: true,
                strict: true,
                esModule: false,
                name: 'nluxEmulatorReactExample',
            },
        ],
    },
    //
    // 09 - React JS + Conversation History
    //
    {
        input: './src/09-react-js-with-conv-history/index.tsx',
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
                file: `${outputFolder}/09-react-js-with-conv-history/index.js`,
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
