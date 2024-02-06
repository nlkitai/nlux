import {OutputOptions} from 'rollup';

export const generateOutputConfig = (
    packageName: string, // Example: @nlux/react
    fileName: string, // Example: nlux-react
    isProduction: boolean,
): OutputOptions[] => {
    const folder = isProduction ? 'prod' : 'dev';
    const path = `../../../dist/${folder}/${fileName}`;
    return [
        {
            file: `${path}/esm/${fileName}.js`,
            format: 'esm',
            esModule: true,
            sourcemap: !isProduction,
            strict: true,
            exports: 'named',
            name: packageName,
        },
        {
            file: `${path}/cjs/${fileName}.js`,
            format: 'cjs',
            esModule: false,
            sourcemap: !isProduction,
            strict: true,
            exports: 'named',
            name: packageName,
        },
        {
            file: `${path}/umd/${fileName}.js`,
            format: 'umd',
            esModule: false,
            sourcemap: !isProduction,
            strict: true,
            exports: 'named',
            name: packageName,
        },
    ];
};
