const merge = require("webpack-merge");
const path = require("path");

const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

const common = require("./webpack.common");
const pagesConfig = require("./pages.config");

module.exports = new Promise((resolve, reject) => {
  pagesConfig().then(() => {
    const dev = merge(common, {
      devtool: "inline-source-map",
      entry: [path.resolve(__dirname, "../src/js/main.js")],
      output: {
        path: path.resolve(__dirname, "../app-error/assets/"),
        filename: "js/main.js"
      },
      module: {
        rules: [
          {
            test: /\.(jpe?g|png|gif|svg)$/i,
            exclude: /node_modules/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: "[name].[ext]?[hash]",
                  outputPath: "img/",
                  useRelativePath : true
                }
              },
              {
                loader: "img-loader",
                options: {
                  debug: true,
                  gifsicle: {
                    interlaced: false
                  },
                  mozjpeg: {
                    progressive: true,
                    arithmetic: false
                  },
                  optipng: false, // disabled
                  pngquant: {
                    floyd: 0.5,
                    speed: 2
                  },
                  svgo: {
                    plugins: [{ removeTitle: true }, { convertPathData: false }]
                  }
                }
              }
            ]
          },
        ]
      },
      plugins: [
      new CleanWebpackPlugin(["app-error"], {
        root: path.resolve(__dirname, "../")
      }),
      new BrowserSyncPlugin({
        browser: "google chrome",
        port: 3000,
        server: {
          baseDir: ["app-error"]
        },
        reload: false,
        ghostMode: {
          clicks: false,
          location: false,
          forms: false,
          scroll: false
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: "debug",
        logPrefix: "wepback",
        notify: true,
        reloadDelay: 0
      })
      ],
    });

    resolve(dev);
  });
});
