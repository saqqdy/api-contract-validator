# API Contract Validator — 详细开发计划

## 项目概述

**定位**：Claude Code Skill 插件，对比 OpenAPI Spec 与实际代码实现，自动发现 contract drift（契约漂移）

**核心价值**：微服务团队手动对比 API 文档与实现几乎不可能，AI 通过语义理解能发现类型不一致、遗漏字段、未文档化端点等问题

**技术栈**：TypeScript + Node.js

---

## 一、功能拆解

### 核心 Drift 类型

| Drift 类型 | 说明 | 优先级 |
|-----------|------|--------|
| Missing Endpoint | 代码有但文档没记录的端点 | P0 |
| Phantom Endpoint | 文档有但代码不存在的端点 | P0 |
| Type Mismatch | 请求/响应字段类型不一致 | P0 |
| Missing Field | 实现中有但文档未记录的字段 | P0 |
| Extra Field | 文档中有但实现不存在的字段 | P1 |
| Required Mismatch | 必填/选填状态不一致 | P1 |
| Response Code Mismatch | 实际返回的 HTTP 状态码与文档不符 | P2 |
| Deprecated Not Removed | 标记 deprecated 但代码仍在使用的端点 | P2 |

### 功能模块

1. **Spec Parser** — 解析 OpenAPI 规范文件（JSON/YAML，v2/v3/v3.1）
2. **Code Analyzer** — 从源码中提取 API 端点与数据结构
3. **Drift Detector** — 对比 Spec 与实现，输出漂移列表
4. **Report Generator** — 生成人类可读 + 机器可解析的报告
5. **Auto-fix Suggester** — 生成修复建议（更新 spec / 更新代码）
6. **Contract Tester** — 通过 MCP 集成 Postman 做契约测试验证

---

## 二、技术架构

```
┌─────────────────────────────────────────────────┐
│                 CLI / Skill 入口                  │
├─────────────────────────────────────────────────┤
│  Config Loader (.contract-validatorrc / CLI args) │
├──────────┬──────────┬───────────┬───────────────┤
│   Spec   │   Code   │   Drift   │    Report     │
│  Parser  │ Analyzer │ Detector  │   Generator   │
├──────────┴──────────┴───────────┴───────────────┤
│              Shared Type System                   │
│        (统一 Spec 与 Code 的类型表示)              │
├─────────────────────────────────────────────────┤
│           Framework Adapters (插件式)             │
│  Express │ Fastify │ Koa │ NestJS │ Hono │ ...  │
├─────────────────────────────────────────────────┤
│          MCP Integration (Postman)                │
└─────────────────────────────────────────────────┘
```

---

## 三、项目结构

```
api-contract-validator/
├── src/
│   ├── index.ts                  # 入口 + Skill 注册
│   ├── cli.ts                    # CLI 命令定义
│   ├── types/
│   │   ├── spec.ts               # OpenAPI 规范类型定义
│   │   ├── endpoint.ts           # 统一端点模型
│   │   ├── drift.ts              # Drift 结果类型
│   │   └── config.ts             # 配置类型
│   ├── parser/
│   │   ├── index.ts              # Parser 工厂
│   │   ├── openapi-v2.ts         # Swagger 2.0 解析
│   │   ├── openapi-v3.ts         # OpenAPI 3.x 解析
│   │   └── spec-normalizer.ts    # 规范归一化（v2→v3 统一表示）
│   ├── analyzer/
│   │   ├── index.ts              # Analyzer 工厂
│   │   ├── base-analyzer.ts      # 分析器基类
│   │   ├── express.ts            # Express 路由分析
│   │   ├── fastify.ts            # Fastify 路由分析
│   │   ├── nestjs.ts             # NestJS 装饰器分析
│   │   ├── koa.ts                # Koa 路由分析
│   │   └── generic.ts            # 通用静态分析（无框架依赖）
│   ├── detector/
│   │   ├── index.ts              # 检测引擎
│   │   ├── endpoint-matcher.ts   # 端点匹配（路径+方法）
│   │   ├── schema-comparator.ts  # Schema 深度对比
│   │   └── severity.ts           # 严重度评估
│   ├── reporter/
│   │   ├── index.ts              # Reporter 工厂
│   │   ├── console.ts            # 终端输出
│   │   ├── json.ts               # JSON 报告
│   │   ├── markdown.ts           # Markdown 报告
│   │   └── sarif.ts              # SARIF 格式（集成 GitHub Code Scanning）
│   ├── fixer/
│   │   ├── index.ts              # 修复建议引擎
│   │   ├── spec-fixer.ts         # 生成 spec 修补补丁
│   │   └── code-fixer.ts         # 生成代码修复建议
│   └── mcp/
│       └── postman.ts            # Postman MCP 集成
├── test/
│   ├── fixtures/                 # 测试用的 spec 文件和代码样本
│   │   ├── specs/
│   │   └── apps/
│   ├── parser/
│   ├── analyzer/
│   ├── detector/
│   └── reporter/
├── skill/
│   └── api-contract-validator.md # Claude Code Skill 定义
├── package.json
├── tsconfig.json
├── tsdown.config.ts
└── README.md
```

