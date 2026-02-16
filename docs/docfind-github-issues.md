# GitHub Issues for Docfind Integration

This document contains ready-to-copy issue templates for implementing docfind search functionality.

---

## Issue #1: Setup Docfind Build Infrastructure

**Title**: Setup Docfind Build Infrastructure

**Labels**: enhancement, documentation, build

**Description**:

### Objective
Install and configure docfind CLI for building search indices from blog posts.

### Background
We're integrating [docfind](https://github.com/microsoft/docfind), a high-performance WebAssembly-based search engine, to enable client-side search across all blog posts. This issue covers the initial infrastructure setup.

### Tasks
- [ ] Install docfind CLI tool and document installation process
- [ ] Create `scripts/build-search-index.js` to extract blog post data
  - Read all blog posts from `src/content/posts/`
  - Extract metadata (title, date, tags, category)
  - Parse MDX content and extract body text
  - Generate `documents.json` in docfind format
- [ ] Add npm scripts to `package.json`:
  - `"build:search-index"` - Generate documents.json
  - `"build:search-wasm"` - Run docfind CLI
  - `"build:search"` - Combined command
- [ ] Update `.gitignore` to exclude intermediate files

### Expected Output
- `public/docfind.js` - JavaScript bindings
- `public/docfind_bg.wasm` - WebAssembly module with embedded index

### Acceptance Criteria
- [ ] `npm run build:search` successfully generates WASM files
- [ ] Generated files are under 10 MB (compressed)
- [ ] Build completes in under 2 minutes
- [ ] Documentation added for local development setup

### Technical Notes
- Current blog has 585+ posts
- Documents should include: title, category, href, body
- Body text should exclude frontmatter and MDX code blocks
- Consider limiting body length to optimize index size

---

## Issue #2: Create Search UI Components

**Title**: Create Search UI Components

**Labels**: enhancement, UI/UX, component

**Description**:

### Objective
Build Astro components for the search interface with full dark/light mode support.

### Tasks
- [ ] Create `src/components/SearchButton.astro`
  - Search icon button for header
  - Keyboard shortcut indicator (⌘K / Ctrl+K)
  - Accessible button with proper ARIA labels
  - Dark/light mode support
- [ ] Create `src/components/SearchModal.astro`
  - Full-screen modal overlay
  - Search input with focus trap
  - Results list container
  - Empty state message
  - Loading state indicator
  - Close button and ESC key handler
  - Responsive design (mobile + desktop)
- [ ] Create `src/components/SearchResult.astro`
  - Individual result item component
  - Display: title, excerpt, date, tags
  - Highlight matching keywords
  - Link to blog post
- [ ] Update `src/components/Header.astro`
  - Add SearchButton component
  - Position appropriately in navigation
  - Maintain responsive layout

### Design Requirements
- Use Tailwind CSS classes
- Match existing blog design system
- Support dark mode with `dark:` prefixes
- Smooth animations and transitions (use `tailwindcss-animate`)
- Keyboard navigation with visual feedback
- Follow WCAG AA accessibility guidelines

### Acceptance Criteria
- [ ] Search button appears in header on all pages
- [ ] Modal opens/closes with button click and keyboard shortcuts
- [ ] Components are fully accessible (tested with screen reader)
- [ ] Design matches blog's existing aesthetic
- [ ] Works on mobile and desktop viewports
- [ ] Dark mode toggles correctly

### Design Reference
- Refer to existing Header.astro for styling patterns
- Use similar modal approach as mobile menu
- Follow ThemeToggle.astro pattern for theme support

---

## Issue #3: Implement Search Functionality

**Title**: Implement Search Functionality with Docfind WASM

**Labels**: enhancement, javascript, performance

**Description**:

### Objective
Integrate docfind WASM module and implement client-side search logic.

### Tasks
- [ ] Create `public/search-init.js`
  - Load docfind WASM module
  - Initialize search on page load
  - Handle loading errors gracefully
  - Cache search instance
- [ ] Create `src/scripts/search.ts`
  - Search query handling function
  - Debounce user input (300ms)
  - Parse and rank results
  - Highlight matching terms in results
  - Handle no results case
