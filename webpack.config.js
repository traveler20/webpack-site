const PATH = require("path");

module.exports = {
	mode: "production",
	entry: "./src/index.js",
	output: {
		path: PATH.resolve(__dirname, "dist"),
		filename: "bundle.js",
	},

	// モード値を production に設定すると最適化された状態で、
	// development に設定するとソースマップ有効でJSファイルが出力される
	mode: MODE,

	// ローカル開発用環境を立ち上げる
	// 実行時にブラウザが自動的に localhost を開く
	devServer: {
		contentBase: "dist",
		open: true,
		watchContentBase: true,
		inline: true,
		hot: true,
	},

	module: {
		rules: [
			{
				test: /\.scss$/i,
				use: [
					{
						loader: "style-loader",
					},
					{
						loader: "css-loader",
					},
					{
						loader: "sass-loader",
						options: {
							sassOptions: {
								outputStyle: "expanded",
							},
						},
					},
				],
			},
		],
	},
};
