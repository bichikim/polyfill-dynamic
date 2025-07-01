import oxlint from 'eslint-plugin-oxlint'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  prettierRecommended,
  ...oxlint.buildFromOxlintConfig({
    plugins: ['typescript', 'node', 'import', 'unicorn'],
  }),
  {
    ignores: ['node_modules', 'dist', '.history'],
  },
]
