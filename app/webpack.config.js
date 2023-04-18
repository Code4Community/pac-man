// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = 'style-loader';


const config = {
    entry: './pacman/index.js',
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        open: true,
        host: 'localhost',
        static: {
            directory: path.resolve(__dirname, './pacman/assets'),
            publicPath: '/pacman/assets'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'pacman.html',
        })

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp|json|mp3|ogg)$/i,
                type: 'asset/resource',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
};

module.exports = () => {
    
    if (isProduction) {
        config.mode = 'production';


    } else {
        config.mode = 'development';
    }

    target: "node"
    
    return config;
};
