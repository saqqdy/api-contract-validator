# Contributing to OpenAPI Drift Guard

First off, thank you for considering contributing to OpenAPI Drift Guard! It's people like you that make this tool better for everyone.

## 🎯 Ways to Contribute

- **Bug reports**: Submit issues with detailed reproduction steps
- **Feature requests**: Share your ideas for new features
- **Code contributions**: Submit pull requests for bug fixes or features
- **Documentation**: Help improve our docs, examples, and guides
- **Testing**: Try the tool and provide feedback

## 🐛 Reporting Bugs

Before submitting a bug report, please:

1. **Check existing issues** to avoid duplicates
2. **Test with the latest version** to ensure the bug still exists
3. **Prepare a minimal reproduction** case

When submitting a bug report, include:

- **Clear description** of the problem
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Environment details** (Node.js version, OS, etc.)
- **Sample code or spec files** if relevant

## 💡 Requesting Features

Feature requests are welcome! Please:

1. **Check existing requests** to avoid duplicates
2. **Describe the feature** in detail
3. **Explain the use case** and why it would be useful
4. **Provide examples** of how it would work

## 🔧 Development Setup

### Prerequisites

- Node.js >= 18.20
- pnpm >= 9.15.9

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/saqqdy/openapi-drift-guard.git
cd openapi-drift-guard

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the project
pnpm build

# Run linting
pnpm lint

# Run type checking
pnpm typecheck
```

### Project Structure

```
openapi-drift-guard/
├── src/              # Source code
│   ├── parser/       # OpenAPI/Swagger parser
│   ├── analyzer/     # Code analyzers
│   ├── detector/     # Drift detection
│   ├── reporter/     # Output formatters
│   └── cli.ts        # CLI entry point
├── test/             # Test files
├── examples/         # Usage examples
├── docs/             # VitePress documentation
└── .claude/          # Claude Code Skill
```

## 📝 Pull Request Process

1. **Fork the repository** and create your branch from `master`
2. **Make your changes** following our code style
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Run the test suite**: `pnpm test`
6. **Run linting**: `pnpm lint`
7. **Update CHANGELOG.md** with your changes
8. **Submit the pull request**

### PR Guidelines

- **Clear title** describing the change
- **Detailed description** of what and why
- **Link related issues** using keywords (fixes #123, closes #456)
- **Keep PRs focused** - one feature/fix per PR
- **Write meaningful commit messages**

## 📚 Code Style

- **TypeScript strict mode** enabled
- **ESLint + Prettier** for formatting
- **Named exports** preferred over default exports
- **JSDoc comments** for public APIs
- **Tests** required for new features

### Commit Message Format

```
type(scope): subject

body

footer
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(parser): add support for external $ref resolution

- Support HTTP/HTTPS references
- Add file:// reference support
- Add circular reference detection

Closes #42
```

## 🧪 Testing

- **Unit tests**: `pnpm test`
- **Coverage report**: `pnpm test:coverage`
- **Watch mode**: `pnpm test:watch`

Aim for **≥80% test coverage** for new code.

## 📖 Documentation

Documentation is built with VitePress:

```bash
# Start docs dev server
pnpm docs:dev

# Build docs
pnpm docs:build
```

When adding features, please update:
- **README.md** with usage examples
- **API documentation** in `docs/api/`
- **Code examples** in `examples/`

## 🤝 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code.

## ❓ Questions?

Feel free to:
- Open an issue for questions
- Start a discussion on GitHub
- Reach out to the maintainer

Thank you for contributing! 🎉
