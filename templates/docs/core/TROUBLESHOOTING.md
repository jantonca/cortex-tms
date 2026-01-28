# Troubleshooting: Known Issues & Solutions

<!-- This file documents framework gotchas, common errors, and workarounds. -->
<!-- Help AI agents avoid known pitfalls by documenting them here. -->

---

## 🎯 Purpose

This file exists to prevent AI agents from:
- Implementing patterns that won't work in your framework
- Making assumptions that contradict framework behavior
- Wasting time debugging known issues

**When to add an entry**: Anytime you encounter a non-obvious error that took more than 30 minutes to debug.

---

## 🔴 Critical Issues (Will Break Production)

<!-- Issues that cause runtime failures or security vulnerabilities -->

### [Issue: e.g., Server Components Can't Use useState]

**Framework**: [e.g., Next.js 13+ (App Router)]

**Symptom**:
```
Error: useState is not a function in Server Components
```

**Cause**: [e.g., Next.js App Router renders components on the server by default. React hooks like `useState` only work in Client Components.]

**Solution**:
```typescript
// ❌ Bad: Using useState in a Server Component
export default function Page() {
  const [count, setCount] = useState(0) // ERROR!
  return <div>{count}</div>
}

// ✅ Good: Add 'use client' directive
'use client'

export default function Page() {
  const [count, setCount] = useState(0) // Works!
  return <div>{count}</div>
}
```

**AI Agent Note**: ⚠️ Before using `useState`, `useEffect`, or any React hook, verify the component has `'use client'` at the top of the file.

**Reference**: [Link to Next.js Server Components docs]

---

### [Issue: e.g., Environment Variables Not Available in Browser]

**Framework**: [e.g., Next.js, Vite, Create React App]

**Symptom**:
```
process.env.API_KEY is undefined in the browser
```

**Cause**: [e.g., Only environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Others are server-only.]

**Solution**:
```bash
# ❌ Bad: Not exposed to browser
API_KEY=secret123

# ✅ Good: Exposed to browser
NEXT_PUBLIC_API_KEY=public123
```

**Security Warning**: ⚠️ NEVER prefix secrets with `NEXT_PUBLIC_`. These are exposed in the client bundle.

**AI Agent Note**: When generating code that uses `process.env` in the browser, verify the variable name starts with `NEXT_PUBLIC_`.

---

## 🟡 Common Errors (Will Cause Confusion)

<!-- Non-critical issues that are confusing but won't break production -->

### [Issue: e.g., Tailwind Styles Not Applying After Config Change]

**Framework**: [e.g., Tailwind CSS (JIT Mode)]

**Symptom**: Added a custom color in `tailwind.config.js`, but it doesn't work in components.

