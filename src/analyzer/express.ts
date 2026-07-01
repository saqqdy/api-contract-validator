/**
 * Express Analyzer - Extract endpoints from Express.js source code
 */

import type { NormalizedEndpoint, Param, Response, Schema } from '../types/endpoint'
import type { HttpMethod } from '../types/spec'
import { normalizePath } from '../types/endpoint'
import { BaseAnalyzer, registerAnalyzer } from './base-analyzer'

/**
 * Express.js route analyzer
 */
export class ExpressAnalyzer extends BaseAnalyzer {
	constructor(sourceDir: string) {
		super('express', sourceDir)
	}

	/**
	 * Extract endpoints from Express code
	 */
	extractEndpoints(): NormalizedEndpoint[] {
		const endpoints: NormalizedEndpoint[] = []

		for (const file of this.files) {
			const content = this.readFile(file)
			const fileEndpoints = this.parseFile(content, file)
			endpoints.push(...fileEndpoints)
		}

		return endpoints
	}

	/**
	 * Parse single file for routes
	 */
	private parseFile(content: string, filePath: string): NormalizedEndpoint[] {
		const endpoints: NormalizedEndpoint[] = []
		const lines = content.split('\n')

		// Pattern for app.METHOD(path, ...) and router.METHOD(path, ...)
		const routePattern =
			/(?:app|router)\.(get|post|put|delete|patch|head|options)\s*\(\s*['"`]([^'"`]+)['"`]/gi

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i]
			const matches = [...line.matchAll(routePattern)]

			for (const match of matches) {
				const method = match[1].toUpperCase() as HttpMethod
				const path = normalizePath(match[2]) // /users/:id -> /users/{id}

				// Extract line number
				const lineNumber = i + 1

				// Try to extract parameters from the route handler
				const params = this.extractParameters(lines, i)
				const requestBody = this.extractRequestBody(lines, i)
				const responses = this.extractResponses(lines, i)

				endpoints.push({
					method,
					path,
					pathParams: params.pathParams,
					queryParams: params.queryParams,
					requestHeaders: [],
					requestBody,
					responses,
					tags: [],
					deprecated: false,
					summary: this.extractSummary(lines, i),
					source: 'code',
					filePath,
					lineNumber,
				})
			}
		}

		return endpoints
	}

	/**
	 * Extract parameters from route handler
	 */
	private extractParameters(
		lines: string[],
		startIndex: number
	): {
		pathParams: Param[]
		queryParams: Param[]
	} {
		const pathParams: Param[] = []
		const queryParams: Param[] = []

		// Look for req.params usage in the next ~20 lines
		for (let i = startIndex; i < Math.min(startIndex + 20, lines.length); i++) {
			const line = lines[i]

			// req.params.id -> path parameter
			const pathMatch = line.match(/req\.params\.([a-zA-Z_]\w*)/g)
			if (pathMatch) {
				for (const param of pathMatch) {
					const name = param.replace('req.params.', '')
					if (!pathParams.find(p => p.name === name)) {
						pathParams.push({
							name,
							type: 'string',
							required: true,
							in: 'path',
						})
					}
				}
			}

			// req.query.limit -> query parameter
			const queryMatch = line.match(/req\.query\.([a-zA-Z_]\w*)/g)
			if (queryMatch) {
				for (const param of queryMatch) {
					const name = param.replace('req.query.', '')
					if (!queryParams.find(p => p.name === name)) {
						queryParams.push({
							name,
							type: 'string',
							required: false,
							in: 'query',
						})
					}
				}
			}
		}

		return { pathParams, queryParams }
	}

	/**
	 * Extract request body schema
	 */
	private extractRequestBody(lines: string[], startIndex: number): Schema | null {
		// Look for req.body usage
		for (let i = startIndex; i < Math.min(startIndex + 30, lines.length); i++) {
			const line = lines[i]

			// req.body.field -> indicates request body
			if (line.includes('req.body')) {
				// For Phase 2, just return a basic object schema
				// Phase 5+ will add deeper analysis with Joi/Zod
				return {
					type: 'object',
				}
			}
		}

		return null
	}

	/**
	 * Extract response structure
	 */
	private extractResponses(lines: string[], startIndex: number): Response[] {
		const responses: Response[] = []

		// Look for res.status() or res.json() calls
		for (let i = startIndex; i < Math.min(startIndex + 30, lines.length); i++) {
			const line = lines[i]

			// res.status(200) or res.json({ ... })
			const statusMatch = line.match(/res\.status\s*\(\s*(\d+)\s*\)/)
			if (statusMatch) {
				const statusCode = statusMatch[1]
				if (!responses.find(r => r.statusCode === statusCode)) {
					responses.push({
						statusCode,
						description: 'Success response',
					})
				}
			}

			// res.json() without explicit status -> 200
			if (line.includes('res.json') && !responses.find(r => r.statusCode === '200')) {
				responses.push({
					statusCode: '200',
					description: 'Success response',
				})
			}

			// res.send() -> 200
			if (line.includes('res.send') && !responses.find(r => r.statusCode === '200')) {
				responses.push({
					statusCode: '200',
					description: 'Success response',
				})
			}
		}

		// Default response if none found
		if (responses.length === 0) {
			responses.push({
				statusCode: '200',
				description: 'Default response',
			})
		}

		return responses
	}

	/**
	 * Extract summary/comment from route
	 */
	private extractSummary(lines: string[], startIndex: number): string | undefined {
		// Look for comment above the route definition
		for (let i = startIndex - 1; i >= Math.max(0, startIndex - 5); i--) {
			const line = lines[i].trim()

			// // Comment or /* Comment */
			if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
				return line
					.replace(/^\/\/\s*/, '')
					.replace(/^\/?\*\s*/, '')
					.replace(/\s*\*\/$/, '')
					.trim()
			}

			// Empty line - stop looking
			if (line === '' && i < startIndex - 1) {
				break
			}
		}

		return undefined
	}
}

// Auto-register Express analyzer
registerAnalyzer('express', sourceDir => new ExpressAnalyzer(sourceDir))
