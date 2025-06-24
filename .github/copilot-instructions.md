# Copilot Instructions for Laurent Kempé's Blog

## Project Overview

This is Laurent Kempé's personal technical blog - "One of the Tech Head Brothers" - built with modern web technologies. The blog features:

- Technical articles about software development, tools, and technologies
- Speaking engagements and presentations
- Archive and tag-based content organization
- Responsive design with dark/light theme support
- SEO optimization and accessibility features
- Social media integration

## Tech Stack

- **Framework**: Astro 5.7.0 (static site generator with island architecture)
- **Styling**: Tailwind CSS 4.1.4 with custom animations and typography
- **Content**: MDX for blog posts with frontmatter metadata
- **Language**: TypeScript for configuration and utilities
- **Build Tool**: Vite (integrated with Astro)
- **Package Manager**: pnpm (lockfile present)

### Key Dependencies

- `@astrojs/mdx` - MDX support for rich content
- `@astrojs/sitemap` - Automatic sitemap generation
- `astro-auto-import` - Component auto-importing
- `astro-icon` - Icon system
- `@astro-community/astro-embed-*` - Social media embeds (Twitter, YouTube)
- `@tailwindcss/typography` - Typography styling for prose content

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
pnpm install         # Install dependencies
pnpm run dev         # Start development server
pnpm run build       # Build for production
pnpm run preview     # Preview production build
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