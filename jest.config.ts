export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/dist/*'],
  moduleNameMapper: {
    '@server': '<rootDir>/server.ts',
  },
}
