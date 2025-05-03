## Accessibility

This blog is designed with accessibility in mind, following WCAG guidelines to ensure a better experience for all users.

### ARIA Attributes

- ARIA attributes are used throughout the site to improve screen reader support
- The ThemeToggle button uses aria-pressed to indicate its state
- SVG icons include aria-hidden="true" with appropriate aria-labels on their parent elements
- Menu toggles use aria-expanded to indicate their state

### Keyboard Navigation

- All interactive elements are fully keyboard-navigable
- Focus styles are visible in both light and dark modes
- The mobile menu has keyboard trap focus management
- Escape key can be used to close dialogs and menus

### Color Contrast

To ensure readability for all users:

- Color contrast ratios have been tested in both light and dark modes
- Text colors meet WCAG AA standards (minimum 4.5:1 for normal text, 3:1 for large text)
- Focus indicators have sufficient contrast against all backgrounds
- Interactive elements maintain proper contrast in all states (hover, focus, active)

To test color contrast:
1. Use the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
2. Toggle between light and dark modes to verify contrast in both themes
3. Check text, buttons, links, and focus indicators against their backgrounds
