/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path')
const nodeModulesPaths = [path.resolve(path.join(__dirname, './node_modules'))]
const workspaceRoot = path.resolve(__dirname, '../')
// mock for all the modules we aren't using
const MOCK_MODULE = path.resolve(__dirname, 'node_modules/url')

module.exports = {
	transformer: {
		getTransformOptions: async() => ({
			transform: {
				experimentalImportSupport: false,
				inlineRequires: true,
			},
		}),
	},
	resolver: {
		nodeModulesPaths,
		extraNodeModules: {
			// Redirect react-native to react-native-web
			net: path.resolve(__dirname, 'node_modules/react-native-tcp-socket'),
			crypto: path.resolve(__dirname, 'node_modules/react-native-crypto'),
			http: MOCK_MODULE, // path.resolve(__dirname, 'node_modules/stream-http'),
			buffer: path.resolve(__dirname, 'node_modules/buffer/'),
			https: MOCK_MODULE, //path.resolve(__dirname, 'node_modules/https-browserify'),
			zlib: path.resolve(__dirname, 'node_modules/browserify-zlib'),
			stream: path.resolve(__dirname, 'node_modules/stream-browserify'),
			tls: path.resolve(__dirname, 'node_modules/react-native-tcp-socket'),
			util: path.resolve(__dirname, 'node_modules/util'),
			dns: MOCK_MODULE, //path.resolve(__dirname, 'node_modules/dns.js'),
			http2: MOCK_MODULE, //path.resolve(__dirname, 'node_modules/http2'),
			url: path.resolve(__dirname, 'node_modules/url'),
			assert: path.resolve(__dirname, 'node_modules/assert'),
			events: path.resolve(__dirname, 'node_modules/events'),
			fs: MOCK_MODULE, // path.resolve(__dirname, 'node_modules/react-native-level-fs'),
			dgram: MOCK_MODULE, // path.resolve(__dirname, 'node_modules/react-native-udp'),
			os: path.resolve(__dirname, 'node_modules/react-native-os'),
			path: path.resolve(__dirname, 'node_modules/path-browserify'),
			constants: path.resolve(__dirname, 'node_modules/constants-browserify'),
			// eslint-disable-next-line camelcase
			perf_hooks: MOCK_MODULE,
			// eslint-disable-next-line camelcase
			child_process: MOCK_MODULE,
		},
	},
	// options for reading data outside root react-native folder
	projectRoot: __dirname,
	watchFolders: [path.resolve(__dirname, '../'), workspaceRoot],
}
