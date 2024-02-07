import {svelte} from '@sveltejs/vite-plugin-svelte';
import {defineConfig} from 'vitest/config';

export default defineConfig(({mode}) => ({
    plugins: [svelte()],
    resolve: {
        conditions: mode === 'test' ? ['browser'] : [],
    },
    build: {
        minify: mode === 'test' ? 'esbuild' : 'terser',
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./vitest-setup.mjs'],
    },
}))

