/*
  webpack.dev.js、webpack.prod.jsへビルド設定を渡す
  引数[MODE]は webpack の出力オプション（'production' か 'development'）を指定します
*/
const webpackConfig = (MODE) => {
	//purgecssの除外設定
	const cssSafeList = ["hoge"];

	//ベースファイルのパス設定
	const filePath = {
		js: "./src/js/",
		ejs: "./src/ejs/",
		sass: "./src/sass/",
	};

	// ソースマップの利用有無判別（productionのときはソースマップを利用しない）
	const enabledSourceMap = MODE === "development";

	//ベース設定読み込み
	const path = require("path");
	const MiniCssExtractPlugin = require("mini-css-extract-plugin");
	const CopyPlugin = require("copy-webpack-plugin");
	const WebpackWatchedGlobEntries = require("webpack-watched-glob-entries-plugin");

	//sassファイル分割
	const entriesScss = WebpackWatchedGlobEntries.getEntries(
		[path.resolve(__dirname, `${filePath.sass}**/**.scss`)],
		{
			ignore: path.resolve(__dirname, `${filePath.sass}**/_*.scss`),
		}
	)();
	const cssGlobPlugins = (entriesScss) => {
		return Object.keys(entriesScss).map(
			(key) =>
				new MiniCssExtractPlugin({
					//出力ファイル名
					filename: `assets/css/${key}.css`,
				})
		);
	};

	//jsファイル分割
	const entriesJS = WebpackWatchedGlobEntries.getEntries([
		path.resolve(__dirname, `${filePath.js}*.js`),
	])();

	//ejsビルド
	const entries = WebpackWatchedGlobEntries.getEntries(
		[path.resolve(__dirname, `${filePath.ejs}**/*.ejs`)],
		{
			ignore: path.resolve(__dirname, `${filePath.ejs}**/_*.ejs`),
		}
	)();
	const HtmlWebpackPlugin = require("html-webpack-plugin");
	const {
		htmlWebpackPluginTemplateCustomizer,
	} = require("template-ejs-loader");
	const htmlGlobPlugins = (entries) => {
		return Object.keys(entries).map(
			(key) =>
				new HtmlWebpackPlugin({
					//出力ファイル名
					filename: `${key}.html`,
					//ejsファイルの読み込み
					template: htmlWebpackPluginTemplateCustomizer({
						htmlLoaderOption: {
							//ファイル自動読み込みと圧縮を無効化
							sources: false,
							minimize: false,
						},
						templatePath: `${filePath.ejs}${key}.ejs`,
					}),

					//JS・CSS自動出力と圧縮を無効化
					inject: false,
					minify: false,
				})
		);
	};

	//ビルド設定を各jsファイルへ渡す
	return {
		// モード値を production に設定すると最適化された状態で、
		// development に設定するとソースマップ有効でJSファイルが出力される
		mode: MODE,

		// ローカル開発用環境を立ち上げる
		// 実行時にブラウザが自動的に localhost を開く
		devServer: {
			static: path.resolve(__dirname, "src"),
			open: true,
		},
		target: "web", //ローカルサーバのホットリロードを有効化する

		//JS書き出しファイル読み込み
		entry: entriesJS,

		//JS書き出し設定
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "assets/js/[name].js",
			clean: true, //ビルド時にdistフォルダをクリーンアップする
		},

		module: {
			rules: [
				//ejs
				{
					test: /\.ejs$/i,
					use: ["html-loader", "template-ejs-loader"],
				},

				//babel-loader
				{
					// 拡張子 .js の場合
					test: /\.js$/,
					exclude: /node_modules/,
					use: [
						{
							// Babel を利用する
							loader: "babel-loader",
							// Babel のオプションを指定する
							options: {
								presets: [["@babel/preset-env", { targets: "defaults" }]],
							},
						},
					],
				},

				//Sass
				{
					test: /\.scss/, // 対象となるファイルの拡張子
					use: [
						// CSSファイルを書き出すオプションを有効にする
						{
							loader: MiniCssExtractPlugin.loader,
						},
						{
							loader: "css-loader",
							options: {
								// オプションでCSS内のurl()メソッドの取り込みを禁止する
								url: true,
								// ソースマップの利用有無
								sourceMap: enabledSourceMap,

								// Sass+PostCSSの場合は2を指定
								// 0 => no loaders (default);
								// 1 => postcss-loader;
								// 2 => postcss-loader, sass-loader
								importLoaders: 2,
							},
						},
						// PostCSSのための設定
						{
							loader: "postcss-loader",
							options: {
								// PostCSS側でもソースマップを有効にする
								// sourceMap: true,
								postcssOptions: {
									plugins: [
										["postcss-normalize-charset", {}],
										["autoprefixer", {}],
										["postcss-sort-media-queries", {}],
										["css-declaration-sorter", { order: "smacss" }],
										[
											"@fullhuman/postcss-purgecss",
											{
												//purgecssオプション：ejsファイルとjsファイルを監視対象にする
												content: [
													`${filePath.ejs}**/*.ejs`,
													`${filePath.js}**/*.js`,
												],
												//purgecssオプション：除外設定　https://purgecss.com/safelisting.html
												safelist: cssSafeList, //除外要素は8行目で設定
											},
										],
									],
								},
							},
						},
						{
							loader: "sass-loader",
							options: {
								// ソースマップの利用有無
								sourceMap: enabledSourceMap,
							},
						},
					],
				},

				//CSS内の画像読み込み設定
				{
					test: /\.(gif|png|jpg|svg)$/,
					// 閾値以上だったら埋め込まずファイルとして分離する
					type: "asset",
					parser: {
						dataUrlCondition: {
							// 4KB以上だったら埋め込まずファイルとして分離する
							maxSize: 4 * 1024,
						},
					},
					//書き出し設定
					generator: {
						filename: "assets/images/[name][ext]",
					},
				},
			],
		},

		plugins: [
			// CSS出力
			...cssGlobPlugins(entriesScss),

			// ejs出力
			...htmlGlobPlugins(entries),

			//ディレクトリコピー
			new CopyPlugin({
				patterns: [
					//画像コピー
					{
						from: path.resolve(__dirname, "src/images/"),
						to: path.resolve(__dirname, "dist/assets/images"),
					},
				],
			}),
		],
	};
};
module.exports = { webpackConfig };
