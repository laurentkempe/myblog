# Docfind Implementation Plan

## Overview

This document outlines the plan to integrate [docfind](https://github.com/microsoft/docfind) - a high-performance document search engine built in Rust with WebAssembly support - into Laurent Kempé's blog.

## What is Docfind?

Docfind is a client-side search solution that:
- Runs entirely in the browser via WebAssembly (no server required)
- Provides fast fuzzy search (1-3ms per query)
- Uses FST (Finite State Transducers) for efficient keyword matching
- Compresses documents with FSST for compact storage
- Extracts keywords automatically using the RAKE algorithm

**Demo Performance (50,000 articles):**
- Dataset: 17.14 MB uncompressed
- Index Size: 11.48 MB (5.20 MB with Brotli compression)
- Load Time: ~100ms
- Search Speed: 1-3ms per query

## Current Blog Statistics

- **Posts**: 585+ blog posts in MDX format
- **Structure**: Content in `src/content/posts/` organized by year
- **Build Tool**: Astro 5.16.7 with static site generation
- **Styling**: Tailwind CSS with dark/light mode support

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Build Time                         │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Blog Posts (MDX) ──> Extract Script                │
│                           │                          │
│                           ▼                          │
│                    documents.json                    │
│                           │                          │
│                           ▼                          │
│                   docfind CLI                        │
│                           │                          │
│                           ▼                          │
│              docfind.js + docfind_bg.wasm            │
│                                                      │
└─────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────┐
│                   Runtime (Browser)                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  User Types Query ──> Search Component              │
│                           │                          │
│                           ▼                          │
│                    docfind WASM                      │
│                           │                          │
│                           ▼                          │
│                   Search Results                     │
│                           │                          │
│                           ▼                          │
│                  Results Modal/Panel                 │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Implementation Sub-Issues

### Sub-Issue 1: Setup Docfind Build Infrastructure

**Objective**: Install and configure docfind CLI for building search indices

**Tasks**:
1. Install docfind CLI tool
   - Add installation script to `.github/workflows/deploy.yml`
   - Document manual installation for local development
2. Create `scripts/build-search-index.js` to:
   - Read all blog posts from `src/content/posts/`
   - Extract metadata (title, date, tags, category)
   - Parse MDX content and extract body text
   - Generate `documents.json` in required format
3. Add npm scripts to `package.json`:
   - `"build:search-index"` - Generate documents.json
   - `"build:search-wasm"` - Run docfind CLI
   - `"build:search"` - Combined command
4. Update `.gitignore` to exclude:
   - `documents.json` (intermediate file)
   - Development test files

**Expected Output**:
- `public/docfind.js` - JavaScript bindings
- `public/docfind_bg.wasm` - WebAssembly module with embedded index

**Acceptance Criteria**:
- `npm run build:search` successfully generates WASM files
- Generated files are under 10 MB (compressed)
- Build completes in under 2 minutes

---

### Sub-Issue 2: Create Search UI Components

**Objective**: Build Astro components for search interface

**Tasks**:
1. Create `src/components/SearchButton.astro`:
   - Search icon button for header
   - Keyboard shortcut indicator (⌘K / Ctrl+K)
   - Accessible button with proper ARIA labels
   - Dark/light mode support
2. Create `src/components/SearchModal.astro`:
   - Full-screen modal overlay
   - Search input with focus trap
   - Results list container
   - Empty state message
   - Loading state indicator
   - Close button and ESC key handler
   - Responsive design (mobile + desktop)
3. Create `src/components/SearchResult.astro`:
   - Individual result item component
   - Title, excerpt, date, tags display
   - Highlight matching keywords
   - Link to blog post
4. Update `src/components/Header.astro`:
   - Add SearchButton component
   - Position between navigation and theme toggle
   - Maintain responsive layout

**Styling Requirements**:
- Use Tailwind CSS classes
- Match existing blog design system
- Support dark mode (`dark:` prefixes)
- Smooth animations and transitions
- Keyboard navigation highlighting

**Acceptance Criteria**:
- Search button appears in header on all pages
- Modal opens/closes with button click and keyboard shortcuts
- Components are fully accessible (WCAG AA)
- Design matches blog's existing aesthetic

---

### Sub-Issue 3: Implement Search Functionality

**Objective**: Integrate docfind WASM and implement search logic

**Tasks**:
1. Create `public/search-init.js`:
   - Load docfind WASM module
   - Initialize search on page load
   - Handle loading errors
   - Cache search instance
2. Create `src/scripts/search.ts`:
   - Search query handling
   - Debounce user input (300ms)
   - Parse and rank results
   - Highlight matching terms
   - Handle no results case
3. Add keyboard shortcuts:
   - `Cmd/Ctrl + K` - Open search
   - `ESC` - Close search
   - `↑/↓` - Navigate results
   - `Enter` - Open selected result
4. Implement result rendering:
   - Display top 10 results by default
   - Show post title, excerpt, date
   - Highlight matching keywords in context
   - Include post URL for navigation

**Performance Requirements**:
- Initial load time: < 200ms
- Search response time: < 5ms per query
- Smooth scrolling and animations
- Lazy load WASM (load on first search)

**Acceptance Criteria**:
- Search returns relevant results
- Fuzzy matching works (handles typos)
- Results appear instantly as user types
- Navigation via keyboard works smoothly

---

### Sub-Issue 4: Integrate Search into Build Pipeline

**Objective**: Automate search index generation in CI/CD

**Tasks**:
1. Update `.github/workflows/deploy.yml`:
   - Add step to install docfind CLI
   - Run search index build before Astro build
   - Ensure WASM files are included in deployment
2. Add pre-build hook in `astro.config.mjs`:
   - Optionally trigger search build automatically
3. Update `package.json` scripts:
   - Modify `"build"` to include search index generation
4. Test build process:
   - Verify local build works
   - Test in CI environment
   - Check deployed site has search files

**Deployment Checklist**:
- [ ] docfind CLI installs successfully in CI
- [ ] Search index builds without errors
- [ ] WASM files under size limits
- [ ] Files served with correct MIME types
- [ ] Brotli/gzip compression enabled

**Acceptance Criteria**:
- GitHub Actions workflow builds search index
- Deployed site includes search functionality
- No manual steps required for deployment

---

### Sub-Issue 5: Add Documentation and Testing

**Objective**: Document the search feature and ensure quality

**Tasks**:
1. Update `README.md`:
   - Add "Search Feature" section
   - Document how to rebuild search index
   - Explain local development workflow
   - List keyboard shortcuts
2. Create `docs/search-maintenance.md`:
   - How to update search configuration
   - Troubleshooting guide
   - Performance optimization tips
3. Manual testing checklist:
   - Test on Chrome, Firefox, Safari, Edge
   - Test on mobile devices (iOS, Android)
   - Test dark/light modes
   - Test keyboard navigation
   - Test with screen readers
   - Test various search queries
4. Add search feature announcement:
   - Consider a blog post about the new feature
   - Update site's about page if needed

**Documentation Topics**:
- How docfind works
- Customizing search behavior
- Updating keywords/relevance
- Monitoring search performance
- Browser compatibility

**Acceptance Criteria**:
- README clearly explains search feature
- Documentation is complete and accurate
- All browsers tested and working
- No accessibility issues found

---

### Sub-Issue 6: Performance Optimization and Polish

**Objective**: Optimize search experience and add finishing touches

**Tasks**:
1. Optimize WASM loading:
   - Implement lazy loading (load on first use)
   - Add loading indicator during WASM load
   - Preload on hover over search button
   - Cache in browser storage
2. Add analytics (optional):
   - Track search queries (privacy-respecting)
   - Monitor popular searches
   - Track null result searches for improvements
3. Enhance search experience:
   - Add search suggestions/autocomplete
   - Show recent searches
   - Add filters (by year, tag, category)
   - Implement result pagination
4. SEO considerations:
   - Ensure search doesn't interfere with SEO
   - Maintain existing meta tags
   - Keep sitemap generation working
5. Performance monitoring:
   - Measure time to interactive
   - Track WASM load time
   - Monitor search query performance

**Nice-to-Have Features**:
- Search history persistence
- Keyboard shortcut customization
- Export search results
- Share search query via URL

**Acceptance Criteria**:
- WASM loads in < 150ms
- Search feels instant and responsive
- No performance regression on page load
- Analytics (if added) respect privacy

---

## Technical Specifications

### Document JSON Format

```json
[
  {
    "title": "Blog Post Title",
    "category": "Blog",
    "href": "/2024/01/15/blog-post-slug/",
    "body": "Full text content of the blog post..."
  }
]
```

### Required Files Structure

```
myblog/
├── scripts/
│   └── build-search-index.js       # Extract blog posts to JSON
├── public/
│   ├── docfind.js                  # Generated by docfind CLI
│   ├── docfind_bg.wasm            # Generated by docfind CLI
│   └── search-init.js             # Search initialization
├── src/
│   ├── components/
│   │   ├── SearchButton.astro     # Search trigger button
│   │   ├── SearchModal.astro      # Search UI modal
│   │   └── SearchResult.astro     # Result item component
│   └── scripts/
│       └── search.ts              # Search logic
└── docs/
    ├── docfind-implementation-plan.md  # This file
    └── search-maintenance.md          # Maintenance guide
```

### Dependencies to Add

```json
{
  "devDependencies": {
    "@types/node": "^20.x.x"  // For Node.js script typing
  }
}
```

Note: docfind CLI is installed as a binary, not an npm package.

## Estimated Timeline

| Sub-Issue | Estimated Time | Complexity |
|-----------|---------------|------------|
| 1. Build Infrastructure | 4-6 hours | Medium |
| 2. UI Components | 6-8 hours | Medium |
| 3. Search Functionality | 8-10 hours | High |
| 4. Build Pipeline | 2-4 hours | Low |
| 5. Documentation & Testing | 4-6 hours | Medium |
| 6. Optimization & Polish | 4-6 hours | Medium |
| **Total** | **28-40 hours** | - |

## Risks and Mitigations

### Risk 1: Large Index Size
**Impact**: Slow loading times, high bandwidth usage
**Mitigation**: 
- Limit body text length per post
- Use Brotli compression
- Lazy load WASM on demand

### Risk 2: Build Time Increase
**Impact**: Slower CI/CD deployments
**Mitigation**:
- Cache docfind binary
- Optimize JSON extraction script
- Run in parallel with other build steps

### Risk 3: Browser Compatibility
**Impact**: Search not working in some browsers
**Mitigation**:
- Test early and often
- Provide fallback message for unsupported browsers
- Ensure graceful degradation

### Risk 4: Search Quality
**Impact**: Poor or irrelevant results
**Mitigation**:
- Fine-tune keyword extraction
- Test with various queries
- Allow manual keyword tagging if needed

## Success Metrics

- **Performance**: Search results in < 5ms
- **Index Size**: < 6 MB compressed
- **Load Time**: WASM loads in < 150ms
- **Adoption**: Search used by 20%+ of visitors
- **Quality**: 90%+ of searches return relevant results

## Future Enhancements

1. **Advanced Filters**:
   - Filter by date range
   - Filter by tags
   - Filter by post type (blog vs. speaking)

2. **Search Analytics Dashboard**:
   - Most popular searches
   - Null result searches
   - Search trends over time

3. **AI-Powered Suggestions**:
   - Related posts based on search
   - "People also searched for"
   - Auto-correct spelling mistakes

4. **Search API**:
   - Expose search as JSON API
   - Enable external integrations
   - RSS feed of search results

## References

- [Docfind GitHub Repository](https://github.com/microsoft/docfind)
- [VS Code Blog Post on Docfind](https://code.visualstudio.com/blogs/2026/01/15/docfind) (Future/fictional reference)
- [Docfind Live Demo](https://microsoft.github.io/docfind/)
- [Astro Documentation](https://docs.astro.build/)
- [WebAssembly Documentation](https://webassembly.org/)

## Appendix: Alternative Solutions Considered

### Alternative 1: Algolia
**Pros**: Mature, hosted solution, excellent UX
**Cons**: Requires server, costs money, privacy concerns
**Decision**: Rejected due to cost and server requirement

### Alternative 2: Lunr.js
**Pros**: Pure JavaScript, easy to integrate
**Cons**: Larger index size, slower search
**Decision**: Rejected in favor of WASM performance

### Alternative 3: Stork Search
**Pros**: Similar to docfind, WASM-based
**Cons**: Less active development, fewer features
**Decision**: Rejected in favor of Microsoft-backed docfind

### Alternative 4: Typesense
**Pros**: Fast, open-source, good documentation
**Cons**: Requires server hosting
**Decision**: Rejected due to server requirement

## Decision: Docfind Selected

Docfind was chosen because:
1. ✅ **No server required** - fully client-side
2. ✅ **Excellent performance** - sub-millisecond search
3. ✅ **Small footprint** - efficient WASM
4. ✅ **Modern technology** - Rust + WebAssembly
5. ✅ **Active development** - Microsoft-backed
6. ✅ **Easy integration** - simple CLI tool
7. ✅ **Privacy-friendly** - no data leaves browser
