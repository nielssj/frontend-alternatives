module.exports = {
    devtool: "inline-source-map",
    entry: "./js/app.js",
    output: {
        path: "static",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: [ 'babel' ],
                exclude: /node_modules/,
                include: __dirname
            }
        ]
    },
    watchOptions: {
        poll: true
    }
};