import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';

export default defineConfig(() => ({
    plugins: [
        react(),
    ],
    resolve: {
        conditions: ['browser'],
    },
    build: {
        minify: false,
        mode: 'development',
        sourcemap: true,
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./vitest-setup.mjs'],
    },
}))

