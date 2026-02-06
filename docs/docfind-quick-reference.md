# Docfind Quick Reference Guide

## What is Docfind?

Docfind is a high-performance, client-side search engine that runs entirely in the browser via WebAssembly. No server required!

**Key Features:**
- ⚡ Ultra-fast search (1-3ms per query)
- 🔍 Fuzzy matching (handles typos)
- 📦 Compact index size (60-80% compression)
- 🚀 Zero server dependencies
- 🔒 Privacy-friendly (all searches happen locally)

## Quick Start Commands

```bash
# Install docfind CLI (macOS/Linux)
curl -fsSL https://microsoft.github.io/docfind/install.sh | sh

# Install docfind CLI (Windows PowerShell)
irm https://microsoft.github.io/docfind/install.ps1 | iex

# Build search index (after implementation)
npm run build:search-index   # Extract blog posts to JSON
npm run build:search-wasm    # Generate WASM from JSON
npm run build:search         # Do both steps

# Full build with search
npm run build
```

## Document JSON Format

```json
[
  {
    "title": "Post Title",
    "category": "Blog",
    "href": "/2024/01/15/post-slug/",
    "body": "Full text content..."
  }
]
```

## Integration Points

### 1. Build Time
- Extract blog posts → `documents.json`
- Generate WASM → `public/docfind.js` + `public/docfind_bg.wasm`

### 2. Header Component
```astro
<!-- src/components/Header.astro -->
<SearchButton />  <!-- Add this -->
```

### 3. Search Modal
```astro
<!-- Global component -->
<SearchModal />
```

### 4. Client-Side Search
```javascript
// Load and search
import search from '/docfind.js';
const results = await search('query');
```

## File Structure

```
myblog/
├── scripts/
│   └── build-search-index.js       # Build script
├── public/
│   ├── docfind.js                  # Generated
│   ├── docfind_bg.wasm            # Generated
│   └── search-init.js             # Your code
├── src/
│   ├── components/
│   │   ├── SearchButton.astro
│   │   ├── SearchModal.astro
│   │   └── SearchResult.astro
│   └── scripts/
│       └── search.ts
└── docs/
    ├── docfind-implementation-plan.md
    ├── docfind-github-issues.md
    └── docfind-quick-reference.md  # This file
```

## Keyboard Shortcuts

- `Cmd/Ctrl + K` - Open search
- `ESC` - Close search
- `↑/↓` - Navigate results
- `Enter` - Open selected result
- `Tab/Shift+Tab` - Move focus in modal

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| WASM Load | < 150ms | First search only |
| Search Query | < 5ms | Per query |
| Index Size | < 6 MB | Compressed with Brotli |
| Build Time | < 2 min | Added to existing build |

## Troubleshooting

### Issue: WASM fails to load
**Solution**: Check MIME types, ensure `.wasm` served as `application/wasm`

### Issue: Search returns no results
**Solution**: Verify index was built correctly, check console for errors

### Issue: Search is slow
**Solution**: Check index size, optimize document body length, enable compression

### Issue: Build fails in CI
**Solution**: Ensure docfind CLI installed, check PATH, verify Node.js version

## Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 57+ | Full support |
| Firefox | 52+ | Full support |
| Safari | 11+ | Full support |
| Edge | 79+ | Full support |

## Resources

- [Docfind GitHub](https://github.com/microsoft/docfind)
- [Live Demo](https://microsoft.github.io/docfind/)
- [Implementation Plan](./docfind-implementation-plan.md)
- [GitHub Issues](./docfind-github-issues.md)

## Example Usage

```typescript
// Initialize search
import search from '/docfind.js';

// Perform search
const results = await search('docker kubernetes');

// Results format
[
  {
    title: "Docker for Development",
    category: "Blog",
    href: "/2024/01/docker-for-dev/",
    body: "Complete guide to Docker..."
  },
  // ... more results
]
```

## Next Steps

1. Read [Implementation Plan](./docfind-implementation-plan.md)
2. Create GitHub issues from [Issue Templates](./docfind-github-issues.md)
3. Start with Issue #1: Build Infrastructure
4. Follow implementation order
5. Test thoroughly before deployment

## Tips for Success

- 🎯 **Start Simple**: Get basic search working first, then add features
- 📊 **Monitor Size**: Keep index under 10 MB uncompressed
- ⚡ **Lazy Load**: Don't load WASM until user opens search
- 🧪 **Test Early**: Test on real devices throughout development
- 📝 **Document**: Keep docs updated as you implement
- 🔍 **Optimize Later**: Get it working, then make it fast

## Common Pitfalls to Avoid

- ❌ Loading WASM on page load (lazy load instead)
- ❌ Including too much body text (limit length)
- ❌ Forgetting to compress WASM (enable Brotli)
- ❌ Not testing on mobile (test early and often)
- ❌ Poor keyboard navigation (implement proper focus trap)
- ❌ Missing loading states (show progress during WASM load)

## Questions?

Refer to:
1. [Docfind Documentation](https://github.com/microsoft/docfind)
2. Implementation plan in this directory
3. Create a GitHub discussion for help
