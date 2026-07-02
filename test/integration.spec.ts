/**
 * Integration tests
 */

import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const fixturesDir = join(__dirname, 'fixtures')
const specFile = join(fixturesDir, 'specs/openapi3-petstore.yaml')
const codeDir = join(fixturesDir, 'apps/express-app')
const _cliPath = join(__dirname, '..', 'dist/cli.js')

describe('Programmatic API', () => {
	it('should validate contract programmatically', async () => {
		const { validateContract } = await import('../src/index')

		const result = validateContract(specFile, codeDir, 'express')

		expect(result.specEndpoints).toBeDefined()
		expect(result.codeEndpoints).toBeDefined()
		expect(result.drifts).toBeDefined()
		expect(result.specEndpoints.length).toBeGreaterThan(0)
		expect(result.codeEndpoints.length).toBeGreaterThan(0)
	})

	it('should detect drifts', async () => {
		const { detectDrifts } = await import('../src/detector')
		const { parseAndNormalizeSpec } = await import('../src/parser')
		const { createAnalyzer } = await import('../src/analyzer')

		const specEndpoints = parseAndNormalizeSpec(specFile)
		const analyzer = createAnalyzer('express', codeDir)
		const codeEndpoints = analyzer.analyze()
		const drifts = detectDrifts(specEndpoints, codeEndpoints)

		expect(Array.isArray(drifts)).toBe(true)
	})
})

describe('Reporter Integration', () => {
	it('should generate console report', async () => {
		const { createReporter } = await import('../src/reporter')
		const { detectDrifts } = await import('../src/detector')
		const { parseAndNormalizeSpec } = await import('../src/parser')
		const { createAnalyzer } = await import('../src/analyzer')

		const specEndpoints = parseAndNormalizeSpec(specFile)
		const analyzer = createAnalyzer('express', codeDir)
		const codeEndpoints = analyzer.analyze()
		const drifts = detectDrifts(specEndpoints, codeEndpoints)

		const reporter = createReporter({ format: 'console' })

		const report = {
			version: '0.1.0',
			timestamp: new Date().toISOString(),
			specFile,
			codeDirectory: codeDir,
			drifts,
			summary: {
				total: drifts.length,
				byType: {} as Record<string, number>,
				bySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
				criticalCount: 0,
				highCount: 0,
				mediumCount: 0,
				lowCount: 0,
			},
		}

		const output = reporter.generate(report)
		expect(output).toContain('API Contract Drift Report')
	})

	it('should generate JSON report', async () => {
		const { createReporter } = await import('../src/reporter')
		const { detectDrifts } = await import('../src/detector')
		const { parseAndNormalizeSpec } = await import('../src/parser')
		const { createAnalyzer } = await import('../src/analyzer')

		const specEndpoints = parseAndNormalizeSpec(specFile)
		const analyzer = createAnalyzer('express', codeDir)
		const codeEndpoints = analyzer.analyze()
		const drifts = detectDrifts(specEndpoints, codeEndpoints)

		const reporter = createReporter({ format: 'json' })

		const report = {
			version: '0.1.0',
			timestamp: new Date().toISOString(),
			specFile,
			codeDirectory: codeDir,
			drifts,
			summary: {
				total: drifts.length,
				byType: {} as Record<string, number>,
				bySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
				criticalCount: 0,
				highCount: 0,
				mediumCount: 0,
				lowCount: 0,
			},
		}

		const output = reporter.generate(report)
		expect(output).toContain('"version"')
		expect(output).toContain('"drifts"')

		// Verify it's valid JSON
		const parsed = JSON.parse(output)
		expect(parsed.version).toBe('0.1.0')
	})

	it('should generate Markdown report', async () => {
		const { createReporter } = await import('../src/reporter')
		const { detectDrifts } = await import('../src/detector')
		const { parseAndNormalizeSpec } = await import('../src/parser')
		const { createAnalyzer } = await import('../src/analyzer')

		const specEndpoints = parseAndNormalizeSpec(specFile)
		const analyzer = createAnalyzer('express', codeDir)
		const codeEndpoints = analyzer.analyze()
		const drifts = detectDrifts(specEndpoints, codeEndpoints)

		const reporter = createReporter({ format: 'markdown' })

		const report = {
			version: '0.1.0',
			timestamp: new Date().toISOString(),
			specFile,
			codeDirectory: codeDir,
			drifts,
			summary: {
				total: drifts.length,
				byType: {} as Record<string, number>,
				bySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
				criticalCount: 0,
				highCount: 0,
				mediumCount: 0,
				lowCount: 0,
			},
		}

		const output = reporter.generate(report)
		expect(output).toContain('# API Contract Drift Report')
		expect(output).toContain('**Generated**')
	})
})

describe('Drift Detection Integration', () => {
	it('should detect all drift types', async () => {
		const { detectDrifts } = await import('../src/detector')
		const { parseAndNormalizeSpec } = await import('../src/parser')
		const { createAnalyzer } = await import('../src/analyzer')

		const specEndpoints = parseAndNormalizeSpec(specFile)
		const analyzer = createAnalyzer('express', codeDir)
		const codeEndpoints = analyzer.analyze()
		const drifts = detectDrifts(specEndpoints, codeEndpoints)

		// Check drift structure
		for (const drift of drifts) {
			expect(drift.type).toBeDefined()
			expect(drift.severity).toBeDefined()
			expect(drift.method).toBeDefined()
			expect(drift.path).toBeDefined()
			expect(drift.message).toBeDefined()
		}
	})
})
