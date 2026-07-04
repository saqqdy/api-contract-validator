# 🔍 OpenAPI Drift Guard

> AI 驱动的 API 契约漂移检测 — 在 OpenAPI 规范与实现代码的**破坏性变更**到达生产环境前发现它们。语义级契约验证，通过 Claude Code Skill 实现。

[![npm version](https://img.shields.io/npm/v/openapi-drift-guard.svg)](https://www.npmjs.com/package/openapi-drift-guard)
[![license](https://img.shields.io/npm/l/openapi-drift-guard.svg)](https://github.com/saqqdy/openapi-drift-guard/blob/master/LICENSE)

[English Docs](README.md)

---

## 🎯 解决的问题

| 场景 | 传统测试 | OpenAPI Drift Guard |
|------|---------|------------------------|
| 规范与代码不一致 | 只捕获运行时错误 | 对比规范 vs 实现，识别漂移 |
| 缺失端点 | ❌ 发现不了 | ✅ 检测规范定义但代码未实现的端点 |
| 额外端点 | ❌ 发现不了 | ✅ 检测代码实现但规范未定义的端点 |
| Schema 漂移 | ❌ 发现不了 | ✅ 检测请求/响应结构差异 |

**核心洞察**：API 规范与实现代码会悄悄漂移，传统测试无法捕获契约漂移。

---

## ✨ 核心功能

### 📋 规范解析层 (v0.1.0)

- **OpenAPI 3.x** — 完整支持 paths, methods, parameters, responses
- **Swagger 2.x** — 传统规范支持
- **标准化输出** — 跨规范版本的统一结构

### 🔍 代码分析层

| 框架 | 支持状态 |
|------|---------|
| Express | ✅ 路由提取、中间件检测 |
| Fastify | 📋 计划中 |
| Koa | 📋 计划中 |
| NestJS | 📋 计划中 |

### 🚨 漂移检测层

| 严重程度 | 含义 | 示例 |
|---------|------|------|
| 🔴 **破坏性** | 会破坏客户端 | 缺失端点、必填字段被删除 |
| 🟡 **警告** | 可能引起问题 | 可选字段被删除、类型变更 |
| 🟢 **信息** | 非破坏性 | 额外端点、新增可选字段 |

---

## 🚀 快速开始

```bash
pnpm add openapi-drift-guard
```

```typescript
import { Validator } from 'openapi-drift-guard'

const validator = new Validator({
  specPath: './openapi.yaml',
  codePath: './src',
  framework: 'express',
})

const report = await validator.validate()
console.log(`破坏性变更: ${report.summary.breakingChanges}`)
```

---

## 📋 版本路线图

| 版本 | 主题 | 状态 |
|------|------|------|
| v0.1.0 | 核心验证引擎 | 🚧 进行中 |
| v0.2.0 | 多框架支持 | 📋 计划中 |
| v0.3.0 | CI/CD 集成 | 📋 计划中 |
| v1.0.0 | 生产就绪 | 📋 计划中 |

---

## 📄 许可证

[MIT](./LICENSE)