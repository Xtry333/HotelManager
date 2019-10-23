const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const WriteFilePlugin = require('write-file-webpack-plugin');

const env = 'development';
const isProduction = env === 'production';

module.exports = {
    mode: env,

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    entry: "./src/App.tsx",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js"],
        modules: ["src", "node_modules"]
    },

    output: {
        filename: 'main.js',
        path: path.join(__dirname, './public/js'),
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                loader: "ts-loader"
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            // Compile '.less' files into '.css'
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'style-loader', // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                    {
                        loader: 'less-loader', // compiles Less to CSS
                    }
                ]
            }
        ]
    },

    devServer: {
        watchContentBase: true,
        contentBase: path.resolve(__dirname, './public/'),
        compress: true,
        port: 9000
    },

    plugins: isProduction ? [new MiniCssExtractPlugin()] : [new WriteFilePlugin()],
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    // externals: {
    //     "react": "React",
    //     "react-dom": "ReactDOM"
    // }
};