---

## 四、分阶段开发计划

### Phase 1：基础骨架 + Spec 解析（Day 1-2）

**目标**：能读取并解析 OpenAPI 规范，输出统一内部模型

**任务清单**：
1. 初始化项目（package.json, tsconfig, tsdown, vitest）
2. 定义核心类型（`types/` 目录）
3. 实现 Spec Parser
   - OpenAPI 3.x JSON/YAML 解析
   - Swagger 2.0 解析 + 规范归一化
   - `$ref` 引用解析
4. 统一端点模型 `NormalizedEndpoint`
5. 单元测试（覆盖各种 spec 格式）

**验证标准**：
- [ ] 能解析 petstore.yaml 示例
- [ ] v2 spec 正确归一化为 v3 格式
- [ ] `$ref` 引用完整展开
- [ ] 输出 `NormalizedEndpoint[]` 类型正确

---

### Phase 2：代码分析器 — Express（Day 3-4）

**目标**：能从 Express 项目源码中提取路由定义与数据结构

**任务清单**：
1. 实现 Analyzer 基类与工厂
2. Express 路由分析器
   - 识别 `app.get/post/put/delete/patch`
   - 识别 `router.METHOD`
   - 提取路径参数、查询参数
   - 分析请求体 schema（Joi/Zod/TypeScript 接口）
   - 分析响应结构
3. 创建测试用 Express 应用（`test/fixtures/apps/express-app/`）
4. 单元测试

**验证标准**：
- [ ] 从 Express 代码中提取出完整路由列表
- [ ] 路径参数正确识别（`/users/:id`）
- [ ] 请求/响应类型提取准确

---

### Phase 3：Drift 检测引擎（Day 5-6）

**目标**：Spec 与 Code 对比，输出 drift 列表

**任务清单**：
1. 端点匹配器（路径归一化 + 方法匹配）
   - `/users/{id}` vs `/users/:id`
   - 处理路径参数格式差异
2. Schema 深度对比器
   - 类型对比（string/number/boolean/array/object）
   - 必填字段对比
   - 嵌套对象递归对比
3. Drift 严重度评估
4. Drift 结果模型定义
5. 单元测试（构造已知 drift 的 spec + code 对）

**验证标准**：
- [ ] Missing/Phantom endpoint 正确检测
- [ ] Type mismatch 准确识别
- [ ] 严重度分级合理
- [ ] 无误报（代码与 spec 一致时零 drift）

---

### Phase 4：报告生成 + CLI（Day 7-8）

**目标**：可用的 CLI 工具，输出多种格式报告

**任务清单**：
1. Console Reporter（彩色终端输出，类似 eslint）
2. JSON Reporter（机器可读）
3. Markdown Reporter（适合 PR comment）
4. CLI 命令定义
   - `validate` — 主命令
   - `init` — 生成配置文件
   - `report` — 仅输出报告
5. 配置文件支持（`.contract-validatorrc`）

**CLI 使用示例**：
```bash
# 基础用法
api-contract-validator validate --spec ./openapi.yaml --src ./src

# 指定框架
api-contract-validator validate --spec ./openapi.yaml --src ./src --framework express

# 输出格式
api-contract-validator validate --spec ./openapi.yaml --src ./src --output json > report.json

# 仅检查特定 drift 类型
api-contract-validator validate --spec ./openapi.yaml --src ./src --only missing-endpoint,type-mismatch
```

**验证标准**：
- [ ] CLI 可正常安装运行
- [ ] Console 输出美观且信息完整
- [ ] JSON 输出结构正确
- [ ] Markdown 输出适合贴到 PR

---

### Phase 5：多框架支持 + 通用分析器（Day 9-12）

**目标**：支持主流 Node.js 框架，无框架时也能分析

**任务清单**：
1. Fastify 分析器（利用 `fastify.route()` schema 定义）
2. NestJS 分析器（装饰器解析 `@Controller`, `@Get`, `@Body`）
3. Koa 分析器（router middleware 解析）
4. 通用分析器（基于 AST 的 HTTP 方法 + 路径模式识别）
5. 各框架测试应用 + 单元测试

