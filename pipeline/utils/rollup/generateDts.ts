import {RollupOptions} from 'rollup';
import dts from 'rollup-plugin-dts';

export const generateDts = (outputFolder: string, outputFile: string, inputFile = './src/index.ts'): RollupOptions => {
    return {
        input: inputFile,
        logLevel: 'silent',
        plugins: [
            dts(),
        ],
        output: {
            file: `${outputFolder}/${outputFile}.d.ts`,
        },
    };
};
