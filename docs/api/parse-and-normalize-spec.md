# parseAndNormalizeSpec()

Parse OpenAPI/Swagger specification into normalized endpoints.

## Signature

```typescript
function parseAndNormalizeSpec(specPath: string): NormalizedEndpoint[]
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `specPath` | `string` | Path to OpenAPI/Swagger file (JSON or YAML) |

## Returns

`NormalizedEndpoint[]` — Array of normalized endpoint definitions

## Supported Formats

- **OpenAPI 3.x** — Full support for JSON and YAML
- **Swagger 2.0** — Automatic conversion to OpenAPI 3.0
- **$ref References** — Recursive resolution with circular detection

## Example

### Basic Usage

```typescript
import { parseAndNormalizeSpec } from 'openapi-drift-guard'

const endpoints = parseAndNormalizeSpec('./openapi.yaml')

console.log(`Found ${endpoints.length} endpoints`)

for (const endpoint of endpoints) {
  console.log(`${endpoint.method} ${endpoint.path}`)
}
```

### OpenAPI 3.x Example

```yaml
openapi: 3.0.3
info:
  title: User API
  version: 1.0.0
paths:
  /users/{id}:
    get:
      operationId: getUser
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
```

```typescript
const endpoints = parseAndNormalizeSpec('./openapi.yaml')
// Result: NormalizedEndpoint[] with unified structure
```

## Features

### $ref Resolution

Recursive resolution of `$ref` references with circular reference detection.

### Path Parameter Normalization

Path parameters are extracted and normalized to `{param}` format.

### Swagger 2.0 Support

Automatic conversion from Swagger 2.0 to OpenAPI 3.0 format.

## Error Handling

Throws `ParseError` for:
- Invalid file path
- Malformed JSON/YAML
- Invalid OpenAPI/Swagger structure
- Unresolvable `$ref` references

## See Also

- [NormalizedEndpoint Type](/api/types/normalized-endpoint)
- [createAnalyzer()](/api/create-analyzer)
- [detectDrifts()](/api/detect-drifts)
