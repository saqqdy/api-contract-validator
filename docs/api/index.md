# API Reference

Programmatic API for OpenAPI Drift Guard.

## Parser

### [parseAndNormalizeSpec()](/api/parse-and-normalize-spec)

Parse OpenAPI/Swagger spec file into normalized endpoints.

```typescript
import { parseAndNormalizeSpec } from 'openapi-drift-guard'

const endpoints = parseAndNormalizeSpec('./openapi.yaml')
console.log(`Found ${endpoints.length} endpoints`)
```

**Supported formats**: OpenAPI 3.x (JSON/YAML), Swagger 2.0 (auto-converted)

## Analyzer

### [createAnalyzer()](/api/create-analyzer)

Create framework-specific code analyzer.

```typescript
import { createAnalyzer } from 'openapi-drift-guard'

const analyzer = createAnalyzer('express', './src')
const endpoints = analyzer.analyze()
```

**Available frameworks**: `express` (v0.1.0), `fastify`/`koa`/`nestjs`/`hono` (v0.2.0)

## Detector

### [detectDrifts()](/api/detect-drifts)

Detect drifts between spec and code endpoints.

```typescript
import { detectDrifts } from 'openapi-drift-guard'

const drifts = detectDrifts(specEndpoints, codeEndpoints)
for (const drift of drifts) {
  console.log(`${drift.severity}: ${drift.message}`)
}
```

**8 drift types** with 4 severity levels (critical/high/medium/low)

## Types

### [NormalizedEndpoint](/api/types/normalized-endpoint)

Unified endpoint model for both spec and code.

```typescript
interface NormalizedEndpoint {
  method: HttpMethod
  path: string
  pathParams: Param[]
  queryParams: Param[]
  requestBody?: Schema
  responses: Response[]
  source: 'spec' | 'code'
}
```

### [DriftResult](/api/types/drift-result)

Drift detection result with severity classification.

```typescript
interface DriftResult {
  type: DriftType
  severity: Severity
  method: HttpMethod
  path: string
  message: string
  suggestions?: string[]
}
```

### [All Types](/api/types/)

Complete type reference including `HttpMethod`, `Severity`, `DriftType`, `Param`, `Schema`, `Response`.

## Error Classes

### ValidationError

Thrown for invalid configuration or input.

### ParseError

Thrown for spec parsing failures.

## Utility Functions

### Format Utilities

```typescript
import {
  formatDriftItem,
  formatDriftReport,
  formatEndpointShort,
  formatSeverityBadge,
  truncate,
} from 'openapi-drift-guard'
```

### Config Utilities

```typescript
import { getDefaultConfig, mergeConfig, validateConfig } from 'openapi-drift-guard'

const config = mergeConfig({ framework: 'express', codeDir: './src' })
validateConfig(config)
```
