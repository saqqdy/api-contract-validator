# 版本路线图

OpenAPI Drift Guard 通过主题版本迭代演进。

## 当前版本

### v0.1.0 — Daybreak（已发布）

**主题**：规范解析 + Express 分析器

**能力**：
- ✅ `parseAndNormalizeSpec()` — 解析 OpenAPI 3.x/Swagger 2.0
- ✅ `$ref` 解析 — 递归引用解析
- ✅ `NormalizedEndpoint` — 规范和代码的统一模型
- ✅ Express 分析器 — 路由提取
- ✅ 漂移检测 — 8 种漂移类型
- ✅ 严重程度分类 — critical/high/medium/low
- ✅ CLI 支持，零安装 `npx`

## 计划版本

### v0.2.0 — Sunrise

**主题**：多框架支持

**计划功能**：
- Fastify 分析器
- NestJS 分析器（装饰器解析）
- Koa 分析器
- Hono 分析器
- 通用分析器（AST 回退）

### v0.3.0 — Dawn

**主题**：Claude Code Skill 就绪

**计划功能**：
- 自然语言查询
- 增量验证（Git diff）
- 修复建议
- 交互模式

### v0.4.0 — Ember

**主题**：CI/CD 集成

**计划功能**：
- SARIF 报告器
- GitHub Action
- GitLab CI 模板
- Pre-commit hook

### v1.0.0 — Lighthouse

**主题**：生产就绪

**计划功能**：
- 性能优化
- 企业特性
- MCP 集成
- 完整文档

## 发布理念

- **渐进价值**：每个版本交付可用功能
- **向后兼容**：API 在小版本间保持稳定
- **社区驱动**：路线图由用户反馈塑造

## 变更日志

详见 [CHANGELOG.md](https://github.com/saqqdy/openapi-drift-guard/blob/master/CHANGELOG.md) 发布历史。