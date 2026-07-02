# NormalizedEndpoint

规范和代码的统一端点模型。

## 类型定义

```typescript
interface NormalizedEndpoint {
  method: HttpMethod
  path: string
  operationId?: string
  pathParams: Param[]
  queryParams: Param[]
  requestBody?: Schema
  responses: Response[]
  tags: string[]
  deprecated: boolean
  source: 'spec' | 'code'
  location?: SourceLocation
}
```

## 字段

| 字段 | 类型 | 描述 |
|------|------|------|
| `method` | `HttpMethod` | HTTP 方法（GET、POST、PUT、DELETE、PATCH） |
| `path` | `string` | 标准化路径，使用 `{param}` 格式 |
| `operationId` | `string?` | 操作标识符（OpenAPI） |
| `pathParams` | `Param[]` | 路径参数 |
| `queryParams` | `Param[]` | 查询参数 |
| `requestBody` | `Schema?` | 请求体 Schema |
| `responses` | `Response[]` | 按状态码的响应 Schema |
| `tags` | `string[]` | API 分组标签 |
| `deprecated` | `boolean` | 废弃标记 |
| `source` | `'spec' \| 'code'` | 端点定义来源 |
| `location` | `SourceLocation?` | 源文件位置 |

## 辅助类型

### HttpMethod

```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
```

### Param

```typescript
interface Param {
  name: string
  required: boolean
  type: string
  schema?: Schema
  description?: string
}
```

### Schema

```typescript
interface Schema {
  type: 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean'
  properties?: Record<string, Schema>
  items?: Schema
  required?: string[]
  description?: string
}
```

### Response

```typescript
interface Response {
  code: number
  description?: string
  schema?: Schema
}
```

### SourceLocation

```typescript
interface SourceLocation {
  file: string
  line?: number
  column?: number
}
```

## 示例

### 来自规范

```typescript
const specEndpoint: NormalizedEndpoint = {
  method: 'GET',
  path: '/users/{id}',
  operationId: 'getUser',
  pathParams: [{ name: 'id', required: true, type: 'string' }],
  responses: [{ code: 200, schema: { type: 'object', ... } }],
  source: 'spec',
  location: { file: 'openapi.yaml', line: 45 }
}
```

### 来自代码

```typescript
const codeEndpoint: NormalizedEndpoint = {
  method: 'GET',
  path: '/users/{id}',  // 从 Express :id 标准化而来
  pathParams: [{ name: 'id', required: true, type: 'string' }],
  source: 'code',
  location: { file: 'src/routes/user.ts', line: 42 }
}
```

## 路径标准化

规范和代码均使用 `{param}` 格式：

```typescript
// OpenAPI: /users/{id} → /users/{id}
// Express: /users/:id  → /users/{id}
```

## 相关链接

- [parseAndNormalizeSpec()](/zh/api/parse-and-normalize-spec)
- [createAnalyzer()](/zh/api/create-analyzer)
- [DriftResult 类型](/zh/api/types/drift-result)