/**
 * OpenAPI Drift Guard
 * Main entry point
 */

import type { DriftResult } from './types/drift'
import type { NormalizedEndpoint } from './types/endpoint'
import { createAnalyzer } from './analyzer'
import { detectDrifts } from './detector'
import { parseAndNormalizeSpec } from './parser'

export * from './analyzer'
export * from './detector'
export * from './parser'
export * from './reporter'
export * from './types'

/**
 * Validate API contract
 * @param specFile - OpenAPI/Swagger spec file path
 * @param codeDirectory - Source code directory
 * @param framework - Framework to analyze (default: express)
 * @returns Normalized endpoints from spec and code, plus drifts
 */
export function validateContract(
	specFile: string,
	codeDirectory: string,
	framework: 'express' | 'fastify' | 'koa' | 'nestjs' = 'express'
): {
	specEndpoints: NormalizedEndpoint[]
	codeEndpoints: NormalizedEndpoint[]
	drifts: DriftResult[]
} {
	const specEndpoints = parseAndNormalizeSpec(specFile)
	const analyzer = createAnalyzer(framework, codeDirectory)
	const codeEndpoints = analyzer.analyze()
	const drifts = detectDrifts(specEndpoints, codeEndpoints)

	return {
		specEndpoints,
		codeEndpoints,
		drifts,
	}
}
