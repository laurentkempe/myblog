import markdownit from 'markdown-it';

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
    return `<div class="mb-4 text-gray-900 dark:text-gray-100">${md.render(contentWithoutImports)}</div>`;
  }

  // Find the line number of the more tag
  const upToMore = content.slice(0, moreIndex);
  const lineCount = upToMore.split('\n').length;
  
  const excerpt = lines.slice(startIndex, lineCount - 1).join('\n');
  return `<div class="mb-4 text-gray-900 dark:text-gray-100">${md.render(excerpt)}</div>`;
}