module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/__tests__/**'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
};
