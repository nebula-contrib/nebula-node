module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: 'semistandard',
  parserOptions: {
    sourceType: 'module'
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    quotes: [1, 'single'],
    semi: [1, 'never'],
    'no-console': 1,
    'space-before-function-paren': 0,
    'no-multiple-empty-lines': ['off']
  },
  globals: {
    describe: true,
    it: true,
    after: true,
    before: true,
    afterEach: true,
    beforeEach: true,
    $: true,
    Viz: true,
    'Viz.render': true,
    'Viz.Module': true,
    nebula: true,
    Thrift: true
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended'
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module'
      },
      plugins: [
        'eslint-plugin-jsdoc',
        'eslint-plugin-prefer-arrow',
        '@typescript-eslint'
      ],
      rules: {
        '@typescript-eslint/adjacent-overload-signatures': 'warn',
        '@typescript-eslint/array-type': [
          'warn',
          {
            default: 'array'
          }
        ],
        '@typescript-eslint/ban-types': [
          'warn',
          {
            types: {
              Object: {
                message: 'Avoid using the `Object` type. Did you mean `object`?'
              },
              Function: {
                message: 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.'
              },
              Boolean: {
                message: 'Avoid using the `Boolean` type. Did you mean `boolean`?'
              },
              Number: {
                message: 'Avoid using the `Number` type. Did you mean `number`?'
              },
              String: {
                message: 'Avoid using the `String` type. Did you mean `string`?'
              },
              Symbol: {
                message: 'Avoid using the `Symbol` type. Did you mean `symbol`?'
              }
            }
          }
        ],
        '@typescript-eslint/consistent-type-assertions': 'warn',
        '@typescript-eslint/dot-notation': 'warn',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'warn',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-misused-new': 'warn',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-unused-expressions': 'warn',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'warn',
        '@typescript-eslint/prefer-for-of': 'warn',
        '@typescript-eslint/prefer-function-type': 'warn',
        '@typescript-eslint/prefer-namespace-keyword': 'warn',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/quotes': [
          'warn',
          'single'
        ],
        '@typescript-eslint/triple-slash-reference': [
          'warn',
          {
            path: 'always',
            types: 'prefer-import',
            lib: 'always'
          }
        ],
        '@typescript-eslint/unified-signatures': 'warn',
        '@typescript-eslint/no-shadow': [
          'warn',
          {
            hoist: 'all'
          }
        ],
        complexity: 'off',
        'constructor-super': 'warn',
        eqeqeq: [
          'warn',
          'smart'
        ],
        'guard-for-in': 'warn',
        'id-blacklist': [
          'warn',
          'any',
          'Number',
          'number',
          'String',
          'string',
          'Boolean',
          'boolean',
          'Undefined',
          'undefined'
        ],
        'id-match': 'warn',
        'jsdoc/check-alignment': 'warn',
        'jsdoc/check-indentation': 'warn',
        'jsdoc/newline-after-description': 'warn',
        'max-classes-per-file': [
          'warn',
          1
        ],
        'max-len': [
          'warn',
          {
            code: 240
          }
        ],
        'new-parens': 'warn',
        'no-bitwise': 'warn',
        'no-caller': 'warn',
        'no-cond-assign': 'warn',
        'no-console': 'warn',
        'no-debugger': 'warn',
        'no-empty': 'off',
        'no-eval': 'warn',
        'no-fallthrough': 'off',
        'no-invalid-this': 'off',
        'no-new-wrappers': 'warn',
        'no-shadow': 'off',
        'no-throw-literal': 'warn',
        'no-trailing-spaces': 'warn',
        'no-undef-init': 'warn',
        'no-underscore-dangle': 'off',
        'no-unsafe-finally': 'warn',
        'no-unused-labels': 'warn',
        'no-var': 'warn',
        'object-shorthand': 'warn',
        'one-var': [
          'warn',
          'never'
        ],
        'prefer-arrow/prefer-arrow-functions': 'warn',
        'prefer-const': 'warn',
        radix: 'warn',
        'spaced-comment': [
          'warn',
          'always',
          {
            markers: [
              '/'
            ]
          }
        ],
        'use-isnan': 'warn',
        'valid-typeof': 'off'
      }
    }
  ]
}
