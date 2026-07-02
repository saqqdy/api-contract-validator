# parseAndNormalizeSpec()

将 OpenAPI/Swagger 规范解析为标准化端点。

## 签名

```typescript
function parseAndNormalizeSpec(specPath: string): NormalizedEndpoint[]
```

## 参数

| 参数 | 类型 | 描述 |
|------|------|------|
| `specPath` | `string` | OpenAPI/Swagger 文件路径（JSON 或 YAML） |

## 返回值

`NormalizedEndpoint[]` — 标准化端点定义数组

## 支持格式

- **OpenAPI 3.x** — 完整支持 JSON 和 YAML
- **Swagger 2.0** — 自动转换为 OpenAPI 3.0
- **$ref 引用** — 递归解析，支持循环检测

## 示例

### 基本用法

```typescript
import { parseAndNormalizeSpec } from 'api-contract-validator'

const endpoints = parseAndNormalizeSpec('./openapi.yaml')

console.log(`发现 ${endpoints.length} 个端点`)

for (const endpoint of endpoints) {
  console.log(`${endpoint.method} ${endpoint.path}`)
}
```

### OpenAPI 3.x 示例

```yaml
openapi: 3.0.3
info:
  title: User API
  version: 1.0.0
paths:
  /users/{id}:
    get:
      operationId: getUser
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
```

```typescript
const endpoints = parseAndNormalizeSpec('./openapi.yaml')
// 结果: NormalizedEndpoint[] 统一结构
```

## 功能特性

### $ref 解析

递归解析 `$ref` 引用，支持循环引用检测。

### 路径参数标准化

路径参数被提取并标准化为 `{param}` 格式。

### Swagger 2.0 支持

自动将 Swagger 2.0 转换为 OpenAPI 3.0 格式。

## 错误处理

以下情况抛出 `ParseError`：
- 无效的文件路径
- 格式错误的 JSON/YAML
- 无效的 OpenAPI/Swagger 结构
- 无法解析的 `$ref` 引用

## 相关链接

- [NormalizedEndpoint 类型](/zh/api/types/normalized-endpoint)
- [createAnalyzer()](/zh/api/create-analyzer)
- [detectDrifts()](/zh/api/detect-drifts)