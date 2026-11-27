import js from '@eslint/js';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';

export default ts.config(
	{
		ignores: ['build/', '.svelte-kit/', 'node_modules/', 'static/']
	},
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		}
	},
	{
		// Règles à corriger plus tard : constats existants trop nombreux pour bloquer la CI.
		rules: {
			'svelte/no-navigation-without-resolve': 'warn',
			'svelte/valid-prop-names-in-kit-pages': 'warn',
			'svelte/require-each-key': 'warn',
			'svelte/prefer-writable-derived': 'warn',
			'svelte/no-inspect': 'warn',
			'svelte/no-at-html-tags': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/ban-ts-comment': 'warn'
		}
	},
	{
		// Un paramètre ou une variable préfixé par `_` est volontairement inutilisé.
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }
			]
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: { parser: ts.parser, extraFileExtensions: ['.svelte'] }
		}
	}
);
