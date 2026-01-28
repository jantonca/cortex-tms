# Cortex TMS: AI Prompt Library

This file contains project-aware prompt templates for streamlined AI collaboration. Use `cortex-tms prompt <name>` to quickly access these prompts.

---

## init-session

Review `NEXT-TASKS.md`, `docs/core/ARCHITECTURE.md`, and `CLAUDE.md`. Summarize current priorities and propose a step-by-step plan for the next task.

---

## feature

Implement `[FEATURE]`. First, check `ARCHITECTURE.md` for constraints, follow `PATTERNS.md` for style, and validate logic against `DOMAIN-LOGIC.md`.

---

## debug

I'm seeing `[ISSUE]`. Check `docs/core/TROUBLESHOOTING.md` for known issues, then trace the logic through `ARCHITECTURE.md` to find the failure point.

---

## review

Review the current changes against `PATTERNS.md`. Flag any violations of project conventions and suggest specific fixes.

---

## refactor

Refactor `[COMPONENT]`. Improve structure per `PATTERNS.md` while ensuring behavior remains strictly compliant with `DOMAIN-LOGIC.md`.

---

## decision

We need to decide on `[TOPIC]`. Draft a new Architecture Decision Record in `docs/core/DECISIONS.md` using the project's standard format.

---

## finish

Task complete. Execute the Maintenance Protocol:

1. Run `pnpm run docs:sync` to ensure version integrity across documentation
2. Update `NEXT-TASKS.md` with task status and next priorities
3. Run `node bin/cortex-tms.js validate --strict` to verify project health
4. Follow Git Protocol: commit with conventional format and co-authorship
5. Suggest next priority from backlog

---

## Usage Tips

- Replace placeholders like `[FEATURE]`, `[ISSUE]`, `[COMPONENT]`, `[TOPIC]` with your specific context
- Customize these prompts to match your team's vocabulary and workflow
- Run `cortex-tms prompt --list` to see all available prompts

<!-- @cortex-tms-version 3.0.0 -->
