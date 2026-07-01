/**
 * Unified Endpoint Model
 * Normalized representation from both Spec and Code
 */

import type { HttpMethod } from './spec'

// Parameter representation
export interface Param {
	name: string
	type: string
	required: boolean
	description?: string
	format?: string
	enum?: string[]
	default?: any
	in?: 'path' | 'query' | 'header' | 'cookie' | 'body'
}

// Schema representation
export interface Schema {
	type: string
	properties?: Record<string, SchemaProperty>
	required?: string[]
	items?: Schema
	additionalProperties?: Schema | boolean
	description?: string
}

// Schema property
export interface SchemaProperty {
	type: string
	format?: string
	nullable?: boolean
	enum?: string[]
	description?: string
	default?: any
	required?: boolean
}

// Response representation
export interface Response {
	statusCode: string
	description?: string
	schema?: Schema
	headers?: Record<string, Param>
}

// Normalized Endpoint (unified model)
export interface NormalizedEndpoint {
	method: HttpMethod
	path: string // Normalized to /users/{id} format
	pathParams: Param[]
	queryParams: Param[]
	requestHeaders: Param[]
	requestBody: Schema | null
	responses: Response[]
	tags: string[]
	deprecated: boolean
	operationId?: string
	summary?: string
	description?: string
	source: 'spec' | 'code'
	filePath?: string // Source file path (for code source)
	lineNumber?: number // Source line number (for code source)
}

// Endpoint match result
export interface EndpointMatch {
	specEndpoint: NormalizedEndpoint | null
	codeEndpoint: NormalizedEndpoint | null
	matchType: 'exact' | 'parameterized' | 'fuzzy' | 'none'
	similarity?: number // For fuzzy matches
}

// Path normalization utilities
export function normalizePath(path: string): string {
	// Convert Express/Fastify style to OpenAPI style
	// /users/:id -> /users/{id}
	// /files/* -> /files/{path}
	return path.replace(/:([^/]+)/g, '{$1}').replace(/\*/g, '{path}')
}

export function denormalizePath(path: string): string {
	// Convert OpenAPI style to Express/Fastify style
	// /users/{id} -> /users/:id
	return path.replace(/\{([^}]+)\}/g, ':$1')
}
