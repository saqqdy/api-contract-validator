# createAnalyzer()

Create framework-specific code analyzer.

## Signature

```typescript
function createAnalyzer(framework: Framework, codeDir: string): Analyzer
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `framework` | `Framework` | Target framework type |
| `codeDir` | `string` | Source code directory path |

## Framework Types

```typescript
type Framework = 
  | 'express'    // Express.js (✅ v0.1.0)
  | 'fastify'    // Fastify (📋 v0.2.0)
  | 'koa'        // Koa (📋 v0.2.0)
  | 'nestjs'     // NestJS (📋 v0.2.0)
  | 'hono'       // Hono (📋 v0.2.0)
  | 'generic'    // Generic AST (📋 v0.2.0)
```

## Returns

`Analyzer` instance with `analyze()` method

## Example

### Express Analyzer (v0.1.0)

```typescript
import { createAnalyzer } from 'api-contract-validator'

const analyzer = createAnalyzer('express', './src')
const endpoints = analyzer.analyze()

console.log(`Found ${endpoints.length} endpoints`)

for (const endpoint of endpoints) {
  console.log(`${endpoint.method} ${endpoint.path}`)
}
```

### Express Route Patterns

Extracts routes from:

```typescript
// app.METHOD patterns
app.get('/users', (req, res) => { ... })
app.post('/users', (req, res) => { ... })

// router.METHOD patterns
router.get('/users/:id', (req, res) => { ... })

// Nested routers
app.use('/api', router)
```

### Path Normalization

Express path parameters are normalized:

```typescript
// Express code: /users/:id
// Normalized:   /users/{id}
```

## Analyzer Interface

```typescript
interface Analyzer {
  analyze(): NormalizedEndpoint[]
}
```

## Error Handling

Throws `ValidationError` for:
- Unknown framework type
- Invalid code directory
- Unsupported framework (in v0.1.0)

## See Also

- [NormalizedEndpoint Type](/api/types/normalized-endpoint)
- [parseAndNormalizeSpec()](/api/parse-and-normalize-spec)
- [detectDrifts()](/api/detect-drifts)
- [Roadmap](/guide/roadmap) — Multi-framework timeline
