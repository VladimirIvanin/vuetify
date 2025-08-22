module.exports = {
  globals: {
    __VUETIFY_VERSION__: true,
    __REQUIRED_VUE__: true,
  },
  env: {
    'vitest/globals': true,
  },
  plugins: [
    'eslint-plugin-local-rules',
  ],
  rules: {
    'no-console': 'error',
    'no-debugger': 'error',
    'vue/html-self-closing': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: 1,
      multiline: {
        max: 1,
        allowFirstLine: false,
      },
    }],
    'vue/component-definition-name-casing': ['error', 'kebab-case'],
    'local-rules/no-render-string-reference': 'error',
  },
  overrides: [
    {
      files: 'dev/Playground.vue',
      rules: {
        'max-len': 'off',
      },
    },
    {
      files: '**/*.spec.ts',
      rules: {
        'no-console': 'off',
        'vue/component-definition-name-casing': 'off',
      },
    },
  ],
}
