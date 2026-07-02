/**
 * Parser tests
 */

import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
	extractEndpoints,
	normalizeSwagger2ToOpenAPI3,
	parseAndNormalizeSpec,
	parseSpecFile,
	resolveRefs,
} from '../src/parser'
import { detectSpecVersion } from '../src/types'

const fixturesDir = join(__dirname, 'fixtures/specs')

describe('Spec Parser', () => {
	describe('parseSpecFile', () => {
		it('should parse OpenAPI 3.0 YAML file', () => {
			const spec = parseSpecFile(join(fixturesDir, 'openapi3-petstore.yaml'))
			expect(spec).toBeDefined()
			expect('openapi' in spec).toBe(true)
			expect(detectSpecVersion(spec)).toBe('openapi3')
		})

		it('should parse Swagger 2.0 JSON file', () => {
			const spec = parseSpecFile(join(fixturesDir, 'swagger2-petstore.json'))
			expect(spec).toBeDefined()
			expect('swagger' in spec).toBe(true)
			expect(detectSpecVersion(spec)).toBe('swagger2')
		})
	})

	describe('normalizeSwagger2ToOpenAPI3', () => {
		it('should convert Swagger 2.0 to OpenAPI 3.0', () => {
			const swagger = parseSpecFile(join(fixturesDir, 'swagger2-petstore.json'))
			const openapi = normalizeSwagger2ToOpenAPI3(swagger as any)

			expect(openapi.openapi).toBe('3.0.0')
			expect(openapi.servers).toBeDefined()
			expect(openapi.servers?.[0].url).toBe('http://petstore.swagger.io/v1')
		})

		it('should convert body parameters to requestBody', () => {
			const swagger = parseSpecFile(join(fixturesDir, 'swagger2-petstore.json'))
			const openapi = normalizeSwagger2ToOpenAPI3(swagger as any)

			const postPets = openapi.paths['/pets']?.post
			expect(postPets?.requestBody).toBeDefined()
			expect(postPets?.requestBody?.content?.['application/json']).toBeDefined()
		})

		it('should convert definitions to components/schemas', () => {
			const swagger = parseSpecFile(join(fixturesDir, 'swagger2-petstore.json'))
			const openapi = normalizeSwagger2ToOpenAPI3(swagger as any)

			expect(openapi.components?.schemas).toBeDefined()
			expect(openapi.components?.schemas?.Pet).toBeDefined()
			expect(openapi.components?.schemas?.Error).toBeDefined()
		})
	})

	describe('resolveRefs', () => {
		it('should resolve $ref references', () => {
			const spec = parseSpecFile(join(fixturesDir, 'openapi3-petstore.yaml')) as any
			const resolved = resolveRefs(spec)

			// Check that $ref in responses is resolved
			const getPets = resolved.paths['/pets']?.get
			const response200 = getPets?.responses['200']
			expect(response200?.content?.['application/json']?.schema).toBeDefined()
			expect(response200?.content?.['application/json']?.schema.type).toBe('array')
		})
	})

	describe('extractEndpoints', () => {
		it('should extract all endpoints from spec', () => {
			const spec = parseSpecFile(join(fixturesDir, 'openapi3-petstore.yaml')) as any
			const endpoints = extractEndpoints(spec)

			expect(endpoints).toHaveLength(3)
			expect(endpoints.map(e => `${e.method} ${e.path}`).sort()).toEqual([
				'GET /pets',
				'GET /pets/{petId}',
				'POST /pets',
			])
		})

		it('should extract path parameters', () => {
			const spec = parseSpecFile(join(fixturesDir, 'openapi3-petstore.yaml')) as any
			const endpoints = extractEndpoints(spec)

			const getPetsById = endpoints.find(e => e.path === '/pets/{petId}')
			expect(getPetsById?.pathParams).toHaveLength(1)
			expect(getPetsById?.pathParams[0].name).toBe('petId')
			expect(getPetsById?.pathParams[0].required).toBe(true)
		})

		it('should extract query parameters', () => {
			const spec = parseSpecFile(join(fixturesDir, 'openapi3-petstore.yaml')) as any
			const endpoints = extractEndpoints(spec)

			const getPets = endpoints.find(e => e.path === '/pets' && e.method === 'GET')
			expect(getPets?.queryParams).toHaveLength(1)
			expect(getPets?.queryParams[0].name).toBe('limit')
			expect(getPets?.queryParams[0].required).toBe(false)
		})

		it('should extract request body', () => {
			const spec = parseSpecFile(join(fixturesDir, 'openapi3-petstore.yaml')) as any
			const endpoints = extractEndpoints(spec)

			const postPets = endpoints.find(e => e.path === '/pets' && e.method === 'POST')
			expect(postPets?.requestBody).toBeDefined()
			expect(postPets?.requestBody?.type).toBe('object')
		})

		it('should extract responses', () => {
			const spec = parseSpecFile(join(fixturesDir, 'openapi3-petstore.yaml')) as any
			const endpoints = extractEndpoints(spec)

			const getPets = endpoints.find(e => e.path === '/pets' && e.method === 'GET')
			expect(getPets?.responses).toHaveLength(2)
			expect(getPets?.responses.map(r => r.statusCode).sort()).toEqual(['200', 'default'])
		})
	})

	describe('parseAndNormalizeSpec', () => {
		it('should parse and normalize OpenAPI 3.0 spec', () => {
			const endpoints = parseAndNormalizeSpec(join(fixturesDir, 'openapi3-petstore.yaml'))

			expect(endpoints).toHaveLength(3)
			expect(endpoints[0].source).toBe('spec')
		})

		it('should parse and normalize Swagger 2.0 spec', () => {
			const endpoints = parseAndNormalizeSpec(join(fixturesDir, 'swagger2-petstore.json'))

			expect(endpoints).toHaveLength(3)
			expect(endpoints[0].source).toBe('spec')

			// Check that POST /pets has requestBody
			const postPets = endpoints.find(e => e.path === '/pets' && e.method === 'POST')
			expect(postPets?.requestBody).toBeDefined()
		})
	})
})
