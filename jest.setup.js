module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    testMatch: ['**/tests/**/*.test.ts'],
    transformIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
    collectCoverageFrom: ['./src/**/*.ts'],
    coveragePathIgnorePatterns: ['node_modules'],
    coverageThreshold: {
      global: {
        lines: 80,
      },
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    moduleNameMapper: {
      '^obsidian$': '<rootDir>/tests/__mocks__/obsidian.ts',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  };
  