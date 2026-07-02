# Skill Commands

API Contract Validator provides interactive drift detection commands in Claude Code.

## Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/validate <spec> <code>` | Full contract validation | `/validate openapi.yaml src/` |
| `/drift <endpoint>` | Endpoint drift detail | `/drift POST /users` |
| `/contract <operationId>` | Operation contract check | `/contract createUser` |
| `/check-api <area>` | Area batch validation | `/check-api user-management` |
| `/api-drift --fix` | Auto-fix suggestions | `/api-drift --fix` |

## `/validate` — Full Contract Validation

Validate entire API contract.

**Usage**:
```
/validate openapi.yaml src/
```

**Output**:
```
🔍 API Contract Drift Report:

  🔴 Breaking Changes (3):
    1. [DELETE /users/{id}] Endpoint removed from impl
       → spec: line 45, impl: src/routes/user.ts:120

  🟡 Warnings (2):
    1. [PUT /users/{id}] New constraint added

  🟢 Info (1):
    1. [GET /products] Optional field tags added

  📊 Summary: 6 drifts | 3 breaking | 2 warnings | 1 info

  💡 Recommended Actions:
    1. Re-add DELETE /users/{id} endpoint
```

## `/drift` — Endpoint Drift Detail

Deep analysis for specific endpoint.

**Usage**:
```
/drift POST /orders
```

**Output**:
```
🔍 Drift Analysis: POST /orders

  📋 Spec Definition (openapi.yaml:85):
    RequestBody:
      - userId: string (required)
      - productId: string (required)

  📂 Impl Definition (src/routes/order.ts:120):
    Handler: createOrder(body: { productId })

  🔴 Drift Details:
    1. Missing required field: userId

  💡 Fix Suggestions:
    Option A: Add userId to handler
    Option B: Mark userId as optional in spec
```

## Severity Levels

Commands return severity levels based on impact:

| Level | Impact | Example |
|-------|--------|---------|
| 🔴 Breaking | Will break clients | Missing endpoint, required field removed |
| 🟡 Warning | May cause issues | Optional field removed, constraint added |
| 🟢 Info | Non-breaking | Extra endpoint, new optional field |

## Tips

### Effective Usage

1. **Start with `/validate`** — Get overview of all drifts
2. **Use `/drift` for details** — Deep dive into specific endpoint
3. **Use `/api-drift --fix`** — Get fix suggestions

### Combining Commands

Chain commands for workflow:

```
/validate openapi.yaml src/
  → reveals 3 breaking changes
/drift POST /orders
  → shows missing userId field
/api-drift --fix
  → suggests adding userId to handler
```

## Programmatic Access

All skill commands use the underlying API:

```typescript
import { detectDrifts, formatDriftReport } from 'api-contract-validator'

const drifts = detectDrifts(specEndpoints, codeEndpoints)
const report = formatDriftReport({ drifts, summary })
```

See [API Reference](/api/) for full details.
