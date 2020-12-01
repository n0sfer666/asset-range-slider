module.exports = {
  roots: [
    '<rootDir>/src',
  ],
  testMatch: [
    '**/tests/**/*+(spec|test).+(ts|tsx|js)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  // collectCoverage: true,
  // collectCoverageFrom: [
  //   '**/SimpleRangeSlider/**/*.ts',
  //   // '**/DemoPanel/*.ts',
  //   '!**/*.d.ts',
  //   '!**/node_modules/**',
  // ],
  // coverageReporters: ['text'],
  setupFiles: ['<rootDir>/jest.setup.js'],
};
