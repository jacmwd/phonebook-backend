import globals from "globals";
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'
import pluginReact from 'eslint-plugin-react';


export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node, },
      ...pluginReact.configs.flat.recommended.languageOptions,
      ecmaVersion: "latest",
    },
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/indent': [
        'error',
        2
      ],
      '@stylistic/js/linebreak-style': [
        'error',
        'unix'
      ],
      '@stylistic/js/quotes': [
        'error',
        'single'
      ],
      '@stylistic/js/semi': [
        'error',
        'never'
      ],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true }
      ],
      'no-console': 'off',
    },
  },
  {
    ignores: ["dist/**", "build/**"],
  },
]