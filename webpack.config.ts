import "webpack-dev-server";
import { Configuration } from "webpack";

import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const isDev = process.env.NODE_ENV === "development";

const config: Configuration = {
  mode: isDev ? "development" : "production",
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  entry: {
    app: "./src/index.tsx",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "assets/[name][ext]",
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: isDev,
              importLoaders: 1,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDev,
            },
          },
        ],
      },
      {
        test: /\.(ico|png|svg|ttf|otf|eot|woff?2?)$/,
        type: isDev ? "asset/inline" : "asset/resource",
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      inject: "body",
      chunks: ["app"],
      filename: "index.html",
      favicon: "./src/favicon.ico",
      template: "./src/index.html",
      scriptLoading: isDev ? "blocking" : "defer",
    }),
  ],
  devServer: {
    open: true,
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
  },
  devtool: isDev ? "inline-source-map" : undefined,
};

export default config;
