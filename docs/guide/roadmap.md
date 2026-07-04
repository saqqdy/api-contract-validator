# Version Roadmap

OpenAPI Drift Guard evolves through themed releases.

## Current Release

### v0.1.0 — Daybreak (Released)

**Theme**: Spec Parsing + Express Analyzer

**Capabilities**:
- ✅ `parseAndNormalizeSpec()` — Parse OpenAPI 3.x/Swagger 2.0
- ✅ `$ref` resolution — Recursive reference resolution
- ✅ `NormalizedEndpoint` — Unified model for spec and code
- ✅ Express analyzer — Route extraction
- ✅ Drift detection — 8 drift types
- ✅ Severity classification — critical/high/medium/low
- ✅ CLI with zero-install `npx` support

## Planned Releases

### v0.2.0 — Sunrise

**Theme**: Multi-framework Support

**Planned Features**:
- Fastify analyzer
- NestJS analyzer (decorator parsing)
- Koa analyzer
- Hono analyzer
- Generic analyzer (AST fallback)

### v0.3.0 — Dawn

**Theme**: Claude Code Skill Ready

**Planned Features**:
- Natural language queries
- Incremental validation (Git diff)
- Fix suggestions
- Interactive mode

### v0.4.0 — Ember

**Theme**: CI/CD Integration

**Planned Features**:
- SARIF reporter
- GitHub Action
- GitLab CI template
- Pre-commit hook

### v1.0.0 — Lighthouse

**Theme**: Production Ready

**Planned Features**:
- Performance optimization
- Enterprise features
- MCP integration
- Comprehensive documentation

## Release Philosophy

- **Incremental Value**: Each release delivers usable features
- **Backward Compatible**: APIs remain stable across minor versions
- **Community Driven**: Roadmap shaped by user feedback

## Changelog

See [CHANGELOG.md](https://github.com/saqqdy/openapi-drift-guard/blob/master/CHANGELOG.md) for release history.
