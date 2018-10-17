const fs = require('fs');
const path = require('path');
const dir = require('node-dir');

const  CreatePugVariables = async() => {
  const pugVariablesDir = path.resolve(__dirname, "../pug-variables/");
  const dirs = await getFileNames(pugVariablesDir);
  let variables = {};

  dirs.forEach(file => {
    const ext = path.extname(file);
    if('.json' === ext) {
      const pugData = require(file);
      variables = Object.assign(variables, pugData);
    }
  });
  return variables;
}


const getFileNames = (files) => {
  return new Promise((resolve) => {
    dir.readFiles(
      files,
      (err, content, next) => {
        next();
      },
      (err, files) => {
        if (err) throw err;
        resolve(files);
      }
    );
  });
};

module.exports = CreatePugVariables;
