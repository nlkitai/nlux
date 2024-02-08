import {svelte} from '@sveltejs/vite-plugin-svelte';
import {defineConfig} from 'vitest/config';

export default defineConfig(() => ({
    plugins: [
        svelte(),
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

