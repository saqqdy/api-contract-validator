# detectDrifts()

检测规范端点与代码端点之间的漂移。

## 签名

```typescript
function detectDrifts(
  specEndpoints: NormalizedEndpoint[],
  codeEndpoints: NormalizedEndpoint[]
): DriftResult[]
```

## 参数

| 参数 | 类型 | 描述 |
|------|------|------|
| `specEndpoints` | `NormalizedEndpoint[]` | 规范解析出的端点 |
| `codeEndpoints` | `NormalizedEndpoint[]` | 代码分析出的端点 |

## 返回值

`DriftResult[]` — 漂移检测结果数组

## 漂移类型

8 种漂移类型及严重程度分类：

| 类型 | 严重程度 | 描述 |
|------|----------|------|
| `missing-endpoint` | 🔴 严重 | 规范中有但代码中缺失的端点 |
| `phantom-endpoint` | 🔴 严重 | 代码中有但规范中未定义的端点 |
| `type-mismatch` | 🔴 高 | 字段类型变更 |
| `missing-field` | 🔴 高 | 必填字段被删除 |
| `extra-field` | 🟡 中 | 可选字段被删除 |
| `required-mismatch` | 🟡 中 | 必填/可选状态翻转 |
| `response-code-mismatch` | 🟢 低 | 状态码变更 |
| `deprecated-not-removed` | 🟢 低 | 已废弃端点仍在使用 |

## 示例

### 基本用法

```typescript
import { parseAndNormalizeSpec, createAnalyzer, detectDrifts } from 'openapi-drift-guard'

const specEndpoints = parseAndNormalizeSpec('./openapi.yaml')
const analyzer = createAnalyzer('express', './src')
const codeEndpoints = analyzer.analyze()

const drifts = detectDrifts(specEndpoints, codeEndpoints)

console.log(`发现 ${drifts.length} 个漂移`)

for (const drift of drifts) {
  console.log(`${drift.severity}: ${drift.type} 位于 ${drift.method} ${drift.path}`)
}
```

### 过滤

```typescript
// 按严重程度过滤
const criticalDrifts = drifts.filter(d => d.severity === 'critical')
const highDrifts = drifts.filter(d => d.severity === 'high')

// 按类型过滤
const missingEndpoints = drifts.filter(d => d.type === 'missing-endpoint')
```

## 匹配算法

### 端点匹配

三层匹配策略：

1. **精确匹配** — 相同方法 + 相同路径
2. **参数化匹配** — 相同方法 + 标准化路径参数
3. **模糊匹配** — 相似路径（未来支持）

### Schema 比较

深度比较：
- 路径参数
- 查询参数
- 请求体
- 响应 Schema

## 错误处理

以下情况抛出 `ValidationError`：
- 无效的端点数组
- 格式错误的端点结构

## 相关链接

- [DriftResult 类型](/zh/api/types/drift-result)
- [NormalizedEndpoint 类型](/zh/api/types/normalized-endpoint)
- [技能命令](/zh/guide/skill-commands) — 交互式漂移检测