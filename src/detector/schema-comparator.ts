/**
 * Schema Comparator - Compare schemas for differences
 */

import type { Schema } from '../types/endpoint'

export interface SchemaDiff {
	type: string
	fieldName?: string
	specType?: string
	codeType?: string
}

export function compareSchemas(spec: Schema | null, code: Schema | null): SchemaDiff[] {
	const diffs: SchemaDiff[] = []

	if (!spec && !code) return diffs
	if (!spec || !code) {
		diffs.push({ type: 'schema-missing', specType: spec?.type, codeType: code?.type })
		return diffs
	}

	if (spec.type !== code.type) {
		diffs.push({ type: 'type-mismatch', specType: spec.type, codeType: code.type })
	}

	return diffs
}
