# Claude Code Plugin vs Skill 深度对比分析

> 本文档详细分析 Claude Code 两种扩展机制：Plugin（插件）和 Skill（技能）的区别、适用场景及代码层面的差异。

---

## 目录

1. [概述](#概述)
2. [架构对比](#架构对比)
3. [Plugin 详解](#plugin-详解)
4. [Skill 详解](#skill-详解)
5. [能力对比矩阵](#能力对比矩阵)
6. [适用场景分析](#适用场景分析)
7. [代码层面差异](#代码层面差异)
8. [最佳实践](#最佳实践)
9. [总结](#总结)

---

## 概述

### Plugin（插件）

Plugin 是 Claude Code 的**全功能扩展系统**，提供了完整的扩展能力，包括自定义命令、技能、代理、钩子、MCP 服务器等。插件可以被发布到市场、npm 或 GitHub 仓库，供其他用户安装使用。

### Skill（技能）

Skill 是一种**轻量级的指令扩展**，本质上是带有 frontmatter 元数据的 Markdown 文件。技能通过 slash 命令（`/skill-name`）触发，提供自定义的指令和上下文注入能力。技能可以是项目级（`.claude/skills/`）或个人级（`~/.claude/skills/`）。

---

## 架构对比

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Claude Code Extension Ecosystem                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────┐  ┌──────────────────────────┐  │
│  │            PLUGIN                   │  │         SKILL            │  │
│  │  (Full-featured Extension)         │  │  (Lightweight Command)    │  │
│  ├────────────────────────────────────┤  ├──────────────────────────┤  │
│  │  • plugin.json (manifest)          │  │  • SKILL.md (single file)│  │
│  │  • skills/ (multiple)              │  │  • frontmatter metadata  │  │
│  │  • agents/ (custom agents)         │  │  • instructions only     │  │
│  │  • hooks/ (event handlers)        │  │                          │  │
│  │  • mcp-servers/ (MCP integration)  │  │                          │  │
│  │  • commands/ (legacy)              │  │                          │  │
│  │  • bin/ (executables)              │  │                          │  │
│  │  • settings.json (defaults)        │  │                          │  │
│  └────────────────────────────────────┘  └──────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────┐  ┌──────────────────────────┐  │
│  │  DISTRIBUTION                      │  │  DISTRIBUTION            │  │
│  │  • Marketplace                     │  │  • Project-level        │  │
│  │  • npm registry                    │  │  • Personal (~/.claude)  │  │
│  │  • GitHub repository               │  │  • Git (in repo)        │  │
│  └────────────────────────────────────┘  └──────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Plugin 详解

### 目录结构

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # 插件清单（必须）
├── skills/                   # 技能目录
│   └── my-skill/
│       └── SKILL.md          # 技能定义
├── agents/                   # 自定义代理
│   ├── security-reviewer.md
│   └── compliance-checker.md
├── hooks/                    # 事件钩子
│   └── hooks.json
├── commands/                 # 遗留：命令目录
│   └── custom-cmd.md
├── .mcp.json                 # MCP 服务器配置
├── .lsp.json                 # LSP 服务器配置（可选）
├── monitors/                 # 后台监控
│   └── monitors.json
├── bin/                      # 可执行文件
│   └── my-tool.sh
└── settings.json            # 默认设置
```

### plugin.json 清单结构

```json
{
  "name": "enterprise-tools",
  "version": "2.1.0",
  "description": "Enterprise workflow automation tools",
  "author": {
    "name": "Enterprise Team",
    "email": "team@example.com"
  },
  "defaultEnabled": false,
  "homepage": "https://docs.example.com/plugins/enterprise-tools",
  "repository": "https://github.com/company/enterprise-plugin",
  "license": "MIT",
  "keywords": ["enterprise", "workflow", "automation"],
  "category": "productivity",
  "commands": [
    "./commands/core/",
    "./commands/enterprise/"
  ],
  "agents": [
    "./agents/security-reviewer.md",
    "./agents/compliance-checker.md"
  ],
  "skills": [
    "./skills/"
  ],
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Command executed' >> ~/claude.log"
          }
        ]
      }
    ]
  },
  "mcpServers": {
    "enterprise-db": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"]
    }
  },
  "dependencies": ["required-plugin"],
  "strict": false
}
```

### Plugin 核心组件

#### 1. Skills（技能）
插件可以包含多个技能，每个技能是一个独立的 Markdown 文件。

#### 2. Agents（代理）
自定义代理定义了特定的任务处理能力：
```markdown
---
name: security-reviewer
description: Reviews code for security vulnerabilities
tools:
  - Read
  - Grep
  - Glob
---

You are a security reviewer. Focus on:
- OWASP Top 10 vulnerabilities
- Authentication/authorization flaws
- Sensitive data exposure
```

#### 3. Hooks（钩子）
钩子允许在工具执行前后自动触发行为：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "/scripts/validate-bash.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "http",
            "url": "https://hooks.example.com/notify",
            "timeout": 10
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Session ended' >> ~/claude-sessions.log"
          }
        ]
      }
    ]
  }
}
```

#### 4. MCP Servers（模型上下文协议服务器）
```json
{
  "mcpServers": {
    "database": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/db-server.js"]
    }
  }
}
```

#### 5. Settings（设置）
```json
{
  "permissions": {
    "allow": [
      "Read(**)",
      "Bash(git *)",
      "Bash(npm *)"
    ],
    "deny": [
      "Bash(rm -rf /*)"
    ]
  }
}
```

---

## Skill 详解

### 目录结构

```
# 项目级技能
.claude/skills/
├── my-skill/
│   ├── SKILL.md             # 或 skill.md
│   └── CLAUDE.md            # 可选的上下文文件
└── another-skill/
    └── SKILL.md

# 个人级技能
~/.claude/skills/
├── personal-skill/
│   └── SKILL.md
└── ...
```

### SKILL.md 结构

```markdown
---
name: pr-summary
description: Summarize changes in a pull request
triggers:
  - /pr-summary
  - /summarize-pr
context: fork
agent: Explore
---

## Pull request context

- PR diff: !`gh pr diff`
- PR comments: !`gh pr view --comments`
- Changed files: !`gh pr diff --name-only`

## Your task

Summarize this pull request, highlighting:
1. Key changes
2. Breaking changes
3. New features
```

### Frontmatter 字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 技能名称（用于 `/name` 命令） |
| `description` | string | 描述（用于自动匹配） |
| `triggers` | string[] | 触发命令列表 |
| `context` | string | 上下文模式：`fork`（子代理）或默认（主线程） |
| `agent` | string | 指定子代理类型（如 `Explore`） |

### 动态上下文注入

使用 `!` 语法在技能中注入动态内容：

```markdown
## Current context

- Git status: !`git status --short`
- Branch: !`git branch --show-current`
- Recent commits: !`git log -5 --oneline`

## Files in focus

!`find . -name "*.ts" -newer .git/index | head -10`
```

---

## 能力对比矩阵

| 能力 | Plugin | Skill | 说明 |
|------|:------:|:-----:|------|
| **基础能力** |
| 自定义指令 | ✅ | ✅ | 两者都支持 |
| Slash 命令触发 | ✅ | ✅ | `/skill-name` |
| 动态上下文注入 | ✅ | ✅ | `!command` 语法 |
| **扩展组件** |
| 多技能打包 | ✅ | ❌ | 插件可包含多个技能 |
| 自定义代理 | ✅ | ❌ | 仅插件支持 |
| 事件钩子 | ✅ | ❌ | 仅插件支持 |
| MCP 服务器 | ✅ | ❌ | 仅插件支持 |
| 后台监控 | ✅ | ❌ | 仅插件支持 |
| 可执行文件 | ✅ | ❌ | 插件有 `bin/` 目录 |
| 默认设置 | ✅ | ❌ | 插件有 `settings.json` |
| **分发能力** |
| Marketplace 发布 | ✅ | ❌ | 仅插件可发布到市场 |
| npm 发布 | ✅ | ❌ | 仅插件可发布到 npm |
| Git 仓库分享 | ✅ | ✅ | 两者都支持 |
| 项目级安装 | ✅ | ✅ | 两者都支持 |
| 个人级安装 | ✅ | ✅ | 两者都支持 |
| **依赖管理** |
| 插件依赖 | ✅ | ❌ | `dependencies` 字段 |
| 版本控制 | ✅ | ❌ | SemVer 版本管理 |
| **高级能力** |
| 工具权限控制 | ✅ | ❌ | 通过 hooks |
| 自动化行为 | ✅ | ❌ | PreToolUse/PostToolUse |
| 环境变量 | ✅ | ❌ | `settings.json` |
| LSP 配置 | ✅ | ❌ | `.lsp.json` |

---

## 适用场景分析

### Plugin 适用场景

#### 1. 企业级工具集成
```
场景：需要在团队中分发统一的开发工作流
需求：多个技能、自定义代理、钩子验证
方案：创建企业插件，发布到内部 npm 或 marketplace
```

#### 2. 安全与合规检查
```
场景：代码提交前必须通过安全审查
需求：PreToolUse hooks 自动触发检查
方案：插件定义 hooks，在 Write/Edit 前验证
```

#### 3. MCP 服务器集成
```
场景：需要连接数据库、API 等外部资源
需求：MCP 服务器配置
方案：插件包含 .mcp.json 配置
```

#### 4. 自动化工作流
```
场景：工具使用后自动记录、通知
需求：PostToolUse hooks
方案：插件定义自动化行为
```

#### 5. 复杂代理系统
```
场景：需要多个专业代理协作
需求：自定义代理定义
方案：插件包含 agents/ 目录
```

### Skill 适用场景

#### 1. 项目特定工作流
```
场景：项目有特定的代码审查流程
需求：简单的指令模板
方案：.claude/skills/project-review/skill.md
```

#### 2. 个人效率工具
```
场景：个人常用的代码生成模板
需求：快速调用
方案：~/.claude/skills/my-template/skill.md
```

#### 3. 团队共享最佳实践
```
场景：团队共享代码风格指南
需求：随 Git 仓库分发
方案：.claude/skills/code-style/skill.md
```

#### 4. 快速原型验证
```
场景：验证一个想法，不需要完整插件架构
需求：快速迭代
方案：单个 SKILL.md 文件
```

### Skill 做不到但 Plugin 可以的场景

#### 1. 强制性安全检查
```json
// Plugin 可以在代码写入前强制验证
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "/scripts/security-check.sh"
          }
        ]
      }
    ]
  }
}
```
> Skill 无法实现：Skill 只是指令模板，无法拦截工具调用。

#### 2. 工具使用后的自动处理
```json
// Plugin 可以在 Bash 执行后自动记录
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"$(date): $TOOL_INPUT\" >> ~/claude-audit.log"
          }
        ]
      }
    ]
  }
}
```
> Skill 无法实现：Skill 无法感知工具执行事件。

#### 3. MCP 服务器集成
```json
// Plugin 可以捆绑 MCP 服务器
{
  "mcpServers": {
    "company-db": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/db-server.js"]
    }
  }
}
```
> Skill 无法实现：Skill 无法定义 MCP 配置。

#### 4. 多技能协同
```
my-plugin/
├── skills/
│   ├── validate/
│   │   └── SKILL.md      # /validate
│   ├── fix/
│   │   └── SKILL.md      # /fix
│   └── report/
│       └── SKILL.md      # /report
└── plugin.json           # 统一管理
```
> Skill 无法实现：每个 Skill 独立存在，无法打包分发。

#### 5. 权限预设
```json
// Plugin 可以预设权限
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(npm *)",
      "Read(**)"
    ]
  }
}
```
> Skill 无法实现：Skill 无法修改设置。

---

## 代码层面差异

### 1. 文件结构对比

#### Plugin 项目
```
openapi-drift-guard/           # 项目根目录
├── .claude-plugin/               # 插件清单目录
│   ├── plugin.json               # 插件清单（必须）
│   └── marketplace.json          # 市场发布配置（可选）
├── skills/                       # 技能目录
│   └── validate/
│       └── SKILL.md
├── agents/                       # 代理目录
│   └── contract-auditor.md
├── hooks/                        # 钩子目录
│   └── hooks.json
├── .mcp.json                     # MCP 配置
├── settings.json                 # 默认设置
├── bin/                          # 可执行文件
│   └── validate-contract.sh
├── src/                          # 源代码
│   └── index.ts
└── package.json                  # npm 配置
```

#### Skill 项目
```
my-project/                       # 项目根目录
├── .claude/                      # Claude 配置目录
│   └── skills/                   # 技能目录
│       └── my-skill/
│           ├── SKILL.md          # 技能定义（必须）
│           └── CLAUDE.md         # 上下文说明（可选）
└── src/                          # 源代码
    └── index.ts
```

### 2. 清单文件对比

#### plugin.json（Plugin）
```json
{
  "name": "openapi-drift-guard",
  "version": "0.1.0",
  "description": "API Contract drift detection",
  "author": { "name": "saqqdy" },
  "repository": "https://github.com/saqqdy/openapi-drift-guard",
  "license": "MIT",
  "defaultEnabled": false,
  "skills": ["./skills/"],
  "agents": ["./agents/contract-auditor.md"],
  "hooks": { "PreToolUse": [...] },
  "mcpServers": { "database": {...} },
  "dependencies": [],
  "strict": false
}
```

#### SKILL.md Frontmatter（Skill）
```markdown
---
name: openapi-drift-guard
description: 检测 OpenAPI 规范与实现的 drift
triggers:
  - /validate
  - /drift
---

# 技能指令...
```

### 3. 触发机制对比

#### Plugin
```bash
# 安装后，技能自动可用
/validate openapi.yaml src/routes

# 代理可通过 Agent 工具调用
# 钩子自动触发，无需用户干预
```

#### Skill
```bash
# 必须手动触发
/validate openapi.yaml src/routes

# 或通过匹配描述自动触发
```

### 4. 分发方式对比

#### Plugin 分发
```bash
# Marketplace
claude plugin install @saqqdy/openapi-drift-guard

# npm
claude plugin install openapi-drift-guard

# GitHub
claude plugin install github:saqqdy/openapi-drift-guard

# 本地
claude plugin install ./path/to/plugin
```

#### Skill 分发
```bash
# Git clone（项目级）
git clone https://github.com/saqqdy/openapi-drift-guard
# 技能随项目 .claude/skills/ 目录可用

# 手动复制（个人级）
cp -r skills/my-skill ~/.claude/skills/
```

---

## 最佳实践

### 何时选择 Plugin

1. **需要自动化行为**
   - 使用 hooks 在工具调用前后自动执行操作
   - 需要拦截、验证或记录工具使用

2. **需要打包分发**
   - 多个技能需要协同工作
   - 需要发布到 marketplace 或 npm

3. **需要外部集成**
   - MCP 服务器连接数据库、API
   - 自定义代理处理特定任务

4. **需要预设配置**
   - 默认权限设置
   - 环境变量配置

### 何时选择 Skill

1. **简单指令模板**
   - 快速定义一个 slash 命令
   - 不需要复杂架构

2. **项目特定需求**
   - 随项目 Git 仓库分发
   - 团队共享简单工作流

3. **个人效率工具**
   - 个人常用的代码模板
   - 快速迭代验证

4. **不需要自动化**
   - 只需要手动触发的指令
   - 不需要拦截工具调用

---

## 总结

### 核心区别

| 维度 | Plugin | Skill |
|------|--------|-------|
| **定位** | 全功能扩展系统 | 轻量级指令模板 |
| **复杂度** | 高（多文件、多组件） | 低（单文件） |
| **自动化** | 支持（hooks） | 不支持 |
| **分发** | Marketplace/npm/Git | Git/手动复制 |
| **依赖** | 支持依赖管理 | 无 |
| **适用场景** | 企业级、自动化、集成 | 项目级、简单指令 |

### 选择建议

```
需要自动化 → Plugin
需要 MCP → Plugin
需要多技能打包 → Plugin
需要市场分发 → Plugin
只需要简单指令 → Skill
快速原型验证 → Skill
项目特定工作流 → Skill
```

### 本项目示例

本项目 `openapi-drift-guard` 采用了混合策略：
- `.claude-plugin/` - Plugin 清单（用于市场发布）
- `.claude/skills/` - Skill 定义（核心产品）

这种结构允许：
1. 作为 Skill 直接使用（`.claude/skills/`）
2. 作为 Plugin 打包发布（`.claude-plugin/`）

---

## 参考资料

- [Claude Code Plugin System](https://code.claude.com/docs/en/plugins)
- [Claude Code Skills Reference](https://code.claude.com/docs/en/skills)
- [Plugin Marketplace](https://code.claude.com/docs/en/plugin-marketplaces)
- [Hooks Configuration](https://code.claude.com/docs/en/hooks)
