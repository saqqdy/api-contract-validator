# DriftResult

漂移检测结果，带严重程度分类。

## 类型定义

```typescript
interface DriftResult {
  type: DriftType
  severity: Severity
  method: HttpMethod
  path: string
  message: string
  details: DriftDetails
  suggestions?: string[]
}
```

## 字段

| 字段 | 类型 | 描述 |
|------|------|------|
| `type` | `DriftType` | 检测到的漂移类型 |
| `severity` | `Severity` | 影响严重程度 |
| `method` | `HttpMethod` | 端点的 HTTP 方法 |
| `path` | `string` | 端点路径 |
| `message` | `string` | 人类可读的漂移描述 |
| `details` | `DriftDetails` | 详细漂移信息 |
| `suggestions` | `string[]?` | 修复建议 |

## DriftType

8 种漂移类型：

```typescript
type DriftType =
  | 'missing-endpoint'       // 🔴 严重
  | 'phantom-endpoint'       // 🔴 严重
  | 'type-mismatch'          // 🔴 高
  | 'missing-field'          // 🔴 高
  | 'extra-field'            // 🟡 中
  | 'required-mismatch'      // 🟡 中
  | 'response-code-mismatch' // 🟢 低
  | 'deprecated-not-removed' // 🟢 低
```

## Severity

```typescript
type Severity = 'critical' | 'high' | 'medium' | 'low'
```

| 严重程度 | 标识 | 影响 |
|----------|------|------|
| `critical` | 🔴 | 会破坏客户端 |
| `high` | 🔴 | 很可能破坏客户端 |
| `medium` | 🟡 | 可能引起问题 |
| `low` | 🟢 | 非破坏性 |

## 示例

### 缺失端点

```typescript
const drift: DriftResult = {
  type: 'missing-endpoint',
  severity: 'critical',
  method: 'DELETE',
  path: '/users/{id}',
  message: '代码中缺失端点',
  details: { specLocation: { file: 'openapi.yaml', line: 45 } },
  suggestions: ['添加 DELETE 处理函数', '从规范中移除该端点']
}
```

### 类型不匹配

```typescript
const drift: DriftResult = {
  type: 'type-mismatch',
  severity: 'high',
  method: 'POST',
  path: '/orders',
  message: '字段 userId 类型不匹配',
  details: { field: 'userId', specType: 'string', codeType: 'number' },
  suggestions: ['将代码类型改为 string', '更新规范']
}
```

## 相关链接

- [detectDrifts()](/zh/api/detect-drifts)
- [NormalizedEndpoint 类型](/zh/api/types/normalized-endpoint)
- [快速开始](/zh/guide/quick-start)