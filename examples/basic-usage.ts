/**
 * Basic usage examples for API Contract Validator
 *
 * Run with: npx tsx examples/basic-usage.ts
 */

import { Validator } from '../src/index'

async function main() {
	console.log('🔍 API Contract Validator — Basic Usage Examples\n')

	// ─── Example 1: Validate Express app against OpenAPI spec ────────
	console.log('📝 Example 1: Validate Express App')
	console.log('─'.repeat(40))

	const validator = new Validator({
		specPath: './test/fixtures/specs/openapi3-petstore.yaml',
		codePath: './test/fixtures/apps/express-app',
		framework: 'express',
	})

	const report = await validator.validate()

	console.log(`Spec: ${report.specPath}`)
	console.log(`Framework: ${report.framework}`)
	console.log(`Endpoints in spec: ${report.summary.totalEndpoints}`)
	console.log(`Endpoints matched: ${report.summary.matchedEndpoints}`)
	console.log(`Breaking changes: ${report.summary.breakingChanges}`)
	console.log(`Warnings: ${report.summary.warnings}`)

	// ─── Example 2: List all drifts ──────────────────────────────────
	console.log('\n📜 Example 2: List Drifts')
	console.log('─'.repeat(40))

	for (const drift of report.drifts.slice(0, 5)) {
		const severity =
			drift.severity === 'breaking' ? '🔴' : drift.severity === 'warning' ? '🟡' : '🟢'
		console.log(`${severity} [${drift.type}] ${drift.message}`)
		if (drift.location) {
			console.log(`   Location: ${drift.location}`)
		}
	}

	// ─── Example 3: Export report ────────────────────────────────────
	console.log('\n📊 Example 3: Export Report')
	console.log('─'.repeat(40))

	// JSON format
	const jsonReport = await validator.exportReport('json')
	console.log(`JSON report length: ${jsonReport.length} chars`)

	// Markdown format
	const mdReport = await validator.exportReport('markdown')
	console.log(`Markdown report length: ${mdReport.length} chars`)

	console.log('\n✅ All examples completed!')
}

main().catch(console.error)
