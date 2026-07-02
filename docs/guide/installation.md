# Installation

Choose the installation method that fits your workflow.

## Option 1: Claude Code Plugin (Recommended)

API Contract Validator is designed as a **Claude Code Plugin** for seamless integration.

### Method A: Plugin Marketplace

```bash
# In Claude Code, run:
/plugin marketplace add saqqdy/api-contract-validator
/plugin install api-contract-validator
```

### Method B: Local Install

```bash
# 1. Navigate to your project
cd your-project

# 2. Install npm package
pnpm add -D api-contract-validator

# 3. Copy skill files
mkdir -p .claude/skills
cp -r node_modules/api-contract-validator/.claude/skills/api-contract-validator .claude/skills/
```

After installation, use commands like `/validate`, `/drift`, `/contract` in Claude Code.

## Option 2: NPM Package

For programmatic usage in Node.js/TypeScript projects:

```bash
pnpm add api-contract-validator
```

```typescript
import {
  parseAndNormalizeSpec,
  createAnalyzer,
  detectDrifts,
} from 'api-contract-validator'

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
npx api-contract-validator validate --spec ./openapi.yaml --code ./src
npx api-contract-validator --version
npx api-contract-validator --help
```

## Option 4: Clone and Explore

For development or exploring examples:

```bash
git clone https://github.com/saqqdy/api-contract-validator.git
cd api-contract-validator
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
npx api-contract-validator --version

# Node.js
node -e "console.log(require('api-contract-validator').version)"
```

## Next Steps

- [Quick Start](/guide/quick-start) — See API Contract Validator in action
- [API Reference](/api/) — Explore the full API
- [Skill Commands](/guide/skill-commands) — Interactive drift detection commands
