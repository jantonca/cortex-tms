# AI Pair Programmer: Collaboration Protocol (TMS v2.0)

## ⚡ Critical Rules (Always Apply)

- **Tech Stack**: Next.js 16, React 19, TypeScript Strict, Tailwind CSS 4, Shadcn UI.
- **Storage**: All data in localStorage (key: `cortex-todos`). No backend, no API calls.
- **Conventions**: Favor functional components with hooks. Client components only (use `"use client"`).
- **Types**: ALWAYS use strict TypeScript. No `any`. No `@ts-ignore`.
- **Logic**: Before implementing todo business rules, check `docs/core/DOMAIN-LOGIC.md`.

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
