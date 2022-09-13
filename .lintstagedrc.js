/**
 * Lint-staged configuration.
 */

module.exports = {
  '**/*.{js,ts,tsx}': 'eslint',
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
  'package.json': 'sort-package-json',
  'src/**/*!(.test).ts?(x)': 'stylelint',
  'src/**/*.ts?(x)': 'jest --findRelatedTests --passWithNoTests',
  'yarn.lock': () => ['yarn-deduplicate', 'yarn'],
};
