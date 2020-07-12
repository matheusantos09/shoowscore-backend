module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'prettier'
  ],
  rules: {
    // todos os problemas que identificar notificar
    'prettier/prettier': 'error',
    // nao cobra 'this' para metodo próprios de classe
    'class-methods-use-this': 'off',
    // fazer alteracoes no parametro
    'no-param-reassign': 'off',
    // deixa de cobrar somente CamelCase
    'camelcase': 'off',

    // nao reclamar caso eu nao use o NEXT em um Middleware
    'no-unused-vars': ['error', {'argsIgnorePattern': 'next'}],
  },
};
