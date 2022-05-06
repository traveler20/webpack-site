/** ↓ エディタで補完を効かせるための JSDoc */
/** @type {import('webpack').Configuration} */

// Node.js の path モジュールをインポート
const path = require("node:path");

module.exports = {
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: "babel-loader",
			},
			{
				// 拡張子 css のファイル（正規表現）
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	// 依存関係解決に参照するファイルの拡張子を指定
	resolve: {
		extensions: [".js", ".json", ".jsx"],
	},
	entry: "./src/main.jsx",
	output: {
		// ファイル名
		filename: "bundle.js",
		// 出力するフォルダ
		path: path.resolve(__dirname, "dist"),
	},
	devtool: "source-map",
	devServer: {
		static: {
			directory: "./dist",
		},
	},
};
