module.exports = {
	extends: ['prettier', '@creatoros'],
	overrides: [],
	plugins: ['react', 'react-native'],
	rules: {
		'react-native/no-unused-styles': 2,
		'react-native/split-platform-components': 2,
		'react-native/no-inline-styles': 2,
		'react-native/no-color-literals': 2,
		'react-native/no-raw-text': 0,
		'react-native/no-single-element-style-arrays': 2,
		'no-console': 'error',
	},
}
