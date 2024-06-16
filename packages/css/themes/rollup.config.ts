import csso from 'postcss-csso';
import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import {LogLevel, RollupOptions} from 'rollup';
import postcss from 'rollup-plugin-postcss';

const isProduction = process.env.NODE_ENV === 'production';
const folder = isProduction ? 'prod' : 'dev';

const cssEntry = (input: string, output: string) => ({
    input,
    logLevel: 'warn' as LogLevel,
    plugins: [
        postcss({
            extract: true,
            sourceMap: !isProduction,
            plugins: [
                postcssImport({
                    plugins: [
                        postcssNested(),
                        csso({comments: false, restructure: false}),
                    ],
                }),
            ],
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

const entries = [
    cssEntry('./src/nova/main.css', `../../../dist/${folder}/themes/nova.css`),
    cssEntry('./src/luna/main.css', `../../../dist/${folder}/themes/luna.css`),
    cssEntry('./src/unstyled/main.css', `../../../dist/${folder}/themes/unstyled.css`),
];

if (!isProduction) {
    entries.push(
        cssEntry('./src/dev/main.css', `../../../dist/${folder}/themes/dev.css`),
    );
}

const packageConfig: () => Promise<RollupOptions[]> = async () => (entries);

export default packageConfig;
