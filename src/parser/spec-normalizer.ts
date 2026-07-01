/**
 * Spec Parser - Parse and normalize OpenAPI specifications
 */

import type { NormalizedEndpoint, Param, Response, Schema } from '../types/endpoint'
import type {
	ApiSpec,
	HttpMethod,
	OpenAPI3Spec,
	OperationObject,
	ParameterObject,
	PathItemObject,
	SchemaObject,
	Swagger2Spec,
	SwaggerOperationObject,
} from '../types/spec'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as yaml from 'js-yaml'
import { detectSpecVersion } from '../types/spec'

// Parse spec file (JSON or YAML)
export function parseSpecFile(filePath: string): ApiSpec {
	const content = fs.readFileSync(filePath, 'utf-8')
	const ext = path.extname(filePath).toLowerCase()

	if (ext === '.json') {
		return JSON.parse(content)
	}

	// YAML files (.yaml, .yml)
	return yaml.load(content) as ApiSpec
}

// Normalize Swagger 2.0 to OpenAPI 3.0 format
export function normalizeSwagger2ToOpenAPI3(swagger: Swagger2Spec): OpenAPI3Spec {
	const openapi: OpenAPI3Spec = {
		openapi: '3.0.0',
		info: swagger.info,
		paths: {},
	}

	// Convert basePath to servers
	if (swagger.host || swagger.basePath) {
		const scheme = swagger.schemes?.[0] || 'https'
		const host = swagger.host || 'localhost'
		const basePath = swagger.basePath || ''
		openapi.servers = [
			{
				url: `${scheme}://${host}${basePath}`,
			},
		]
	}

	// Convert paths
	for (const [pathKey, pathItem] of Object.entries(swagger.paths)) {
		openapi.paths[pathKey] = normalizeSwagger2PathItem(pathItem)
	}

	// Convert definitions to components/schemas
	if (swagger.definitions) {
		openapi.components = {
			schemas: swagger.definitions,
		}
	}

	// Convert parameters
	if (swagger.parameters) {
		if (!openapi.components) openapi.components = {}
		openapi.components.parameters = swagger.parameters
	}

	// Convert responses
	if (swagger.responses) {
		if (!openapi.components) openapi.components = {}
		openapi.components.responses = swagger.responses
	}

	// Convert securityDefinitions
	if (swagger.securityDefinitions) {
		if (!openapi.components) openapi.components = {}
		openapi.components.securitySchemes = swagger.securityDefinitions
	}

	// Copy tags and externalDocs
	if (swagger.tags) openapi.tags = swagger.tags
	if (swagger.externalDocs) openapi.externalDocs = swagger.externalDocs

	return openapi
}

// Normalize Swagger 2.0 PathItem to OpenAPI 3.0 format
function normalizeSwagger2PathItem(swaggerPathItem: any): PathItemObject {
	const pathItem: PathItemObject = {}

	// Use lowercase methods for accessing swagger pathItem properties
	const lowercaseMethods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'] as const

	for (const method of lowercaseMethods) {
		const operation = swaggerPathItem[method]
		if (operation) {
			pathItem[method] = normalizeSwagger2Operation(operation)
		}
	}

	// Copy parameters
	if (swaggerPathItem.parameters) {
		pathItem.parameters = swaggerPathItem.parameters
	}

	return pathItem
}

// Normalize Swagger 2.0 Operation to OpenAPI 3.0 format
function normalizeSwagger2Operation(swaggerOp: SwaggerOperationObject): OperationObject {
	const operation: OperationObject = {
		responses: {},
	}

	// Copy basic fields
	if (swaggerOp.operationId) operation.operationId = swaggerOp.operationId
	if (swaggerOp.summary) operation.summary = swaggerOp.summary
	if (swaggerOp.description) operation.description = swaggerOp.description
	if (swaggerOp.tags) operation.tags = swaggerOp.tags
	if (swaggerOp.deprecated) operation.deprecated = swaggerOp.deprecated
	if (swaggerOp.externalDocs) operation.externalDocs = swaggerOp.externalDocs

	// Convert parameters - use type assertion to handle body parameter
	if (swaggerOp.parameters) {
		const params = swaggerOp.parameters as any[]
		operation.parameters = params.filter(p => p.in !== 'body')

		// Convert body parameter to requestBody
		const bodyParam = params.find(p => p.in === 'body')
		if (bodyParam) {
			operation.requestBody = {
				description: bodyParam.description,
				required: bodyParam.required,
				content: {
					'application/json': {
						schema: bodyParam.schema,
					},
				},
			}
		}
	}

	// Convert responses - use type assertion
	const responses = swaggerOp.responses as Record<string, any>
	for (const [code, response] of Object.entries(responses)) {
		operation.responses[code] = {
			description: response.description || '',
		}

		// Convert schema to content
		if (response.schema) {
			operation.responses[code].content = {
				'application/json': {
					schema: response.schema,
				},
			}
		}
	}

	return operation
}

// Resolve $ref references
export function resolveRefs(spec: OpenAPI3Spec): OpenAPI3Spec {
	const resolved = JSON.parse(JSON.stringify(spec))

	// Build reference map
	const refMap: Record<string, any> = {}

	if (resolved.components) {
		// Schemas
		if (resolved.components.schemas) {
			for (const [name, schema] of Object.entries(resolved.components.schemas)) {
				refMap[`#/components/schemas/${name}`] = schema
			}
		}

		// Parameters
		if (resolved.components.parameters) {
			for (const [name, param] of Object.entries(resolved.components.parameters)) {
				refMap[`#/components/parameters/${name}`] = param
			}
		}

		// Responses
		if (resolved.components.responses) {
			for (const [name, resp] of Object.entries(resolved.components.responses)) {
				refMap[`#/components/responses/${name}`] = resp
			}
		}

		// Request Bodies
		if (resolved.components.requestBodies) {
			for (const [name, rb] of Object.entries(resolved.components.requestBodies)) {
				refMap[`#/components/requestBodies/${name}`] = rb
			}
		}
	}

	// Resolve all refs recursively
	resolveRefsRecursive(resolved, refMap)

	return resolved
}

