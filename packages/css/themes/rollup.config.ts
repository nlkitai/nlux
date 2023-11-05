import {join} from 'path';
// @ts-ignore
import csso from 'postcss-csso';
import postcssImport from 'postcss-import';
import {LogLevel, RollupOptions} from 'rollup';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import postcss from 'rollup-plugin-postcss';
// @ts-ignore
import {outputFolder} from '../../../pipeline/utils/paths.mjs';
import {readJsonFile} from '../../../pipeline/utils/rollup/readJsonFile';

const isProduction = process.env.NODE_ENV === 'production';
const themesOutputFolder = outputFolder('themes');
const packageJsonData = readJsonFile(join(themesOutputFolder, 'package.json'));

const cssEntry = (input: string, output: string) => ({
    input,
    logLevel: 'warn' as LogLevel,
    plugins: [
        postcss({
            extract: true,
            sourceMap: !isProduction,
            plugins: [
                postcssImport({
                    plugins: [csso({comments: false, restructure: false})],
                }),
            ],
        }),
        generatePackageJson({
            outputFolder: themesOutputFolder,
            baseContents: {
                main: 'kensington.css',
                ...packageJsonData,
                dependencies: {},
                peerDependencies: {},
            },
        }),
    ],
    output: [
        {
            file: output,
            sourcemap: !isProduction,
            strict: true,
        },
    ],
});

const packageConfig: () => Promise<RollupOptions[]> = async () => ([
    cssEntry('./src/kensington/theme.css', `${themesOutputFolder}/kensington.css`),
]);

export default packageConfig;
