# API Contract Validator — 版本发布计划

## 版本策略

采用 [Semantic Versioning 2.0](https://semver.org/) 规范：

```
MAJOR.MINOR.PATCH[-PRERELEASE]

MAJOR  — 不兼容的 API 变更
MINOR  — 向后兼容的新功能
PATCH  — 向后兼容的 Bug 修复
PRERELEASE — alpha / beta / rc
```

### 分支策略

| 分支 | 用途 | 命名 |
|------|------|------|
| `main` | 稳定发布 | — |
| `dev` | 开发集成分支 | — |
| `feature/*` | 功能开发 | `feature/express-analyzer` |
| `fix/*` | 缺陷修复 | `fix/ref-cycle-detection` |
| `release/*` | 发版准备 | `release/v0.1.0` |

### 发布渠道

| 渠道 | 包名 / 地址 | 触发方式 |
|------|------------|----------|
| npm | `api-contract-validator` | `npm publish` |
| GitHub Release | `saqqdy/api-contract-validator` | Git tag push |
| Claude Code Skill Registry | 待集成 | 发版自动同步 |

---

## 版本路线图

### v0.1.0-alpha.1 — Spec Parser

> **时间**：Day 2
> **阶段**：Phase 1
> **目标**：验证核心解析能力，仅供内部测试

**包含范围**：
- OpenAPI 3.x JSON/YAML 解析
- Swagger 2.0 解析 + 归一化
- `$ref` 引用解析（含外部文件引用）
- `NormalizedEndpoint` 统一模型输出
- 基础 CLI `parse` 子命令

**质量门禁**：
- [ ] 单元测试覆盖率 ≥ 80%
- [ ] 能正确解析官方 petstore v2/v3 示例
- [ ] 循环 `$ref` 不死循环
- [ ] 无 TypeScript 编译错误

**不包含**：代码分析、drift 检测、报告生成

---

### v0.1.0-alpha.2 — Express Analyzer

> **时间**：Day 4
> **阶段**：Phase 2
> **目标**：验证从 Express 代码提取端点的能力

**包含范围**：
- Express 路由分析器
  - `app.METHOD` / `router.METHOD` 识别
  - 路径参数 `/users/:id` 提取
  - 请求体 schema（Joi/Zod 基础支持）
  - 响应结构推断
- Analyzer 工厂 + 自动框架检测
- CLI `analyze` 子命令

**质量门禁**：
- [ ] 测试用 Express 应用路由 100% 提取
- [ ] 路径参数正确归一化
- [ ] 框架自动检测准确率 ≥ 95%（对已知项目）

**不包含**：drift 对比、其他框架

---

### v0.1.0-beta.1 — Drift 检测 MVP

> **时间**：Day 6
> **阶段**：Phase 3
> **目标**：核心能力闭环 — 能检测 drift

**包含范围**：
- 端点匹配器（精确 + 参数化 + 模糊）
- Schema 深度对比器
- 8 种 drift 全部可检测
- 严重度分级（error / warning / info）
- Drift 结果 JSON 输出
- CLI `detect` 子命令

**质量门禁**：
- [ ] 8 种 drift 各有 ≥ 2 个测试用例
- [ ] Spec 和代码一致时零 drift（零误报）
- [ ] 严重度标注合理（P0 drift 标为 error）

**不包含**：美观报告、修复建议、其他框架

---

### v0.1.0 — 首个可用版本（MVP）

> **时间**：Day 8
> **阶段**：Phase 4
> **目标**：可正式安装使用的 CLI 工具

**包含范围**：
- Console Reporter（彩色格式化输出）
- JSON Reporter
- Markdown Reporter
- CLI 主命令 `validate`
- 子命令 `init`（生成配置文件）
- 配置文件支持（`.contract-validatorrc`）
- 退出码语义：0=无 drift, 1=有 drift, 2=执行错误
- README.md 基础文档

**质量门禁**：
- [ ] `npm i -g api-contract-validator` 可正常安装
- [ ] `validate` 命令端到端跑通
- [ ] Console 输出信息完整美观
- [ ] Markdown 输出可贴 PR comment
- [ ] 集成测试覆盖主流程
- [ ] 无已知 P0/P1 Bug

**发布流程**：
1. 创建 `release/v0.1.0` 分支
2. 更新 CHANGELOG.md
3. 运行完整测试套件
4. `npm publish --tag latest`
5. 创建 GitHub Release + Git tag `v0.1.0`
6. 合并回 `main`

---

### v0.2.0-alpha.1 — Fastify 支持

> **时间**：Day 10
> **阶段**：Phase 5（前半）
> **目标**：扩展第二个框架

**包含范围**：
- Fastify 路由分析器
  - `fastify.route()` schema 定义提取
  - `fastify.get/post()` 简写形式
  - Fastify schema → NormalizedEndpoint 转换
- Fastify 测试应用

**质量门禁**：
- [ ] Fastify 示例项目路由 100% 提取
- [ ] Fastify schema 定义准确读取

---

### v0.2.0-alpha.2 — NestJS + Koa 支持

> **时间**：Day 12
> **阶段**：Phase 5（后半）
> **目标**：覆盖主流框架 + 通用兜底

**包含范围**：
- NestJS 分析器（装饰器解析）
- Koa 分析器（koa-router）
- 通用分析器（AST 模式匹配兜底）
- 自动框架检测增强（package.json + 特征文件）
- 各框架测试应用

**质量门禁**：
- [ ] 4 个框架各有完整测试应用
- [ ] 自动检测准确率 ≥ 90%
- [ ] 无框架项目能兜底提取

---

### v0.2.0 — 多框架版本

> **时间**：Day 12
> **阶段**：Phase 5 完成
> **目标**：正式支持多框架

**包含范围**：
- 合并 v0.2.0-alpha.1 + alpha.2 所有功能
- 框架适配器文档
- `--framework` 参数可省（自动检测）
- 性能基准测试（50/200/1000 端点场景）

**质量门禁**：
- [ ] 4 框架集成测试全绿
- [ ] 200 端点项目 < 5s
- [ ] 无 P0/P1 Bug

**发布流程**：同 v0.1.0

---

### v0.3.0-beta.1 — 修复建议

> **时间**：Day 14
> **阶段**：Phase 6
> **目标**：从"发现问题"升级到"解决问题"

**包含范围**：
- Spec 修复建议生成
  - Missing Endpoint → 生成 OpenAPI path 片段
  - Type Mismatch → 生成正确 schema
  - Missing Field → 生成属性定义
- Code 修复建议生成
  - Phantom Endpoint → 标记废弃 / 提示补充文档
  - Required Mismatch → 给出调整方向
- CLI `fix` 子命令（输出修复补丁）
- 交互模式雏形（`--interactive`）

**质量门禁**：
- [ ] 生成的 OpenAPI 片段可通过 spec 校验
- [ ] 修复建议覆盖全部 8 种 drift
- [ ] 交互模式可逐一确认/跳过

---

### v0.3.0 — Skill 就绪版本

> **时间**：Day 16
> **阶段**：Phase 7
> **目标**：可作为 Claude Code Skill 使用

**包含范围**：
- Claude Code Skill 定义文件
- 触发场景配置
- 自然语言查询支持
- 增量检查（Git diff 范围）
- Hook 集成模板（pre-commit / CI）
- 完整使用文档

**质量门禁**：
- [ ] Skill 可被 Claude Code 正确加载和触发
- [ ] 自然语言查询可解析为检测指令
- [ ] 增量检查结果与全量检查一致（对变更部分）
- [ ] 使用文档完整覆盖所有功能

**里程碑意义**：此版本为 **正式发布候选**，功能完备度达到 1.0 的核心要求

---

### v0.4.0-beta.1 — MCP + 契约测试

> **时间**：Day 19
> **阶段**：Phase 8
> **目标**：运行时验证，超越静态分析

**包含范围**：
- Postman MCP 集成
  - 自动同步 endpoint → Postman Collection
  - 触发 Collection Runner
  - 结果关联回 drift 报告
- 运行时验证
  - 本地服务启动 + 实际请求发送
  - 响应结构 vs Spec 对比
- 合规率统计输出

**质量门禁**：
- [ ] Postman Collection 正确生成并可运行
- [ ] 运行时验证发现的结构差异可关联到 drift
- [ ] 整个流程无需手动干预

---

### v0.4.0 — CI/CD 集成版本

> **时间**：Day 21
> **阶段**：Phase 9
> **目标**：完整融入 DevOps 工具链

**包含范围**：
- v0.4.0-beta.1 全部功能
- SARIF Reporter
- GitHub Actions Action（`saqqdy/api-contract-validator-action`）
- GitLab CI 模板
- CI 缓存策略文档
- 退出码标准化

**质量门禁**：
- [ ] SARIF 报告可导入 GitHub Code Scanning
- [ ] GitHub Action 在公开仓库可正常使用
- [ ] CI 缓存使二次运行耗时降低 ≥ 50%

---

### v1.0.0-rc.1 — 发布候选

> **时间**：Day 23-24
> **目标**：全面质量验证 + 文档完善

**验证清单**：
- [ ] 全部单元 + 集成 + E2E 测试通过
- [ ] 性能达标（50端点<1s, 200端点<5s, 1000端点<30s）
- [ ] 4 框架在生产级项目验证
- [ ] 安全审计（无依赖漏洞）
- [ ] 文档完整（README + API Reference + Skill Guide + CI Guide）
- [ ] Breaking change 审查（0.x → 1.0 迁移指南）
- [ ] CHANGELOG 从 v0.1.0 起完整

---

### v1.0.0 — 正式发布

> **时间**：Day 25
> **目标**：生产就绪的首个稳定版本

**发布标准**：
1. rc.1 验证清单全部通过
2. 至少 3 个外部用户试用反馈已处理
3. 无 P0 Bug，P1 Bug ≤ 2 且有 workaround

**发布活动**：
- npm `latest` tag
- GitHub Release（含完整 CHANGELOG）
- 博客文章 / 推广
- Claude Code Skill Registry 提交
- 社区公告（GitHub Discussions + Discord）

---

## 后续版本规划

### v1.1.0 — 框架扩展

- Hono 支持
- tRPC support（从 router 定义推断 OpenAPI）
- Next.js API Routes 支持

### v1.2.0 — Schema 增强

- 自定义验证规则插件
- 正则 pattern 对比
- 枚举值差异检测增强

### v2.0.0 — 多语言支持

- Go（Gin / Echo / Fiber）
- Python（FastAPI / Django REST / Flask）
- Java（Spring Boot）

> **Breaking**：可能重构 `NormalizedEndpoint` 模型以支持多语言差异

---

## CHANGELOG 模板

每个版本须维护 `CHANGELOG.md`，格式遵循 [Keep a Changelog](https://keepachangelog.com/)：

```markdown
## [0.3.0] - 2026-07-05

### Added
- 修复建议引擎，支持 8 种 drift 类型的自动修复建议
- Claude Code Skill 定义文件与触发场景
- 增量检查模式（`--diff` 参数）
- CLI `fix` 子命令

### Changed
- `validate` 命令输出格式优化，新增 drift 摘要统计

### Fixed
- 修复嵌套 $ref 深度超过 10 层时的栈溢出问题 (#42)
- 修复 Fastify schema 中 `enum` 未被提取的问题 (#45)
```

---

## 发布检查清单

每个版本发布前须完成：

| 检查项 | 命令 / 操作 |
|--------|------------|
| 编译通过 | `pnpm build` |
| 类型检查 | `pnpm typecheck` |
| Lint 通过 | `pnpm lint` |
| 全量测试 | `pnpm test` |
| 测试覆盖率 | `pnpm test:coverage`（门槛 ≥ 80%） |
| 安全审计 | `pnpm audit`（无 high/critical） |
| 版本号更新 | `package.json` + `CHANGELOG.md` |
| Git tag | `git tag v0.x.0` |
| npm 发布 | `npm publish [--tag beta]` |
| GitHub Release | 附带 CHANGELOG 段落 + 压缩包 |

---

## 总结时间线

```
Day 2    v0.1.0-alpha.1   Spec Parser
Day 4    v0.1.0-alpha.2   Express Analyzer
Day 6    v0.1.0-beta.1    Drift Detector
Day 8    v0.1.0           ★ MVP 正式版
Day 10   v0.2.0-alpha.1   Fastify
Day 12   v0.2.0           多框架版
Day 14   v0.3.0-beta.1    修复建议
Day 16   v0.3.0           Skill 就绪版
Day 19   v0.4.0-beta.1    MCP + 契约测试
Day 21   v0.4.0           CI/CD 集成版
Day 24   v1.0.0-rc.1      发布候选
Day 25   v1.0.0           ★ 正式发布
```

**5 个关键里程碑**：
1. 🟢 **v0.1.0** — CLI 可用，Express 契约校验闭环
2. 🟢 **v0.2.0** — 4 框架覆盖
3. 🟢 **v0.3.0** — Claude Code Skill 就绪
4. 🟢 **v0.4.0** — CI/CD 全链路
5. 🔴 **v1.0.0** — 生产就绪
