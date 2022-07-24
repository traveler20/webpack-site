//webpack.common.jsを読み込み'development'設定で出力
const { webpackConfig } = require("./webpack.common");
module.exports = webpackConfig("development");
