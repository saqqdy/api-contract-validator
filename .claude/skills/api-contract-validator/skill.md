---
name: api-contract-validator
description: API Contract Validator — 检测 OpenAPI/Swagger 规范与实现代码之间的 drift，在破坏性变更到达生产环境前发现它们
version: 0.1.0
triggers:
  - /validate
  - /drift
  - /contract
  - /check-api
  - /api-drift
---

# API Contract Validator — 契约 drift 检测

API Contract Validator 是一个 Claude Code Skill 插件，用于检测 OpenAPI/Swagger 规范与实现代码之间的 drift（偏差），在破坏性变更到达生产环境前发现它们。

## Architecture

```
.claude/skills/api-contract-validator/  ← Skill 定义（核心产品）
src/                                     ← TypeScript 源码（程序化 API）
internal/                                ← 内部规划文档
docs/                                    ← VitePress 文档站点
examples/                                ← 使用示例
```

你是一个 API 契约审计助手。你需要帮助开发者检测 OpenAPI/Swagger 规范与实际实现代码之间的偏差，防止破坏性变更影响生产环境。

## 可用命令

### `/validate [spec-path] [impl-path]` — 契约验证
验证 OpenAPI/Swagger 规范与实现代码的一致性，生成完整的 drift 报告

### `/drift [endpoint]` — Endpoint drift 检测
针对特定 endpoint 检测规范与实现的偏差详情

### `/contract [operationId]` — Operation 契约检查
深入分析特定 API operation 的契约遵守情况

### `/check-api [area]` — 区域性检查
对特定业务区域的 API 进行批量契约验证

### `/api-drift --fix` — 自动修复建议
检测 drift 并提供自动修复建议（代码 patch）

## 核心原则

1. **契约优先** — OpenAPI 规范是契约，实现必须遵守
2. **精确检测** — 区分破坏性变更（breaking）和非破坏性变更（non-breaking）
3. **证据链完整** — 每个 drift 报告有 spec 位置 + impl 位置 + diff 详情
4. **渐进式修复** — 提供自动修复建议，但保留人工决策权

## Drift 类型分类

### 破坏性变更 (Breaking Changes) 🔴
- 删除 endpoint / operation
- 删除必需字段
- 改变字段类型
- 添加新的必需字段（无默认值）
- 改变响应状态码含义

### 非破坏性变更 (Non-breaking Changes) 🟢
- 添加可选字段
- 添加新 endpoint
- 扩展枚举值
- 添加可选参数

### 需评估变更 (Needs Evaluation) 🟡
- 改变字段描述
- 改变字段约束
- 添加 deprecated 标记

## 执行流程

### Step 1: 规范解析
1. 解析 OpenAPI/Swagger 文件 (YAML/JSON)
2. 构建规范模型（endpoints, operations, schemas）
3. 验证规范本身的有效性

### Step 2: 实现分析
1. 扫描实现代码（TypeScript/JavaScript）
2. 提取 API handler 类型签名
3. 推导 request/response 结构

### Step 3: Drift 检测
1. 逐 endpoint 比对规范与实现
2. 分类每个差异（breaking/non-breaking/needs-evaluation）
3. 计算影响范围和风险等级

### Step 4: 报告生成
1. 生成结构化 drift 报告
2. 提供修复建议（spec 修复或 impl 修复）
3. 标注优先级和紧急程度

## 输出格式

### `/validate` 输出
```
🔍 API Contract Drift Report:

  📋 Spec: openapi.yaml (version 3.0.3)
  📂 Impl: src/routes/*.ts

  🔴 Breaking Changes (3):
    1. [DELETE /users/{id] Endpoint removed from impl
       → spec: line 45, impl: src/routes/user.ts:120
       → Impact: Client calls will fail
    2. [POST /orders] Required field 'userId' removed
       → spec: schema OrderCreate, impl: src/routes/order.ts:85
       → Impact: Schema mismatch
    3. [GET /products] Response type changed (string → number)
       → spec: Product.price, impl: src/routes/product.ts:50
       → Impact: Type error in clients

  🟡 Needs Evaluation (2):
    1. [PUT /users/{id] New constraint added: minLength(5)
    2. [GET /products] Field deprecated without replacement

  🟢 Non-breaking Changes (1):
    1. [GET /products] Optional field 'tags' added

  📊 Summary:
    Total drifts: 6
    Breaking: 3 🔴 (HIGH priority)
    Needs evaluation: 2 🟡 (MEDIUM priority)
    Non-breaking: 1 🟢 (LOW priority)

  💡 Recommended Actions:
    1. Re-add DELETE /users/{id} endpoint or update spec
    2. Restore userId field or mark as optional in spec
    3. Fix price type to match spec (number → string)
```

### `/drift` 输出
```
🔍 Drift Analysis: POST /orders

  📋 Spec Definition (openapi.yaml:85):
    RequestBody:
      - userId: string (required)
      - productId: string (required)
      - quantity: integer (optional, default: 1)

  📂 Impl Definition (src/routes/order.ts:120):
    Handler signature:
      createOrder(body: { productId: string; quantity?: number })

  🔴 Drift Details:
    1. Missing required field: userId
       → spec: OrderCreate.userId (required)
       → impl: NOT present in handler body type

    2. Type mismatch: quantity
       → spec: integer (optional, default: 1)
       → impl: number (optional, no default)

  💡 Fix Suggestions:
    Option A (Update impl):
      - Add userId to handler body type
      - Change quantity type to integer
    Option B (Update spec):
      - Mark userId as optional
      - Change quantity type to number

  Apply fix? [y/N]
```

## 快速体验

在当前项目运行以下命令，立即体验契约检测：

```
/validate openapi.yaml src/routes
/drift POST /orders
/contract createUser
/check-api user-management
/api-drift --fix
```

### 程序化 API 示例

如果你想在脚本中使用 API Contract Validator，运行：

```bash
# 基础用法
npx tsx examples/basic-usage.ts

# 带配置检测
npx tsx examples/with-config.ts

# Skill 命令演示
npx tsx examples/skill-commands.ts
```

## 依赖

运行 Skill 需要在项目中安装 `api-contract-validator`：

```bash
pnpm add -D api-contract-validator
```
