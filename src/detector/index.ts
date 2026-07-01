/**
 * Drift Detector - Detect contract drift
 */

import type { DriftResult } from '../types/drift'
import type { NormalizedEndpoint, Schema, SchemaProperty } from '../types/endpoint'
import type { HttpMethod } from '../types/spec'
import { createDrift } from '../types/drift'
import { matchEndpoints } from './endpoint-matcher'

export function detectDrifts(
	specEndpoints: NormalizedEndpoint[],
	codeEndpoints: NormalizedEndpoint[]
): DriftResult[] {
	const drifts: DriftResult[] = []
	const matches = matchEndpoints(specEndpoints, codeEndpoints)

	for (const match of matches) {
		// Missing endpoint: code has but spec doesn't
		if (!match.specEndpoint && match.codeEndpoint) {
			drifts.push(
				createDrift(
					'missing-endpoint',
					match.codeEndpoint.method,
					match.codeEndpoint.path,
					{ endpoint: match.codeEndpoint }
				)
			)
			continue
		}

		// Phantom endpoint: spec has but code doesn't
		if (match.specEndpoint && !match.codeEndpoint) {
			// Check if deprecated - if so, it's deprecated-not-removed instead
			if (match.specEndpoint.deprecated) {
				drifts.push(
					createDrift(
						'deprecated-not-removed',
						match.specEndpoint.method,
						match.specEndpoint.path,
						{ endpoint: match.specEndpoint }
					)
				)
			} else {
				drifts.push(
					createDrift(
						'phantom-endpoint',
						match.specEndpoint.method,
						match.specEndpoint.path,
						{ endpoint: match.specEndpoint }
					)
				)
			}
			continue
		}

		// Both exist - deep comparison
		if (match.specEndpoint && match.codeEndpoint) {
			const spec = match.specEndpoint
			const code = match.codeEndpoint

			// Compare request body schemas
			if (spec.requestBody || code.requestBody) {
				drifts.push(
					...compareSchemas(
						spec.requestBody,
						code.requestBody,
						spec.method,
						spec.path,
						'request'
					)
				)
			}

			// Compare responses
			drifts.push(...compareResponses(spec.responses, code.responses, spec.method, spec.path))

			// Check deprecated status
			if (spec.deprecated && !code.deprecated) {
				drifts.push(
					createDrift(
						'deprecated-not-removed',
						spec.method,
						spec.path,
						{ endpoint: spec },
						['Remove deprecated endpoint from spec or mark as deprecated in code']
					)
				)
			}
		}
	}

	return drifts
}

/**
 * Compare two schemas and generate drifts
 */
function compareSchemas(
	specSchema: Schema | null,
	codeSchema: Schema | null,
	method: HttpMethod,
	path: string,
	location: 'request' | 'response'
): DriftResult[] {
	const drifts: DriftResult[] = []

	if (!specSchema && !codeSchema) return drifts

	// Schema missing entirely
	if (!specSchema && codeSchema) {
		drifts.push(
			createDrift('missing-field', method, path, {
				fieldName: `${location}Body`,
				codeType: codeSchema.type,
			})
		)
		return drifts
	}

	if (specSchema && !codeSchema) {
		drifts.push(
			createDrift('extra-field', method, path, {
				fieldName: `${location}Body`,
				specType: specSchema.type,
			})
		)
		return drifts
	}

	// Type mismatch
	if (specSchema!.type !== codeSchema!.type) {
		drifts.push(
			createDrift('type-mismatch', method, path, {
				fieldName: `${location}Body`,
				specType: specSchema!.type,
				codeType: codeSchema!.type,
			})
		)
	}

	// Compare properties for object types
	if (specSchema!.type === 'object' && codeSchema!.type === 'object') {
		drifts.push(...compareProperties(specSchema!, codeSchema!, method, path))
	}

	// Compare required arrays
	drifts.push(...compareRequired(specSchema!, codeSchema!, method, path))

	return drifts
}

/**
 * Compare schema properties
 */
function compareProperties(
	specSchema: Schema,
	codeSchema: Schema,
	method: HttpMethod,
	path: string
): DriftResult[] {
	const drifts: DriftResult[] = []
	const specProps = specSchema.properties || {}
	const codeProps = codeSchema.properties || {}

	// Missing fields (code has but spec doesn't)
	for (const [name, prop] of Object.entries(codeProps)) {
		if (!specProps[name]) {
			drifts.push(
				createDrift('missing-field', method, path, {
					fieldName: name,
					codeType: (prop as SchemaProperty).type,
				})
			)
		}
	}

	// Extra fields (spec has but code doesn't)
	for (const [name, prop] of Object.entries(specProps)) {
		if (!codeProps[name]) {
			drifts.push(
				createDrift('extra-field', method, path, {
					fieldName: name,
					specType: (prop as SchemaProperty).type,
				})
			)
		}
	}

	// Type mismatch for common fields
	for (const [name] of Object.entries(specProps)) {
		if (codeProps[name]) {
			const specProp = specProps[name] as SchemaProperty
			const codeProp = codeProps[name] as SchemaProperty

			if (specProp.type !== codeProp.type) {
				drifts.push(
					createDrift('type-mismatch', method, path, {
						fieldName: name,
						specType: specProp.type,
						codeType: codeProp.type,
					})
				)
			}
		}
	}

	return drifts
}

/**
 * Compare required arrays
 */
function compareRequired(
	specSchema: Schema,
	codeSchema: Schema,
	method: HttpMethod,
	path: string
): DriftResult[] {
	const drifts: DriftResult[] = []
	const specRequired = new Set(specSchema.required || [])
	const codeRequired = new Set(codeSchema.required || [])

	// Check each field's required status
	const allFields = new Set([...specRequired, ...codeRequired])
	for (const field of allFields) {
		const specReq = specRequired.has(field)
		const codeReq = codeRequired.has(field)

		if (specReq !== codeReq) {
			drifts.push(
				createDrift('required-mismatch', method, path, {
					fieldName: field,
					specRequired: specReq,
					codeRequired: codeReq,
				})
			)
		}
	}

	return drifts
}

/**
 * Compare responses
 */
function compareResponses(
	specResponses: NormalizedEndpoint['responses'],
	codeResponses: NormalizedEndpoint['responses'],
	method: HttpMethod,
	path: string
): DriftResult[] {
	const drifts: DriftResult[] = []
	const specCodes = new Set(specResponses.map(r => r.statusCode))
	const codeCodes = new Set(codeResponses.map(r => r.statusCode))

	// Response code mismatch
	for (const code of specCodes) {
		if (!codeCodes.has(code)) {
			drifts.push(
				createDrift('response-code-mismatch', method, path, {
					specStatusCode: code,
					codeStatusCode: 'N/A',
				})
			)
		}
	}

	for (const code of codeCodes) {
		if (!specCodes.has(code)) {
			drifts.push(
				createDrift('response-code-mismatch', method, path, {
					specStatusCode: 'N/A',
					codeStatusCode: code,
				})
			)
		}
	}

	// Compare response schemas for matching status codes
	for (const specResp of specResponses) {
		const codeResp = codeResponses.find(r => r.statusCode === specResp.statusCode)
		if (codeResp && specResp.schema && codeResp.schema) {
			drifts.push(
				...compareSchemas(specResp.schema, codeResp.schema, method, path, 'response')
			)
		}
	}

	return drifts
}
