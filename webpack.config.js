/** ↓ エディタで補完を効かせるための JSDoc */
/** @type {import('webpack').Configuration} */
module.exports = {
	module: {
		rules: [
			{
				// 拡張子 js のファイル（正規表現）
				test: /\.js$/,
				// ローダーの指定
				loader: "babel-loader",
			},
		],
	},
	devtool: "source-map",
	devServer: {
		static: {
			directory: "./dist",
		},
	},
};
