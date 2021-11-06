module.exports = {
  entry: ["./client/index.js"],
  output: {
    path: path.join(__dirname, "public", "dist"),
    filename: "[name].js",
  },
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,

        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"],
        },
      },

      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
