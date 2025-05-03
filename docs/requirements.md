
# SEO Enhancements
## Meta Tags
- [x] Add Open Graph and Twitter meta tags for better social media sharing.
## Canonical Links
- [x] Add canonical URLs to avoid duplicate content issues.
## Sitemap and Robots.txt
- [x] Set up sitemap.xml generation using @astrojs/sitemap integration.
- [x] Create a robots.txt file that links to the sitemap.xml for better search engine indexing.
## Structured Data
- [x] Implement JSON-LD structured data for better search engine understanding:
   - [x] Add Blog schema to the homepage.
   - [x] Add BlogPosting schema to individual blog posts.

# Accessibility Improvements
## ARIA Attributes
- [x] Add ARIA attributes where necessary for better screen reader support. For example:
   - [x] The ThemeToggle button should use aria-pressed to denote its state.
   - [x] SVGs used as icons should have meaningful aria-labels or title attributes for accessibility.
## Contrast and Readability
   - [x] Test color contrast ratios in both light and dark modes to ensure they meet WCAG AA or AAA standards.
## Keyboard Navigation
   - [x] Ensure all interactive elements (e.g., menu links, buttons) are fully keyboard-navigable.
