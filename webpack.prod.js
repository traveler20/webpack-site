//webpack.common.jsを読み込み'production'設定で出力
const { webpackConfig } = require("./webpack.common");
module.exports = webpackConfig("production");
