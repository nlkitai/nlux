import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        process: {
            env: {
                NLUX_DEBUG_ENABLED: 'true',
            },
        },
    },
});
