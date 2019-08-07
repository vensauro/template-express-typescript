module.exports = {
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	env: {
		es6: true,
		node: true,
		jest: true
	},
	plugins: ['@typescript-eslint', 'prettier', 'jest'],
	extends: [
		'plugin:jest/recommended',
		'standard-with-typescript',
		'prettier/@typescript-eslint',
		'plugin:prettier/recommended'
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
		project: './tsconfig.json'
	},
	rules: {
		'@typescript-eslint/indent': 'off',
		'@typescript-eslint/explicit-function-return-type': [
			'warn',
			{
				'allowExpressions': true,
				'allowTypedFunctionExpressions': true
			}
		],
		'@typescript-eslint/explicit-member-accessibility': [
			'warn',
			{
				'accessibility': 'no-public'
			}
		],
		'@typescript-eslint/camelcase': 'off'
	}
}
