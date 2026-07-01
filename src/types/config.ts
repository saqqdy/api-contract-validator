/**
 * Configuration Types
 */

import type { DriftType } from './drift'

// Framework types
export type Framework = 'express' | 'fastify' | 'nestjs' | 'koa' | 'hono' | 'generic'

// Output formats
export type OutputFormat = 'console' | 'json' | 'markdown' | 'sarif'

// Configuration
export interface Config {
	// Input sources
	specFile: string
	codeDirectory: string

	// Framework detection
	framework?: Framework | 'auto'

	// Output
	outputFormat: OutputFormat
	outputFile?: string

	// Filtering
	include?: string[]
	exclude?: string[]
	onlyDriftTypes?: DriftType[]

	// Severity threshold
	minSeverity?: 'critical' | 'high' | 'medium' | 'low'

	// Behavior
	strict?: boolean // Strict mode: fail on any drift
	suggestFixes?: boolean // Generate fix suggestions
	ignoreDeprecated?: boolean // Ignore deprecated endpoints in drift detection

	// Performance
	cache?: boolean
	incremental?: boolean

	// MCP Integration
	postmanCollection?: string
	postmanEnvironment?: string
}

// Default configuration
export const defaultConfig: Partial<Config> = {
	framework: 'auto',
	outputFormat: 'console',
	minSeverity: 'medium',
	suggestFixes: true,
	ignoreDeprecated: false,
	strict: false,
	cache: true,
	incremental: false,
}

// Config file schema
export interface ConfigFile {
	spec?: string
	src?: string
	framework?: Framework
	output?: OutputFormat
	exclude?: string[]
	include?: string[]
	severity?: 'critical' | 'high' | 'medium' | 'low'
	strict?: boolean
	suggestFixes?: boolean
	ignoreDeprecated?: boolean
}

// CLI arguments
export interface CliOptions {
	spec?: string
	src?: string
	framework?: Framework
	output?: OutputFormat
	only?: string // Comma-separated drift types
	exclude?: string // Comma-separated patterns
	include?: string // Comma-separated patterns
	severity?: 'critical' | 'high' | 'medium' | 'low'
	strict?: boolean
	fix?: boolean
	init?: boolean
	config?: string // Config file path
}

// Parse drift types from string
export function parseDriftTypes(str: string): DriftType[] {
	return str.split(',').map(s => s.trim() as DriftType)
}

// Merge config with CLI options
export function mergeConfig(configFile: ConfigFile, cliOptions: CliOptions): Config {
	return {
		specFile: cliOptions.spec || configFile.spec || './openapi.yaml',
		codeDirectory: cliOptions.src || configFile.src || './src',
		framework: cliOptions.framework || configFile.framework || 'auto',
		outputFormat: cliOptions.output || configFile.output || 'console',
		onlyDriftTypes: cliOptions.only ? parseDriftTypes(cliOptions.only) : undefined,
		exclude: cliOptions.exclude ? cliOptions.exclude.split(',') : configFile.exclude,
		include: cliOptions.include ? cliOptions.include.split(',') : configFile.include,
		minSeverity: cliOptions.severity || configFile.severity,
		strict: cliOptions.strict ?? configFile.strict ?? false,
		suggestFixes: cliOptions.fix ?? configFile.suggestFixes ?? true,
		ignoreDeprecated: configFile.ignoreDeprecated ?? false,
	}
}