- [ ] Implement keyboard shortcuts
  - `Cmd/Ctrl + K` - Open search modal
  - `ESC` - Close search modal
  - `↑/↓` - Navigate results
  - `Enter` - Open selected result
  - `Tab` - Trap focus within modal
- [ ] Implement result rendering
  - Display top 10 results by default
  - Show post title, excerpt, date, tags
  - Highlight matching keywords in context
  - Include post URL for navigation
  - Smooth scroll to selected result

### Performance Requirements
- Initial load time: < 200ms
- Search response time: < 5ms per query
- Smooth animations (60fps)
- Lazy load WASM (load on first search interaction)

### Acceptance Criteria
- [ ] Search returns relevant results for common queries
- [ ] Fuzzy matching works (handles typos)
- [ ] Results appear instantly as user types
- [ ] Keyboard navigation works smoothly
- [ ] No console errors or warnings
- [ ] Works in Chrome, Firefox, Safari, Edge

### Technical Notes
- Use `wasm-bindgen` bindings from docfind.js
- Consider implementing result caching
- Debounce prevents excessive searches while typing
- Highlight matching terms using text highlighting

---

## Issue #4: Integrate Search into Build Pipeline

**Title**: Integrate Search Index Generation into CI/CD Pipeline

**Labels**: enhancement, CI/CD, automation

**Description**:

### Objective
Automate search index generation in the GitHub Actions deployment workflow.

### Tasks
- [ ] Update `.github/workflows/deploy.yml`
  - Add step to install docfind CLI before build
  - Run search index build before Astro build
  - Ensure WASM files are included in deployment
  - Add error handling for build failures
- [ ] Update `package.json` scripts
  - Modify `"build"` to include search index generation
  - Ensure proper command chaining
- [ ] Test build process
  - Verify local build works end-to-end
  - Test in CI environment (GitHub Actions)
  - Verify deployed site includes search files
  - Check WASM files served with correct MIME types

### Deployment Checklist
- [ ] docfind CLI installs successfully in CI
- [ ] Search index builds without errors
- [ ] WASM files under size limits (10 MB)
- [ ] Files served with correct MIME types
- [ ] Brotli/gzip compression enabled for WASM
- [ ] No increase in build time > 2 minutes

### Acceptance Criteria
- [ ] GitHub Actions workflow builds search index automatically
- [ ] Deployed site includes working search functionality
- [ ] No manual steps required for deployment
- [ ] Build failures are handled gracefully
- [ ] Documentation updated for build process

### Technical Notes
- Install docfind using: `curl -fsSL https://microsoft.github.io/docfind/install.sh | sh`
- Ensure docfind binary is in PATH for CI
- Consider caching docfind binary to speed up builds
- Verify static files are copied to deployment directory

---

## Issue #5: Add Documentation and Testing

**Title**: Add Documentation and Testing for Search Feature

**Labels**: documentation, testing

**Description**:

### Objective
Document the search feature comprehensively and ensure quality through testing.

### Tasks
- [ ] Update `README.md`
  - Add "Search Feature" section
  - Document how to rebuild search index locally
  - Explain local development workflow
  - List keyboard shortcuts for users
- [ ] Create `docs/search-maintenance.md`
  - How to update search configuration
  - Troubleshooting common issues
  - Performance optimization tips
  - Monitoring search quality
- [ ] Create testing checklist and test
  - Chrome, Firefox, Safari, Edge (latest versions)
  - Mobile devices (iOS Safari, Android Chrome)
  - Dark and light modes
  - Keyboard navigation
  - Screen reader compatibility (NVDA/VoiceOver)
  - Various search queries (common, edge cases)
- [ ] Optional: Write blog post announcing feature
  - Explain docfind technology
  - Show how to use search
  - Share performance metrics

### Documentation Topics to Cover
- How docfind works (brief overview)
- Customizing search behavior
- Updating keywords and relevance weights
- Monitoring search performance
- Browser compatibility matrix
- Accessibility features

