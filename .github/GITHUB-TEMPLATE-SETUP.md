# GitHub Template Repository Setup

This document provides instructions for enabling this repository as a GitHub Template.

## Manual Steps Required

GitHub Template status must be enabled through the repository settings interface. Follow these steps:

### 1. Enable Template Repository

1. Navigate to: `https://github.com/cortex-tms/cortex-tms/settings`
2. Scroll to the **"Template repository"** section
3. Check the box: **"Template repository"**
4. Click **"Save"**

### 2. Verify Template Badge

After enabling, a "Use this template" button will appear on the repository homepage:
- Green button next to "Code"
- Allows one-click repository creation

### 3. Repository Settings Checklist

Ensure these settings are configured:

- [ ] **Visibility**: Public (required for template usage)
- [ ] **Issues**: Enabled
- [ ] **Wiki**: Disabled (optional)
- [ ] **Projects**: Disabled (optional)
- [ ] **Discussions**: Enabled (optional for community support)

### 4. Topics (Recommended)

Add these topics to improve discoverability:
- `tms`
- `ai-optimized`
- `boilerplate`
- `documentation`
- `claude`
- `copilot`
- `template`
- `cli-tool`

### 5. About Section

Update the repository description:

**Description:**
```
The Universal AI-Optimized Project Boilerplate - CLI tool and template system for maximizing AI agent performance
```

**Website:**
```
https://github.com/cortex-tms/cortex-tms
```

## Usage Instructions for Users

Once template status is enabled, users can:

### Option 1: Use GitHub Template (Batteries-Included)
1. Click "Use this template" on the repository homepage
2. Create a new repository with all files pre-configured
3. Run `pnpm install` to set up dependencies
4. Customize templates for their project

### Option 2: Use CLI Tool (Minimal Setup)
```bash
mkdir my-project && cd my-project
npx cortex-tms init
```

## Verification

Test template creation:
1. Log in to a different GitHub account (or use incognito mode)
2. Navigate to the repository
3. Verify "Use this template" button is visible
4. Create a test repository to ensure files are copied correctly

## Notes

- The `.github/template.yml` file defines files excluded from template repositories
- Template repositories automatically exclude `.git` history
- Users get a clean slate with all TMS structure pre-configured
