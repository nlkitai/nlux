import {resolve} from 'path';

export const getSharedViteConfig = (
    pathToRoot: string,
    requireTrustedScript: boolean = false,
    plugins: Array<any> = [],
) => {
    const getAbsolutePath = (path: string) => resolve(pathToRoot, path);

    return {
        plugins,
        define: {
            process: {
                env: {
                    NLUX_DEBUG_ENABLED: 'true',
                },
            },
        },
        server: {
            // Add header
            headers: requireTrustedScript ? {
                'Content-Security-Policy': 'require-trusted-types-for \'script\';',
            } : {},
        },
        resolve: {
            alias: {
                '@shared': getAbsolutePath('packages/shared/src'),
            },
        },
    };
};
