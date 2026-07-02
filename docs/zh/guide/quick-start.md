# 快速上手

## 使用技能

在 Claude Code 中运行：

```
/validate openapi.yaml src/
```

输出：

```
🔍 正在验证 API 契约...

  规范: openapi.yaml
  代码: src/

✅ 规范已解析: 15 个端点
✅ 代码已分析: 12 个端点

📊 检测到漂移: 3 个问题

  🔴 破坏性: DELETE /users/{id} 端点在代码中缺失
  🟡 警告: POST /orders.userId 字段类型不匹配
  🟢 信息: GET /products.tags 字段已新增（可选）

💡 建议操作:
  1. 重新添加 DELETE /users/{id} 端点
  2. 修复 userId 类型以匹配规范
```

## 使用 API

```typescript
import { parseAndNormalizeSpec, createAnalyzer, detectDrifts } from 'api-contract-validator'

// 解析 OpenAPI 规范
const specEndpoints = parseAndNormalizeSpec('./openapi.yaml')
console.log(`规范端点: ${specEndpoints.length}`)

// 分析 Express 代码
const analyzer = createAnalyzer('express', './src')
const codeEndpoints = analyzer.analyze()
console.log(`代码端点: ${codeEndpoints.length}`)

// 检测漂移
const drifts = detectDrifts(specEndpoints, codeEndpoints)
console.log(`发现漂移: ${drifts.length}`)
```

## CLI 使用

```bash
# 验证契约
npx api-contract-validator validate --spec ./openapi.yaml --code ./src

# 带选项
npx api-contract-validator validate   --spec ./openapi.yaml   --code ./src   --framework express   --output json
```