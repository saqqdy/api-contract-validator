# DriftResult

Drift detection result with severity classification.

## Type Definition

```typescript
interface DriftResult {
  type: DriftType
  severity: Severity
  method: HttpMethod
  path: string
  message: string
  details: DriftDetails
  suggestions?: string[]
}
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `type` | `DriftType` | Type of drift detected |
| `severity` | `Severity` | Impact severity level |
| `method` | `HttpMethod` | HTTP method of endpoint |
| `path` | `string` | Endpoint path |
| `message` | `string` | Human-readable drift description |
| `details` | `DriftDetails` | Detailed drift information |
| `suggestions` | `string[]?` | Fix suggestions |

## DriftType

8 drift types:

```typescript
type DriftType =
  | 'missing-endpoint'       // 🔴 Critical
  | 'phantom-endpoint'       // 🔴 Critical
  | 'type-mismatch'          // 🔴 High
  | 'missing-field'          // 🔴 High
  | 'extra-field'            // 🟡 Medium
  | 'required-mismatch'      // 🟡 Medium
  | 'response-code-mismatch' // 🟢 Low
  | 'deprecated-not-removed' // 🟢 Low
```

## Severity

```typescript
type Severity = 'critical' | 'high' | 'medium' | 'low'
```

| Severity | Emoji | Impact |
|----------|-------|--------|
| `critical` | 🔴 | Will break clients |
| `high` | 🔴 | Likely to break clients |
| `medium` | 🟡 | May cause issues |
| `low` | 🟢 | Non-breaking |

## Example

### Missing Endpoint

```typescript
const drift: DriftResult = {
  type: 'missing-endpoint',
  severity: 'critical',
  method: 'DELETE',
  path: '/users/{id}',
  message: 'Endpoint missing in code',
  details: { specLocation: { file: 'openapi.yaml', line: 45 } },
  suggestions: ['Add DELETE handler', 'Remove from spec']
}
```

### Type Mismatch

```typescript
const drift: DriftResult = {
  type: 'type-mismatch',
  severity: 'high',
  method: 'POST',
  path: '/orders',
  message: 'Field userId type mismatch',
  details: { field: 'userId', specType: 'string', codeType: 'number' },
  suggestions: ['Change code type to string', 'Update spec']
}
```

## See Also

- [detectDrifts()](/api/detect-drifts)
- [NormalizedEndpoint Type](/api/types/normalized-endpoint)
- [Quick Start Guide](/guide/quick-start)
