export function getTagSlug(tag: string): string {
    // Special cases for specific tags
    if (tag === 'C#') return 'csharp';
    
    // Handle ASP.NET before general .NET replacement
    let processedTag = tag.replace(/ASP\.NET/g, 'asp-net');
    
    // Replace remaining .NET with dotnet
    processedTag = processedTag.replace(/\.NET/g, 'dotnet');
    
    // General case: convert to lowercase and replace special characters
    return processedTag.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace any non-alphanumeric character with a dash
        .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
}

export function getTagFromSlug(slug: string): string {
    // Special cases for specific slugs
    if (slug === 'csharp') return 'C#';
    
    let processedSlug = slug;
    
    // Handle ASP.NET case
    if (slug.includes('asp-net')) {
        processedSlug = processedSlug.replace(/asp-net/, 'ASP.NET');
    }
    // Handle remaining dotnet cases
    else if (slug.includes('dotnet')) {
        processedSlug = processedSlug.replace(/^dotnet$/, '.NET');
        processedSlug = processedSlug.replace(/dotnet-/, '.NET ');
    }
    
    return processedSlug;
}