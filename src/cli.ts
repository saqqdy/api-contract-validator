#!/usr/bin/env node

/**
 * CLI entry point using Commander
 */

import type { DriftReport, DriftSummary, DriftType } from './types/drift'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { Command } from 'commander'
import { createAnalyzer } from './analyzer'
import { detectDrifts } from './detector'
import { parseAndNormalizeSpec } from './parser'
import { createReporter } from './reporter'
import { getDefaultConfig, loadConfigFile, mergeConfig } from './utils/config'
import './analyzer/express' // Ensure Express analyzer is registered

// Read version from package.json
const pkgPath = join(__dirname, '..', 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))

const program = new Command()

program
	.name('openapi-drift-guard')
	.description('Detect drift between OpenAPI spec and implementation')
	.version(pkg.version)

// Validate command
program
	.command('validate')
	.description('Validate API contract between spec and code')
	.option('-s, --spec <file>', 'OpenAPI/Swagger spec file path')
	.option('-c, --code <dir>', 'Source code directory')
	.option('-f, --format <format>', 'Output format (console, json, markdown)', 'console')
	.option('-o, --output <file>', 'Output file path')
	.option('--config <file>', 'Config file path', '.contract-validatorrc')
	.option('--severity <level>', 'Minimum severity to report (critical, high, medium, low)')
	.option('--framework <name>', 'Framework to use (express, fastify, koa, nestjs)')
	.action(options => {
		try {
			// Load config file if exists
			let config = getDefaultConfig()
			const configPath = options.config

			if (existsSync(configPath)) {
				const fileConfig = loadConfigFile(configPath)
				config = mergeConfig(fileConfig, {
					spec: options.spec,
					src: options.code,
					output: options.format,
					severity: options.severity,
					framework: options.framework,
				})
			} else {
				// Use CLI options directly
				config = {
					...config,
					specFile: options.spec || config.specFile,
					codeDirectory: options.code || config.codeDirectory,
					outputFormat: options.format || config.outputFormat,
					minSeverity: options.severity || config.minSeverity,
					framework: options.framework || config.framework,
				}
			}

			// Validate required options
			if (!config.specFile || !config.codeDirectory) {
				console.error('❌ Error: Both --spec and --code are required')
				console.log('Usage: openapi-drift-guard validate --spec <file> --code <dir>')
				process.exit(2)
			}

			console.log('🔍 Validating API contract...')
			console.log(`  Spec: ${config.specFile}`)
			console.log(`  Code: ${config.codeDirectory}`)

			// Parse spec
			const specEndpoints = parseAndNormalizeSpec(config.specFile)
			console.log(`\n✅ Spec parsed: ${specEndpoints.length} endpoints`)

			// Analyze code
			const framework = config.framework === 'auto' ? 'express' : config.framework
			const analyzer = createAnalyzer(framework as 'express', config.codeDirectory)
			const codeEndpoints = analyzer.analyze()
			console.log(`\n✅ Code analyzed: ${codeEndpoints.length} endpoints`)

			// Detect drifts
			const drifts = detectDrifts(specEndpoints, codeEndpoints)
			console.log(`\n📊 Drift detected: ${drifts.length} issues`)

			// Generate report
			const report: DriftReport = {
				version: pkg.version,
				timestamp: new Date().toISOString(),
				specFile: config.specFile,
				codeDirectory: config.codeDirectory,
				drifts,
				summary: generateSummary(drifts),
			}

			// Output report
			const outputFormat = (
				config.outputFormat === 'sarif' ? 'console' : config.outputFormat
			) as 'console' | 'json' | 'markdown'
			const reporter = createReporter({
				format: outputFormat,
				outputFile: options.output,
				minSeverity: config.minSeverity as 'critical' | 'high' | 'medium' | 'low',
			})

			if (outputFormat !== 'console') {
				const output = reporter.generate(report)
				if (options.output) {
					writeFileSync(options.output, output, 'utf-8')
					console.log(`\n📄 Report saved to: ${options.output}`)
				} else {
					console.log(`\n${output}`)
				}
			} else {
				reporter.output(report)
			}

			// Exit with appropriate code
			// 0 = no drift, 1 = drift found, 2 = execution error
			if (drifts.length > 0) {
				process.exit(1)
			}
			process.exit(0)
		} catch (error) {
			console.error('❌ Error:', error instanceof Error ? error.message : String(error))
			process.exit(2)
		}
	})

// Init command
program
	.command('init')
	.description('Generate configuration file')
	.option('-s, --spec <file>', 'Default spec file path', './openapi.yaml')
	.option('-c, --code <dir>', 'Default code directory', './src')
	.option('-f, --format <format>', 'Default output format', 'console')
	.option('--framework <name>', 'Default framework', 'express')
	.option('--force', 'Overwrite existing config file')
	.action(options => {
		const configPath = '.contract-validatorrc'

		if (existsSync(configPath) && !options.force) {
			console.error(`❌ Config file already exists: ${configPath}`)
			console.log('Use --force to overwrite')
			process.exit(1)
		}

		const config = {
			spec: options.spec,
			src: options.code,
			framework: options.framework,
			output: options.format,
			exclude: ['node_modules/', 'dist/', 'coverage/', 'test/'],
		}

		writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8')
		console.log(`✅ Config file created: ${configPath}`)
		console.log(JSON.stringify(config, null, 2))
	})

program.parse()

/**
 * Generate summary from drifts
 */
function generateSummary(drifts: DriftReport['drifts']): DriftSummary {
	const byType: Record<DriftType, number> = {} as Record<DriftType, number>
	const bySeverity: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 }

	for (const d of drifts) {
		byType[d.type] = (byType[d.type] || 0) + 1
		bySeverity[d.severity] = (bySeverity[d.severity] || 0) + 1
	}

	return {
		total: drifts.length,
		byType,
		bySeverity,
		criticalCount: bySeverity.critical,
		highCount: bySeverity.high,
		mediumCount: bySeverity.medium,
		lowCount: bySeverity.low,
	}
}
