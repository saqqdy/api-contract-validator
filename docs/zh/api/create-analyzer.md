# createAnalyzer()

创建框架特定的代码分析器。

## 签名

```typescript
function createAnalyzer(framework: Framework, codeDir: string): Analyzer
```

## 参数

| 参数 | 类型 | 描述 |
|------|------|------|
| `framework` | `Framework` | 目标框架类型 |
| `codeDir` | `string` | 源代码目录路径 |

## 框架类型

```typescript
type Framework = 
  | 'express'    // Express.js (✅ v0.1.0)
  | 'fastify'    // Fastify (📋 v0.2.0)
  | 'koa'        // Koa (📋 v0.2.0)
  | 'nestjs'     // NestJS (📋 v0.2.0)
  | 'hono'       // Hono (📋 v0.2.0)
  | 'generic'    // 通用 AST (📋 v0.2.0)
```

## 返回值

`Analyzer` 实例，包含 `analyze()` 方法

## 示例

### Express 分析器 (v0.1.0)

```typescript
import { createAnalyzer } from 'api-contract-validator'

const analyzer = createAnalyzer('express', './src')
const endpoints = analyzer.analyze()

console.log(`发现 ${endpoints.length} 个端点`)

for (const endpoint of endpoints) {
  console.log(`${endpoint.method} ${endpoint.path}`)
}
```

### Express 路由模式

从以下模式提取路由：

```typescript
// app.METHOD 模式
app.get('/users', (req, res) => { ... })
app.post('/users', (req, res) => { ... })

// router.METHOD 模式
router.get('/users/:id', (req, res) => { ... })

// 嵌套路由器
app.use('/api', router)
```

### 路径标准化

Express 路径参数会被标准化：

```typescript
// Express 代码: /users/:id
// 标准化后:   /users/{id}
```

## Analyzer 接口

```typescript
interface Analyzer {
  analyze(): NormalizedEndpoint[]
}
```

## 错误处理

以下情况抛出 `ValidationError`：
- 未知的框架类型
- 无效的代码目录
- 不支持的框架（在 v0.1.0）

## 相关链接

- [NormalizedEndpoint 类型](/zh/api/types/normalized-endpoint)
- [parseAndNormalizeSpec()](/zh/api/parse-and-normalize-spec)
- [detectDrifts()](/zh/api/detect-drifts)
- [路线图](/zh/guide/roadmap) — 多框架时间线