**验证标准**：
- [ ] Fastify 项目路由正确提取
- [ ] NestJS 装饰器语义正确解析
- [ ] 无框架项目也能检测 HTTP 端点
- [ ] 自动框架检测（无需 `--framework` 参数）

---

### Phase 6：修复建议引擎（Day 13-14）

**目标**：不只是发现问题，还要给出修复方向

**任务清单**：
1. Spec 修复建议生成
   - 发现 Missing Endpoint → 生成应添加的 openapi 片段
   - 发现 Type Mismatch → 给出正确的 schema 定义
2. Code 修复建议生成
   - 发现 Phantom Endpoint → 提示移除无用代码或补充文档
   - 发现 Required Mismatch → 给出代码调整方向
3. 交互模式（Claude Code Skill 内可逐条确认修复）

**验证标准**：
- [ ] 修复建议准确且可直接应用
- [ ] 生成的 OpenAPI 片段语法正确
- [ ] 交互模式下用户可逐一确认/跳过

---

### Phase 7：Claude Code Skill 集成（Day 15-16）

**目标**：作为 Claude Code Skill 无缝集成到开发工作流

**任务清单**：
1. 编写 Skill 定义文件（`skill/api-contract-validator.md`）
2. 触发场景定义
   - PR 审查时自动检查 API 契约
   - 新增/修改端点时提示更新 spec
   - 手动 `/api-contract-validator` 触发
3. 与 Claude Code 对话集成
   - 支持自然语言查询："哪些 API 没有文档化？"
   - 支持增量检查："只检查这次 PR 改动的端点"
4. Hook 集成（pre-commit / CI 触发）

**验证标准**：
- [ ] Skill 可被 Claude Code 正确加载
- [ ] 触发条件工作正常
- [ ] 增量检查只分析变更部分

---

### Phase 8：MCP 集成 + 契约测试（Day 17-19）

**目标**：通过 Postman MCP 做真实的契约测试验证

**任务清单**：
1. Postman MCP 集成
   - 将检测到的 endpoint 信息同步到 Postman Collection
   - 触发 Postman Collection Runner 执行契约测试
   - 读取测试结果，关联到 drift 报告
2. 运行时验证
   - 启动本地服务器（或连接测试环境）
   - 发送实际请求验证响应结构
   - 对比实际响应与 spec 定义
3. 持续监控模式
   - 定时检查 API 契约合规率
   - 仪表盘输出（可集成 Grafana）

**验证标准**：
- [ ] Postman Collection 自动同步
- [ ] 实际请求验证响应结构一致性
- [ ] 契约测试结果可关联到 drift 报告

---

### Phase 9：SARIF + CI/CD 集成（Day 20-21）

**目标**：无缝融入现有 CI/CD 工作流

**任务清单**：
1. SARIF Reporter（集成 GitHub Code Scanning）
2. GitHub Actions Action
3. GitLab CI 模板
4. 退出码语义（0=无 drift, 1=有 drift, 2=错误）
5. CI 缓存策略（增量分析）

**验证标准**：
- [ ] SARIF 报告可导入 GitHub Code Scanning
- [ ] GitHub Action 可正常使用
- [ ] CI 中 drift 检测正确阻断流水线

---

## 五、关键设计决策

### 1. 统一类型系统

Spec 和 Code 分析结果都归一化为 `NormalizedEndpoint`：

```typescript
interface NormalizedEndpoint {
  method: HttpMethod           // GET | POST | PUT | DELETE | PATCH
  path: string                 // 统一为 /users/{id} 格式
  pathParams: Param[]          // 路径参数
  queryParams: Param[]         // 查询参数
  requestHeaders: Param[]      // 请求头
  requestBody: Schema | null   // 请求体 schema
  responses: Response[]        // 响应定义
  tags: string[]               // 分组标签
  deprecated: boolean           // 是否废弃
  source: 'spec' | 'code'      // 来源标记
}

interface Schema {
  type: string
  properties: Record<string, SchemaProperty>
  required: string[]
  items?: Schema               // 数组元素
  additionalProperties?: Schema | boolean
}

interface SchemaProperty {
  type: string
  format?: string              // date-time, int64, etc.
  nullable?: boolean
  enum?: string[]
  description?: string
}
```

### 2. 端点匹配策略

路径归一化规则：
- Express `/users/:id` → `/users/{id}`
- Fastify `/users/:id` → `/users/{id}`
- NestJS 通过装饰器路径参数 → `/users/{id}`
- 通配符 `/files/*` → `/files/{path}`

匹配算法：
1. 精确匹配：路径 + 方法完全一致
2. 参数化匹配：路径结构一致，参数名可不同
3. 模糊匹配：相似度阈值 > 0.8 时标记为 "可能匹配"

