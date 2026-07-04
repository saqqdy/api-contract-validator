# 🔍 OpenAPI Drift Guard

> AI-powered API contract drift detection — catch breaking changes between OpenAPI spec and implementation **before** they reach production.

[![npm version](https://img.shields.io/npm/v/openapi-drift-guard.svg)](https://www.npmjs.com/package/openapi-drift-guard)
[![license](https://img.shields.io/npm/l/openapi-drift-guard.svg)](https://github.com/saqqdy/openapi-drift-guard/blob/master/LICENSE)

## Quick Links

- [Installation](/guide/installation) — Get started in minutes
- [Quick Start](/guide/quick-start) — See it in action
- [API Reference](/api/) — Programmatic usage
- [Skill Commands](/guide/skill-commands) — Interactive drift detection

## The Problem

API specs and implementation code drift apart silently:

```
Spec: GET /users/{id} → returns User
Code: GET /users/:id  → returns UserDTO (extra fields, missing id)
```

Traditional testing catches runtime errors, but misses:
- Missing endpoints in code
- Extra undocumented endpoints
- Schema mismatches (request/response)
- Parameter type changes

## The Solution

OpenAPI Drift Guard detects **drift** through three layers:

| Layer | Capability | Output |
|-------|------------|--------|
| **Spec Parsing** | Parse OpenAPI/Swagger into normalized endpoints | `NormalizedEndpoint[]` |
| **Code Analysis** | Extract routes from frameworks | `NormalizedEndpoint[]` |
| **Drift Detection** | Compare and classify severity | `DriftReport` |

## Severity Levels

| Severity | Meaning | Example |
|----------|---------|---------|
| 🔴 **Breaking** | Will break clients | Missing endpoint, required field removed |
| 🟡 **Warning** | May cause issues | Optional field removed, type changed |
| 🟢 **Info** | Non-breaking | Extra endpoint, new optional field |

## Key Features

### 🔍 OpenAPI/Swagger Parsing

Structured parsing with zero configuration:

- **OpenAPI 3.x** — JSON/YAML parsing with full schema support
- **Swagger 2.0** — Automatic normalization to OpenAPI 3.0
- **$ref Resolution** — Recursive reference resolution
- **Unified Model** — `NormalizedEndpoint` for spec and code

### 🧠 Code Analysis

- Express/Fastify/Koa/NestJS/Hono route extraction
- TypeScript type inference for request/response
- Parameter extraction from route definitions

### 🔄 Interactive Commands

In Claude Code, use natural language drift detection:

| Command | Purpose |
|---------|---------|
| `/validate <spec> <code>` | Full contract validation |
| `/drift <endpoint>` | Endpoint drift detail |
| `/contract <operationId>` | Operation contract check |
| `/check-api <area>` | Area batch validation |

## Example Output

```
/validate openapi.yaml src/

🔍 API Contract Drift Report:

  📋 Spec: openapi.yaml (version 3.0.3)
  📂 Impl: src/routes/*.ts

  🔴 Breaking Changes (3):
    1. [DELETE /users/{id}] Endpoint removed from impl
    2. [POST /orders] Required field userId removed
    3. [GET /products] Response type changed (string → number)

  🟡 Warnings (2):
    1. [PUT /users/{id}] New constraint added: minLength(5)
    2. [GET /products] Field deprecated without replacement

  🟢 Info (1):
    1. [GET /products] Optional field tags added

  📊 Summary:
    Total drifts: 6 | Breaking: 3 | Warnings: 2 | Info: 1
```

## Comparison

| Dimension | Schema Validation | OpenAPI Drift Guard |
|-----------|-------------------|------------------------|
| Timing | Runtime | Design time |
| Coverage | Single request | Full API surface |
| Drift Detection | ❌ No | ✅ 8 drift types |
| Code Analysis | ❌ No | ✅ Framework-aware |
| Severity Levels | ❌ No | ✅ 🔴🟡🟢 classification |

## Get Started

Choose your path:

### 1. Claude Code Plugin (Recommended)

```bash
/plugin marketplace add saqqdy/openapi-drift-guard
/plugin install openapi-drift-guard
```

### 2. NPM Package

```bash
pnpm add openapi-drift-guard
```

### 3. CLI (Zero-Install)

```bash
npx openapi-drift-guard validate --spec ./openapi.yaml --code ./src
```

## Project Status

| Version | Theme | Status |
|---------|-------|--------|
| v0.1.0 | Spec parsing + Express analyzer | ✅ Released |
| v0.2.0 | Multi-framework support | 📋 Planned |
| v0.3.0 | Claude Code Skill ready | 📋 Planned |
| v0.4.0 | CI/CD integration | 📋 Planned |
| v1.0.0 | Production-ready | 📋 Planned |

See [Roadmap](/guide/roadmap) for details.

## License

MIT — use freely in personal and commercial projects.
