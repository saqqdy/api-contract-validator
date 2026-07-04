# 安装

选择适合你工作流的安装方式。

## 方式 1：Claude Code 插件（推荐）

OpenAPI Drift Guard 设计为 **Claude Code 插件**，实现无缝集成。

### 方法 A：插件市场

```bash
# 在 Claude Code 中运行：
/plugin marketplace add saqqdy/openapi-drift-guard
/plugin install openapi-drift-guard
```

### 方法 B：本地安装

```bash
# 1. 进入你的项目
cd your-project

# 2. 安装 npm 包
pnpm add -D openapi-drift-guard

# 3. 复制技能文件
mkdir -p .claude/skills
cp -r node_modules/openapi-drift-guard/.claude/skills/openapi-drift-guard .claude/skills/
```

安装后，可在 Claude Code 中使用 `/validate`、`/drift`、`/contract` 等命令。

## 方式 2：NPM 包

用于 Node.js/TypeScript 项目编程使用：

```bash
pnpm add openapi-drift-guard
```

```typescript
import {
  parseAndNormalizeSpec,
  createAnalyzer,
  detectDrifts,
} from 'openapi-drift-guard'

// 解析规范
const specEndpoints = parseAndNormalizeSpec('./openapi.yaml')

// 分析代码
const analyzer = createAnalyzer('express', './src')
const codeEndpoints = analyzer.analyze()

// 检测漂移
const drifts = detectDrifts(specEndpoints, codeEndpoints)
```

## 方式 3：CLI（零安装）

使用 `npx` 直接运行 — 无需安装：

```bash
# 在任何项目中
npx openapi-drift-guard validate --spec ./openapi.yaml --code ./src
npx openapi-drift-guard --version
npx openapi-drift-guard --help
```

## 方式 4：克隆探索

用于开发或探索示例：

```bash
git clone https://github.com/saqqdy/openapi-drift-guard.git
cd openapi-drift-guard
pnpm install

# 运行示例
npx tsx examples/basic-usage.ts
npx tsx examples/with-config.ts
npx tsx examples/skill-commands.ts
```

## 验证

验证安装：

```bash
# CLI
npx openapi-drift-guard --version

# Node.js
node -e "console.log(require('openapi-drift-guard').version)"
```

## 下一步

- [快速上手](/zh/guide/quick-start) — 查看 OpenAPI Drift Guard 实际效果
- [API 参考](/zh/api/) — 探索完整 API
- [技能命令](/zh/guide/skill-commands) — 交互式漂移检测命令