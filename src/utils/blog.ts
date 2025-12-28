import markdownit from 'markdown-it';

/**
 * Extracts plain text excerpt for meta tags (og:description, twitter:description).
 * Strips markdown syntax and limits to maxLength characters.
 */
export function getPlainTextExcerpt(content: string, maxLength: number = 160): string {
  const lines = content.split('\n');
  
  // Skip import statements at the beginning
  let startIndex = 0;
  while (startIndex < lines.length && lines[startIndex].trim().startsWith('import ')) {
    startIndex++;
  }

  const moreIndex = content.indexOf('{/* <!-- more --> */}');
  let excerptLines: string[];
  
  if (moreIndex === -1) {
    excerptLines = lines.slice(startIndex);
  } else {
    const upToMore = content.slice(0, moreIndex);
    const lineCount = upToMore.split('\n').length;
    excerptLines = lines.slice(startIndex, lineCount - 1);
  }

  // Strip markdown syntax and get plain text
  const plainText = excerptLines
    .join(' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')     // Bold **text**
    .replace(/\*([^*]+)\*/g, '$1')          // Italic *text*
    .replace(/`([^`]+)`/g, '$1')            // Inline code `code`
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links [text](url)
    .replace(/^#+\s*/gm, '')                // Headers
    .replace(/\s+/g, ' ')                   // Normalize whitespace
    .trim();

  return plainText.length > maxLength 
    ? plainText.slice(0, maxLength - 3).trim() + '...' 
    : plainText;
}

export function getExcerpt(content: string): string {
  const md = markdownit();
  const lines = content.split('\n');
  
  // Skip import statements at the beginning
  let startIndex = 0;
  while (startIndex < lines.length && lines[startIndex].trim().startsWith('import ')) {
    startIndex++;
  }

  const moreIndex = content.indexOf('{/* <!-- more --> */}');
  if (moreIndex === -1) {
    const contentWithoutImports = lines.slice(startIndex).join('\n');
    return `<div class="prose dark:prose-invert max-w-none mb-4 text-gray-900 dark:text-gray-100">${md.render(contentWithoutImports)}</div>`;
  }

  // Find the line number of the more tag
  const upToMore = content.slice(0, moreIndex);
  const lineCount = upToMore.split('\n').length;
  
  const excerpt = lines.slice(startIndex, lineCount - 1).join('\n');
  return `<div class="prose dark:prose-invert max-w-none mb-4 text-gray-900 dark:text-gray-100">${md.render(excerpt)}</div>`;
}