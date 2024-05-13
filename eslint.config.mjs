// @ts-check

import tsEslint from 'typescript-eslint';

export default tsEslint.config(
    {
        files: [
            'packages/**/*.ts',
            'packages/**/*.tsx'
        ],
        extends: [
            ...tsEslint.configs.recommended,
        ],
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    'args': 'none',
                    'caughtErrors': 'all',
                    'caughtErrorsIgnorePattern': '^_',
                    'destructuredArrayIgnorePattern': '^_',
                    'varsIgnorePattern': '^_',
                    'ignoreRestSiblings': true
                }
            ],
            'no-prototype-builtins': 'off',
        },
        ignores: [
            'dist',
            'packages/shared/src/markdown/snapshot/marked/*.ts',
            'packages/shared/src/utils/dequal/*.ts',
        ],
    }
);
