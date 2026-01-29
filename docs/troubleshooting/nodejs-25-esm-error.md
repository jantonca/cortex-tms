# Node.js 25 ESM Module Error Investigation

**Status**: Under Investigation
**Reporter**: u/soyalemujica (Reddit)
**Error Code**: `ERR_UNSUPPORTED_ESM_URL_SCHEME`
**Affected Version**: Cortex TMS v3.0.0
**Node.js Version**: 25.x
**Platform**: Likely Windows

## Error Message

```
node:internal/modules/esm/load:195
throw new ERR_UNSUPPORTED_ESM_URL_SCHEME(parsed, schemes);
```

## Background

This error was reported on Reddit during the v3.0.0 launch. The error occurs when Node.js 25 encounters an unsupported URL scheme during ESM module resolution.

## Current Investigation Status

### ✅ Confirmed: Cortex TMS is ESM-Compatible

The codebase analysis shows:
- ✅ `package.json` has `"type": "module"`
- ✅ All source files use `import/export` (no CommonJS)
- ✅ All imports use `.js` extensions (required for ESM)
- ✅ `__dirname` and `__filename` are properly recreated using `fileURLToPath()` and `dirname()`
- ✅ TypeScript compiles to correct ESM output
- ✅ Top-level `await` is used correctly
- ✅ Bin files use proper ESM patterns

**Files Checked**:
- `src/cli.ts` - ✅ ESM compliant
- `bin/cortex-tms.js` - ✅ ESM compliant
- `src/utils/templates.ts` - ✅ ESM compliant (uses `fileURLToPath`, `dirname`)
- `dist/**/*.js` - ✅ Compiled correctly to ESM

### ❓ Potential Root Causes

Given that the code is ESM-compliant, the error likely stems from:

1. **Windows Path Handling**
   - Windows uses backslashes in paths (`C:\Users\...`)
   - ESM `file://` URLs require forward slashes
   - Node.js 25 may have stricter validation of file:// URL schemes
   - Special characters in paths (spaces, Unicode) can cause issues

2. **NPM Global Install Location**
   - When running `npx cortex-tms@latest init`, npm installs to a temp cache directory
   - Cache paths may contain special characters that break in Node.js 25
   - Example: `C:\Users\username\AppData\Local\npm-cache\_npx\...`

3. **Node.js 25 Breaking Changes**
   - Node.js 25 may have introduced stricter ESM resolution
   - Changes to how `file://` URLs are validated
   - Changes to module path resolution on Windows

4. **Missing `exports` Field**
   - `package.json` might need an explicit `exports` field for Node.js 25
   - Current setup uses only `bin` field

## Reproduction Steps

To reproduce this issue, we need:

1. **Install Node.js 25**
   ```bash
   # Using nvm
   nvm install 25
   nvm use 25
   ```

2. **Try Global Install**
   ```bash
   npm install -g cortex-tms@3.0.0
   cortex-tms init
   ```

3. **Try NPX**
   ```bash
   npx cortex-tms@3.0.0 init
   ```

4. **Test on Windows**
   - Especially paths with spaces: `C:\Program Files\...`
   - Especially paths with Unicode characters

## Potential Fixes

### Option 1: Add `exports` Field to package.json

```json
{
  "exports": {
    ".": {
      "import": "./dist/cli.js",
      "types": "./dist/cli.d.ts"
    }
  }
}
```

### Option 2: Add Node.js Version Constraint

If this is a Node.js 25 regression:
```json
{
  "engines": {
    "node": ">=18.0.0 <25.0.0"
  }
}
```

### Option 3: Use `pathToFileURL()` for Dynamic Imports

If the issue is in path resolution, wrap paths in `pathToFileURL()`:
```typescript
import { pathToFileURL } from 'url';
const modulePath = pathToFileURL(join(__dirname, 'module.js'));
await import(modulePath.href);
```

### Option 4: Update Windows Path Handling

Ensure all paths use forward slashes before conversion to file:// URLs.

## Testing Checklist

- [ ] Reproduce error on Node.js 25 (Linux)
- [ ] Reproduce error on Node.js 25 (Windows)
- [ ] Test with paths containing spaces
- [ ] Test with paths containing Unicode characters
- [ ] Test global install (`npm install -g`)
- [ ] Test npx usage (`npx cortex-tms@latest`)
- [ ] Test with different Windows user profile paths

## Next Steps

1. **Request More Information from Reporter**
   - Exact Node.js version (`node --version`)
   - Full error stack trace
   - Operating system and version
   - Installation method (npm global vs npx)
   - User profile path (does it contain spaces or special chars?)

2. **Set Up Test Environment**
   - Docker container with Node.js 25
   - Windows VM or WSL for path testing
   - Test suite for ESM edge cases

3. **Decision Matrix**
   - If reproducible + quick fix → v3.0.1 hotfix
   - If reproducible + complex → document workaround, fix in v3.1
   - If not reproducible → request more details from community

## Workarounds for Users

If you encounter this error:

1. **Downgrade to Node.js 24 or 22 (LTS)**
   ```bash
   nvm install 22
   nvm use 22
   ```

2. **Try Local Install Instead of Global**
   ```bash
   npm install cortex-tms
   npx cortex-tms init
   ```

3. **Avoid Paths with Spaces**
   - Run from a directory without spaces in the path
   - On Windows, use `C:\dev\` instead of `C:\Program Files\`

## References

- [Node.js ESM Documentation](https://nodejs.org/api/esm.html)
- [ERR_UNSUPPORTED_ESM_URL_SCHEME](https://nodejs.org/api/errors.html#err_unsupported_esm_url_scheme)
- [Package.json exports field](https://nodejs.org/api/packages.html#exports)

## Related Issues

- GitHub Issue: [TBD - to be created]
- Reddit Report: [r/cortextms launch thread](https://reddit.com/r/cortextms)

---

**Last Updated**: 2026-01-30
**Contact**: Open a GitHub issue or tag us on Reddit r/cortextms
