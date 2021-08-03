import { defineConfig } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve, {
  DEFAULTS as RESOLVE_DEFAULTS
} from '@rollup/plugin-node-resolve'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import { REPO_NAME, OUTPUT_DIR } from './config.js'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

/**
 * @type {import('rollup').OutputOptions}
 */
const outputCommon = {
  // Do not let Rollup call Object.freeze() on namespace import objects
  // (i.e. import * as namespaceImportObject from...) that are accessed dynamically.
  freeze: false,
  // Respect tsconfig esModuleInterop when setting __esModule.
  name: REPO_NAME,
  sourcemap: true,
  globals: { react: 'React', 'react-native': 'ReactNative' },
  exports: 'named'
}

/**
 * @type {import('rollup').OutputOptions[]}
 */
const output = [{
  ...outputCommon,
  file: `${OUTPUT_DIR}/${REPO_NAME}.cjs.development.js`,
  format: 'cjs'
}, {
  ...outputCommon,
  file: `${OUTPUT_DIR}/${REPO_NAME}.cjs.production.min.js`,
  format: 'cjs',
  plugins: [terser()]
}, {
  ...outputCommon,
  file: `${OUTPUT_DIR}/${REPO_NAME}.esm.js`,
  format: 'esm'
}]

export default defineConfig({
  // Tell Rollup the entry point to the package
  input: 'src/index.ts',
  // Establish Rollup output
  output,
  plugins: [
    peerDepsExternal(),
    resolve({
      mainFields: [
        'module',
        'main',
        'browser'
      ],
      extensions: [...RESOLVE_DEFAULTS.extensions, '.jsx']
    }),
    // all bundled external modules need to be converted from CJS to ESM
    commonjs({
      // use a regex to make sure to include eventual hoisted packages
      include: /\/node_modules\//
    }),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      tsconfigDefaults: {
        exclude: [
          // all TS test files, regardless whether co-located or in test/ etc
          '**/*.spec.ts',
          '**/*.test.ts',
          '**/*.spec.tsx',
          '**/*.test.tsx',
          '**/*.stories.tsx',
          // TS defaults below
          'node_modules',
          'bower_components',
          'jspm_packages',
          'example'
        ],
        compilerOptions: {
          sourceMap: true,
          declaration: true,
          declarationMap: true,
          jsx: 'react'
        }
      },
      check: true
    }),
    sourceMaps()
  ]
})
