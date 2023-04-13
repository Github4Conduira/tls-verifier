module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	plugins: [
		[
			'module-resolver',
			{
				root: ['.'],
				alias: {
					'@app': './src',
				},
			},
		],
		[
			'module:react-native-dotenv',
			{
				moduleName: '@env',
				path: '.env',
			},
		],
		'react-native-reanimated/plugin',
		['@babel/plugin-proposal-private-methods', { loose: true }],
	],
}
