import js from '@eslint/js';
import ts from 'typescript-eslint';

export default [
    js.configs.recommended,
    ...ts.configs.recommended,
    {
        ignores: ['dist/**', 'node_modules/**', 'skills/**/templates/**'],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: ts.parser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },
    {
        files: ['**/*.test.ts'],
        rules: {
            '@typescript-eslint/no-unused-expressions': 'off',
        },
    },
];
