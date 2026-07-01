/**
 * Endpoint Matcher - Match endpoints between spec and code
 */

import type { EndpointMatch, NormalizedEndpoint } from '../types/endpoint'

/**
 * Match endpoints between spec and code
 */
export function matchEndpoints(
	specEndpoints: NormalizedEndpoint[],
	codeEndpoints: NormalizedEndpoint[]
): EndpointMatch[] {
	const matches: EndpointMatch[] = []
	const matchedSpec = new Set<string>()
	const matchedCode = new Set<string>()

	// Find exact matches first
	for (const spec of specEndpoints) {
		for (const code of codeEndpoints) {
			if (spec.method === code.method && spec.path === code.path) {
				matches.push({
					specEndpoint: spec,
					codeEndpoint: code,
					matchType: 'exact',
				})
				matchedSpec.add(`${spec.method} ${spec.path}`)
				matchedCode.add(`${code.method} ${code.path}`)
				break
			}
		}
	}

	// Phantom endpoints (spec has but code doesn't)
	for (const spec of specEndpoints) {
		if (!matchedSpec.has(`${spec.method} ${spec.path}`)) {
			matches.push({
				specEndpoint: spec,
				codeEndpoint: null,
				matchType: 'none',
			})
		}
	}

	// Missing endpoints (code has but spec doesn't)
	for (const code of codeEndpoints) {
		if (!matchedCode.has(`${code.method} ${code.path}`)) {
			matches.push({
				specEndpoint: null,
				codeEndpoint: code,
				matchType: 'none',
			})
		}
	}

	return matches
}
