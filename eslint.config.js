// @ts-check
import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { logicalProperties } from './scripts/eslint-logical-properties.js';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'storybook-static/**',
      'playwright-report/**',
      'test-results/**',
      'src/api/generated/**',
      'public/**',
      'docs/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettier,
  {
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            'eslint.config.js',
            'scripts/*.js',
            'scripts/*.mjs',
            'scripts/*.test.mjs',
            '.storybook/*.ts',
            '.storybook/*.tsx',
          ],
          defaultProject: 'tsconfig.app.json',
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { 'react-hooks': reactHooks, resilisense: { rules: { 'logical-properties': logicalProperties } } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@aws-sdk/*', 'aws-sdk', 'aws-amplify'], message: 'No AWS (ADR-011).' },
            { group: ['antd', 'antd/*', '@mui/*', 'materialize-css'], message: 'Only shadcn/ui + Radix (02 §1).' },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'sessionStorage', message: 'Tokens live in memory only (CLAUDE.md "Auth").' },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: { 'resilisense/logical-properties': 'error' },
  },
  {
    files: ['scripts/**', 'e2e/**', '*.config.ts', 'eslint.config.js'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.test.mjs', 'src/test/**', 'e2e/**', '**/*.stories.tsx'],
    languageOptions: { globals: { ...globals.vitest } },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  { files: ['**/*.js', '**/*.mjs'], ...tseslint.configs.disableTypeChecked },
);
