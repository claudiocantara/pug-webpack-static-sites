const path = require("path");
const merge = require("webpack-merge");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const CreateFileWebpack = require('create-file-webpack')

const Sitemap = require("./singleton.sitemap");
const common = require("./webpack.common");
const pagesConfig = require("./pages.config");

const sitemap =  Sitemap.getInstance();

module.exports = new Promise((resolve, reject) => {

  pagesConfig().then(() => {
    const prod = merge(common, {
      entry: [path.resolve(__dirname, "../src/js/main.js")],
      output: {
        path: path.resolve(__dirname, "../dist/assets/"),
        filename: "js/main.js"
      },
      module: {
        rules: [
          {
            test: /\.(jpe?g|png|gif|svg)$/i,
            exclude: /node_modules/,
            use: [
              {
                loader: path.resolve(__dirname,'../file-loader'),
                options: {
                  name: "[name].[ext]?[hash]",
                  outputPath: "img/",
                  publicPath: (file, output) => {
                    const basePath = output.split("src/").pop();
                    const compareBaseName = path.basename(basePath, ".pug");

                    if (basePath == "css/style.scss") {
                      return `../${file}`;

                    } else {
                      const pagesFullPath = basePath.match(/(?:(?=pages\/)(?:.*)[(?=\/)])/).shift();
                      const isRoot = pagesFullPath.match(/[^(?:pages)].+$/);

                      if (compareBaseName == "index") {
                        return !isRoot ? `assets/${file}` : `${path.relative(pagesFullPath, "pages/")}/assets/${file}`;

                      } else {
                        return `${path.relative( `${pagesFullPath}/anotherPath`, "pages/")}/assets/${file}`;
                      }
                    }
                  }
                }
              },
              {
                loader: "img-loader",
                options: {
                  plugins: [
                    require('imagemin-gifsicle')({
                      interlaced: false
                    }),
                    require('imagemin-mozjpeg')({
                      progressive: true,
                      arithmetic: false
                    }),
                    require('imagemin-pngquant')({
                      floyd: 0.5,
                      speed: 2
                    }),
                    require('imagemin-svgo')({
                      plugins: [
                        { removeTitle: true },
                        { convertPathData: false }
                      ]
                    })
                  ]
                }
              }
            ]
          },
        ]
      },
      plugins: [
        new CleanWebpackPlugin(["dist"], {
          root: path.resolve(__dirname, "../")
        }),
        // new FaviconsWebpackPlugin({
        //   logo: path.resolve(__dirname, "../src/img/adv_logo.png"),
        //   prefix: "/icons-[hash]/",
        //   icons: {
        //     android: true,
        //     appleIcon: true,
        //     appleStartup: true,
        //     coast: false,
        //     favicons: true,
        //     firefox: false,
        //     opengraph: false,
        //     twitter: false,
        //     yandex: false,
        //     windows: false
        //   }
        // }),
        new CreateFileWebpack({
          path : "./dist",
          fileName : 'sitemap.xml',
          content :  sitemap.creatSiteMap()
        }),
      ],
    });

    resolve(prod);
  });
});
