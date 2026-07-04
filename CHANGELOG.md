# Changelog

## 0.1.0 (2026-06-28)

### 🚀 Features

- **cli**: add zero-install CLI for quick experience
  - `npx openapi-drift-guard validate --spec <file> --code <dir>` — contract validation
  - `npx openapi-drift-guard init` — generate config file
  - `npx openapi-drift-guard --version` — show version
  - `npx openapi-drift-guard --help` — show help
  - Commander.js based CLI with subcommands
  - `--format` option: console (default), json, markdown
  - `--output` option: write report to file
  - `--severity` option: filter by minimum severity
  - `--config` option: load config from file
  - Exit codes: 0 = no drift, 1 = drift found, 2 = execution error
- **parser**: add OpenAPI/Swagger spec parsing layer
  - `parseAndNormalizeSpec()` — parse OpenAPI 3.x JSON/YAML into normalized endpoints
  - `parseSwagger2Spec()` — parse Swagger 2.0 with automatic normalization to OpenAPI 3.0
  - `$ref` reference resolution — recursive resolution with circular reference detection
  - `NormalizedEndpoint` unified model — consistent representation for spec and code
- **analyzer**: add Express route analyzer
  - `ExpressAnalyzer` — extract routes from `app.METHOD` / `router.METHOD` patterns
  - Path parameter normalization — `/users/:id` → `/users/{id}`
  - `createAnalyzer()` factory — automatic framework detection
- **detector**: add drift detection engine
  - `EndpointMatcher` — exact, parameterized, and fuzzy matching
  - `SchemaComparator` — deep schema comparison
  - 8 drift types: missing-endpoint, phantom-endpoint, type-mismatch, missing-field, extra-field, required-mismatch, response-code-mismatch, deprecated-not-removed
  - Severity classification (critical/high/medium/low)
  - Deep schema comparison for matched endpoints (request body, response schema, required fields)
- **reporter**: add multi-format report output
  - `ConsoleReporter` — colorful ANSI output with severity grouping
  - `JsonReporter` — structured JSON output
  - `MarkdownReporter` — Markdown format for PR comments
  - `createReporter()` factory — format-based reporter selection
  - Severity filtering support
- **config**: add configuration file support
  - `init` subcommand — generate `.contract-validatorrc` config file
  - `loadConfigFile()` — load and parse JSON config
  - `mergeConfig()` — merge config file with CLI options
  - `getDefaultConfig()` / `validateConfig()` for `Config`
- **errors**: add structured error classes `ValidationError` and `ParseError`
- **format**: add formatting utilities — `formatDriftItem`, `formatDriftReport`, `formatEndpointShort`, `formatSeverityBadge`, `truncate`

### 📝 Documentation

- **docs**: comprehensive documentation optimization
  - Enhanced landing page with feature comparison and severity levels
  - Improved installation guide with marketplace instructions
  - Expanded roadmap with detailed version plans
  - Enhanced skill-commands with examples
  - Comprehensive API reference with usage patterns
  - Updated VitePress config with correct project branding
- add Claude Code Skill definition (`.claude/skills/openapi-drift-guard/skill.md`)
  - Commands: `/validate`, `/drift`, `/contract`, `/check-api`, `/api-drift`
  - Severity levels: 🔴 Breaking / 🟡 Warning / 🟢 Info
- add examples directory with 3 demo scripts
  - `examples/basic-usage.ts` — programmatic API walkthrough
  - `examples/with-config.ts` — configuration patterns
  - `examples/skill-commands.ts` — skill command simulation
- add VitePress documentation site (`docs/`)
- add README.md and README_CN.md with CLI/Skill/API usage guides
- add `.claude-plugin/` for Claude Code Plugin Marketplace

### 🔧 Chores

- add initial project configuration (TypeScript 5.9, tsup, vitest, ESLint 9, Prettier)
- add CI/CD workflows — lint, typecheck, test, build, release, docs deploy
- add `bin` field to package.json for CLI entry point
- fix `sideEffects` config to preserve analyzer registration
- fix ESM import in index.ts (replace `require()` with ES imports)
