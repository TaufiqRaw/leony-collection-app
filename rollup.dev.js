const rollup = require("rollup");
const { getAllFiles } = require('get-all-files')
const { promisify } = require('util');
const fs = require('fs');
const rm = promisify(fs.rm);
const path = require("path");

const rollupConfig = require("./rollup.config.js");

const scripts_dir = "./src_frontend/scripts/";

let watcher = null;

async function watch() {
  await rm("./public/scripts/", { recursive: true, force: true })

  const scripts = (await getAllFiles(scripts_dir, {resolve: true}).toArray()).map(file => {
    const relativePath = path.relative(path.join(__dirname, scripts_dir) , file)
    return { [relativePath.split(".")[0].replace("\\", ".")] : path.join(scripts_dir,relativePath)};
  }).reduce((acc, val) => ({...acc, ...val}), {});

  const watchOptions = {
    ...rollupConfig,
    input: scripts
  }

  if(watcher)
    throw new Error("Watcher already exists");

  watcher = rollup.watch(watchOptions);
  
  watcher.on('event', ({ result , ...event}) => {
    if(event.code == "ERROR") {
      console.error(event.error);
    }
    if (result) {
      result.close();
    }
  });
  console.log("Watching for changes...");
}

watch();

fs.watch(scripts_dir,{recursive : true} ,(eventType, filename) => {
  if(eventType == "rename") {
    watcher && watcher.close();
    watcher = null;
    watch();
  }
});