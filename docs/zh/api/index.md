# API 参考

OpenAPI Drift Guard 的编程接口。

## 解析器

### [parseAndNormalizeSpec()](/zh/api/parse-and-normalize-spec)

将 OpenAPI/Swagger 规范文件解析为标准化端点。

```typescript
import { parseAndNormalizeSpec } from 'openapi-drift-guard'

const endpoints = parseAndNormalizeSpec('./openapi.yaml')
console.log(`发现 ${endpoints.length} 个端点`)
```

**支持格式**：OpenAPI 3.x（JSON/YAML）、Swagger 2.0（自动转换）

## 分析器

### [createAnalyzer()](/zh/api/create-analyzer)

创建框架特定的代码分析器。

```typescript
import { createAnalyzer } from 'openapi-drift-guard'

const analyzer = createAnalyzer('express', './src')
const endpoints = analyzer.analyze()
```

**可用框架**：`express`（v0.1.0）、`fastify`/`koa`/`nestjs`/`hono`（v0.2.0）

## 检测器

### [detectDrifts()](/zh/api/detect-drifts)

检测规范端点与代码端点之间的漂移。

```typescript
import { detectDrifts } from 'openapi-drift-guard'

const drifts = detectDrifts(specEndpoints, codeEndpoints)
for (const drift of drifts) {
  console.log(`${drift.severity}: ${drift.message}`)
}
```

**8 种漂移类型**，4 个严重程度级别（critical/high/medium/low）

## 类型

### [NormalizedEndpoint](/zh/api/types/normalized-endpoint)

规范和代码的统一端点模型。

```typescript
interface NormalizedEndpoint {
  method: HttpMethod
  path: string
  pathParams: Param[]
  queryParams: Param[]
  requestBody?: Schema
  responses: Response[]
  source: 'spec' | 'code'
}
```

### [DriftResult](/zh/api/types/drift-result)

漂移检测结果，带严重程度分类。

```typescript
interface DriftResult {
  type: DriftType
  severity: Severity
  method: HttpMethod
  path: string
  message: string
  suggestions?: string[]
}
```

### [所有类型](/zh/api/types/)

完整类型参考，包括 `HttpMethod`、`Severity`、`DriftType`、`Param`、`Schema`、`Response`。

## 错误类

### ValidationError

无效配置或输入时抛出。

### ParseError

规范解析失败时抛出。

## 工具函数

### 格式化工具

```typescript
import {
  formatDriftItem,
  formatDriftReport,
  formatEndpointShort,
  formatSeverityBadge,
  truncate,
} from 'openapi-drift-guard'
```

### 配置工具

```typescript
import { getDefaultConfig, mergeConfig, validateConfig } from 'openapi-drift-guard'

const config = mergeConfig({ framework: 'express', codeDir: './src' })
validateConfig(config)
```