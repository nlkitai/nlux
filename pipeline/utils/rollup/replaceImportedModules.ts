import replace from '@rollup/plugin-replace';

export const importMap = {
    '@nlux/nlux': '/packages/@nlux/nlux/esm/nlux.js',
    '@nlux/nlux-react': '/packages/@nlux/nlux-react/esm/nlux-react.js',
    '@nlux/openai': '/packages/@nlux/openai/esm/openai.js',
    '@nlux/openai-react': '/packages/@nlux/openai-react/esm/openai-react.js',
    'react': '/packages/react/index.js',
    'react-dom': '/packages/react-dom/index.js',
};

export const replaceImportedModules = () => {
    const keys = Object.keys(importMap);
    const values = Object.values(importMap);

    return replace({
        delimiters: ['', ''],
        preventAssignment: false,
        values: keys.reduce((acc: any, key, index) => {
            acc[`from '${key}'`] = `from '${values[index]}'`;
            return acc;
        }, {}),
    });
};
