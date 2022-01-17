const PATH = require("path");

module.exports = {
	mode: "production",
	entry: "./src/index.js",
	output: {
		path: PATH.resolve(__dirname, "dist"),
		filename: "bundle.js",
	},
<<<<<<< HEAD

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

=======
>>>>>>> 9186c3daf603c87c5dd7d16e997f9f6f9c929b8c
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
