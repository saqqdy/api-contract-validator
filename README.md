# 🔍 API Contract Validator

> AI-powered API contract drift detection — detect breaking changes between OpenAPI/Swagger specs and implementation code **before** they reach production.

[![npm version](https://img.shields.io/npm/v/api-contract-validator.svg)](https://www.npmjs.com/package/api-contract-validator)
[![license](https://img.shields.io/npm/l/api-contract-validator.svg)](https://github.com/saqqdy/api-contract-validator/blob/master/LICENSE)

[中文文档](README_CN.md)

---

## 🎯 The Problem It Solves

| Scenario | Traditional Testing | API Contract Validator |
|----------|--------------------|------------------------|
| "Is this endpoint documented?" | ❌ Manual review | ✅ Auto-detect missing/phantom endpoints |
| "Will this change break clients?" | ⚠️ Runtime tests only | ✅ Static analysis before deploy |
| "Is the response schema correct?" | ❌ Integration tests | ✅ Schema comparison with severity levels |

**Core insight**: Breaking changes should be caught at **design time**, not after deployment.

---

## ✨ Core Features

### 🔍 OpenAPI/Swagger Parsing (v0.1.0)

- **OpenAPI 3.x** — JSON/YAML parsing with full schema support
- **Swagger 2.0** — Automatic normalization to OpenAPI 3.0
- **`$ref` Resolution** — Recursive reference resolution
- **Unified Model** — `NormalizedEndpoint` for spec and code

### 🧠 Code Analysis (v0.2.0+)

- Express/Fastify/Koa/NestJS/Hono route extraction
- TypeScript type inference for request/response
- Parameter extraction from route definitions

### 🔄 Drift Detection

8 drift types with severity classification:

| Drift Type | Severity | Example |
|------------|----------|---------|
| Missing Endpoint | 🔴 Breaking | Code has endpoint not in spec |
| Phantom Endpoint | 🔴 Breaking | Spec has endpoint not in code |
| Type Mismatch | 🔴 Breaking | Field type changed |
| Missing Field | 🔴 Breaking | Required field removed |
| Extra Field | 🟡 Warning | Optional field removed |
| Required Mismatch | 🟡 Warning | Required/optional flip |
| Response Code Mismatch | 🟢 Info | Status code changed |
| Deprecated Not Removed | 🟢 Info | Deprecated still in use |

---

## ⚡ Quick Start (5 Minutes)

```bash
# Option 1: Zero-install CLI (fastest)
npx api-contract-validator validate --spec openapi.yaml --code src/

# Option 2: Install globally
npm install -g api-contract-validator
api-contract-validator validate --spec openapi.yaml --code src/

# Option 3: Use in Node.js project
npm install api-contract-validator
```

**First run results**:
- ✅ Spec parsed: 12 endpoints detected
- ✅ Code analyzed: 15 endpoints found
- 📊 Drift detected: 3 breaking changes found

See [Getting Started](#getting-started) for detailed usage.

---

## 🚀 Getting Started

### Option 1: Claude Code Plugin (Recommended)

```bash
# In Claude Code, run:
/plugin marketplace add saqqdy/api-contract-validator
/plugin install api-contract-validator
```

#### Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/validate` | Validate contract drift | `/validate openapi.yaml src/` |
| `/drift` | Endpoint drift detail | `/drift POST /users` |
| `/contract` | Operation contract check | `/contract createUser` |
| `/check-api` | Area batch validation | `/check-api user-management` |
| `/api-drift` | Auto-fix suggestions | `/api-drift --fix` |

### Option 2: NPM Package

```bash
pnpm add api-contract-validator
```

```typescript
import { parseAndNormalizeSpec, createAnalyzer, detectDrifts } from 'api-contract-validator'

// Parse spec
const specEndpoints = parseAndNormalizeSpec('./openapi.yaml')

// Analyze code
const analyzer = createAnalyzer('express', './src')
const codeEndpoints = analyzer.analyze()

// Detect drifts
const drifts = detectDrifts(specEndpoints, codeEndpoints)
console.log(`Found ${drifts.length} drifts`)
```

### Option 3: CLI (Zero-Install)

```bash
# In any project
npx api-contract-validator validate --spec ./openapi.yaml --code ./src
npx api-contract-validator --version
npx api-contract-validator --help
```

### Option 4: Clone and Run Examples

```bash
git clone https://github.com/saqqdy/api-contract-validator.git
cd api-contract-validator
pnpm install

# Run examples
npx tsx examples/basic-usage.ts
npx tsx examples/with-config.ts
npx tsx examples/skill-commands.ts
```

---

## 📋 Version Roadmap

| Version | Codename | Theme | Status |
|---------|----------|-------|--------|
| v0.1.0 | Daybreak | Spec parsing + Express analyzer | ✅ Current |
| v0.2.0 | Sunrise | Multi-framework support | 📋 Planned |
| v0.3.0 | Dawn | Claude Code Skill ready | 📋 Planned |
| v0.4.0 | Ember | CI/CD integration + SARIF | 📋 Planned |
| v1.0.0 | Lighthouse | Production-ready | 📋 Planned |

---

## 🗂️ Project Structure

```
api-contract-validator/
├── .claude/skills/api-contract-validator/  # Skill prompts (core product)
│   └── skill.md                            # Commands + execution flow
├── src/                                    # TypeScript source
│   ├── parser/                             # OpenAPI/Swagger parser
│   ├── analyzer/                           # Code analyzers
│   ├── detector/                           # Drift detection
│   ├── types/                              # Core types
│   └── utils/                              # Utilities
├── examples/                               # Usage examples
├── docs/                                   # VitePress docs
└── internal/                               # Planning docs
```

---

## 🛠️ Development

```bash
pnpm install          # Install dependencies
pnpm run lint         # ESLint + auto-fix
pnpm run typecheck    # TypeScript check
pnpm run test         # Run tests (vitest)
pnpm run build        # Build (ESM + CJS)
pnpm run docs:dev     # Start docs server
```

---

## 🆚 Comparison

### vs Schema Validation

| Dimension | Schema Validation | API Contract Validator |
|-----------|-------------------|------------------------|
| Timing | Runtime | Design time |
| Coverage | Single request | Full API surface |
| Drift Detection | ❌ No | ✅ 8 drift types |
| Code Analysis | ❌ No | ✅ Framework-aware |
| Severity Levels | ❌ No | ✅ 🔴🟡🟢 classification |

---

## 📄 License

[MIT](./LICENSE)

## 👤 Author

saqqdy <https://github.com/saqqdy>

## 🙏 Acknowledgments

Inspired by [git-unearth](https://github.com/saqqdy/git-unearth)'s project structure and documentation style.