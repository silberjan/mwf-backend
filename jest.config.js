module.exports = {
  verbose: false,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: ['**/?(*.)(spec).(ts|js)?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.{ts,js}', '!<rootDir>/node_modules/', '!src/__tests__/**/*', '!src/index.ts'],
  moduleDirectories: ['node_modules', '.'],
}
