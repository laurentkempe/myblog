# GenAI Spell Checking

This directory contains the GenAI script for automatic spell checking and grammar correction of markdown files.

## How it works

The `sc.genai.mts` script:

1. Identifies recently modified `.md` and `.mdx` files using git diff
2. Analyzes each file for spelling and grammar errors
3. Preserves important content:
   - YAML frontmatter
   - Code blocks (inline and fenced)
   - URLs and links
   - Technical terminology
4. Applies only minimal, necessary corrections
5. Saves the corrected content back to the files

## GitHub Action Integration

The spell checker runs automatically via GitHub Actions when:
- Pushing to any branch except `main`
- Changes include `.md` or `.mdx` files

If corrections are made, they are automatically committed with the message:
`fix: spellcheck markdown files [genai]`

## Manual Usage

You can also run the spell checker manually:

```bash
npx --yes genaiscript run sc
```

Or specify a custom base commit:

```bash
npx --yes genaiscript run sc --vars base="HEAD~2"
```