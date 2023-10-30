// @ts-nocheck
import {join} from 'path';
import postcssImport from 'postcss-import';
import {RollupOptions} from 'rollup';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import postcss from 'rollup-plugin-postcss';
import {readJsonFile} from '../../../pipeline/utils/rollup/readJsonFile';

const isProduction = process.env.NODE_ENV === 'production';
const distPath = join('..', '..', '..', 'dist');
const devDistFolder = join(distPath, 'dev', 'themes');
const prodDistFolder = join(distPath, 'prod', 'themes');

const outputFolder = isProduction ? prodDistFolder : devDistFolder;
const packageJsonData = readJsonFile(join(outputFolder, 'package.json'));

const cssEntry = (input: string, output: string) => ({
    input,
    logLevel: 'silent',
    plugins: [
        postcss({
            extract: true,
            minimize: isProduction,
            sourceMap: !isProduction,
            plugins: [
                postcssImport(),
            ],
        }),
        generatePackageJson({
            outputFolder,
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
    cssEntry('./src/kensington/theme.css', `${outputFolder}/kensington.css`),
]);

export default packageConfig;
