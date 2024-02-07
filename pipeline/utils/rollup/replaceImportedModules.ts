import replace from '@rollup/plugin-replace';

export const nluxImportMap = {
    '@nlux/core': '/packages/@nlux/core/{nluxBundlerPackageType}/nlux-core.js',
    '@nlux/react': '/packages/@nlux/react/{nluxBundlerPackageType}/nlux-react.js',
    '@nlux/langchain': '/packages/@nlux/langchain/{nluxBundlerPackageType}/langchain.js',
    '@nlux/langchain-react': '/packages/@nlux/langchain-react/{nluxBundlerPackageType}/langchain-react.js',
    '@nlux/openai': '/packages/@nlux/openai/{nluxBundlerPackageType}/openai.js',
    '@nlux/openai-react': '/packages/@nlux/openai-react/{nluxBundlerPackageType}/openai-react.js',
    '@nlux/hf': '/packages/@nlux/hf/{nluxBundlerPackageType}/hf.js',
    '@nlux/hf-react': '/packages/@nlux/hf-react/{nluxBundlerPackageType}/hf-react.js',
    '@nlux/highlighter': '/packages/@nlux/highlighter/{nluxBundlerPackageType}/highlighter.js',
};

export const reactImportsByPackageType = (nluxBundlerPackageType: 'esm' | 'cjs' | 'umd') => ({
    'react': `/packages/react/${nluxBundlerPackageType === 'cjs' ? 'cjs' : 'umd'}/react.development.js`,
    'react-dom': `/packages/react-dom/${nluxBundlerPackageType === 'cjs' ? 'cjs' : 'umd'}/react-dom.development.js`,
    'react-dom/client': `/packages/react-dom/client.js`, // CJS only
    'langchain': `/packages/langchain/index.${nluxBundlerPackageType === 'esm' ? 'mjs' : 'js'}`,
    'openai': `/packages/openai/index.${nluxBundlerPackageType === 'esm' ? 'mjs' : 'js'}`,
    'hf': `/packages/hf/index.${nluxBundlerPackageType === 'esm' ? 'mjs' : 'js'}`,
});

const packageTypeFromEnv = process?.env?.NLUX_BUNDLER_PACKAGE_TYPE?.toLowerCase() as any;
const defaultPackageType: 'cjs' | 'esm' | 'umd' = ['cjs', 'esm', 'umd'].includes(packageTypeFromEnv)
    ? packageTypeFromEnv
    : 'esm';

export const replaceImportedModules = (nluxBundlerPackageType: 'cjs' | 'esm' | 'umd' = defaultPackageType) => {
    const updatedReactImports = reactImportsByPackageType(nluxBundlerPackageType);
    const allImports: {[key: string]: string} = {
        ...updatedReactImports,
        ...nluxImportMap,
    };

    const keys = Object.keys(allImports);
    const values = Object.values(allImports);

    return [];

    return [
        replace({
            delimiters: ['', ''],
            preventAssignment: false,
            values: keys.reduce((acc: any, key, index) => {
                const value = values[index].replace('{nluxBundlerPackageType}', nluxBundlerPackageType);
                acc[`from '${key}'`] = `from '${value}'`;
                return acc;
            }, {}),
        }),
    ];
};
