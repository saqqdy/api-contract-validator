# API Contract Validator — Claude Code Guide

## Project Overview

API Contract Validator 是一个 Claude Code Skill 插件，用于检测 OpenAPI/Swagger 规范与实现代码之间的 drift（偏差），在破坏性变更到达生产环境前发现它们。

## Architecture

```
.claude/skills/api-contract-validator/  ← Skill 定义（核心产品）
src/                                     ← TypeScript 源码（程序化 API）
internal/                                ← 内部规划文档
docs/                                    ← VitePress 文档站点
examples/                                ← 使用示例
```

## Development Commands

```bash
pnpm install          # 安装依赖
pnpm run lint         # ESLint 检查 + 自动修复
pnpm run typecheck    # TypeScript 类型检查
pnpm run test         # 运行测试 (vitest)
pnpm run build        # 构建 (ESM + CJS)
pnpm run dev          # 监听模式开发
pnpm run docs:dev     # 文档开发服务器
pnpm run docs:build   # 构建文档
```

## Key Principles

1. **契约优先** — OpenAPI 规范是契约，实现必须遵守
2. **精确检测** — 区分破坏性变更（breaking）和非破坏性变更（non-breaking）
3. **证据链完整** — 每个 drift 报告有 spec 位置 + impl 位置 + diff 详情
4. **渐进式修复** — 提供自动修复建议，但保留人工决策权

## Code Style

- TypeScript 5.9+，strict mode
- 文件命名：kebab-case
- 导出：named exports，不用 default
- 注释密度：关键模块加 JSDoc，公共 API 必须有
- 测试：vitest，放在同级 `*.test.ts`

## Version Plan

- v0.1.0 Daybreak: 基础检测框架 + OpenAPI 解析 + 简单 drift 类型
- v0.2.0 Sunrise: TypeScript 类型推导 + 深度 impl 分析 + 自动修复建议
- 完整路线图见 `internal/release-plan.md`
