# NormalizedEndpoint

Unified endpoint model for both spec and code.

## Type Definition

```typescript
interface NormalizedEndpoint {
  method: HttpMethod
  path: string
  operationId?: string
  pathParams: Param[]
  queryParams: Param[]
  requestBody?: Schema
  responses: Response[]
  tags: string[]
  deprecated: boolean
  source: 'spec' | 'code'
  location?: SourceLocation
}
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `method` | `HttpMethod` | HTTP method (GET, POST, PUT, DELETE, PATCH) |
| `path` | `string` | Normalized path with `{param}` format |
| `operationId` | `string?` | Operation identifier (OpenAPI) |
| `pathParams` | `Param[]` | Path parameters |
| `queryParams` | `Param[]` | Query parameters |
| `requestBody` | `Schema?` | Request body schema |
| `responses` | `Response[]` | Response schemas by status code |
| `tags` | `string[]` | API grouping tags |
| `deprecated` | `boolean` | Deprecation flag |
| `source` | `'spec' \| 'code'` | Origin of endpoint definition |
| `location` | `SourceLocation?` | Source file location |

## Supporting Types

### HttpMethod

```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
```

### Param

```typescript
interface Param {
  name: string
  required: boolean
  type: string
  schema?: Schema
  description?: string
}
```

### Schema

```typescript
interface Schema {
  type: 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean'
  properties?: Record<string, Schema>
  items?: Schema
  required?: string[]
  description?: string
}
```

### Response

```typescript
interface Response {
  code: number
  description?: string
  schema?: Schema
}
```

### SourceLocation

```typescript
interface SourceLocation {
  file: string
  line?: number
  column?: number
}
```

## Example

### From Spec

```typescript
const specEndpoint: NormalizedEndpoint = {
  method: 'GET',
  path: '/users/{id}',
  operationId: 'getUser',
  pathParams: [{ name: 'id', required: true, type: 'string' }],
  responses: [{ code: 200, schema: { type: 'object', ... } }],
  source: 'spec',
  location: { file: 'openapi.yaml', line: 45 }
}
```

### From Code

```typescript
const codeEndpoint: NormalizedEndpoint = {
  method: 'GET',
  path: '/users/{id}',  // Normalized from Express :id
  pathParams: [{ name: 'id', required: true, type: 'string' }],
  source: 'code',
  location: { file: 'src/routes/user.ts', line: 42 }
}
```

## Path Normalization

Both spec and code use `{param}` format:

```typescript
// OpenAPI: /users/{id} → /users/{id}
// Express: /users/:id  → /users/{id}
```

## See Also

- [parseAndNormalizeSpec()](/api/parse-and-normalize-spec)
- [createAnalyzer()](/api/create-analyzer)
- [DriftResult Type](/api/types/drift-result)
