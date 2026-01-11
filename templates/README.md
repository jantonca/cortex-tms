# [Project Name]

**[One-line description of what this project does]**

[2-3 sentence overview explaining the problem this project solves and who it's for]

---

## 🚀 Quick Start

### Prerequisites
- [e.g., Node.js 20+]
- [e.g., PostgreSQL 15+]
- [e.g., Package manager: pnpm, npm, yarn]

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd [project-name]

# Install dependencies
[package-manager] install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations (if applicable)
[migration-command]

# Start development server
[dev-command]
```

---

## 📂 Project Structure

```
.
├── [folder-name]/          # [Description]
├── [folder-name]/          # [Description]
├── docs/
│   ├── core/              # WARM tier - Technical documentation
│   └── archive/           # COLD tier - Historical context
├── NEXT-TASKS.md          # HOT tier - Current sprint
└── CLAUDE.md              # HOT tier - AI agent workflow
```

**See**: `docs/core/ARCHITECTURE.md` for detailed system design

---

## 🎯 Features

- **[Feature 1]**: [Brief description and user value]
- **[Feature 2]**: [Brief description and user value]
- **[Feature 3]**: [Brief description and user value]

---

## 🛠️ Development

### Available Commands

| Command | Description |
|:--------|:------------|
| `[dev-command]` | Start development server |
| `[build-command]` | Build for production |
| `[test-command]` | Run test suite |
| `[lint-command]` | Lint and format code |

### Tech Stack

- **Frontend**: [e.g., Next.js 15, React 18, Tailwind CSS]
- **Backend**: [e.g., Express, tRPC, Prisma]
- **Database**: [e.g., PostgreSQL, Redis]
- **Testing**: [e.g., Vitest, Playwright]
- **Deployment**: [e.g., Vercel, Railway, Docker]

**See**: `docs/core/DECISIONS.md` for technology choices and rationale

---

## 📖 Documentation

This project uses the [Cortex TMS](https://github.com/[your-org]/cortex-tms) documentation structure:

- **`NEXT-TASKS.md`**: Current sprint and active tasks
- **`docs/core/ARCHITECTURE.md`**: System design and component map
- **`docs/core/PATTERNS.md`**: Code conventions and best practices
- **`docs/core/DOMAIN-LOGIC.md`**: Business rules and constraints
- **`docs/core/GLOSSARY.md`**: Project terminology
- **`docs/core/DECISIONS.md`**: Architecture Decision Records (ADRs)

---

## 🧪 Testing

```bash
# Run all tests
[test-command]

# Run tests in watch mode
[test-watch-command]

# Run tests with coverage
[test-coverage-command]
```

**Coverage Target**: [e.g., 80% for core modules]

---

## 🚢 Deployment

### Environment Variables

| Variable | Description | Required | Example |
|:---------|:------------|:---------|:--------|
| `[VAR_NAME]` | [Description] | Yes/No | `[example-value]` |
| `[VAR_NAME]` | [Description] | Yes/No | `[example-value]` |

### Production Build

```bash
# Build for production
[build-command]

# Start production server
[start-command]
```

**See**: `docs/core/ARCHITECTURE.md#deployment-infrastructure` for deployment guide

---

## 🤝 Contributing

This project follows conventional commit standards and uses AI-assisted development workflows.

### Workflow

1. Check `NEXT-TASKS.md` for current priorities
2. Create a branch: `[type]/[description]` (see `docs/core/GIT-STANDARDS.md`)
3. Make your changes following `docs/core/PATTERNS.md`
4. Run tests and linting
5. Commit with conventional format: `type(scope): subject`
6. Open a PR using `.github/PULL_REQUEST_TEMPLATE.md`

**See**: `CLAUDE.md` for AI agent collaboration protocol

---

## 📝 License

[License Type - e.g., MIT License]

---

## 🔗 Links

- **Documentation**: [Link to full docs]
- **Issue Tracker**: [Link to issues]
- **Changelog**: `docs/archive/` (organized by sprint)
- **Roadmap**: `FUTURE-ENHANCEMENTS.md`

---

**Built with [Cortex TMS](https://github.com/[your-org]/cortex-tms) - AI-Optimized Project Documentation**
