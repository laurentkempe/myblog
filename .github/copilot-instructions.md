# Copilot Instructions for Laurent Kempé's Blog

## Project Overview

This is Laurent Kempé's personal technical blog - "One of the Tech Head Brothers" - built with modern web technologies. The blog features:

- Technical articles about software development, tools, and technologies
- Speaking engagements and presentations
- Archive and tag-based content organization
- Responsive design with dark/light theme support
- SEO optimization and accessibility features
- Social media integration
- Giscus-powered comments system

## Tech Stack

- **Framework**: Astro 5.16.0 (static site generator with island architecture)
- **Styling**: Tailwind CSS 4.1.12 with custom animations and typography
- **Content**: MDX for blog posts with frontmatter metadata
- **Language**: TypeScript for configuration and utilities
- **Build Tool**: Vite (integrated with Astro via @tailwindcss/vite)
- **Package Manager**: pnpm (lockfile present)

### Key Dependencies

- `@astrojs/mdx` (4.3.12) - MDX support for rich content
- `@astrojs/sitemap` (3.6.0) - Automatic sitemap generation
- `astro-auto-import` (0.4.4) - Component auto-importing
- `astro-icon` (1.1.5) - Icon system with Iconify collections
- `@astro-community/astro-embed-twitter` (0.5.8) - Twitter embeds
- `@astro-community/astro-embed-youtube` (0.5.6) - YouTube embeds
- `@tailwindcss/typography` (0.5.16) - Typography styling for prose content
- `markdown-it` (14.1.0) - Markdown parsing utilities

## Project Structure

```
src/
├── components/          # Reusable Astro components
│   ├── Header.astro    # Site navigation
│   ├── Footer.astro    # Site footer
│   ├── ThemeToggle.astro # Dark/light mode switcher
│   └── ...             # Other UI components
├── content/            # Content collections
│   ├── posts/          # Blog posts in MDX format
│   └── speaking/       # Presentations and talks
├── layouts/            # Page layouts
│   └── Layout.astro    # Main layout with SEO meta tags
├── pages/              # Route pages
│   ├── index.astro     # Homepage
│   ├── blog.astro      # Blog listing
│   ├── archives/       # Archive pages by year
│   └── tags/           # Tag-based pages
├── styles/             # Global CSS
└── utils/              # Helper functions and constants
    ├── constants.ts    # Site configuration
    └── collections.ts  # Content collection utilities
```

## Content Management

### Blog Posts
- Located in `src/content/posts/` organized by year
- Written in MDX format with frontmatter
- Required frontmatter fields: `title`, `date`, `permalink`
- Optional fields: `description`, `coverImage`, `thumbnailImage`, `tags`, `draft`
- Use `{/* <!-- more --> */}` comment for post excerpts

### Speaking Content
- Located in `src/content/speaking/`
- Similar structure to blog posts with additional `slides` field
- Supports presentation metadata and descriptions

## Component Conventions

- **File Extension**: Use `.astro` for components
- **Component Props**: Define TypeScript interfaces for props
- **Imports**: Leverage `astro-auto-import` for commonly used components
- **Icons**: Use `astro-icon` with Iconify collections (`@iconify-json/fa6-*`)
- **Embeds**: Auto-imported components available: `<Tweet>`, `<YouTube>`, `<GitHubCard>`, `<Alert>`, `<Reveal>`

### Auto-Imported Components
These components are available in MDX files without explicit imports:
- `GitHubCard.astro` - GitHub repository cards
- `Alert.astro` - Callout/alert boxes
- `Reveal.astro` - Expandable content sections
- `GiscusComments.astro` - GitHub-based comments
- `Tweet` - Twitter embed component
- `YouTube` - YouTube video embed
- `Image` - Optimized image component from `astro:assets`

## Styling Conventions

- **Framework**: Tailwind CSS with class-based styling
- **Dark Mode**: Class-based dark mode (`dark:` prefix)
- **Responsive**: Mobile-first approach with responsive utilities
- **Typography**: Use `@tailwindcss/typography` for prose content
- **Animations**: `tailwindcss-animate` for smooth transitions
- **Theme Colors**: Responsive design with `bg-white dark:bg-gray-900` pattern

### Color Scheme
- Light mode: White backgrounds with dark text
- Dark mode: Gray-900 backgrounds with light text
- Proper contrast ratios meeting WCAG AA standards

## SEO and Accessibility Best Practices

### SEO Features
- Open Graph meta tags for social sharing
- Twitter Card metadata
- Canonical URLs on all pages
- Automatic sitemap generation (`/sitemap.xml`)
- RSS feed (`/atom.xml`)
- Structured data (JSON-LD) for blog posts

### Accessibility Features
- ARIA attributes on interactive elements
- Keyboard navigation support
- Screen reader optimized content
- High contrast color ratios in both themes
- Focus management and visible focus indicators
- Semantic HTML structure