// Recursively resolve $ref
function resolveRefsRecursive(obj: any, refMap: Record<string, any>, depth = 0): void {
	if (depth > 10) return // Prevent infinite recursion

	if (obj && typeof obj === 'object') {
		if (obj.$ref) {
			const refValue = refMap[obj.$ref]
			if (refValue) {
				// Replace ref with actual value
				for (const key of Object.keys(obj)) {
					if (key !== '$ref') {
						delete obj[key]
					}
				}
				for (const [key, value] of Object.entries(refValue)) {
					obj[key] = value
				}
				// Continue resolving if the referenced object has refs
				resolveRefsRecursive(obj, refMap, depth + 1)
			}
		} else {
			// Process nested objects
			for (const value of Object.values(obj)) {
				resolveRefsRecursive(value, refMap, depth + 1)
			}
		}
	}
}

// Extract endpoints from spec
export function extractEndpoints(spec: OpenAPI3Spec): NormalizedEndpoint[] {
	const endpoints: NormalizedEndpoint[] = []

	for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
		// Use lowercase methods for accessing pathItem properties
		const lowercaseMethods = [
			'get',
			'post',
			'put',
			'delete',
			'patch',
			'head',
			'options',
		] as const

		for (const method of lowercaseMethods) {
			const operation = pathItem[method]
			if (operation) {
				// Convert method to uppercase for HttpMethod type
				const upperMethod = method.toUpperCase() as HttpMethod
				endpoints.push(extractEndpoint(pathKey, upperMethod, operation, pathItem))
			}
		}
	}

	return endpoints
}

// Extract single endpoint
function extractEndpoint(
	pathKey: string,
	method: HttpMethod,
	operation: OperationObject,
	pathItem: PathItemObject
): NormalizedEndpoint {
	// Extract parameters
	const allParams = [...(pathItem.parameters || []), ...(operation.parameters || [])]

	const pathParams: Param[] = []
	const queryParams: Param[] = []
	const requestHeaders: Param[] = []

	for (const param of allParams) {
		const normalizedParam = normalizeParameter(param)

		switch (param.in) {
			case 'path':
				pathParams.push(normalizedParam)
				break
			case 'query':
				queryParams.push(normalizedParam)
				break
			case 'header':
				requestHeaders.push(normalizedParam)
				break
		}
	}

	// Extract request body
	let requestBody: Schema | null = null
	if (operation.requestBody?.content) {
		const jsonContent = operation.requestBody.content['application/json']
		if (jsonContent?.schema) {
			requestBody = normalizeSchema(jsonContent.schema)
		}
	}

	// Extract responses
	const responses: Response[] = []
	for (const [code, resp] of Object.entries(operation.responses)) {
		const response: Response = {
			statusCode: code,
			description: resp.description,
		}

		if (resp.content?.['application/json']?.schema) {
			response.schema = normalizeSchema(resp.content['application/json'].schema)
		}

		responses.push(response)
	}

	return {
		method,
		path: pathKey,
		pathParams,
		queryParams,
		requestHeaders,
		requestBody,
		responses,
		tags: operation.tags || [],
		deprecated: operation.deprecated || false,
		operationId: operation.operationId,
		summary: operation.summary,
		description: operation.description,
		source: 'spec',
	}
}

// Normalize parameter
function normalizeParameter(param: ParameterObject): Param {
	return {
		name: param.name,
		type: param.schema?.type || 'string',
		required: param.required || false,
		description: param.description,
		format: param.schema?.format,
		enum: param.schema?.enum,
		in: param.in,
	}
}

// Normalize schema
function normalizeSchema(schema: SchemaObject): Schema {
	const normalized: Schema = {
		type: schema.type || 'object',
	}

	if (schema.properties) {
		normalized.properties = {}
		for (const [key, prop] of Object.entries(schema.properties)) {
			normalized.properties[key] = normalizeSchemaProperty(prop)
		}
	}

	if (schema.required) {
		normalized.required = schema.required
	}

	if (schema.items) {
		normalized.items = normalizeSchema(schema.items)
	}

	if (schema.additionalProperties !== undefined) {
		if (typeof schema.additionalProperties === 'boolean') {
			normalized.additionalProperties = schema.additionalProperties
		} else {
			normalized.additionalProperties = normalizeSchema(schema.additionalProperties)
		}
	}

	if (schema.description) {
		normalized.description = schema.description
	}

	return normalized
}

// Normalize schema property
function normalizeSchemaProperty(schema: SchemaObject): any {
	return {
		type: schema.type || 'string',
		format: schema.format,
		nullable: schema.nullable,
		enum: schema.enum,
		description: schema.description,
	}
}

// Parse and normalize spec
export function parseAndNormalizeSpec(filePath: string): NormalizedEndpoint[] {
	const spec = parseSpecFile(filePath)
	const version = detectSpecVersion(spec)

	let openapiSpec: OpenAPI3Spec

	if (version === 'swagger2') {
		openapiSpec = normalizeSwagger2ToOpenAPI3(spec as Swagger2Spec)
	} else {
		openapiSpec = spec as OpenAPI3Spec
	}

	// Resolve references
	const resolvedSpec = resolveRefs(openapiSpec)

	// Extract endpoints
	return extractEndpoints(resolvedSpec)
}
