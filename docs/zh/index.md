# 🔍 API Contract Validator

> AI 驱动的 API 契约漂移检测 — 在 OpenAPI 规范与实现代码的**破坏性变更**到达生产前发现它们。

[![npm version](https://img.shields.io/npm/v/api-contract-validator.svg)](https://www.npmjs.com/package/api-contract-validator)
[![license](https://img.shields.io/npm/l/api-contract-validator.svg)](https://github.com/saqqdy/api-contract-validator/blob/master/LICENSE)

## 快速链接

- [安装](/zh/guide/installation) — 几分钟快速上手
- [快速上手](/zh/guide/quick-start) — 查看实际效果
- [API 参考](/zh/api/) — 编程接口
- [技能命令](/zh/guide/skill-commands) — 交互式漂移检测

## 问题

API 规范与实现代码会悄悄漂移：

```
规范: GET /users/{id} → 返回 User
代码: GET /users/:id  → 返回 UserDTO (额外字段，缺失 id)
```

传统测试捕获运行时错误，但无法发现：
- 代码中缺失的端点
- 额外未记录的端点
- Schema 不匹配（请求/响应）
- 参数类型变更

## 解决方案

API Contract Validator 通过三层检测**漂移**：

| 层级 | 能力 | 输出 |
|------|------|------|
| **规范解析** | 解析 OpenAPI/Swagger 为标准化端点 | `NormalizedEndpoint[]` |
| **代码分析** | 从框架中提取路由 | `NormalizedEndpoint[]` |
| **漂移检测** | 比较并分类严重程度 | `DriftReport` |

## 严重程度

| 严重程度 | 含义 | 示例 |
|----------|------|------|
| 🔴 **破坏性** | 会破坏客户端 | 缺失端点、必填字段被删除 |
| 🟡 **警告** | 可能引起问题 | 可选字段被删除、类型变更 |
| 🟢 **信息** | 非破坏性 | 额外端点、新增可选字段 |

## 核心特性

### 🔍 OpenAPI/Swagger 解析

零配置结构化解析：

- **OpenAPI 3.x** — JSON/YAML 解析，完整 Schema 支持
- **Swagger 2.0** — 自动标准化为 OpenAPI 3.0
- **$ref 解析** — 递归引用解析
- **统一模型** — 规范和代码共用 `NormalizedEndpoint`

### 🧠 代码分析

- Express/Fastify/Koa/NestJS/Hono 路由提取
- TypeScript 请求/响应类型推断
- 路由定义参数提取

### 🔄 交互式命令

在 Claude Code 中，使用自然语言漂移检测：

| 命令 | 用途 |
|------|------|
| `/validate <spec> <code>` | 完整契约验证 |
| `/drift <endpoint>` | 端点漂移详情 |
| `/contract <operationId>` | 操作契约检查 |
| `/check-api <area>` | 区域批量验证 |

## 示例输出

```
/validate openapi.yaml src/

🔍 API Contract Drift Report:

  📋 规范: openapi.yaml (版本 3.0.3)
  📂 实现: src/routes/*.ts

  🔴 破坏性变更 (3):
    1. [DELETE /users/{id}] 实现中已移除该端点
    2. [POST /orders] 必填字段 userId 被删除
    3. [GET /products] 响应类型变更 (string → number)

  🟡 警告 (2):
    1. [PUT /users/{id}] 新增约束: minLength(5)
    2. [GET /products] 字段已废弃且无替代

  🟢 信息 (1):
    1. [GET /products] 新增可选字段 tags

  📊 总结:
    漂移总数: 6 | 破坏性: 3 | 警告: 2 | 信息: 1
```

## 对比

| 维度 | Schema 验证 | API Contract Validator |
|------|-------------|------------------------|
| 时机 | 运行时 | 设计时 |
| 覆盖范围 | 单个请求 | 完整 API 接口 |
| 漂移检测 | ❌ 否 | ✅ 8 种漂移类型 |
| 代码分析 | ❌ 否 | ✅ 框架感知 |
| 严重程度 | ❌ 否 | ✅ 🔴🟡🟢 分类 |

## 快速开始

选择你的方式：

### 1. Claude Code 插件（推荐）

```bash
/plugin marketplace add saqqdy/api-contract-validator
/plugin install api-contract-validator
```

### 2. NPM 包

```bash
pnpm add api-contract-validator
```

### 3. CLI（零安装）

```bash
npx api-contract-validator validate --spec ./openapi.yaml --code ./src
```

## 项目状态

| 版本 | 主题 | 状态 |
|------|------|------|
| v0.1.0 | 规范解析 + Express 分析器 | ✅ 已发布 |
| v0.2.0 | 多框架支持 | 📋 计划中 |
| v0.3.0 | Claude Code Skill 就绪 | 📋 计划中 |
| v0.4.0 | CI/CD 集成 | 📋 计划中 |
| v1.0.0 | 生产就绪 | 📋 计划中 |

详见[路线图](/zh/guide/roadmap)。

## 许可证

MIT — 个人和商业项目均可自由使用。