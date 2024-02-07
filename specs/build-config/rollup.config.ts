import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import strip from '@rollup/plugin-strip';
import {glob} from 'glob';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {join} from 'path';
import {PreRenderedChunk, RollupOptions} from 'rollup';
import copy from 'rollup-plugin-copy';
import esbuild from 'rollup-plugin-esbuild';

const isProduction = process.env.NODE_ENV === 'production';

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
        treeshake: 'safest',
        external: externals,
        input: Object.fromEntries(
            glob.sync('**/*.spec.{ts,tsx}').map(file => [
                // This remove `src/` as well as the file extension from each
                // file, so e.g. src/nested/foo.js becomes nested/foo
                path.relative(
                    'src',
                    file.slice(0, file.length - path.extname(file).length),
                ),
                // This expands the relative paths to absolute paths, so e.g.
                // src/nested/foo becomes /project/src/nested/foo.js
                // @ts-ignore
                fileURLToPath(new URL(join('..', '..', 'specs', file), import.meta.url)),
            ]),
        ),
        output: {
            format: 'es',
            dir: '../dist/specs',
            entryFileNames: (chunkInfo: PreRenderedChunk) => {
                // Extract file name from the file URL present in chunkInfo.name
                const fileName = chunkInfo
                    // @ts-ignore
                    .name.replace(import.meta.url, '')
                    .replace('..', '');

                // Remove leading `/` from fileName
                return fileName.replace(/^\//, '') + '.js';
            },
        },
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
            copy({
                targets: [
                    {src: './build-config/jest.config.js', dest: '../dist/specs/'},
                    {src: './jest.setup.js', dest: '../dist/specs/'},
                ],
            }),
        ],
    };
};

const packageConfig = getPackageConfig();

export default packageConfig;
