import {OutputOptions} from 'rollup';

export const generateOutputConfig = (
    packageName: string, // Example: @nlux/react
    fileName: string, // Example: nlux-react
    outputFolder: string,
    isProduction: boolean,
): OutputOptions[] => {
    return [
        {
            file: `${outputFolder}/esm/${fileName}.js`,
            format: 'esm',
            esModule: true,
            sourcemap: !isProduction,
            strict: true,
            exports: 'named',
            name: packageName,
        },
        {
            file: `${outputFolder}/cjs/${fileName}.js`,
            format: 'cjs',
            esModule: false,
            sourcemap: !isProduction,
            strict: true,
            exports: 'named',
            name: packageName,
        },
        {
            file: `${outputFolder}/umd/${fileName}.js`,
            format: 'umd',
            esModule: false,
            sourcemap: !isProduction,
            strict: true,
            exports: 'named',
            name: packageName,
        },
    ];
};
