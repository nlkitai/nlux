import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
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
        }
    }
});
