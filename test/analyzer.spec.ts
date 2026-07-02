/**
 * Analyzer tests
 */

import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createAnalyzer, ExpressAnalyzer, getSupportedFrameworks } from '../src/analyzer'

const fixturesDir = join(__dirname, 'fixtures/apps/express-app')

describe('Express Analyzer', () => {
	describe('ExpressAnalyzer', () => {
		it('should extract endpoints from Express app', () => {
			const analyzer = new ExpressAnalyzer(fixturesDir)
			const endpoints = analyzer.analyze()

			expect(endpoints.length).toBeGreaterThan(0)
			expect(endpoints[0].source).toBe('code')
		})

		it('should extract all HTTP methods', () => {
			const analyzer = new ExpressAnalyzer(fixturesDir)
			const endpoints = analyzer.analyze()

			const methods = endpoints.map(e => e.method).sort()
			expect(methods).toContain('GET')
			expect(methods).toContain('POST')
			expect(methods).toContain('PUT')
			expect(methods).toContain('DELETE')
		})

		it('should normalize paths', () => {
			const analyzer = new ExpressAnalyzer(fixturesDir)
			const endpoints = analyzer.analyze()

			// /users/:id -> /users/{id}
			const userEndpoints = endpoints.filter(e => e.path.includes('{id}'))
			expect(userEndpoints.length).toBeGreaterThan(0)
		})

		it('should extract path parameters', () => {
			const analyzer = new ExpressAnalyzer(fixturesDir)
			const endpoints = analyzer.analyze()

			const endpointWithId = endpoints.find(e => e.path.includes('{id}'))
			expect(endpointWithId?.pathParams).toBeDefined()
			expect(endpointWithId?.pathParams.length).toBeGreaterThan(0)
			expect(endpointWithId?.pathParams[0].name).toBe('id')
			expect(endpointWithId?.pathParams[0].required).toBe(true)
		})

		it('should extract query parameters', () => {
			const analyzer = new ExpressAnalyzer(fixturesDir)
			const endpoints = analyzer.analyze()

			const endpointWithQuery = endpoints.find(e => e.path === '/users' && e.method === 'GET')
			expect(endpointWithQuery?.queryParams).toBeDefined()
			expect(endpointWithQuery?.queryParams.length).toBeGreaterThan(0)
			expect(endpointWithQuery?.queryParams.find(p => p.name === 'limit')).toBeDefined()
		})

		it('should extract request body', () => {
			const analyzer = new ExpressAnalyzer(fixturesDir)
			const endpoints = analyzer.analyze()

			const postEndpoint = endpoints.find(e => e.method === 'POST')
			expect(postEndpoint?.requestBody).toBeDefined()
			expect(postEndpoint?.requestBody?.type).toBe('object')
		})

		it('should extract responses', () => {
			const analyzer = new ExpressAnalyzer(fixturesDir)
			const endpoints = analyzer.analyze()

			// All endpoints should have at least one response
			for (const endpoint of endpoints) {
				expect(endpoint.responses.length).toBeGreaterThan(0)
			}

			// POST should have 201 response
			const postEndpoint = endpoints.find(e => e.method === 'POST')
			expect(postEndpoint?.responses.find(r => r.statusCode === '201')).toBeDefined()
		})

		it('should extract comments as summary', () => {
			const analyzer = new ExpressAnalyzer(fixturesDir)
			const endpoints = analyzer.analyze()

			const productEndpoints = endpoints.filter(e => e.path.includes('products'))
			expect(productEndpoints.length).toBeGreaterThan(0)

			const getProducts = productEndpoints.find(e => e.method === 'GET')
			expect(getProducts?.summary).toBeDefined()
		})

		it('should extract file path and line number', () => {
			const analyzer = new ExpressAnalyzer(fixturesDir)
			const endpoints = analyzer.analyze()

			for (const endpoint of endpoints) {
				expect(endpoint.filePath).toBeDefined()
				expect(endpoint.lineNumber).toBeGreaterThan(0)
			}
		})
	})

	describe('Analyzer Factory', () => {
		it('should create Express analyzer', () => {
			const analyzer = createAnalyzer('express', fixturesDir)
			expect(analyzer).toBeInstanceOf(ExpressAnalyzer)
		})

		it('should throw error for unsupported framework', () => {
			expect(() => createAnalyzer('unknown' as any, fixturesDir)).toThrow()
		})

		it('should register supported frameworks', () => {
			const frameworks = getSupportedFrameworks()
			expect(frameworks).toContain('express')
		})
	})
})