**Cause**: [e.g., Tailwind's JIT compiler caches build output. Config changes require a dev server restart.]

**Solution**:
```bash
# Stop dev server (Ctrl+C), then restart
pnpm dev
```

**Workaround**: [e.g., Use Tailwind's `--watch` flag for automatic reloading]

**AI Agent Note**: After modifying `tailwind.config.js`, always suggest restarting the dev server.

---

### [Issue: e.g., TypeScript Can't Find Module After Creating It]

**Framework**: [e.g., TypeScript]

**Symptom**:
```
Cannot find module './myFile' or its corresponding type declarations.
```

**Cause**: [e.g., TypeScript language server cache is stale]

**Solution**:
```
VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

**AI Agent Note**: If a newly created file isn't recognized, suggest restarting the TypeScript server.

---

## 🟢 Framework Gotchas (Non-Obvious Behavior)

<!-- Quirks that aren't errors but might surprise developers -->

### [Gotcha: e.g., Database Timestamps Use Different Timezone Than App]

**Framework**: [e.g., PostgreSQL, Prisma]

**Behavior**: [e.g., PostgreSQL `TIMESTAMP` defaults to server timezone, not UTC]

**Recommendation**:
```sql
-- ❌ Bad: Uses server timezone
createdAt TIMESTAMP DEFAULT NOW()

-- ✅ Good: Explicitly use UTC
createdAt TIMESTAMPTZ DEFAULT NOW()
```

**AI Agent Note**: Always use `TIMESTAMPTZ` (timestamp with time zone) instead of `TIMESTAMP` in PostgreSQL schemas.

**Reference**: [See SCHEMA.md for timestamp rules]

---

### [Gotcha: e.g., Array.map() in JSX Requires Unique Keys]

**Framework**: [e.g., React]

**Behavior**: React throws a warning if list items don't have unique `key` props.

**Recommendation**:
```typescript
// ❌ Bad: No key prop
{users.map(user => <div>{user.name}</div>)}

// ✅ Good: Stable, unique key
{users.map(user => <div key={user.id}>{user.name}</div>)}

// ⚠️ Avoid: Using array index (breaks on reorder)
{users.map((user, index) => <div key={index}>{user.name}</div>)}
```

**AI Agent Note**: When generating `map()` in JSX, always add a `key` prop using a stable ID (not array index).

---

## 🛠️ Environment Setup Issues

<!-- Problems that occur during installation or local development -->

### [Issue: e.g., pnpm install fails with EACCES error]

**Platform**: [e.g., macOS, Linux]

**Symptom**:
```
Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules'
```

**Cause**: [e.g., npm/pnpm trying to write to system-protected directory]

**Solution**:
```bash
# Use a Node version manager (nvm, fnm, volta)
# Never use sudo with npm/pnpm
```

**AI Agent Note**: If installation fails with EACCES, recommend using a Node version manager instead of `sudo`.

---

### [Issue: e.g., Port 3000 already in use]

**Platform**: [e.g., Any]

**Symptom**:
```
Error: Port 3000 is already in use
```

**Solution**:
```bash
# Option 1: Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Use a different port
PORT=3001 pnpm dev
```

**AI Agent Note**: When dev server fails to start, check if another process is using the port.

---

## 🐛 AI Agent Common Mistakes

<!-- Errors that AI coding assistants frequently make -->

### [Mistake: e.g., Hallucinating Non-Existent Imports]

**Example**:
```typescript
// ❌ AI might generate this (doesn't exist)
import { useAuth } from '@/lib/auth'

// ✅ Correct import (verify in codebase first)
import { useAuth } from '@/hooks/useAuth'
```

**Prevention**: ⚠️ Before suggesting an import, verify the file/export exists in the project.

**Validation**: Use `grep -r "export.*useAuth"` to find the actual export location.

---

### [Mistake: e.g., Using Deprecated APIs]

**Example**:
```typescript
// ❌ AI might use deprecated Next.js API
import { useRouter } from 'next/router' // Pages Router (old)

// ✅ Use App Router API (Next.js 13+)
import { useRouter } from 'next/navigation' // App Router (new)
```

**Prevention**: ⚠️ Check `docs/core/ARCHITECTURE.md` for the framework version before generating code.

**Reference**: [See ARCHITECTURE.md for tech stack versions]

---

### [Mistake: e.g., Not Handling Async Errors in React]

**Example**:
```typescript
// ❌ Unhandled promise rejection
async function handleSubmit() {
  await fetch('/api/submit') // No error handling
}

// ✅ Proper error handling
async function handleSubmit() {
  try {
    await fetch('/api/submit')
  } catch (error) {
    console.error('Submit failed:', error)
    // Show user-friendly error message
  }
}
```

**Prevention**: ⚠️ Always wrap async operations in try/catch blocks.

---

## 📚 Reference Checklist (For AI Agents)

Before implementing a feature, verify:

- [ ] Framework version matches `docs/core/ARCHITECTURE.md`
- [ ] Imports use correct paths (check existing files)
- [ ] Environment variables use correct prefix (e.g., `NEXT_PUBLIC_`)
- [ ] Database timestamps use correct type (e.g., `TIMESTAMPTZ`)
- [ ] React components use `'use client'` when needed
- [ ] TypeScript types match `docs/core/SCHEMA.md`
- [ ] Error handling is implemented (no unhandled promises)

---

## 🔗 Related Documentation

- **Architecture**: See `ARCHITECTURE.md` for framework versions
- **Schema**: See `SCHEMA.md` for database gotchas
- **Patterns**: See `PATTERNS.md` for anti-patterns

---

## 📝 How to Document a New Issue

When you encounter a new gotcha:

1. **Title**: Brief, searchable description (e.g., "useState in Server Components")
2. **Framework**: Which tool/library this affects
3. **Symptom**: Exact error message or unexpected behavior
4. **Cause**: Why this happens
5. **Solution**: Code example showing fix
6. **AI Agent Note**: What to check before generating this code

**Template**:
```markdown
### [Issue: Brief Description]

**Framework**: [Tool/Library]
**Symptom**: [Error message or behavior]
**Cause**: [Why it happens]
**Solution**: [Code example]
**AI Agent Note**: [What to verify]
```

<!-- @cortex-tms-version 3.0.0 -->
