export function getTagSlug(tag: string): string {
    // Special cases for specific tags
    if (tag === 'C#') return 'csharp';
    
    // General case: convert to lowercase and replace special characters
    return tag.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace any non-alphanumeric character with a dash
        .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
}

export function getTagFromSlug(slug: string): string {
    // Special cases for specific slugs
    if (slug === 'csharp') return 'C#';
    
    // For other cases, the slug will be used as is
    return slug;
}