### 3. Schema 对比策略

递归对比 `Schema` 对象：
1. 顶层类型必须一致
2. `required` 集合做差集
3. `properties` 逐属性对比
4. `additionalProperties` 策略差异标记为低严重度
5. `format` 不一致标记为建议级

### 4. 框架自动检测

自动检测策略（按优先级）：
1. 读写 `package.json` 的 `dependencies`
2. 特征文件检测（`nest-cli.json`, `fastify` 配置文件等）
3. 入口文件 AST 分析（import 语句模式）
4. 降级到通用分析器

---

## 六、测试策略

### 测试金字塔

```
        ┌──────────┐
        │  E2E 测试  │   ← 完整 spec + 真实项目 对比
        │   (少量)    │
        ├──────────┤
        │  集成测试   │   ← Parser + Analyzer + Detector 联动
        │   (适量)    │
        ├──────────┤
        │  单元测试   │   ← 每个模块独立测试
        │   (大量)    │
        └──────────┘
```

### 测试用例维度

| 维度 | 示例 |
|------|------|
| Spec 格式 | JSON / YAML, v2 / v3 / v3.1 |
| 框架 | Express / Fastify / NestJS / Koa / 无框架 |
| Drift 类型 | 8 种 drift 各至少 3 个用例 |
| 边界情况 | 空 spec / 空代码 / 巨型 spec (1000+ 端点) |
| 错误处理 | 无效 spec / 解析失败的代码 / 循环 $ref |

---

## 七、性能考量

| 场景 | 目标 | 策略 |
|------|------|------|
| 小型项目 (50 端点) | < 1s | 直接分析 |
| 中型项目 (200 端点) | < 5s | 增量分析 + 缓存 |
| 大型项目 (1000+ 端点) | < 30s | 并行分析 + 增量 + 缓存 |
| CI 场景 | 只分析变更文件 | Git diff 范围限定 |

---

## 八、与 Claude Code 集成的关键接口

### Skill 触发条件

```yaml
triggers:
  - description: "当用户修改了 OpenAPI spec 文件或 API 路由代码时"
    patterns:
      - "**/openapi.{yaml,yml,json}"
      - "**/swagger.{yaml,yml,json}"
      - "**/routes/**"
      - "**/controllers/**"
  - command: "/api-contract-validator"
  - description: "PR 审查时自动检查"
```

### Skill 能力声明

```yaml
capabilities:
  - "对比 OpenAPI 规范与代码实现，发现 drift"
  - "支持 Express / Fastify / NestJS / Koa 框架"
  - "生成修复建议和 OpenAPI 补丁"
  - "输出多种格式报告（终端 / JSON / Markdown / SARIF）"
  - "集成 Postman MCP 做契约测试"
  - "支持增量检查，适配 CI/CD"
```

---

## 九、里程碑总览

| 阶段 | 时间 | 交付物 | 核心指标 |
|------|------|--------|----------|
| Phase 1 | Day 1-2 | Spec Parser | 能解析 OpenAPI v2/v3 |
| Phase 2 | Day 3-4 | Express Analyzer | 能从 Express 代码提取端点 |
| Phase 3 | Day 5-6 | Drift Detector | 能检测 8 种 drift |
| Phase 4 | Day 7-8 | CLI + Reporter | 可作为 CLI 工具使用 |
| Phase 5 | Day 9-12 | 多框架支持 | 支持 4+ 框架 |
| Phase 6 | Day 13-14 | Fix Suggester | 可生成修复建议 |
| Phase 7 | Day 15-16 | Claude Code Skill | 可作为 Skill 运行 |
| Phase 8 | Day 17-19 | MCP + 契约测试 | Postman 集成 |
| Phase 9 | Day 20-21 | CI/CD 集成 | GitHub Action 可用 |

**MVP 定义**（Phase 1-4 完成）：能对 Express 项目执行 API 契约校验，输出 drift 报告

**正式发布定义**（Phase 1-7 完成）：可作为 Claude Code Skill 正式使用

---

## 十、风险与应对

| 风险 | 影响 | 应对 |
|------|------|------|
| TypeScript 类型提取不完整 | 遗漏字段 | Phase 2 优先支持 Joi/Zod；TS 接口提取作为增强 |
| 框架路由注册方式多样 | 遗漏端点 | 通用分析器作为兜底；社区贡献补充 |
| 巨型 spec 解析性能 | 处理慢 | 增量分析 + 缓存；CI 场景限定范围 |
| $ref 循环引用 | 解析死循环 | 检测循环 + 引用深度限制 |
| OpenAPI 规范本身有误 | 误报 | 支持 strict/lenient 模式；spec 校验前置步骤 |
