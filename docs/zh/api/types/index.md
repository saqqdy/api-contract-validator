# API 类型

API 契约验证的核心类型。

## 端点类型

- [NormalizedEndpoint](/zh/api/types/normalized-endpoint) — 统一端点模型
- [DriftResult](/zh/api/types/drift-result) — 漂移检测结果

## 辅助类型

### HttpMethod

```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
```

### Severity

```typescript
type Severity = 'critical' | 'high' | 'medium' | 'low'
```

| 级别 | 标识 | 影响 |
|------|------|------|
| `critical` | 🔴 | 会破坏客户端 |
| `high` | 🔴 | 很可能破坏客户端 |
| `medium` | 🟡 | 可能引起问题 |
| `low` | 🟢 | 非破坏性 |

### DriftType

```typescript
type DriftType =
  | 'missing-endpoint'
  | 'phantom-endpoint'
  | 'type-mismatch'
  | 'missing-field'
  | 'extra-field'
  | 'required-mismatch'
  | 'response-code-mismatch'
  | 'deprecated-not-removed'
```

### Param, Schema, Response, SourceLocation

详见 [NormalizedEndpoint](/zh/api/types/normalized-endpoint) 中的定义。

## 类型关系

```typescript
parseAndNormalizeSpec(): NormalizedEndpoint[]
createAnalyzer().analyze(): NormalizedEndpoint[]
detectDrifts(): DriftResult[]
```

## 相关链接

- [API 参考](/zh/api/) — 完整 API 文档