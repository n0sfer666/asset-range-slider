module.exports = {
  'roots': [
    '<rootDir>/src'
  ],
  'testMatch': [
    '**/tests/**/*+(spec|test).+(ts|tsx|js)',
  ],
  'transform': {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  'collectCoverage': true,
  'collectCoverageFrom': [
    '**/plugin/*.{ts,js}',
    '!**/node_modules/**'
  ],
  'coverageReporters': ['text-summary', 'text'],
}