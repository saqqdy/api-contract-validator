# API Types

Core types for API contract validation.

## Endpoint Types

- [NormalizedEndpoint](/api/types/normalized-endpoint) — Unified endpoint model
- [DriftResult](/api/types/drift-result) — Drift detection result

## Supporting Types

### HttpMethod

```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
```

### Severity

```typescript
type Severity = 'critical' | 'high' | 'medium' | 'low'
```

| Level | Emoji | Impact |
|-------|-------|--------|
| `critical` | 🔴 | Will break clients |
| `high` | 🔴 | Likely to break clients |
| `medium` | 🟡 | May cause issues |
| `low` | 🟢 | Non-breaking |

### DriftType

```typescript
type DriftType =
  | 'missing-endpoint'
  | 'phantom-endpoint'
  | 'type-mismatch'
  | 'missing-field'
  | 'extra-field'
  | 'required-mismatch'
  | 'response-code-mismatch'
  | 'deprecated-not-removed'
```

### Param, Schema, Response, SourceLocation

See [NormalizedEndpoint](/api/types/normalized-endpoint) for detailed definitions.

## Type Relationships

```typescript
parseAndNormalizeSpec(): NormalizedEndpoint[]
createAnalyzer().analyze(): NormalizedEndpoint[]
detectDrifts(): DriftResult[]
```

## See Also

- [API Reference](/api/) — Full API documentation
