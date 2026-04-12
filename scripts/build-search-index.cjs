#!/usr/bin/env node

/**
 * Build Search Index Script
 * 
 * This script extracts blog posts from src/content/posts/ and generates
 * a documents.json file that can be used by docfind to build a search index.
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '../src/content/posts');
const OUTPUT_FILE = path.join(__dirname, '../documents.json');
const MAX_BODY_LENGTH = 5000; // Limit body text to keep index size reasonable

/**
 * Recursively find all MDX files in a directory
 */
function findMdxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findMdxFiles(filePath, fileList);
    } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Parse frontmatter from MDX file
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const frontmatterText = match[1];
  const body = content.slice(match[0].length);
  
  const frontmatter = {};
  const lines = frontmatterText.split('\n');
  
  let currentKey = null;
  let currentValue = '';
  
  for (const line of lines) {
    // Check if line starts a new key-value pair
    const keyMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.*)$/);
    
    if (keyMatch) {
      // Save previous key-value if exists
      if (currentKey) {
        frontmatter[currentKey] = parseValue(currentValue.trim());
      }
      
      currentKey = keyMatch[1];
      currentValue = keyMatch[2];
    } else if (currentKey) {
      // Continue multi-line value
      currentValue += '\n' + line;
    }
  }
  
  // Save last key-value
  if (currentKey) {
    frontmatter[currentKey] = parseValue(currentValue.trim());
  }
  
  return { frontmatter, body };
}

/**
 * Parse value from frontmatter (handle strings, arrays, etc.)
 */
function parseValue(value) {
  // Remove quotes
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  
  // Handle arrays
  if (value.startsWith('[') && value.endsWith(']')) {
    const arrayContent = value.slice(1, -1);
    return arrayContent.split(',').map(item => {
      item = item.trim();
      if ((item.startsWith('"') && item.endsWith('"')) ||
          (item.startsWith("'") && item.endsWith("'"))) {
        return item.slice(1, -1);
      }
      return item;
    }).filter(item => item.length > 0);
  }
  
  return value;
}

/**
 * Clean MDX content to extract plain text
 */
function cleanMdxContent(content) {
  // Remove frontmatter
  content = content.replace(/^---\n[\s\S]*?\n---\n/, '');
  
  // Remove MDX comments (including "more" marker)
  content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  
  // Remove HTML/JSX tags
  content = content.replace(/<[^>]+>/g, ' ');
  
  // Remove code blocks
  content = content.replace(/```[\s\S]*?```/g, ' ');
  
  // Remove inline code
  content = content.replace(/`[^`]+`/g, ' ');
  
  // Remove markdown links but keep text
  content = content.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  // Remove markdown images
  content = content.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '');
  
  // Remove markdown formatting
  content = content.replace(/[*_~#]/g, '');
  
  // Remove multiple spaces
  content = content.replace(/\s+/g, ' ');
  
  // Trim
  content = content.trim();
  
  return content;
}

/**
 * Extract document data from a blog post file
 */
function extractDocument(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, body } = parseFrontmatter(content);
    
    // Skip drafts
    if (frontmatter.draft === 'true' || frontmatter.draft === true) {
      return null;
    }
    
    const title = frontmatter.title || 'Untitled';
    const permalink = frontmatter.permalink || '';
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
    
    // Clean body text
    let bodyText = cleanMdxContent(body);
    
    // Limit body length to keep index size manageable
    if (bodyText.length > MAX_BODY_LENGTH) {
      bodyText = bodyText.substring(0, MAX_BODY_LENGTH) + '...';
    }
    
    // Combine title, tags, and body for searchable content
    const searchableBody = `${title} ${tags.join(' ')} ${bodyText}`;
    
    return {
      title: title,
      category: 'Blog',
      href: permalink,
      body: searchableBody
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Main function
 */
function main() {
  console.log('Building search index...');
  console.log(`Reading blog posts from: ${POSTS_DIR}`);
  
  // Find all MDX files
  const mdxFiles = findMdxFiles(POSTS_DIR);
  console.log(`Found ${mdxFiles.length} blog post files`);
  
  // Extract documents
  const documents = mdxFiles
    .map(extractDocument)
    .filter(doc => doc !== null);
  
  console.log(`Extracted ${documents.length} documents (excluding drafts)`);
  
  // Calculate total size
  const totalSize = JSON.stringify(documents).length;
  const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
  console.log(`Total documents.json size: ${sizeInMB} MB`);
  
  // Write to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(documents, null, 2));
  console.log(`✓ Written to: ${OUTPUT_FILE}`);
  
  console.log('\nSample documents:');
  documents.slice(0, 3).forEach((doc, i) => {
    console.log(`\n${i + 1}. ${doc.title}`);
    console.log(`   Category: ${doc.category}`);
    console.log(`   URL: ${doc.href}`);
    console.log(`   Body preview: ${doc.body.substring(0, 100)}...`);
  });
}

// Run main function
main();
