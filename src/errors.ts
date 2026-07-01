/**
 * Structured error classes for API Contract Validator
 */

/** Error thrown when spec parsing fails */
export class SpecParseError extends Error {
	/** The spec file path */
	readonly specPath: string
	/** The spec format (openapi3, swagger2, etc.) */
	readonly format: string | undefined
	/** The raw input that failed to parse */
	readonly rawInput: string | undefined

	constructor(options: {
		specPath: string
		format?: string
		rawInput?: string
		message?: string
		cause?: Error
	}) {
		const msg = options.message ?? `Failed to parse spec: ${options.specPath}`
		super(msg)
		this.name = 'SpecParseError'
		this.specPath = options.specPath
		this.format = options.format
		this.rawInput = options.rawInput
		if (options.cause && Error.captureStackTrace) {
			Error.captureStackTrace(this, SpecParseError)
		}
	}
}

/** Error thrown when code analysis fails */
export class CodeAnalysisError extends Error {
	/** The file path that failed analysis */
	readonly filePath: string
	/** The framework being analyzed */
	readonly framework: string

	constructor(options: { filePath: string; framework: string; message?: string; cause?: Error }) {
		const msg =
			options.message ?? `Failed to analyze ${options.framework} code: ${options.filePath}`
		super(msg)
		this.name = 'CodeAnalysisError'
		this.filePath = options.filePath
		this.framework = options.framework
		if (options.cause && Error.captureStackTrace) {
			Error.captureStackTrace(this, CodeAnalysisError)
		}
	}
}

/** Error thrown when endpoint matching fails */
export class EndpointMatchError extends Error {
	/** The spec endpoint that couldn't be matched */
	readonly specEndpoint: string
	/** The reason for the failure */
	readonly reason: string

	constructor(options: { specEndpoint: string; reason: string; message?: string }) {
		const msg =
			options.message ??
			`Failed to match endpoint: ${options.specEndpoint} (${options.reason})`
		super(msg)
		this.name = 'EndpointMatchError'
		this.specEndpoint = options.specEndpoint
		this.reason = options.reason
	}
}

/** Error thrown when schema comparison fails */
export class SchemaComparisonError extends Error {
	/** The schema path being compared */
	readonly schemaPath: string
	/** The comparison type */
	readonly comparisonType: string

	constructor(options: {
		schemaPath: string
		comparisonType: string
		message?: string
		cause?: Error
	}) {
		const msg = options.message ?? `Schema comparison failed at ${options.schemaPath}`
		super(msg)
		this.name = 'SchemaComparisonError'
		this.schemaPath = options.schemaPath
		this.comparisonType = options.comparisonType
		if (options.cause && Error.captureStackTrace) {
			Error.captureStackTrace(this, SchemaComparisonError)
		}
	}
}
