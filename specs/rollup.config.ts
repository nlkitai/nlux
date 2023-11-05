import {nodeResolve} from '@rollup/plugin-node-resolve';
import {join} from 'path';
import {cwd} from 'process';
import {RollupOptions} from 'rollup';
import esbuild from 'rollup-plugin-esbuild';

const distPath = join(cwd(), '..', '..', 'dist');

const externals = [
    '@nlux/nlux',
    '@nlux/openai',
    '@nlux/nlux-react',
    '@nlux/openai-react',
    'openai',
    'react',
    'react-dom',
    'jest',
];

const isProduction = process.env.NODE_ENV === 'production';

const getPackageConfig: () => RollupOptions = () => {
    return {
        logLevel: 'silent',
        external: externals,
        plugins: [
            esbuild(),
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
