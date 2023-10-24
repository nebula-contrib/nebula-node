/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  roots: ["<rootDir>/src/", "<rootDir>/__tests__/"],
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ["**/*.ts", "!**/*.d.ts", "!**/node_modules/**"],
};
