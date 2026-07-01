/**
 * OpenAPI Specification Types
 * Supports OpenAPI 2.0 (Swagger) and OpenAPI 3.x
 */

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

// OpenAPI 3.x Types
export interface OpenAPI3Spec {
	openapi: string
	info: InfoObject
	servers?: ServerObject[]
	paths: Record<string, PathItemObject>
	components?: ComponentsObject
	tags?: TagObject[]
	externalDocs?: ExternalDocsObject
}

export interface InfoObject {
	title: string
	description?: string
	version: string
	contact?: ContactObject
	license?: LicenseObject
}

export interface ServerObject {
	url: string
	description?: string
	variables?: Record<string, ServerVariableObject>
}

export interface PathItemObject {
	$ref?: string
	summary?: string
	description?: string
	get?: OperationObject
	post?: OperationObject
	put?: OperationObject
	delete?: OperationObject
	patch?: OperationObject
	head?: OperationObject
	options?: OperationObject
	servers?: ServerObject[]
	parameters?: ParameterObject[]
}

export interface OperationObject {
	operationId?: string
	summary?: string
	description?: string
	externalDocs?: ExternalDocsObject
	tags?: string[]
	parameters?: ParameterObject[]
	requestBody?: RequestBodyObject
	responses: Record<string, ResponseObject>
	deprecated?: boolean
	security?: SecurityRequirementObject[]
	servers?: ServerObject[]
}

export interface ParameterObject {
	name: string
	in: 'query' | 'header' | 'path' | 'cookie'
	description?: string
	required?: boolean
	deprecated?: boolean
	schema?: SchemaObject
	example?: any
	examples?: Record<string, ExampleObject>
}

export interface RequestBodyObject {
	description?: string
	content: Record<string, MediaTypeObject>
	required?: boolean
}

export interface MediaTypeObject {
	schema?: SchemaObject
	example?: any
	examples?: Record<string, ExampleObject>
	encoding?: Record<string, EncodingObject>
}

export interface ResponseObject {
	description: string
	headers?: Record<string, HeaderObject>
	content?: Record<string, MediaTypeObject>
	links?: Record<string, LinkObject>
}

export interface HeaderObject {
	description?: string
	required?: boolean
	deprecated?: boolean
	schema?: SchemaObject
}

export interface SchemaObject {
	type?: string
	title?: string
	description?: string
	properties?: Record<string, SchemaObject>
	required?: string[]
	items?: SchemaObject
	allOf?: SchemaObject[]
	oneOf?: SchemaObject[]
	anyOf?: SchemaObject[]
	not?: SchemaObject
	additionalProperties?: SchemaObject | boolean
	enum?: string[]
	format?: string
	default?: any
	nullable?: boolean
	readOnly?: boolean
	writeOnly?: boolean
	example?: any
	externalDocs?: ExternalDocsObject
	deprecated?: boolean
	$ref?: string
}

export interface ComponentsObject {
	schemas?: Record<string, SchemaObject>
	responses?: Record<string, ResponseObject>
	parameters?: Record<string, ParameterObject>
	examples?: Record<string, ExampleObject>
	requestBodies?: Record<string, RequestBodyObject>
	headers?: Record<string, HeaderObject>
	securitySchemes?: Record<string, SecuritySchemeObject>
	links?: Record<string, LinkObject>
	callbacks?: Record<string, CallbackObject>
}

export interface TagObject {
	name: string
	description?: string
	externalDocs?: ExternalDocsObject
}

export interface ExternalDocsObject {
	url: string
	description?: string
}

export interface ContactObject {
	name?: string
	url?: string
	email?: string
}

export interface LicenseObject {
	name: string
	url?: string
}

export interface ServerVariableObject {
	enum?: string[]
	default: string
	description?: string
}

export interface ExampleObject {
	summary?: string
	description?: string
	value?: any
	externalValue?: string
}

export interface EncodingObject {
	contentType?: string
	headers?: Record<string, HeaderObject>
	style?: string
	explode?: boolean
	allowReserved?: boolean
}

export interface LinkObject {
	operationRef?: string
	operationId?: string
	parameters?: Record<string, any>
	requestBody?: any
	description?: string
	server?: ServerObject
}

export interface SecuritySchemeObject {
	type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect'
	description?: string
	name?: string
	in?: 'query' | 'header' | 'cookie'
	scheme?: string
	bearerFormat?: string
	flows?: OAuthFlowsObject
	openIdConnectUrl?: string
}

export interface OAuthFlowsObject {
	implicit?: OAuthFlowObject
	password?: OAuthFlowObject
	clientCredentials?: OAuthFlowObject
	authorizationCode?: OAuthFlowObject
}

export interface OAuthFlowObject {
	authorizationUrl?: string
	tokenUrl?: string
	refreshUrl?: string
	scopes: Record<string, string>
}

export interface SecurityRequirementObject {
	[string: string]: string[]
}

export interface CallbackObject {
	[string: string]: PathItemObject
}

// Swagger 2.0 Types
export interface Swagger2Spec {
	swagger: string
	info: InfoObject
	host?: string
	basePath?: string
	schemes?: string[]
	paths: Record<string, SwaggerPathItemObject>
	definitions?: Record<string, SchemaObject>
	parameters?: Record<string, ParameterObject>
	responses?: Record<string, ResponseObject>
	securityDefinitions?: Record<string, SecuritySchemeObject>
	security?: SecurityRequirementObject[]
	tags?: TagObject[]
	externalDocs?: ExternalDocsObject
	produces?: string[]
	consumes?: string[]
}

export interface SwaggerPathItemObject {
	$ref?: string
	get?: SwaggerOperationObject
	post?: SwaggerOperationObject
	put?: SwaggerOperationObject
	delete?: SwaggerOperationObject
	patch?: SwaggerOperationObject
	head?: SwaggerOperationObject
	options?: SwaggerOperationObject
	parameters?: ParameterObject[]
}

export interface SwaggerOperationObject {
	operationId?: string
	summary?: string
	description?: string
	externalDocs?: ExternalDocsObject
	tags?: string[]
	parameters?: ParameterObject[]
	responses: Record<string, SwaggerResponseObject>
	schemes?: string[]
	deprecated?: boolean
	security?: SecurityRequirementObject[]
	produces?: string[]
	consumes?: string[]
}

export interface SwaggerResponseObject {
	description: string
	schema?: SchemaObject
	headers?: Record<string, HeaderObject>
	examples?: Record<string, any>
}

// Unified Spec Type
export type ApiSpec = OpenAPI3Spec | Swagger2Spec

// Spec Version
export type SpecVersion = 'swagger2' | 'openapi3' | 'openapi3.1'

// Detect spec version
export function detectSpecVersion(spec: ApiSpec): SpecVersion {
	if ('swagger' in spec) {
		return 'swagger2'
	}
	if (spec.openapi.startsWith('3.1')) {
		return 'openapi3.1'
	}
	return 'openapi3'
}
