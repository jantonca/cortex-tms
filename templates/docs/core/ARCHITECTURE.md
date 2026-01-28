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
- **Database**: [e.g., PostgreSQL on Railway, SQLite local-first]
- **IaC (Infrastructure as Code)**: [e.g., Terraform, Pulumi, Manual, N/A for CLI tools]

---

## 📊 Observability & Monitoring

**Error Tracking**:
- **Tool**: [e.g., Sentry, Rollbar, CloudWatch]
- **Coverage**: [e.g., All production errors, API failures, Critical paths only]
- **Alert Threshold**: [e.g., >10 errors/min triggers PagerDuty]

**Logging**:
- **Strategy**: [e.g., Structured JSON logs, Plain text, Winston logger]
- **Levels**: [e.g., ERROR (always), WARN (production), INFO (debug mode)]
- **Retention**: [e.g., 30 days in CloudWatch, 7 days local]
- **Sensitive Data**: [e.g., Never log passwords, PII masked, API keys redacted]

**Metrics & Analytics**:
- **Performance**: [e.g., Datadog APM, New Relic, None]
- **Business Metrics**: [e.g., User signups/day, API calls/min, CLI installs]
- **Health Checks**: [e.g., `/health` endpoint, Database connectivity, External API status]

**Alerting**:
- **Critical**: [e.g., Service down → PagerDuty → On-call engineer]
- **Warning**: [e.g., High error rate → Slack #alerts → Team review]
- **Info**: [e.g., Deployment complete → Slack #releases]

---

## 📈 Scalability & Performance

**Current Load Profile**:
- **Users**: [e.g., 1,000 DAU, 50 concurrent, CLI tool (N/A)]
- **Request Volume**: [e.g., 10K requests/day, 100 requests/sec peak]
- **Data Size**: [e.g., 10GB database, 1M records, Local files only]

**Performance Targets**:
- **API Response Time**: [e.g., p95 < 200ms, p99 < 500ms]
- **Page Load Time**: [e.g., First Contentful Paint < 1.5s]
- **CLI Execution**: [e.g., `init` command < 2s]

**Scaling Strategy**:
- **Horizontal Scaling**: [e.g., Auto-scale on AWS ECS, Stateless API servers, N/A]
- **Caching**: [e.g., Redis for session data, CDN for static assets, In-memory caching]
- **Database**: [e.g., Read replicas for scaling, Connection pooling, Indexed queries]
- **Bottlenecks**: [e.g., Third-party API rate limits, File I/O for large operations]

**Known Limits**:
- **Single-point failures**: [e.g., Primary database, Payment gateway, None]
- **Rate Limits**: [e.g., GitHub API 5000/hour, Stripe 100 req/sec]
- **Resource Constraints**: [e.g., Lambda 15min timeout, 512MB memory limit]

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

<!-- @cortex-tms-version 3.0.0 -->
