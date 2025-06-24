# My new blog

[![Deploy to GitHub Pages](https://github.com/laurentkempe/myblog/actions/workflows/deploy.yml/badge.svg)](https://github.com/laurentkempe/myblog/actions/workflows/deploy.yml)

[Laurent Kempé - One of the Tech Head Brothers](https://laurentkempe.com/) leveraging now [Astro](https://astro.build/).

## Development Options

### 🚀 Quick Start with Dev Containers (Recommended)

The fastest way to get started is using the pre-configured Dev Container:

- **GitHub Codespaces**: Click the green "Code" button → "Codespaces" → "Create codespace"
- **VS Code**: Install Dev Containers extension → Reopen in Container
- **JetBrains WebStorm**: Use Remote Development → Dev Containers

All dependencies are automatically installed. Just run `pnpm run dev` when ready!

See [.devcontainer/README.md](.devcontainer/README.md) for detailed instructions.

### 📦 Local Development

## Install dependencies

```bash
pnpm install
```

## Start the Astro dev server

```bash
pnpm run dev
```

## Creating Draft Blog Posts

Create a new draft blog post using the provided template:

```bash
# Interactive mode - will prompt for title
pnpm run create-draft

# Or provide title as argument
pnpm run create-draft "My Amazing Blog Post Title"
```

The script will:
- Create a new `.mdx` file in the appropriate year folder (`src/content/posts/YYYY/`)
- Generate a URL-friendly slug from the title
- Set up the frontmatter with current date, permalink, and disqusIdentifier
- Mark the post as draft (set `draft: true`)

The generated post will be saved as `src/content/posts/2025/my-amazing-blog-post-title.mdx` (using current year).

## Listing Draft Blog Posts

List all draft blog posts in a formatted table:

```bash
pnpm run list-drafts
```

The script will:
- Scan all blog posts in `src/content/posts/` directories
- Find posts marked with `draft: true` in frontmatter
- Display a formatted table with:
  - Draft filename
  - Title
  - Date
  - Tags
  - Permalink

Example output:
```
📝 Found 2 draft blog posts:

┌───────────────────────────┬───────────────────────┬──────────────┬────────────────────────────────────────────────┬────────────────────────────────────┐
│ Filename                  │ Title                 │ Date         │ Tags                                           │ Permalink                          │
├───────────────────────────┼───────────────────────┼──────────────┼────────────────────────────────────────────────┼────────────────────────────────────┤
│ another-draft-post.mdx    │ Another Draft Post    │ Jun 24, 2025 │ JavaScript, React, TypeScript, Web Development │ /2025/06/24/another-draft-post/    │
│ test-draft-post-title.mdx │ Test Draft Post Title │ Jun 24, 2025 │ AI, ASP.NET Core, C#, LLM, SLM, Docker         │ /2025/06/24/test-draft-post-title/ │
└───────────────────────────┴───────────────────────┴──────────────┴────────────────────────────────────────────────┴────────────────────────────────────┘
```
