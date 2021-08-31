const path = require('path');
console.log('dirname', __dirname);
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  globals: {
    'ts-jest': {
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>',
  },
  rootDir: __dirname,
  transform: {
    '^.+\\.ts?$': 'babel-jest',
  },
};
