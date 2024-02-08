import {OutputOptions} from 'rollup';

export const generateOutputConfig = (
    packageNpmName: string, // Example: @nlux/react
    packageFileName: string, // Example: nlux-react
    isProduction: boolean,
): OutputOptions[] => {
    const envFolder = isProduction ? 'prod' : 'dev';
    const path = `../../../dist/${envFolder}/${packageFileName}`;
    return [
        {
            file: `${path}/esm/${packageFileName}.js`,
            format: 'esm',
            esModule: false,
            sourcemap: !isProduction,
            strict: true,
            exports: 'named',
            name: packageNpmName,
        },
        {
            file: `${path}/cjs/${packageFileName}.js`,
            format: 'cjs',
            esModule: false,
            sourcemap: !isProduction,
            strict: true,
            exports: 'named',
            name: packageNpmName,
        },
        {
            file: `${path}/umd/${packageFileName}.js`,
            format: 'umd',
            esModule: false,
            sourcemap: !isProduction,
            strict: true,
            exports: 'named',
            name: packageNpmName,
        },
    ];
};
