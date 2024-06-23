// @ts-check

import tsEslint from 'typescript-eslint';

export default tsEslint.config(
    {
        files: [
            'packages/**/*.ts',
            'packages/**/*.tsx',
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
                    'ignoreRestSiblings': true,
                },
            ],
            'no-prototype-builtins': 'off',
        },
        ignores: [
            'dist/**',
            'specs/**',
            'samples/**',
            'packages/js/core/src/aiChat/comp/comp.ts',
            'packages/react/core/src/exports/hooks/usePrimitivesContext.tsx',
            'packages/react/core/src/exports/hooks/useAiChatApi.ts',
            'packages/shared/src/markdown/snapshot/marked/*.ts',
            'packages/shared/src/types/adapters/chat/serverComponentChatAdapter.ts',
            'packages/shared/src/utils/dequal.ts',
        ],
    },
);
