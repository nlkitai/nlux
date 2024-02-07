import {nodeResolve} from '@rollup/plugin-node-resolve';
import {join} from 'path';
import {cwd} from 'process';
import {RollupOptions} from 'rollup';
import esbuild from 'rollup-plugin-esbuild';

const distPath = join(cwd(), '..', '..', 'dist');

const externals = [
    '@nlux/core',
    '@nlux/react',
    '@nlux/openai',
    '@nlux/openai-react',
    '@nlux/hf',
    '@nlux/hf-react',
    '@nlux/highlighter',
    '@nlux/markdown',
    'openai',
    'highlight.js',
    'react',
    'react-dom',
    'jest',
];

const getPackageConfig: () => RollupOptions = () => {
    return {
        logLevel: 'silent',
        external: externals,
        plugins: [
            esbuild({
                jsx: 'transform',
                jsxFactory: 'React.createElement',
                jsxFragment: 'React.Fragment',
            }),
            nodeResolve({
                modulePaths: [
                    join(distPath, 'dev', 'emulator', 'packages'),
                ],
                browser: true,
            }),
        ],
    };
};

const packageConfig = getPackageConfig();

export default packageConfig;