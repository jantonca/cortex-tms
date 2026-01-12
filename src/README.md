# Cortex TMS CLI - Source Code

This directory contains the TypeScript source code for the Cortex TMS command-line tool.

## Directory Structure

```
src/
├── cli.ts              # Main entry point (Commander.js setup)
├── commands/           # Command implementations
│   └── init.ts         # (Coming next) Initialize TMS in project
├── utils/              # Shared utilities
│   ├── file-ops.ts     # (Coming) File system operations
│   ├── prompts.ts      # (Coming) Inquirer prompt definitions
│   └── templates.ts    # (Coming) Template processing
└── types/
    └── cli.ts          # TypeScript type definitions
```

## Development

**Run CLI in development mode**:
```bash
# Via npm script
pnpm cli:dev

# Directly with tsx
tsx src/cli.ts --help
tsx src/cli.ts init

# Via the shebang wrapper
node bin/cortex-tms.js --help
```

**Build for production**:
```bash
pnpm cli:build
# Output: dist/
```

## Architecture

### Entry Flow

1. **bin/cortex-tms.js** - Shebang wrapper (executable)
   - Detects dev vs production environment
   - In dev: Uses `tsx` to run TypeScript directly
   - In prod: Runs compiled JavaScript from `dist/`

2. **src/cli.ts** - Main CLI setup
   - Configures Commander.js program
   - Registers subcommands
   - Handles errors and help output

3. **src/commands/*.ts** - Individual commands
   - Each command is a separate file
   - Exports a Commander Command instance
   - Handles user interaction via Inquirer

4. **src/utils/*.ts** - Shared logic
   - File system operations (fs-extra)
   - Template processing (placeholder replacement)
   - Project detection (git, package.json, etc.)

## Phase 4 Roadmap

### ✅ Step 1: Foundation (Current Commit)
- Package structure
- TypeScript configuration
- Basic CLI skeleton
- Version and help commands

### ⬜ Step 2: Init Command
- Interactive prompts (project name, template selection)
- Project context detection
- File conflict detection

### ⬜ Step 3: Template Operations
- Copy templates from `templates/` directory
- Replace placeholders ([Project Name], etc.)
- Safe overwrite handling

### ⬜ Step 4: Testing & Polish
- Test in greenfield projects
- Test in brownfield projects
- Error handling and validation
- Spinner/progress indicators

## Code Quality Standards

- **TypeScript**: Strict mode enabled
- **ESM**: Pure ES modules (no CommonJS)
- **Error Handling**: All file operations wrapped in try/catch
- **User Feedback**: Clear messages with chalk colors
- **Validation**: Input validation before file operations
- **Safety**: Never overwrite without confirmation

## Dependencies

### Production
- `commander` - CLI framework
- `inquirer` - Interactive prompts
- `chalk` - Terminal colors
- `fs-extra` - Enhanced file operations
- `ora` - Spinners and progress indicators

### Development
- `tsx` - TypeScript execution (dev mode)
- `typescript` - Type checking and compilation
- `@types/*` - Type definitions

## Testing Commands

```bash
# Version check
node bin/cortex-tms.js --version

# Help output
node bin/cortex-tms.js --help

# Init command (placeholder)
node bin/cortex-tms.js init
```

---

**Last Updated**: 2026-01-12
**Phase**: 4 (CLI Tool) - Step 1 Complete
