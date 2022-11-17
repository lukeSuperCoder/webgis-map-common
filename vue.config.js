// 引入等比适配插件
const px2rem = require("postcss-px2rem");

// 配置基本大小
const postcss = px2rem({
  // 基准大小 baseSize，需要和rem.js中相同
  remUnit: 16,
});
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ["js", "css"];
const webpack = require("webpack");
module.exports = {
  // 公共路径(必须有的)
  publicPath: "./",
  // 输出文件目录
  outputDir: "commonDist",
  // eslint-loader 是否在保存的时候检查(果断不用，这玩意儿我都没装)
  lintOnSave: false,
  // 我用的only，打包后小些
  runtimeCompiler: false,
  productionSourceMap: false, // 不需要生产环境的设置false可以减小dist文件大小，加速构建
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "基础通用前端框架";
      return args;
    });
  },
  configureWebpack: (config) => {
    // config.entry.app = ["@babel/polyfill","./src/main.js"];
    if (process.env.NODE_ENV === "production") {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: "gzip",
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
          threshold: 10240,
          minRatio: 0.8,
        })
      );
    }
    config.resolve = {
      // 别名配置
      alias: {
        src: "@", //默认已配置
        assets: "@/assets",
        common: "@/common",
        components: "@/components",
        views: "@/views",
        plugins: "@/plugins",
        utils: "@/utils",
      },
    };
  },
  css: {
    extract: false,
    loaderOptions: {
      postcss: {
        plugins: [postcss],
      },
    },
  },
  devServer: {
    port: 8081, // 端口号
    open: false, //配置是否自动启动浏览器
    https: false,// https:{type:Boolean}是否启用https
    proxy: {
      // 代理
      "/api": {
        target: "http://jalee.xicp.io",     //要代理访问的路径
        ws: false,// 是否启用websockets
        changeOrigin: true,//开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          "^/api": ""//这里理解成用'/api'代替target里面的地址,比如我要调用'http://192.168.0.45:8088/user/getuserlist'，直接写'/api/user/getuserlist'即可
        }
      }
    }
  }
};
