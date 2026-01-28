# Implementation Patterns

## [Category: e.g., UI/Data/Auth] [Pattern Name]

**Rule**: [Short, imperative statement of the rule]

### ❌ Anti-Pattern (What NOT to do)

- [Description of common AI mistake]
- [Why it fails in this project]

### ✅ Canonical Example

**Source File**: `path/to/best-example-file.ts`

```typescript
// A concise, perfect implementation of the pattern
```

### 🔗 References

- **Domain Logic**: `DOMAIN-LOGIC.md#[Section]`
- **Gotchas**: `TROUBLESHOOTING.md#[Section]`

#### 2. `templates/root/copilot-instructions.md`

The "Contract" that the user will place in their own `.github/` folder.

# AI Pair Programmer: Collaboration Protocol (TMS v2.0)

## 📖 Mandatory Read Order

AI agents MUST follow this order before proposing or writing code:

1. `.github/copilot-instructions.md` (This file)
2. `NEXT-TASKS.md` (Current context)
3. `docs/core/DOMAIN-LOGIC.md` (Domain rules)
4. `docs/core/PATTERNS.md` (Implementation standards)

## ⚡ Critical Rules

- **Domain**: [Describe the domain here]
- **Money/Math**: [e.g., Use integers in cents]
- **Types**: ALWAYS use strict TypeScript. No `any`.

## 🏗️ Technical Map

- **Gotchas**: `docs/core/TROUBLESHOOTING.md`
- **Past Decisions**: `docs/core/DECISIONS.md`

## 🧪 Operational Loop

1. Read `NEXT-TASKS.md` to understand the "Why" and "What."
2. Check `docs/core/PATTERNS.md` for existing canonical examples.
3. Propose -> Justify -> Recommend.

<!-- @cortex-tms-version 3.0.0 -->
