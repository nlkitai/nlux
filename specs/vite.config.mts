/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import {resolve} from 'path';

const absolutePath = (path: string) => resolve('..', path);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.mts'],
    },
    resolve: {
        alias: {
            '@shared': absolutePath('packages/shared/src'),
        },
    },
});
