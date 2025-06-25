import oxlint from 'eslint-plugin-oxlint'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  ...oxlint.buildFromOxlintConfig({
    plugins: ['typescript', 'node', 'import', 'unicorn'],
  }),
  prettierRecommended,
  {
    files: ['src/**/*.ts'],
    rules: {
      'prettier/prettier': 'error',
    },
  },
  {
    ignores: ['node_modules', 'dist', '.history'],
  },
]
