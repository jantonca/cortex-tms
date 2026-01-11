# Architecture: [Project Name]

## 🎯 Quick Context (For AI Agents)
<!-- This section provides high-level orientation in 3 bullets -->
- **What it does**: [One sentence - e.g., "A CLI tool that scaffolds AI-optimized project documentation"]
- **Who it's for**: [Target audience - e.g., "Developers building greenfield projects with AI coding assistants"]
- **Key constraint**: [Critical limitation - e.g., "Must run offline", "Sub-100ms API responses", "Zero external dependencies"]

---

## 🏗️ System Overview
[Briefly describe what the system does and the problem it solves. 2-3 sentences max.]

---

## 🧠 Mental Model
[Describe the high-level concept or metaphor that explains how the system works. This helps both humans and AI agents understand the core logic.]

**Example**: "A centralized hub for documentation that uses a tiered memory system to optimize AI context" or "A real-time event pipeline where actions flow through validation → execution → logging stages."

---

## 📂 Component Map

| Component | Responsibility | Tech Stack |
|:----------|:---------------|:-----------|
| [e.g., Frontend] | [User interaction layer] | [e.g., Next.js 15, React 18] |
| [e.g., CLI Tool] | [File system operations] | [e.g., Node.js, Commander.js] |
| [e.g., API Server] | [Business logic & data access] | [e.g., Express, PostgreSQL] |
| [e.g., Auth Layer] | [Authentication & authorization] | [e.g., Auth.js, JWT] |

---

## 🔄 Core Data Flow
<!-- Describe the primary "happy path" through your system -->

1. **[Step 1]**: [e.g., User triggers command via CLI]
2. **[Step 2]**: [e.g., CLI reads configuration from local file]
3. **[Step 3]**: [e.g., System validates input against schema]
4. **[Step 4]**: [e.g., Results written to file system / database]

**Diagram** (optional):
```
[User] → [CLI] → [Validation] → [File System]
```

---

## 🚢 Deployment & Infrastructure

- **Environment**: [e.g., Vercel, AWS Lambda, Local CLI, Docker]
- **CI/CD**: [e.g., GitHub Actions, GitLab CI]
- **Observability**: [e.g., Sentry for errors, CloudWatch for logs]
- **Database**: [e.g., PostgreSQL on Railway, SQLite local-first]

---

## 🔒 Security Posture

- **Authentication**: [e.g., Auth.js with Google OAuth, API keys, None (CLI tool)]
- **Authorization**: [e.g., RBAC with roles (admin, user), Scopes (read, write)]
- **Data Safety**: [e.g., Secrets stored in environment variables, No PII in logs]
- **Attack Surface**: [e.g., Public API endpoints rate-limited, Internal services behind VPC]

---

## 🧪 Testing Strategy

- **Unit Tests**: [e.g., Vitest for business logic]
- **Integration Tests**: [e.g., Playwright for API endpoints]
- **E2E Tests**: [e.g., Cypress for critical user flows]
- **Test Coverage Target**: [e.g., 80% for core modules]

---

## 🛠️ Technology Decisions (ADR Summary)
<!-- High-level summary only. For detailed rationale, see docs/core/DECISIONS.md -->

- **[Tech/Framework 1]**: [Why it was chosen - e.g., "Next.js for SSR and API routes in one framework"]
- **[Tech/Framework 2]**: [Why it was chosen - e.g., "PostgreSQL for relational data with ACID guarantees"]
- **[Tech/Framework 3]**: [Why it was chosen - e.g., "pnpm for faster installs and strict dependency resolution"]

---

## 📌 Key Files & Locations
<!-- Help AI agents find critical code -->

| File/Folder | Purpose | Notes |
|:------------|:--------|:------|
| [e.g., `src/index.ts`] | [Main entry point] | [CLI initialization] |
| [e.g., `src/commands/`] | [CLI command handlers] | [Uses Commander.js pattern] |
| [e.g., `src/lib/validation.ts`] | [Schema validation logic] | [Uses Zod for type safety] |
| [e.g., `templates/`] | [Boilerplate files] | [Copied to user projects] |

---

## 🔗 Related Documentation

- **Patterns**: See `docs/core/PATTERNS.md` for code conventions
- **Domain Logic**: See `docs/core/DOMAIN-LOGIC.md` for business rules
- **Decisions**: See `docs/core/DECISIONS.md` for detailed ADRs
- **Schema**: See `docs/core/SCHEMA.md` for data models (if applicable)
