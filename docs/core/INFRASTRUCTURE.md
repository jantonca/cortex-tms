# Infrastructure & Deployment

This document tracks the infrastructure assets and deployment configuration for the Cortex TMS project.

---

## 🌐 Domains

**Registered**: 2026-01-18

| Domain | Purpose | Status | Registrar | Notes |
|:-------|:--------|:------:|:----------|:------|
| **cortex-tms.dev** | Primary documentation site | ✅ Active | TBD | Main brand domain |
| **cortextms.dev** | Alternate/redirect | ✅ Active | TBD | Variant without hyphen |

**DNS Configuration**: TBD (pending Starlight deployment)

**Why .dev?**
- Modern, developer-focused TLD
- Enforced HTTPS (security by default)
- Strong association with developer tools
- .com variants were already taken

**Domain Strategy**:
- Primary: `cortex-tms.dev` (matches npm package name)
- Redirect: `cortextms.dev` → `cortex-tms.dev` (prevents typo squatting)

---

## 🏗️ Repository Structure

**Current** (as of v2.6.0):
```
github.com/jantonca/cortex-tms (public)
├── Main CLI package
├── Documentation
└── Templates
```

**Planned** (v2.7+):
```
GitHub Organization: cortex-tms
├── cortex-tms/core (public) - Main CLI package
├── cortex-tms/internal (private) - Business strategy, planning
├── cortex-tms/docs (public) - Starlight documentation site
└── cortex-tms/[future] - Pro/Enterprise features (TBD)
```

**Repository Decision Status**: 🔄 In Progress (TMS-270c)

---

## 📦 NPM Package

**Package Name**: `cortex-tms`
**Registry**: https://www.npmjs.com/package/cortex-tms
**Current Version**: 2.6.0 (stable)

**Distribution Tags**:
- `latest`: 2.6.0
- `beta`: 2.6.0-beta.1

**Install Command**:
```bash
npm install -g cortex-tms@latest
```

---

## 🚀 Deployment Targets

### Documentation Site (Planned - TMS-270d)

**Platform**: TBD (options: Vercel, Netlify, Cloudflare Pages)
**Framework**: Starlight (Astro-based)
**Domain**: cortex-tms.dev
**Status**: 🔄 Planned (Week 1-2 of v2.7)

**Requirements**:
- Automatic deployments from main branch
- Preview deployments for PRs
- SSL/TLS (enforced by .dev TLD)
- CDN for global performance

---

## 🔐 Access Control

### Public Assets
- NPM package: `cortex-tms`
- GitHub repo: `github.com/jantonca/cortex-tms`
- Documentation site: `cortex-tms.dev` (planned)

### Private Assets (Planned - TMS-276)
- Business strategy repo: `cortex-tms-internal` (TBD)
- Internal planning documents
- Client migration retrospectives

---

## 📊 Analytics & Monitoring (Planned)

**Planned for v2.7 Phase 2**:
- Website analytics: TBD (Plausible, Fathom, or Simple Analytics recommended)
- NPM download tracking: Via npm stats API
- Error tracking: TBD
- Performance monitoring: TBD

**Privacy-First Approach**:
- No Google Analytics (GDPR-friendly alternatives)
- No user tracking across sites
- Minimal data collection

---

## 🔄 CI/CD Pipeline

**Current** (v2.6.0):
```
GitHub Actions:
├── .github/workflows/tms-validate.yml
│   ├── Runs on: push to main, PRs
│   ├── Jobs: validate, docs-check, test, build
│   └── Status: ✅ Active
```

**Planned** (v2.7):
```
Documentation Site:
├── Auto-deploy on push to main
├── Preview deploys for PRs
└── Build cache optimization
```

---

## 🏷️ Version Management

**Source of Truth**: `package.json` version field

**Automated Sync**:
- 34 files automatically synchronized via `pnpm run docs:sync`
- Version metadata tags: `<!-- @cortex-tms-version X.Y.Z -->`
- CHANGELOG.md validated for version entries

**Release Process**:
- Documented in: `temp/technical/planning/PLAN-v2.6-stable-release.md`
- Tools: Atomic Release Engine (`scripts/release.js`)
- Distribution: NPM + GitHub Releases

---

## 📝 Configuration Files

| File | Purpose | Location |
|:-----|:--------|:---------|
| `.cortexrc` | Project configuration | Root directory |
| `package.json` | NPM package metadata | Root directory |
| `tsconfig.json` | TypeScript compilation | Root directory |
| `vitest.config.ts` | Test configuration | Root directory (planned) |

---

## 🔧 Development Environment

**Required Tools**:
- Node.js >=18.0.0
- pnpm (preferred) or npm
- Git
- GitHub CLI (`gh`) - for release automation
- TypeScript 5.7+

**Optional Tools**:
- VS Code (recommended IDE)
- Cortex TMS VS Code snippets (auto-installed)

---

## 📚 Related Documentation

- Repository structure: See `ARCHITECTURE.md` (planned)
- Release process: See `temp/technical/planning/PLAN-v2.6-stable-release.md`
- Git standards: See `docs/core/GIT-STANDARDS.md`
- Security: Private repo migration details in `NEXT-TASKS.md` (TMS-276)

---

**Last Updated**: 2026-01-18
**Status**: Living document - updated as infrastructure evolves

<!-- @cortex-tms-version 2.6.0 -->
