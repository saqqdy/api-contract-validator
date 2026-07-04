/**
 * Configuration management for OpenAPI Drift Guard
 */

import type { CliOptions, Config, ConfigFile, Framework, OutputFormat } from '../types/config'
import { existsSync, readFileSync } from 'node:fs'

/** Load config file from path */
export function loadConfigFile(path: string): ConfigFile {
	if (!existsSync(path)) {
		return {}
	}

	try {
		const content = readFileSync(path, 'utf-8')
		return JSON.parse(content)
	} catch {
		return {}
	}
}

/** Default configuration */
const DEFAULT_CONFIG: Required<
	Pick<Config, 'specFile' | 'codeDirectory' | 'framework' | 'outputFormat'>
> &
	Config = {
	specFile: './openapi.yaml',
	codeDirectory: './src',
	framework: 'auto',
	outputFormat: 'console',
	exclude: ['node_modules/', 'dist/', 'coverage/', 'vendor/', '.git/', 'test/'],
	strict: false,
	suggestFixes: true,
	ignoreDeprecated: false,
	minSeverity: 'medium',
	cache: true,
	incremental: false,
	include: undefined,
	onlyDriftTypes: undefined,
	outputFile: undefined,
	postmanCollection: undefined,
	postmanEnvironment: undefined,
}

/** Merge config file with CLI options */
export function mergeConfig(fileConfig: ConfigFile, cliOptions: CliOptions): Config {
	return {
		...DEFAULT_CONFIG,
		specFile: cliOptions.spec || fileConfig.spec || DEFAULT_CONFIG.specFile,
		codeDirectory: cliOptions.src || fileConfig.src || DEFAULT_CONFIG.codeDirectory,
		framework: cliOptions.framework || fileConfig.framework || DEFAULT_CONFIG.framework,
		outputFormat: (cliOptions.output ||
			fileConfig.output ||
			DEFAULT_CONFIG.outputFormat) as Config['outputFormat'],
		exclude: fileConfig.exclude ?? DEFAULT_CONFIG.exclude,
		minSeverity: cliOptions.severity || fileConfig.severity || DEFAULT_CONFIG.minSeverity,
		strict: cliOptions.strict ?? fileConfig.strict ?? DEFAULT_CONFIG.strict,
		suggestFixes: cliOptions.fix ?? fileConfig.suggestFixes ?? DEFAULT_CONFIG.suggestFixes,
		ignoreDeprecated: fileConfig.ignoreDeprecated ?? DEFAULT_CONFIG.ignoreDeprecated,
	}
}

/** Get default configuration (fresh copy) */
export function getDefaultConfig(): Config {
	return { ...DEFAULT_CONFIG }
}

/** Validate configuration */
export function validateConfig(config: Config): void {
	if (!config.specFile) {
		throw new Error('specFile is required')
	}
	if (!config.codeDirectory) {
		throw new Error('codeDirectory is required')
	}

	const validFrameworks: Framework[] = ['express', 'fastify', 'koa', 'nestjs', 'hono', 'generic']
	if (config.framework !== 'auto' && !validFrameworks.includes(config.framework as Framework)) {
		throw new Error(`Unsupported framework: ${config.framework}`)
	}

	const validFormats: OutputFormat[] = ['console', 'json', 'markdown', 'sarif']
	if (!validFormats.includes(config.outputFormat)) {
		throw new Error(`Unsupported output format: ${config.outputFormat}`)
	}
}
