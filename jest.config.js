/**
 * Jest configuration.
 */

module.exports = {
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  modulePaths: ['<rootDir>/src/'],
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/config/', '/node_modules/'],
};
