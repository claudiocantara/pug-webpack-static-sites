const path = require("path");
const dir = require("node-dir");
const package = require("../package.json");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const common = require("./webpack.common");
const Sitemap = require("./singleton.sitemap");

const sitemap = Sitemap.getInstance();

const getPagesName = (pages) => {
  return new Promise((resolve) => {
    dir.readFiles(
      pages,
      (_err, _content, next) => {
        next();
      },
      (err, files) => {
        if (err) throw err;
        resolve(files);
      }
    );
  });
};

const addPlugin = async () => {
  const pagesDir = path.resolve(__dirname, "../src/templates/pages/");
  const pages = await getPagesName(pagesDir);

  pages.forEach(pagePath => {
    const templatePath = pagePath.match(/(?:(?=src\/)(?:.*))/).shift();
    const compareVal =  path.basename(pagePath, '.pug');
    const newPathBase = pagePath.match(/(?:(?=pages\/)(?:.*)[(?=\/)])/).shift();
    const newPath = newPathBase.match(/[^(?:pages)].+$/);

    if( compareVal !== '.DS_Store'){
      common.plugins.push(
        new HtmlWebpackPlugin({
          minify: {
            collapseWhitespace: true
          },
          hash: true,
          template: path.resolve(__dirname, `../${templatePath}`),
          filename: createFilename(newPath, compareVal),
        })
      );
    }
  });
}

const handleUrl = url => {
  return sitemap.addURL(page.replace('./', `${url}/`));
}

const createFilename = (path, compareVal) => {
  const prePath = path || "/";

  const conditionPath =
    compareVal === "index"
      ? `.${prePath}index.html`
      : `.${prePath + compareVal}/index.html`;

  const page = compareVal == "index" && !path ? "./index.html" : conditionPath;
  if(process.env.NODE_ENV == "production"){

   handleUrl(package["url-project"])
  }

  return page;
};

module.exports = addPlugin;
