'use strict';

const fs = require('fs');
const del = require('del');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const packageJson = require('../package.json');

let promise = Promise.resolve()

// Clean up the output directory
promise = promise.then(() => del(['dist/*']));

// Compile source code into a distributable format with Babel
['es', 'cjs', 'umd'].forEach((format) => {
  promise = promise.then(() => rollup.rollup({
    entry: 'src/molgenis-js-library-example.js',
    external: Object.keys(packageJson.dependencies),
    plugins: [babel(Object.assign(packageJson.babel, {
      babelrc: false,
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      presets: packageJson.babel.presets.map(x => (x === 'latest' ? ['latest', { es2015: { modules: false } }] : x)),
    }))],
  }).then(bundle => bundle.write({
    dest: `dist/${format === 'cjs' ? 'molgenis-js-library-example' : `molgenis-js-library-example.${format}`}.js`,
    format,
    sourceMap: true,
    moduleName: format === 'umd' ? packageJson.name : undefined,
  })));
});

// Copy package.json
promise = promise.then(() => {
  delete packageJson.private
  delete packageJson.devDependencies
  delete packageJson.scripts
  delete packageJson.eslintConfig
  delete packageJson.babel
  fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, null, '  '), 'utf-8')
});

promise.catch(err => console.error(err.stack)) // eslint-disable-line no-console
