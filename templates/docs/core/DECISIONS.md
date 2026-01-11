# Architecture Decisions (ADR)

## 🎯 Purpose
This file documents **why** we made key technical decisions. When an AI agent or developer asks "Why did we choose X over Y?", the answer should be here.

**ADR Format**: Context → Decision → Reasoning → Consequences

---

## [YYYY-MM-DD] - [Decision Title]

**Context**: [What problem were we solving? What constraints existed?]

**Decision**: [What did we choose? Be specific - e.g., "Use PostgreSQL as the primary database"]

**Reasoning**: [Why did we choose this over alternatives?]
- **Pro**: [Advantage 1 - e.g., "ACID compliance for financial transactions"]
- **Pro**: [Advantage 2 - e.g., "Strong TypeScript support via Prisma"]
- **Con**: [Trade-off 1 - e.g., "More complex than SQLite for local dev"]
- **Alternative Considered**: [What we didn't choose and why - e.g., "MongoDB: Too flexible for our relational data model"]

**Consequences**: [What does this decision enable or prevent?]
- ✅ [Positive outcome - e.g., "Can use transactions for multi-table updates"]
- ⚠️ [Trade-off - e.g., "Requires Docker for local development"]

**Status**: [Active | Deprecated | Superseded by ADR-XXX]

---

## Example: [2026-01-10] - Use pnpm as Package Manager

**Context**: We needed a package manager for the Node.js CLI project. The team had experience with npm and yarn, but wanted to evaluate modern alternatives for speed and disk efficiency.

**Decision**: Use `pnpm` as the exclusive package manager for this project.

**Reasoning**:
- **Pro**: Faster installs via content-addressable storage (saves ~40% time vs npm)
- **Pro**: Strict dependency resolution prevents phantom dependencies
- **Pro**: Symlink-based `node_modules` saves disk space in monorepos
- **Con**: Less universal than npm (requires installation step for new contributors)
- **Alternative Considered**: Yarn 2 (Berry) - Too complex with PnP; Bun - Too bleeding-edge for production

**Consequences**:
- ✅ CI/CD runs 40% faster
- ✅ Prevents accidental use of undeclared dependencies
- ⚠️ All documentation must specify `pnpm` commands (can't use `npm`)
- ⚠️ Contributors must install pnpm (`npm install -g pnpm`)

**Status**: Active

---

## Template for New Decisions

**Copy this template when adding a new ADR:**

```markdown
## [YYYY-MM-DD] - [Decision Title]

**Context**: [Problem and constraints]

**Decision**: [What we chose]

**Reasoning**:
- **Pro**: [Advantage 1]
- **Pro**: [Advantage 2]
- **Con**: [Trade-off 1]
- **Alternative Considered**: [What we didn't choose and why]

**Consequences**:
- ✅ [Positive outcome]
- ⚠️ [Trade-off]

**Status**: Active
```

---

## 🔗 Cross-References

- **Architecture**: See `docs/core/ARCHITECTURE.md` for technology stack
- **Patterns**: See `docs/core/PATTERNS.md` for implementation patterns
- **Glossary**: See `docs/core/GLOSSARY.md` for term definitions
