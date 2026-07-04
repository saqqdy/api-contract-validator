/**
 * Skill commands demo for OpenAPI Drift Guard
 *
 * Demonstrates the commands available in the Claude Code Skill.
 * Run with: npx tsx examples/skill-commands.ts
 */

import { Validator } from '../src/index'
import { formatDriftReport } from '../src/utils/format'

/**
 * Simulates the `/validate` command
 */
async function validateCommand(specPath: string, codePath: string) {
	console.log(`\n🔍 /validate ${specPath} ${codePath}`)
	console.log('='.repeat(50))

	const validator = new Validator({
		specPath,
		codePath,
		framework: 'express',
	})

	const report = await validator.validate()

	console.log(`\n📊 验证结果：`)
	console.log(`   端点总数: ${report.summary.totalEndpoints}`)
	console.log(`   匹配端点: ${report.summary.matchedEndpoints}`)
	console.log(`   破坏性变更: ${report.summary.breakingChanges}`)
	console.log(`   警告: ${report.summary.warnings}`)

	if (report.summary.breakingChanges > 0) {
		console.log('\n🔴 发现破坏性变更！')
		for (const drift of report.drifts.filter(d => d.severity === 'breaking')) {
			console.log(`   - ${drift.type}: ${drift.message}`)
		}
	} else {
		console.log('\n✅ 未发现破坏性变更')
	}
}

/**
 * Simulates the `/drift-report` command
 */
async function driftReportCommand(specPath: string, codePath: string) {
	console.log(`\n📄 /drift-report ${specPath} ${codePath}`)
	console.log('='.repeat(50))

	const validator = new Validator({
		specPath,
		codePath,
		framework: 'express',
	})

	const report = await validator.validate()
	const markdown = formatDriftReport(report)

	console.log('\n' + markdown)
}

/**
 * Simulates the `/check-endpoint` command
 */
async function checkEndpointCommand(method: string, path: string) {
	console.log(`\n🔎 /check-endpoint ${method} ${path}`)
	console.log('='.repeat(50))

	const validator = new Validator({
		specPath: './test/fixtures/specs/openapi3-petstore.yaml',
		codePath: './test/fixtures/apps/express-app',
		framework: 'express',
	})

	const report = await validator.validate()
	const endpointDrifts = report.drifts.filter(
		d =>
			d.endpoint &&
			d.endpoint.method.toLowerCase() === method.toLowerCase() &&
			d.endpoint.path === path
	)

	if (endpointDrifts.length === 0) {
		console.log(`\n✅ 端点 ${method.toUpperCase()} ${path} 未发现漂移`)
	} else {
		console.log(`\n⚠️  端点 ${method.toUpperCase()} ${path} 存在问题：`)
		for (const drift of endpointDrifts) {
			console.log(`   - ${drift.type}: ${drift.message}`)
		}
	}
}

// ─── Run demos ────────────────────────────────────────────────────────

async function main() {
	console.log('🎯 OpenAPI Drift Guard — Skill Commands Demo\n')

	await validateCommand(
		'./test/fixtures/specs/openapi3-petstore.yaml',
		'./test/fixtures/apps/express-app'
	)

	await driftReportCommand(
		'./test/fixtures/specs/openapi3-petstore.yaml',
		'./test/fixtures/apps/express-app'
	)

	await checkEndpointCommand('GET', '/pets')

	console.log('\n✅ 演示完成!')
	console.log('\n💡 安装 skill 后可用：/validate, /drift-report, /check-endpoint')
}

main().catch(console.error)
