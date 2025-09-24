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

## 🤖 AI Development Support

This project includes MCP (Model Context Protocol) server configuration for enhanced development experience with GitHub Copilot and VS Code. 

**Quick Start**: Open in VS Code Insiders to access:
- 📚 Up-to-date Astro and Tailwind CSS documentation via Context7
- 🗂️ File system analysis and project understanding  
- 🔍 Web search for research and content validation
- 🐙 GitHub repository integration

See [docs/MCP_CONFIGURATION.md](docs/MCP_CONFIGURATION.md) for detailed setup and usage instructions.

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
  - Clickable draft file path
  - Title
  - Date
  - Tags

## Publishing Draft Blog Posts

Publish a draft blog post using an interactive interface:

```bash
pnpm run publish-draft
```

The script will:
- Scan all blog posts for drafts (marked with `draft: true`)
- Display an interactive list with keyboard navigation
- Allow selection using ↑/↓ arrow keys and Enter to confirm
- Update the blog post frontmatter:
  - Set the current date and time
  - Update the permalink with the new publication date
  - Update the disqusIdentifier with the new publication date
  - Remove the `draft: true` flag
- Move the post to the correct year folder if needed (e.g., draft from 2024 → published in 2025)

### Navigation Controls:
- **↑/↓ Arrow Keys**: Navigate through the list of drafts
- **Enter**: Select and publish the highlighted draft
- **q**: Quit without publishing anything

## Comments System (Giscus)

This blog uses [giscus](https://giscus.app) for comments, which are powered by GitHub Discussions. Comments are automatically enabled on all individual blog posts.

### Configuration

To configure giscus properly, you need to:

1. **Enable GitHub Discussions** on your repository:
   - Go to your repository settings
   - Scroll down to the "Features" section  
   - Check "Discussions"

2. **Get giscus configuration**:
   - Visit [giscus.app](https://giscus.app)
   - Enter your repository name: `laurentkempe/myblog-comments`
   - Select a discussion category (recommended: "General" or create a dedicated "Comments" category)
   - Choose mapping: "pathname" (default)
   - Copy the generated `data-repo-id` and `data-category-id` values

3. **Update the configuration**:
   - Edit `src/components/GiscusComments.astro`
   - Replace the empty `data-repo-id` and `data-category-id` values with the ones from giscus.app

### Current Settings

- **Repository**: `laurentkempe/myblog-comments`
- **Mapping**: `pathname` (maps each blog post URL to a discussion)
- **Theme**: `preferred_color_scheme` (automatically adapts to system dark/light mode)
- **Position**: Comments appear below blog post content
- **Reactions**: Enabled on main post
- **Lazy Loading**: Enabled for better performance

### Customization

The `GiscusComments` component accepts various props for customization:

```astro
<GiscusComments 
  repo="laurentkempe/myblog"
  category="Comments" 
  theme="light"
  reactionsEnabled={false}
/>
```

Available props include `repo`, `category`, `mapping`, `theme`, `reactionsEnabled`, `inputPosition`, `lang`, and `loading`.