## Development Commands

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run preview      # Preview production build
pnpm run create-draft # Create a new draft blog post
pnpm run list-drafts  # List all draft posts
pnpm run publish-draft # Publish a draft post
```

## Content Creation Guidelines

### Writing Blog Posts
1. Create new MDX file in `src/content/posts/YYYY/`
2. Include required frontmatter with title, date, permalink
3. Use semantic headings (##, ###, etc.)
4. Add relevant tags for categorization
5. Include cover images when appropriate
6. Use `{/* <!-- more --> */}` for excerpt breaks

### Component Usage in MDX
- Leverage auto-imported components for rich content
- Use `<Alert>` for important callouts
- Embed social media with `<Tweet>` and `<YouTube>`
- Showcase GitHub repos with `<GitHubCard>`
- Create expandable sections with `<Reveal>`

## Configuration Files

- `astro.config.mjs` - Main Astro configuration
- `tailwind.config.mjs` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `src/content/config.ts` - Content collection schemas
- `src/utils/constants.ts` - Site-wide constants and author info

## Build, Test, and Validation

### Building the Project
```bash
pnpm run build        # Production build (outputs to dist/)
pnpm run dev          # Development server with hot reload
pnpm run preview      # Preview production build locally
```

**Build Requirements:**
- Node.js 20 or later recommended
- pnpm package manager (install with `npm install -g pnpm`)
- All dependencies must be installed first with `pnpm install`

**Expected Build Output:**
- Static HTML files in `dist/` directory
- Generated sitemap at `dist/sitemap.xml`
- Optimized assets and images

### Linting and Testing
⚠️ **Note**: This project currently has no linting or automated testing infrastructure. When making changes:
- Manually verify Astro component syntax
- Check TypeScript types compile correctly with `astro check`
- Test locally with `pnpm run dev` before building
- Validate MDX frontmatter matches the schema in `src/content/config.ts`

### Validating Changes

**For Component Changes:**
1. Run `pnpm run dev` to start development server
2. Navigate to affected pages in browser (typically http://localhost:4321)
3. Test both light and dark themes with the theme toggle
4. Verify responsive behavior at different screen sizes
5. Check browser console for any errors

**For Content Changes (Blog Posts/Speaking):**
1. Verify frontmatter fields match schema requirements
2. Check that `{/* <!-- more --> */}` excerpt marker is properly placed
3. Ensure dates are in correct ISO format (YYYY-MM-DD)
4. Validate that tags are consistent with existing tag structure
5. Test post rendering with `pnpm run dev`

**For Build Verification:**
1. Run `pnpm run build` to ensure no build errors
2. Run `pnpm run preview` to test the production build
3. Check console output for warnings or errors
4. Verify generated pages in browser

## Common Pitfalls and Gotchas

### MDX Content Issues
- **YouTube Embeds**: Some posts may have YouTube components with invalid JSON data. The build will fail with "Unexpected token" errors if YouTube metadata cannot be parsed. Check the specific blog post mentioned in the error.
- **More Marker**: The excerpt separator must be exactly `{/* <!-- more --> */}` (MDX comment syntax), not HTML comment syntax
- **Frontmatter Types**: Date fields must be parseable dates (YYYY-MM-DD format). The schema uses `z.coerce.date()` for automatic parsing.

### Component Auto-Import
- Components listed in `astro.config.mjs` auto-import configuration are available globally in MDX files
- Don't manually import these components - it will cause conflicts
- Auto-imported components: `GitHubCard`, `Alert`, `Reveal`, `GiscusComments`, `Tweet`, `YouTube`, `Image`

### Tailwind CSS
- This project uses Tailwind CSS v4.1+ with Vite plugin, not PostCSS
- Styles are applied via class names directly in components
- Dark mode classes (e.g., `dark:bg-gray-900`) require the base light mode class to be present
- Typography plugin classes (e.g., `prose`) handle markdown content styling

### Build Performance
- The site has many posts and generates many tag pages - builds can take 30-90 seconds
- Development server (hot reload) is much faster for iterative changes
- Static page generation happens at build time, not runtime

### Giscus Comments
- Comments component requires `data-repo-id` and `data-category-id` configuration
- These IDs must be obtained from https://giscus.app
- GitHub Discussions must be enabled on the repository for comments to work

## Deployment

The site deploys automatically via GitHub Actions on push to `main` branch:
- Workflow: `.github/workflows/deploy.yml`
- Uses `withastro/action@v3` for building
- Deploys to external repository `laurentkempe/techheadbrothers` via GitHub Pages
- Requires `ACTIONS_DEPLOY_KEY` secret for cross-repository deployment

## Troubleshooting

### Build Fails with "pnpm: command not found"
```bash
npm install -g pnpm
```

### Build Fails with Module Errors
```bash
rm -rf node_modules dist .astro
pnpm install
pnpm run build
```

### Type Errors in Components
- Check that props interfaces match actual usage
- Verify imports from `astro:assets` and other Astro modules
- Run `astro check` (if available) for type checking

### Development Server Not Hot Reloading
- Restart the dev server with `pnpm run dev`
- Check that you're editing files inside the `src/` directory
- Some changes (like config files) require server restart

### Images Not Displaying
- Images should be in `public/` for static assets or imported via `astro:assets` for optimization
- Check that image paths are correct relative to the page location
- Verify image files exist and have correct permissions