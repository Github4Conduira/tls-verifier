const webpack = require('webpack');
module.exports = function override(config) {
	const fallback = config.resolve.fallback || {};
	Object.assign(fallback, {
		"crypto": require.resolve("crypto-browserify"),
		"path": require.resolve("path-browserify"),
		"stream": require.resolve("stream-browserify"),
		"process": require.resolve("process/browser"),
		"assert": require.resolve("assert/"),
		"os": require.resolve("os-browserify"),
		"url": require.resolve("url"),
		"zlib": require.resolve("browserify-zlib"),
		"util": require.resolve("util"),
		"buffer": require.resolve("buffer"),
		"http": false,//require.resolve("stream-http"),
		"https": false, //require.resolve("https-browserify"),
		"dns": false,
		"net": false,
		"tls": false,
		"http2": false,
		"fs": false,
	})
	config.resolve.fallback = fallback;
	config.plugins = (config.plugins || []).concat([
		new webpack.ProvidePlugin({
			process: 'process/browser',
			Buffer: ['buffer', 'Buffer']
		})
	])
	return config;
}