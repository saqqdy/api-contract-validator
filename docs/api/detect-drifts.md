# detectDrifts()

Detect drifts between spec and code endpoints.

## Signature

```typescript
function detectDrifts(
  specEndpoints: NormalizedEndpoint[],
  codeEndpoints: NormalizedEndpoint[]
): DriftResult[]
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `specEndpoints` | `NormalizedEndpoint[]` | Endpoints from spec parsing |
| `codeEndpoints` | `NormalizedEndpoint[]` | Endpoints from code analysis |

## Returns

`DriftResult[]` — Array of drift detection results

## Drift Types

8 drift types with severity classification:

| Type | Severity | Description |
|------|----------|-------------|
| `missing-endpoint` | 🔴 Critical | Endpoint in spec but not in code |
| `phantom-endpoint` | 🔴 Critical | Endpoint in code but not in spec |
| `type-mismatch` | 🔴 High | Field type changed |
| `missing-field` | 🔴 High | Required field removed |
| `extra-field` | 🟡 Medium | Optional field removed |
| `required-mismatch` | 🟡 Medium | Required/optional flip |
| `response-code-mismatch` | 🟢 Low | Status code changed |
| `deprecated-not-removed` | 🟢 Low | Deprecated endpoint still in use |

## Example

### Basic Usage

```typescript
import { parseAndNormalizeSpec, createAnalyzer, detectDrifts } from 'api-contract-validator'

const specEndpoints = parseAndNormalizeSpec('./openapi.yaml')
const analyzer = createAnalyzer('express', './src')
const codeEndpoints = analyzer.analyze()

const drifts = detectDrifts(specEndpoints, codeEndpoints)

console.log(`Found ${drifts.length} drifts`)

for (const drift of drifts) {
  console.log(`${drift.severity}: ${drift.type} at ${drift.method} ${drift.path}`)
}
```

### Filtering

```typescript
// Filter by severity
const criticalDrifts = drifts.filter(d => d.severity === 'critical')
const highDrifts = drifts.filter(d => d.severity === 'high')

// Filter by type
const missingEndpoints = drifts.filter(d => d.type === 'missing-endpoint')
```

## Matching Algorithm

### Endpoint Matching

Three-tier matching strategy:

1. **Exact Match** — Same method + identical path
2. **Parameterized Match** — Same method + normalized path params
3. **Fuzzy Match** — Similar paths (future)

### Schema Comparison

Deep comparison of:
- Path parameters
- Query parameters
- Request body
- Response schemas

## Error Handling

Throws `ValidationError` for:
- Invalid endpoint arrays
- Malformed endpoint structure

## See Also

- [DriftResult Type](/api/types/drift-result)
- [NormalizedEndpoint Type](/api/types/normalized-endpoint)
- [Skill Commands](/guide/skill-commands) — Interactive drift detection
