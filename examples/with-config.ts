/**
 * Configuration usage example for OpenAPI Drift Guard
 *
 * Demonstrates how to use custom configuration.
 * Run with: npx tsx examples/with-config.ts
 */

import { Validator } from '../src/index'
import { mergeConfig, getDefaultConfig, validateConfig } from '../src/utils/config'

async function main() {
	console.log('⚙️  OpenAPI Drift Guard — Configuration Example\n')

	// ─── Default configuration ──────────────────────────────────────
	console.log('🔹 Default configuration:')
	const defaultConfig = getDefaultConfig()
	console.log(`  specPath: ${defaultConfig.specPath}`)
	console.log(`  codePath: ${defaultConfig.codePath}`)
	console.log(`  framework: ${defaultConfig.framework}`)
	console.log(`  strictMode: ${defaultConfig.strictMode}`)
	console.log(`  reportFormat: ${defaultConfig.reportFormat}\n`)

	// ─── Custom configuration ───────────────────────────────────────
	console.log('🔹 Custom configuration:')
	const customConfig = mergeConfig({
		specPath: './test/fixtures/specs/openapi3-petstore.yaml',
		codePath: './test/fixtures/apps/express-app',
		framework: 'express',
		strictMode: true,
		reportFormat: 'markdown',
		excludePaths: ['node_modules/', 'dist/', 'coverage/', 'test/'],
	})

	console.log(`  specPath: ${customConfig.specPath}`)
	console.log(`  codePath: ${customConfig.codePath}`)
	console.log(`  framework: ${customConfig.framework}`)
	console.log(`  strictMode: ${customConfig.strictMode}`)
	console.log(`  reportFormat: ${customConfig.reportFormat}`)
	console.log(`  excludePaths: ${customConfig.excludePaths.length} patterns\n`)

	// ─── Validate configuration ─────────────────────────────────────
	console.log('🔹 Validate configuration:')
	try {
		validateConfig(customConfig)
		console.log('  ✅ Configuration is valid\n')
	} catch (error) {
		console.log(`  ❌ ${error}\n`)
	}

	// ─── Invalid configuration ──────────────────────────────────────
	console.log('🔹 Invalid configuration example:')
	try {
		const invalidConfig = mergeConfig({
			specPath: './openapi.yaml',
			codePath: './src',
			framework: 'invalid-framework' as any,
		})
		validateConfig(invalidConfig)
	} catch (error) {
		console.log(`  ❌ Expected error: ${error}\n`)
	}

	// ─── Use configuration with validator ───────────────────────────
	console.log('🔹 Use configuration with validator:')
	const validator = new Validator(customConfig)
	const report = await validator.validate()

	console.log(`  Validation completed!`)
	console.log(`  Breaking changes: ${report.summary.breakingChanges}`)
	console.log(`  Warnings: ${report.summary.warnings}`)

	console.log('\n✅ Configuration example completed!')
}

main().catch(console.error)
