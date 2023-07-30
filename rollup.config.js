const ts = require("rollup-plugin-ts");
const nodeResolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const iife = require("rollup-plugin-iife");
const path = require("path");
const { getAllFilesSync } = require('get-all-files')

const scripts_dir = "./src_frontend/scripts/";

const files = getAllFilesSync(scripts_dir, {resolve: true}).toArray().map(file => {
  const relativePath = path.relative(path.join(__dirname, scripts_dir) , file)
  return { [relativePath.split(".")[0].replace("\\", ".")] : path.join(scripts_dir,relativePath)};
}).reduce((acc, val) => ({...acc, ...val}), {});

module.exports = {
  input: files,
  plugins: [
    ts(),
    iife(),
    commonjs(),
    nodeResolve({ jsnext: true,
    main: true,
    browser: true, }),
  ],

  output: {
    dir: 'public/scripts/',
    format: "es",
    entryFileNames: '[name].js',
    chunkFileNames: '[name].js',
    compact : true,
    manualChunks: (id) => {
      if (id.includes('node_modules')) {
        return 'vendor';
      }
    }
  },
}