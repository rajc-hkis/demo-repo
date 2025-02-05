import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      'no-console': 'error',
      'no-undef': 'error',
      semi: 'error',
      'semi-spacing': 'error',
      eqeqeq: 'error',
      'no-return-assign': 'error',
      'no-unused-expressions': ['error', { allowTernary: true }],
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'no-constant-condition': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: 'req|res|next|__' }],
      indent: ['error', 2, { SwitchCase: 1 }],
      'space-before-blocks': 'error',
      'space-in-parens': 'error',
      'space-unary-ops': 'error',
      quotes: ['error', 'single'],
      'max-len': ['error', { code: 200 }],
      'keyword-spacing': 'error',
      'multiline-ternary': ['error', 'never'],
      'no-mixed-operators': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      'no-whitespace-before-property': 'error',
      'nonblock-statement-body-position': 'error',
      'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
      'arrow-spacing': 'error',
      'no-confusing-arrow': 'error',
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-const': 'error',
      'prefer-template': 'warn',
      camelcase: 'error',
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