### Testing Scenarios
- [ ] Search with common terms (e.g., "Docker", "C#", "Azure")
- [ ] Search with typos (fuzzy matching)
- [ ] Search with partial words
- [ ] Search with multiple keywords
- [ ] Empty search query
- [ ] Very long search query
- [ ] Special characters in search
- [ ] Search on slow network (throttled)

### Acceptance Criteria
- [ ] README clearly explains search feature
- [ ] Maintenance documentation is complete and accurate
- [ ] All major browsers tested and working
- [ ] No accessibility issues found (WCAG AA compliant)
- [ ] Mobile experience is smooth
- [ ] Test results documented

---

## Issue #6: Performance Optimization and Polish

**Title**: Performance Optimization and Polish for Search Feature

**Labels**: enhancement, performance, UX

**Description**:

### Objective
Optimize search experience and add finishing touches for production quality.

### Tasks
- [ ] Optimize WASM loading
  - Implement lazy loading (load on first use)
  - Add loading indicator during WASM initialization
  - Preload on hover over search button
  - Consider caching in browser storage
- [ ] Enhance search experience
  - Add visual feedback for no results
  - Show recent searches (optional)
  - Add search result count
  - Improve result excerpt generation
  - Add fade-in animations for results
- [ ] Performance monitoring
  - Measure time to interactive
  - Track WASM load time
  - Monitor search query performance
  - Log slow queries for investigation
- [ ] SEO considerations
  - Ensure search doesn't interfere with SEO
  - Maintain existing meta tags
  - Keep sitemap generation working
  - Verify no impact on page load performance
- [ ] Final polish
  - Smooth animations and transitions
  - Perfect mobile responsive behavior
  - Cross-browser testing and fixes
  - Accessibility audit

### Nice-to-Have Features (Optional)
- [ ] Search history persistence (localStorage)
- [ ] Keyboard shortcut customization
- [ ] Export search results
- [ ] Share search query via URL parameter
- [ ] Filter by year, tag, or category
- [ ] Sort results by date or relevance

### Performance Targets
- WASM loads in < 150ms (initial load)
- Search feels instant (< 50ms perceived delay)
- No performance regression on page load
- Lighthouse score maintains 90+ performance

### Acceptance Criteria
- [ ] Search experience feels polished and professional
- [ ] Performance meets or exceeds targets
- [ ] All animations smooth at 60fps
- [ ] No regressions in existing functionality
- [ ] User testing feedback is positive
- [ ] Ready for production deployment

### Metrics to Track
- Time to first search result
- WASM load time (p50, p95, p99)
- Search query latency
- Modal open/close animation smoothness
- Mobile vs desktop performance comparison

---

## Implementation Order

These issues should be implemented in order:

1. **Issue #1** (Build Infrastructure) - Foundation
2. **Issue #2** (UI Components) - Can start in parallel with #1
3. **Issue #3** (Search Functionality) - Requires #1 and #2
4. **Issue #4** (Build Pipeline) - Requires #1
5. **Issue #5** (Documentation) - Can start anytime, finalize after #3
6. **Issue #6** (Optimization) - Requires #3, final polish

## Total Estimated Effort

- Issue #1: 4-6 hours
- Issue #2: 6-8 hours
- Issue #3: 8-10 hours
- Issue #4: 2-4 hours
- Issue #5: 4-6 hours
- Issue #6: 4-6 hours

**Total: 28-40 hours** (approximately 1-2 weeks for one developer)

## Dependencies

### External
- docfind CLI binary
- Node.js 20+ (for build scripts)
- pnpm (existing)

### Internal
- Existing blog structure must remain stable
- Astro framework compatibility
- Tailwind CSS theming system

## Success Criteria

Overall project success will be measured by:
- ✅ Search index builds automatically
- ✅ Search UI is accessible and responsive
- ✅ Search results are fast (<3ms per query)
- ✅ Works in all major browsers
- ✅ Maintains blog's existing dark/light theme
- ✅ Zero server-side dependencies
- ✅ No negative impact on SEO or performance
- ✅ Positive user feedback
