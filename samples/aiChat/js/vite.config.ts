import {defineConfig} from 'vite';
import {resolve} from 'path';

const absolutePath = (path: string) => resolve('..', '..', '..', path);

export default defineConfig({
    define: {
        process: {
            env: {
                NLUX_DEBUG_ENABLED: 'true',
            },
        },
    },
    server: {
        // Add header
        headers: {
            'Content-Security-Policy': 'require-trusted-types-for \'script\';',
        },
    },
    resolve: {
        alias: {
            '@shared': absolutePath('packages/shared/src'),
        },
    },
});
