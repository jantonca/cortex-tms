# AI Pair Programmer: Collaboration Protocol (TMS v2.0)

## ⚡ Critical Rules (Always Apply)

- **Tech Stack**: [e.g., Next.js 15, TypeScript Strict, Tailwind CSS].
- **Conventions**: Favor functional programming and composition over inheritance.
- **Types**: ALWAYS use strict TypeScript. No `any`. No `@ts-ignore`.
- **Logic**: Before implementing business logic, check `docs/core/DOMAIN-LOGIC.md`.

<!-- SETUP NOTE: If you see [placeholder] text above, this project needs
     bootstrapping. Run: cortex-tms prompt bootstrap -->

## 🏗️ Technical Map (Read Order)

AI agents MUST follow this order before proposing code:

1. `NEXT-TASKS.md` (Current context)
2. `docs/core/DOMAIN-LOGIC.md` (Project rules)
3. `docs/core/PATTERNS.md` (Coding standards)

## 🚫 Prohibitions

- Never store secrets or API keys in code.
- Never bypass linting or type-checking.
- Never implement features not listed in `NEXT-TASKS.md` without asking.

## ✔️ Pre-Submission Checklist

- [ ] Logic verified against DOMAIN-LOGIC.md.
- [ ] Tests added/updated and passing.
- [ ] No `console.log` statements remaining.

<!-- @cortex-tms-version 2.3.0 -->
