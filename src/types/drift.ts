/**
 * Drift Detection Result Types
 */

import type { NormalizedEndpoint, Param, SchemaProperty } from './endpoint'
import type { HttpMethod } from './spec'

// Drift types
export type DriftType =
	| 'missing-endpoint' // Code has but spec doesn't
	| 'phantom-endpoint' // Spec has but code doesn't
	| 'type-mismatch' // Field type inconsistent
	| 'missing-field' // Implementation has but spec doesn't
	| 'extra-field' // Spec has but implementation doesn't
	| 'required-mismatch' // Required/optional status inconsistent
	| 'response-code-mismatch' // HTTP status code inconsistent
	| 'deprecated-not-removed' // Deprecated but still in use

// Severity levels
export type Severity = 'critical' | 'high' | 'medium' | 'low'

// Drift result
export interface DriftResult {
	type: DriftType
	severity: Severity
	method: HttpMethod
	path: string
	message: string
	details: DriftDetails
	suggestions?: string[]
	location?: {
		spec?: { path?: string; line?: number }
		code?: { path?: string; line?: number }
	}
}

// Detailed drift information
export interface DriftDetails {
	// For endpoint drifts
	endpoint?: NormalizedEndpoint

	// For field drifts
	fieldName?: string
	specType?: string
	codeType?: string
	specRequired?: boolean
	codeRequired?: boolean

	// For response code drifts
	specStatusCode?: string
	codeStatusCode?: string

	// For schema drifts
	specProperty?: SchemaProperty
	codeProperty?: SchemaProperty

	// For parameter drifts
	param?: Param
}

// Drift report
export interface DriftReport {
	version: string
	timestamp: string
	specFile: string
	codeDirectory: string
	drifts: DriftResult[]
	summary: DriftSummary
}

// Drift summary statistics
export interface DriftSummary {
	total: number
	byType: Record<DriftType, number>
	bySeverity: Record<Severity, number>
	criticalCount: number
	highCount: number
	mediumCount: number
	lowCount: number
}

// Severity evaluation function
export function evaluateSeverity(driftType: DriftType): Severity {
	const severityMap: Record<DriftType, Severity> = {
		'missing-endpoint': 'critical',
		'phantom-endpoint': 'critical',
		'type-mismatch': 'critical',
		'missing-field': 'critical',
		'extra-field': 'medium',
		'required-mismatch': 'high',
		'response-code-mismatch': 'low',
		'deprecated-not-removed': 'low',
	}
	return severityMap[driftType]
}

// Create drift result helper
export function createDrift(
	type: DriftType,
	method: HttpMethod,
	path: string,
	details: DriftDetails,
	suggestions?: string[]
): DriftResult {
	return {
		type,
		severity: evaluateSeverity(type),
		method,
		path,
		message: generateDriftMessage(type, method, path, details),
		details,
		suggestions,
	}
}

// Generate drift message
function generateDriftMessage(
	type: DriftType,
	method: HttpMethod,
	path: string,
	details: DriftDetails
): string {
	switch (type) {
		case 'missing-endpoint':
			return `Endpoint ${method} ${path} exists in code but not documented in spec`
		case 'phantom-endpoint':
			return `Endpoint ${method} ${path} documented in spec but not found in code`
		case 'type-mismatch':
			return `Field "${details.fieldName}" type mismatch: spec="${details.specType}", code="${details.codeType}"`
		case 'missing-field':
			return `Field "${details.fieldName}" exists in code but not documented in spec`
		case 'extra-field':
			return `Field "${details.fieldName}" documented in spec but not found in code`
		case 'required-mismatch':
			return `Field "${details.fieldName}" required status mismatch: spec=${details.specRequired}, code=${details.codeRequired}`
		case 'response-code-mismatch':
			return `Response code mismatch: spec="${details.specStatusCode}", code="${details.codeStatusCode}"`
		case 'deprecated-not-removed':
			return `Endpoint ${method} ${path} marked as deprecated but still in use`
		default:
			return `Unknown drift type: ${type}`
	}
}
