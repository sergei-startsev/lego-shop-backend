/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '@libs/(.*)': '<rootDir>/src/libs/$1',
    '@mocks/(.*)': '<rootDir>/src/mocks/$1',
  }
};
