const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const libraryName = 'range-slider';

module.exports = env => {
    const mode = env.production ? 'production' : 'development';
    let inputJSFile = './src/range-slider.js';
    let rootPath = path.resolve(__dirname, 'dist');
    let outputJSFile = mode === 'production' ? libraryName + '.main.min.js' : libraryName + '.main.js';
    let outputCSSFile = mode === 'production' ? libraryName + '.min.css' : libraryName + '.css';
    
    let cssLoaders = ["style-loader", "css-loader"] ;
    let minimizers = [];
    let cssPlugins =  [];

    if(env.withCSS) {
        outputJSFile = mode === 'production' ? libraryName + '.min.js' : libraryName + '.js';
        cssLoaders = [MiniCssExtractPlugin.loader, "css-loader"];
        minimizers = [ new CssMinimizerPlugin()];
        cssPlugins =  [
            new MiniCssExtractPlugin({
              filename: outputCSSFile,
              chunkFilename: "[id].css",
            }),
        ];
    }

    if(env.bundle) {
        rootPath = path.resolve(__dirname, 'example');
        inputJSFile = './src/example.js';
        outputJSFile = './bundle.js';
    }

    return {
        mode,
        entry: inputJSFile,
        output: {
            path: rootPath,
            filename: outputJSFile,
            library: {
                name: 'RangeSlider',
                type: 'umd',
                export: 'default'
            }
        },
        plugins: cssPlugins,
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: cssLoaders,
                },
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"],
                        },
                    },
                },
            ],
        },
        optimization: {
            minimizer: minimizers,
        },
    }
};
