import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/openapi-drift-guard/',
  head: [
    ['meta', { name: 'theme-color', content: '#6366f1' }],
  ],
  locales: {
    root: {
      description: 'AI-powered API contract drift detection',
      label: 'English',
      lang: 'en',
      themeConfig: {
        darkModeSwitchLabel: 'Theme',
        docFooter: { next: 'Next', prev: 'Previous' },
        editLink: {
          pattern: 'https://github.com/saqqdy/openapi-drift-guard/edit/master/docs/:path',
          text: 'Edit this page on GitHub',
        },
        footer: { copyright: 'Copyright © 2024-present saqqdy', message: 'MIT License' },
        lastUpdated: { text: 'Updated at' },
        nav: [
          { activeMatch: '/guide/', link: '/guide/', text: 'Guide' },
          { activeMatch: '/api/', link: '/api/', text: 'API' },
          { items: [
            { link: 'https://github.com/saqqdy/openapi-drift-guard', text: 'GitHub' },
            { link: 'https://www.npmjs.com/package/openapi-drift-guard', text: 'NPM' },
          ], text: 'Links' },
        ],
        outline: { label: 'On this page' },
        sidebar: {
          '/api/': [
            { items: [{ link: '/api/', text: 'Overview' }], text: 'API Reference' },
            { items: [
              { link: '/api/parse-and-normalize-spec', text: 'parseAndNormalizeSpec()' },
              { link: '/api/create-analyzer', text: 'createAnalyzer()' },
              { link: '/api/detect-drifts', text: 'detectDrifts()' },
            ], text: 'Functions' },
            { items: [
              { link: '/api/types/', text: 'All Types' },
              { link: '/api/types/normalized-endpoint', text: 'NormalizedEndpoint' },
              { link: '/api/types/drift-result', text: 'DriftResult' },
            ], text: 'Types' },
          ],
          '/guide/': [
            { items: [
              { link: '/guide/', text: 'Introduction' },
              { link: '/guide/installation', text: 'Installation' },
              { link: '/guide/quick-start', text: 'Quick Start' },
              { link: '/guide/roadmap', text: 'Roadmap' },
            ], text: 'Getting Started' },
            { items: [
              { link: '/guide/skill-commands', text: 'Skill Commands' },
            ], text: 'Features' },
          ],
        },
      },
      title: 'OpenAPI Drift Guard',
    },
    zh: {
      description: 'AI 驱动的 API 契约漂移检测',
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        darkModeSwitchLabel: '主题',
        docFooter: { next: '下一页', prev: '上一页' },
        editLink: {
          pattern: 'https://github.com/saqqdy/openapi-drift-guard/edit/master/docs/:path',
          text: '在 GitHub 上编辑此页',
        },
        footer: { copyright: '版权所有 © 2024-present saqqdy', message: '基于 MIT 许可发布' },
        lastUpdated: { text: '最后更新' },
        nav: [
          { activeMatch: '/zh/guide/', link: '/zh/guide/', text: '指南' },
          { activeMatch: '/zh/api/', link: '/zh/api/', text: 'API' },
          { items: [
            { link: 'https://github.com/saqqdy/openapi-drift-guard', text: 'GitHub' },
            { link: 'https://www.npmjs.com/package/openapi-drift-guard', text: 'NPM' },
          ], text: '链接' },
        ],
        outline: { label: '页面导航' },
        sidebar: {
          '/zh/api/': [
            { items: [{ link: '/zh/api/', text: '概览' }], text: 'API 参考' },
            { items: [
              { link: '/api/parse-and-normalize-spec', text: 'parseAndNormalizeSpec()' },
              { link: '/api/create-analyzer', text: 'createAnalyzer()' },
              { link: '/api/detect-drifts', text: 'detectDrifts()' },
            ], text: '函数' },
            { items: [
              { link: '/api/types/', text: '所有类型' },
              { link: '/api/types/normalized-endpoint', text: 'NormalizedEndpoint' },
              { link: '/api/types/drift-result', text: 'DriftResult' },
            ], text: '类型' },
          ],
          '/zh/guide/': [
            { items: [
              { link: '/zh/guide/', text: '介绍' },
              { link: '/zh/guide/installation', text: '安装' },
              { link: '/zh/guide/quick-start', text: '快速上手' },
              { link: '/zh/guide/roadmap', text: '版本路线图' },
            ], text: '开始' },
            { items: [
              { link: '/zh/guide/skill-commands', text: 'Skill 命令' },
            ], text: '功能' },
          ],
        },
      },
      title: 'OpenAPI Drift Guard',
    },
  },
  sitemap: { hostname: 'https://saqqdy.github.io/openapi-drift-guard' },
  themeConfig: {
    logo: '/logo.svg',
    search: { provider: 'local' },
    siteTitle: 'OpenAPI Drift Guard',
    socialLinks: [{ icon: 'github', link: 'https://github.com/saqqdy/openapi-drift-guard' }],
  },
})
