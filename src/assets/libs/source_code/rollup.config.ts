import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import sourcemaps from 'rollup-plugin-sourcemaps'
import dts from 'rollup-plugin-dts'
import pkg from './package.json'

export default [
  {
    input: 'src/main.ts',

    external: ['pie-mapboxgl-module'],

    plugins: [typescript(), terser(), sourcemaps()],

    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es', sourcemap: true },
    ],
  },

  {
    input: 'src/main.ts',
    output: [{ file: 'dist/pie-mapboxgl-module.d.ts', format: 'es' }],
    plugins: [dts()],
  },
]
