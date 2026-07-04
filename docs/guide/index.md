# Introduction

OpenAPI Drift Guard helps you catch breaking changes between OpenAPI/Swagger specs and implementation code **before** they reach production.

## The Problem

API specs and implementation code drift apart:
- Missing endpoints in code
- Extra undocumented endpoints
- Schema mismatches
- Parameter type changes

## The Solution

Three-layer validation:
1. **Spec Parsing** — Parse OpenAPI/Swagger into normalized endpoints
2. **Code Analysis** — Extract routes from Express/Fastify/Koa/NestJS
3. **Drift Detection** — Compare spec vs code, classify severity

## Severity Levels

| Level | Meaning |
|-------|---------|
| 🔴 Breaking | Will break clients |
| 🟡 Warning | May cause issues |
| 🟢 Info | Non-breaking |
