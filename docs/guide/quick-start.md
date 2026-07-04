# Quick Start

## Using the Skill

In Claude Code, run:

```
/validate openapi.yaml src/
```

Output:

```
🔍 Validating API contract...

  Spec: openapi.yaml
  Code: src/

✅ Spec parsed: 15 endpoints
✅ Code analyzed: 12 endpoints

📊 Drift detected: 3 issues

  🔴 Breaking: DELETE /users/{id} endpoint missing in code
  🟡 Warning: POST /orders.userId field type mismatch
  🟢 Info: GET /products.tags field added (optional)

💡 Recommended Actions:
  1. Re-add DELETE /users/{id} endpoint
  2. Fix userId type to match spec
```

## Using the API

```typescript
import { parseAndNormalizeSpec, createAnalyzer, detectDrifts } from 'openapi-drift-guard'

// Parse OpenAPI spec
const specEndpoints = parseAndNormalizeSpec('./openapi.yaml')
console.log(`Spec endpoints: ${specEndpoints.length}`)

// Analyze Express code
const analyzer = createAnalyzer('express', './src')
const codeEndpoints = analyzer.analyze()
console.log(`Code endpoints: ${codeEndpoints.length}`)

// Detect drifts
const drifts = detectDrifts(specEndpoints, codeEndpoints)
console.log(`Drifts found: ${drifts.length}`)
```

## CLI Usage

```bash
# Validate contract
npx openapi-drift-guard validate --spec ./openapi.yaml --code ./src

# With options
npx openapi-drift-guard validate   --spec ./openapi.yaml   --code ./src   --framework express   --output json
```
