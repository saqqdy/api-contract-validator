# Installation

Choose the installation method that fits your workflow.

## Option 1: Claude Code Plugin (Recommended)

OpenAPI Drift Guard is designed as a **Claude Code Plugin** for seamless integration.

### Method A: Plugin Marketplace

```bash
# In Claude Code, run:
/plugin marketplace add saqqdy/openapi-drift-guard
/plugin install openapi-drift-guard
```

### Method B: Local Install

```bash
# 1. Navigate to your project
cd your-project

# 2. Install npm package
pnpm add -D openapi-drift-guard

# 3. Copy skill files
mkdir -p .claude/skills
cp -r node_modules/openapi-drift-guard/.claude/skills/openapi-drift-guard .claude/skills/
```

After installation, use commands like `/validate`, `/drift`, `/contract` in Claude Code.

## Option 2: NPM Package

For programmatic usage in Node.js/TypeScript projects:

```bash
pnpm add openapi-drift-guard
```

```typescript
import {
  parseAndNormalizeSpec,
  createAnalyzer,
  detectDrifts,
} from 'openapi-drift-guard'

// Parse spec
const specEndpoints = parseAndNormalizeSpec('./openapi.yaml')

// Analyze code
const analyzer = createAnalyzer('express', './src')
const codeEndpoints = analyzer.analyze()

// Detect drifts
const drifts = detectDrifts(specEndpoints, codeEndpoints)
```

## Option 3: CLI (Zero-Install)

Run directly with `npx` — no installation required:

```bash
# In any project
npx openapi-drift-guard validate --spec ./openapi.yaml --code ./src
npx openapi-drift-guard --version
npx openapi-drift-guard --help
```

## Option 4: Clone and Explore

For development or exploring examples:

```bash
git clone https://github.com/saqqdy/openapi-drift-guard.git
cd openapi-drift-guard
pnpm install

# Run examples
npx tsx examples/basic-usage.ts
npx tsx examples/with-config.ts
npx tsx examples/skill-commands.ts
```

## Verification

Verify your installation:

```bash
# CLI
npx openapi-drift-guard --version

# Node.js
node -e "console.log(require('openapi-drift-guard').version)"
```

## Next Steps

- [Quick Start](/guide/quick-start) — See OpenAPI Drift Guard in action
- [API Reference](/api/) — Explore the full API
- [Skill Commands](/guide/skill-commands) — Interactive drift detection commands
