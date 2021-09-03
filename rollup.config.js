const path = require('path');
const outputPath = path.resolve(__dirname, 'dist');
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
/**
 * @type import('rollup').RollupOptions
 */
const config = {
  input: path.resolve(__dirname, 'index.ts'),
  output: {
    file: path.resolve(outputPath, 'index.js'),
    format: 'cjs',
  },
  plugins: [nodeResolve(), commonjs(), typescript()],
};

module.exports = config;
