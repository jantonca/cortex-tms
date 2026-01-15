# Glossary: Cortex TMS Terminology

This document defines terms specific to the Tiered Memory System (TMS).

---

## Core Concepts

### Tiered Memory System (TMS)
A documentation architecture that organizes files by **access frequency** (HOT/WARM/COLD) instead of content type. Designed to optimize AI agent performance by reducing context window waste.

**Example**: Instead of organizing docs by "architecture", "tasks", "decisions", TMS groups them by how often AI agents should read them.

---

### HOT Tier
**Definition**: Files the AI agent must read at the start of every session.

**Characteristics**:
- Always loaded into AI context
- Strict size limits (to preserve context budget)
- Contains **current** actionable information

**Files**:
- `NEXT-TASKS.md` (current sprint)
- `.github/copilot-instructions.md` (critical rules)
- `CLAUDE.md` (workflow config)

**Analogy**: Like RAM in a computer—small, fast, always accessed.

---

### WARM Tier
**Definition**: Files the AI agent reads on demand when implementing specific features.

**Characteristics**:
- Loaded when relevant to current task
- Contains **timeless** reference information
- No strict size limits (but keep reasonable)

**Files**:
- `docs/core/ARCHITECTURE.md` (system design)
- `docs/core/PATTERNS.md` (coding standards)
- `docs/core/DOMAIN-LOGIC.md` (business rules)
- `docs/core/DECISIONS.md` (ADRs)
- `docs/core/GLOSSARY.md` (this file)
- `docs/core/SCHEMA.md` (data models)
- `docs/core/TROUBLESHOOTING.md` (framework gotchas)

**Analogy**: Like an SSD—larger capacity, fast when needed.

---

### COLD Tier
**Definition**: Files the AI agent should ignore unless explicitly asked.

**Characteristics**:
- Historical context
- Completed tasks, old changelogs, deprecated docs
- No size limits

**Files**:
- `docs/archive/*` (all archived content)

**Analogy**: Like a hard drive—large, slow, rarely accessed.

---

## File Types

### NEXT-TASKS.md
**Purpose**: Tracks the current sprint (1-2 weeks max).

**Structure**:
- Active sprint with "Why this matters" context
- Task table with effort/priority/status
- Definition of Done checklist

**Max Size**: 200 lines

**Archive Trigger**: When sprint completes, move to `docs/archive/sprint-YYYY-MM.md`.

---

### FUTURE-ENHANCEMENTS.md
**Purpose**: Living backlog for tasks not in the current sprint.

**Structure**:
- Prioritized list of future features
- Epics and long-term ideas
- Notes on technical debt

**Max Size**: No limit (but organize by priority)

**Migration**: When a task becomes active, move it to `NEXT-TASKS.md`.

---

### copilot-instructions.md
**Location**: `.github/copilot-instructions.md`

**Purpose**: The "contract" file that defines:
- Tech stack
- Critical rules (money/math, security)
- Read order for AI agents
- Prohibitions

**Max Size**: 100 lines

**Audience**: All AI agents (Claude Code, GitHub Copilot, Cursor).

---

### CLAUDE.md
**Location**: Root directory

**Purpose**: CLI commands and workflow configuration for Claude Code specifically.

**Content**:
- Package manager commands (`pnpm`, not npm)
- Operational loop (what to read before coding)
- Development workflow

---

### Canonical Link
**Definition**: A reference to the actual file containing the pattern implementation.

**Purpose**: Avoids code duplication in docs.

**Example**:
```markdown
**Canonical Example**: `src/components/Button.tsx:15`
```

**Why**: Duplication causes drift. Links stay accurate.

---

### Dogfooding
**Definition**: Using the product you're building to build itself.

**In Cortex**: We use TMS to develop Cortex TMS.

**Validation**: "Can an AI agent working on Cortex find what it needs in < 3 file reads?"

---

## Acronyms

- **TMS**: Tiered Memory System
- **ADR**: Architecture Decision Record
- **HOT**: Highest-priority tier (always read)
- **WARM**: Medium-priority tier (read on demand)
- **COLD**: Lowest-priority tier (archived)
- **CLI**: Command-Line Interface
- **FN**: Fast Node Manager (Node.js version manager)

<!-- @cortex-tms-version 2.5.0 -->
