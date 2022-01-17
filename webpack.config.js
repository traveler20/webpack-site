// [定数] webpack の出力オプションを指定します
// 'production' か 'development' を指定
const MODE = "production";

// ソースマップの利用有無(productionのときはソースマップを利用しない)
const enabledSourceMap = MODE === "development";

module.exports = {
	// メインとなるJavaScriptファイル（エントリーポイント）
	entry: `./src/index.js`,

	// ファイルの出力設定
	output: {
		// 出力ファイル名
		filename: "main.js",
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
			// Sassファイルの読み込みとコンパイル
			{
				test: /\.scss/, // 対象となるファイルの拡張子
				// ローダー名
				use: [
					// linkタグに出力する機能
					"style-loader",
					// CSSをバンドルするための機能
					{
						loader: "css-loader",
						options: {
							// オプションでCSS内のurl()メソッドを取り込む
							url: true,
							// ソースマップの利用有無
							sourceMap: enabledSourceMap,

							// 0 => no loaders (default);
							// 1 => postcss-loader;
							// 2 => postcss-loader, sass-loader
							importLoaders: 2,
						},
					},
					// Sassをバンドルするための機能
					{
						loader: "sass-loader",
						options: {
							// ソースマップの利用有無
							sourceMap: enabledSourceMap,
						},
					},
				],
			},
			{
				// 対象となるファイルの拡張子
				test: /\.(gif|png|jpg|svg)$/,
				// 画像をBase64として取り込む
				type: "asset/inline",
			},
		],
	},
	// ES5(IE11等)向けの指定（webpack 5以上で必要）
	target: ["web", "es5"],
};
