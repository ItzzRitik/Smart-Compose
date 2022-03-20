module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/vue3-essential', '@vue/standard'],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    indent: 'off',
	'vue/multi-word-component-names': 'off',
	'vue/no-v-model-argument': 'off',
    'no-tabs': 'off',
    'vue/script-indent': ['error', 'tab', { baseIndent: 1 }],
    'vue/html-indent': ['error', 'tab', { baseIndent: 1 }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
