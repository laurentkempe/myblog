# Search Feature Maintenance Guide

This guide covers maintaining and troubleshooting the docfind-powered search feature on Laurent Kempé's blog.

## Overview

The blog uses [docfind](https://github.com/microsoft/docfind), a WebAssembly-based search engine that runs entirely in the browser. The search index is built at compile time and deployed as static files.

## Architecture

```
Build Time:
  Blog Posts (MDX) → build-search-index.cjs → documents.json → docfind CLI → WASM files

Runtime:
  User opens search → Load WASM (lazy, ~100ms) → Search locally → Display results
```

## Files and Components

### Build Scripts

- **`scripts/build-search-index.cjs`**: Extracts blog posts and generates `documents.json`
- **`scripts/docfind`**: Binary CLI tool that builds the WASM search index
- **`documents.json`**: Intermediate JSON file (gitignored, generated during build)

### Output Files

- **`public/docfind.js`**: JavaScript bindings for the WASM module
- **`public/docfind_bg.wasm`**: WebAssembly module with embedded search index (687 KB)
- **`public/search-init.js`**: Search initialization and query handling

### UI Components

- **`src/components/SearchButton.astro`**: Search button in header with ⌘K hint
- **`src/components/SearchModal.astro`**: Full-screen search modal with results
- **`src/components/SearchResult.astro`**: Template for result items
- **`src/layouts/Layout.astro`**: Includes SearchModal globally

## Rebuilding the Search Index

### Manual Rebuild (Local Development)

```bash
# Build search index only
npm run build:search

# Or step by step:
npm run build:search-index  # Generate documents.json
npm run build:search-wasm   # Build WASM from documents.json

# Full build (includes search)
npm run build
```

### Automatic Rebuild (CI/CD)

The search index is automatically rebuilt on every deployment via GitHub Actions:

1. Checkout code
2. Setup Node.js and Rust
3. Build docfind binary (cached)
4. Run `npm run build` which includes `build:search`
5. Deploy to GitHub Pages

## Configuration

### Adjusting Index Size

If the search index becomes too large, adjust `MAX_BODY_LENGTH` in `scripts/build-search-index.cjs`:

```javascript
const MAX_BODY_LENGTH = 5000; // Reduce this to decrease index size
```

### Excluding Posts from Search

Posts with `draft: true` in frontmatter are automatically excluded. To exclude other posts, modify the `extractDocument` function in `build-search-index.cjs`.

## Troubleshooting

### Search Not Working

**Symptom**: Search modal opens but no results appear

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify WASM files are loaded: Check Network tab for `docfind_bg.wasm`
3. Ensure `search-init.js` is loaded after page load
4. Check that `docfind.js` and `docfind_bg.wasm` exist in `public/`

### Build Fails: docfind Not Found

**Symptom**: `scripts/docfind: command not found`

**Solutions**:
1. Ensure docfind binary exists: `ls -la scripts/docfind`
2. Make it executable: `chmod +x scripts/docfind`
3. In CI, ensure docfind build step completed successfully

### Index Size Too Large

**Symptom**: WASM file > 10 MB

**Solutions**:
1. Reduce `MAX_BODY_LENGTH` in `build-search-index.cjs`
2. Remove old/archived posts from index
3. Optimize MDX content (remove excessive formatting)

### Search Results Not Relevant

**Symptom**: Queries return unexpected results

**Solutions**:
1. docfind uses RAKE algorithm for keyword extraction
2. Ensure post titles and tags are descriptive
3. Check that `cleanMdxContent` function properly removes formatting
4. Consider adjusting search query handling in `search-init.js`

### WASM Fails to Load

**Symptom**: `Failed to initialize search` in console

**Solutions**:
1. Check WASM MIME type is set correctly (should be `application/wasm`)
2. Verify WASM file is not corrupted: `file public/docfind_bg.wasm`
3. Check browser compatibility (requires WebAssembly support)
4. Clear browser cache and reload

### Slow Search Performance

**Symptom**: Search takes > 100ms

**Solutions**:
1. Reduce debounce delay in `search-init.js` (currently 300ms)
2. Check if index is too large (should be < 1 MB)
3. Ensure WASM is being cached by browser
4. Profile with browser DevTools

## Performance Metrics

### Expected Performance

- **Index Size**: < 1 MB (currently 687 KB)
- **WASM Load Time**: < 150ms (first search only)
- **Search Query Time**: < 5ms per query
- **Build Time**: < 2 minutes (full site build)

### Monitoring

Monitor search performance using browser DevTools:

```javascript
// In browser console
performance.mark('search-start');
// ... perform search ...
performance.mark('search-end');
performance.measure('search', 'search-start', 'search-end');
console.log(performance.getEntriesByName('search'));
```

## Updating docfind

To update to a newer version of docfind:

1. Update the git clone URL in `.github/workflows/deploy.yml` if needed
2. Rebuild docfind binary: 
   ```bash
   cd /tmp
   git clone https://github.com/microsoft/docfind.git
   cd docfind
   cargo build --release -p docfind
   cp target/release/docfind /path/to/blog/scripts/docfind
   ```
3. Test locally: `npm run build:search`
4. Update cache key in GitHub Actions workflow

## Browser Compatibility

Minimum browser versions:
- Chrome 57+ (March 2017)
- Firefox 52+ (March 2017)
- Safari 11+ (September 2017)
- Edge 79+ (January 2020)

All modern browsers support WebAssembly and ES modules.

## SEO Considerations

The search feature does not impact SEO:
- Search is client-side only (no server-side rendering needed)
- All blog posts remain crawlable via normal HTML pages
- Sitemap and meta tags unchanged
- No JavaScript required for content access

## Accessibility

The search feature is fully accessible:
- Keyboard navigation: `Cmd/Ctrl+K`, `↑/↓`, `Enter`, `ESC`
- Screen reader support via ARIA labels
- Focus management and trap
- High contrast in both light and dark modes
- Complies with WCAG AA standards

## Support

For issues:
1. Check this guide first
2. Review [docfind documentation](https://github.com/microsoft/docfind)
3. Check browser console for errors
4. Create an issue in the repository with:
   - Browser and version
   - Steps to reproduce
   - Console error messages
   - Network tab screenshot

## Additional Resources

- [Docfind GitHub](https://github.com/microsoft/docfind)
- [Docfind Live Demo](https://microsoft.github.io/docfind/)
- [Implementation Plan](./docfind-implementation-plan.md)
- [WebAssembly Documentation](https://webassembly.org/)
