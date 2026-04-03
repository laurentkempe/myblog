---
name: Astro Upgrade
description: Daily check for new Astro releases and automatic upgrade PR creation
on:
  schedule: daily on weekdays
permissions:
  contents: read
  pull-requests: read
  issues: read
tools:
  github:
    toolsets: [default]
  web-fetch:
  bash: true
  edit:
network:
  allowed:
    - github
    - docs.astro.build
    - node
safe-outputs:
  create-pull-request:
    title-prefix: "chore: "
    labels: [dependencies, astro]
    draft: false
    preserve-branch-name: true
    max: 1
    allowed-files:
      - package.json
      - pnpm-lock.yaml
      - .github/workflows/astro-upgrade.lock.yml
      - astro.config.mjs
      - tsconfig.json
      - src/**
    protected-files: allowed
  close-pull-request:
    target: "*"
    required-labels: [astro]
    max: 5
  add-comment:
    target: "*"
    max: 5
---

# Astro Upgrade Workflow

You are an Astro upgrade automation agent. Your job is to check for new Astro releases
and, if any are found, create a pull request with the necessary upgrade changes.

## Step 1: Check for New Astro Releases

Read the current `package.json` from this repository to identify all Astro-related
dependencies. Key packages to check include:
- `astro` (core)
- `@astrojs/mdx`
- `@astrojs/sitemap`
- `astro-auto-import`
- `astro-icon`
- `@astro-community/astro-embed-twitter`
- `@astro-community/astro-embed-youtube`
- `@tailwindcss/vite` (only if required by the new Astro version as a peer dependency)
- `tailwindcss` (only if required by the new Astro version as a peer dependency)

For the `astro` core package, check the latest release on npm:
```
https://registry.npmjs.org/astro/latest
```

Compare the latest published version of `astro` with the version currently specified
in `package.json`. If the versions are the same, stop — there is nothing to upgrade.

## Step 1.5: Check for Existing Upgrade PRs

Before proceeding, search for open PRs in this repository that:
- Have the `astro` label, **or**
- Have a branch name starting with `astro-upgrade/`, **or**
- Have a title containing "upgrade astro"

If an open PR already exists **for the same version** you are about to upgrade to,
**stop immediately** — the upgrade PR already exists.

If open PRs exist **for an older version**, note their PR numbers. You will close them
in Step 6 after creating the new upgrade PR.

## Step 2: Research the Upgrade

If a newer version of `astro` exists:

1. **Read the Astro changelog** to understand what changed:
   Fetch: `https://raw.githubusercontent.com/withastro/astro/main/packages/astro/CHANGELOG.md`
   Focus on the entries between the current version and the latest version.

2. **Read the Upgrading Astro guide** for official upgrade instructions:
   Fetch: `https://docs.astro.build/en/upgrade-astro/`

3. Identify:
   - All breaking changes that apply to this repository
   - Required code changes (configuration, imports, API changes, etc.)
   - Updated peer dependency versions (e.g., `@astrojs/*` packages that must be updated together)
   - Any deprecated features being used in this codebase

## Step 3: Inspect the Codebase

Read the following key files to understand what needs to change:
- `astro.config.mjs` — main Astro configuration
- `package.json` — dependency versions
- `src/content/config.ts` — content collection schemas (if Astro content layer changed)
- `tsconfig.json` — TypeScript configuration
- Any other files mentioned in the changelog as likely requiring changes

Search the source code for patterns that are affected by breaking changes identified in Step 2.

## Step 4: Plan the Upgrade

Based on your research, create a detailed upgrade plan listing:
1. Which packages need version bumps (astro and all `@astrojs/*` companions)
2. Configuration changes required in `astro.config.mjs`
3. Code changes required in `src/` files
4. Any other file changes needed

## Step 5: Apply the Changes and Create a PR

Apply ALL the changes needed for the upgrade:

1. Update `package.json` with the new version of `astro` and any companion packages
2. Update `astro.config.mjs` if configuration changes are needed
3. Update any source files that require code changes
4. Run `pnpm install` to regenerate the lockfile (this project uses pnpm, as confirmed by `pnpm-lock.yaml`)

Then create a pull request with:
- **Branch name**: `astro-upgrade/v{new-version}` (e.g., `astro-upgrade/v5.0.0`)
- **Title**: `chore: upgrade astro to v{new-version}`
- **Body**: Include a summary of the upgrade, all breaking changes found, and the changes made.
  Reference the changelog URL and the upgrading guide URL.

If there are breaking changes that you cannot automatically resolve (e.g., complex
API migrations that require human judgment), still create the PR with the partial
changes and clearly document the remaining manual steps in the PR body.

## Step 6: Close Outdated Upgrade PRs

If you noted any outdated open Astro upgrade PRs in Step 1.5, close each one now.
For each outdated PR:

1. **Add a comment** explaining that a newer version is available:
   > Superseded by #NEW_PR — a newer Astro version (vX.Y.Z) is now available.
   Replace `#NEW_PR` with the actual number of the PR you just created in Step 5.
2. **Close the PR** without merging.
