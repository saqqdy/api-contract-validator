# 技能命令

API Contract Validator 在 Claude Code 中提供交互式漂移检测命令。

## 可用命令

| 命令 | 描述 | 示例 |
|------|------|------|
| `/validate <spec> <code>` | 完整契约验证 | `/validate openapi.yaml src/` |
| `/drift <endpoint>` | 端点漂移详情 | `/drift POST /users` |
| `/contract <operationId>` | 操作契约检查 | `/contract createUser` |
| `/check-api <area>` | 区域批量验证 | `/check-api user-management` |
| `/api-drift --fix` | 自动修复建议 | `/api-drift --fix` |

## `/validate` — 完整契约验证

验证整个 API 契约。

**用法**：
```
/validate openapi.yaml src/
```

**输出**：
```
🔍 API Contract Drift Report:

  🔴 破坏性变更 (3):
    1. [DELETE /users/{id}] 实现中已移除该端点
       → 规范: line 45, 实现: src/routes/user.ts:120

  🟡 警告 (2):
    1. [PUT /users/{id}] 新增约束

  🟢 信息 (1):
    1. [GET /products] 新增可选字段 tags

  📊 总结: 6 个漂移 | 3 破坏性 | 2 警告 | 1 信息

  💡 建议操作:
    1. 重新添加 DELETE /users/{id} 端点
```

## `/drift` — 端点漂移详情

特定端点深度分析。

**用法**：
```
/drift POST /orders
```

**输出**：
```
🔍 漂移分析: POST /orders

  📋 规范定义 (openapi.yaml:85):
    RequestBody:
      - userId: string (必填)
      - productId: string (必填)

  📂 实现定义 (src/routes/order.ts:120):
    Handler: createOrder(body: { productId })

  🔴 漂移详情:
    1. 缺失必填字段: userId

  💡 修复建议:
    选项 A: 在处理函数中添加 userId
    选项 B: 在规范中将 userId 标记为可选
```

## 严重程度

命令根据影响返回严重程度级别：

| 级别 | 影响 | 示例 |
|------|------|------|
| 🔴 破坏性 | 会破坏客户端 | 缺失端点、必填字段被删除 |
| 🟡 警告 | 可能引起问题 | 可选字段被删除、新增约束 |
| 🟢 信息 | 非破坏性 | 额外端点、新增可选字段 |

## 使用技巧

### 有效使用

1. **从 `/validate` 开始** — 获取所有漂移概览
2. **使用 `/drift` 查看详情** — 深入特定端点
3. **使用 `/api-drift --fix`** — 获取修复建议

### 组合命令

组合命令形成工作流：

```
/validate openapi.yaml src/
  → 发现 3 个破坏性变更
/drift POST /orders
  → 显示缺失 userId 字段
/api-drift --fix
  → 建议在处理函数中添加 userId
```

## 编程访问

所有技能命令使用底层 API：

```typescript
import { detectDrifts, formatDriftReport } from 'api-contract-validator'

const drifts = detectDrifts(specEndpoints, codeEndpoints)
const report = formatDriftReport({ drifts, summary })
```

详见 [API 参考](/zh/api/)。