#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parse YAML frontmatter from MDX content
 */
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return null;
    }
    
    const frontmatterText = match[1];
    const frontmatter = {};
    
    // Parse each line of the frontmatter
    const lines = frontmatterText.split('\n');
    let currentKey = null;
    let currentValue = '';
    let inMultilineValue = false;
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (!trimmedLine) continue;
        
        // Check if this is a new key-value pair
        const keyValueMatch = trimmedLine.match(/^([^:]+):\s*(.*)$/);
        
        if (keyValueMatch && !inMultilineValue) {
            // Save previous key-value if exists
            if (currentKey) {
                frontmatter[currentKey] = parseValue(currentValue.trim());
            }
            
            currentKey = keyValueMatch[1].trim();
            currentValue = keyValueMatch[2];
            
            // Check if this is a multiline array
            if (currentValue.startsWith('[') && !currentValue.endsWith(']')) {
                inMultilineValue = true;
            }
        } else if (inMultilineValue) {
            // Continue multiline value
            currentValue += ' ' + trimmedLine;
            if (trimmedLine.endsWith(']')) {
                inMultilineValue = false;
            }
        }
    }
    
    // Save the last key-value pair
    if (currentKey) {
        frontmatter[currentKey] = parseValue(currentValue.trim());
    }
    
    return frontmatter;
}

/**
 * Parse individual values, handling different types
 */
function parseValue(value) {
    // Handle quoted strings
    if ((value.startsWith("'") && value.endsWith("'")) || 
        (value.startsWith('"') && value.endsWith('"'))) {
        return value.slice(1, -1);
    }
    
    // Handle arrays
    if (value.startsWith('[') && value.endsWith(']')) {
        const arrayContent = value.slice(1, -1);
        return arrayContent.split(',').map(item => item.trim().replace(/^['"]|['"]$/g, ''));
    }
    
    // Handle booleans
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    // Return as string
    return value;
}

/**
 * Recursively scan directories for MDX files
 */
function scanForMDXFiles(dir) {
    const files = [];
    
    try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                files.push(...scanForMDXFiles(fullPath));
            } else if (item.endsWith('.mdx')) {
                files.push(fullPath);
            }
        }
    } catch (error) {
        // Ignore directories that can't be read
    }
    
    return files;
}

/**
 * Format the date for display
 */
function formatDate(dateStr) {
    try {
        // Handle the MM/DD/YYYY HH:MM:SS format used in the frontmatter
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return dateStr; // Return original if parsing fails
        }
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    } catch (error) {
        return dateStr;
    }
}

/**
 * Format tags array for display
 */
function formatTags(tags) {
    if (!tags || !Array.isArray(tags)) {
        return '';
    }
    return tags.join(', ');
}

/**
 * Create a formatted table display
 */
function displayDraftsTable(drafts) {
    if (drafts.length === 0) {
        console.log('📝 No draft blog posts found.');
        return;
    }
    
    console.log(`\n📝 Found ${drafts.length} draft blog post${drafts.length !== 1 ? 's' : ''}:\n`);
    
    // Calculate column widths
    const columns = {
        filePath: Math.max(9, ...drafts.map(d => d.filePath.length)),
        title: Math.max(5, ...drafts.map(d => d.title.length)),
        date: Math.max(4, ...drafts.map(d => d.date.length)),
        tags: Math.max(4, ...drafts.map(d => d.tags.length))
    };
    
    // Header
    const headerRow = 
        '│ ' + 'File Path'.padEnd(columns.filePath) + 
        ' │ ' + 'Title'.padEnd(columns.title) + 
        ' │ ' + 'Date'.padEnd(columns.date) + 
        ' │ ' + 'Tags'.padEnd(columns.tags) + ' │';
    
    const separatorRow = 
        '├─' + '─'.repeat(columns.filePath) + 
        '─┼─' + '─'.repeat(columns.title) + 
        '─┼─' + '─'.repeat(columns.date) + 
        '─┼─' + '─'.repeat(columns.tags) + '─┤';
    
    const topBorder = 
        '┌─' + '─'.repeat(columns.filePath) + 
        '─┬─' + '─'.repeat(columns.title) + 
        '─┬─' + '─'.repeat(columns.date) + 
        '─┬─' + '─'.repeat(columns.tags) + '─┐';
    
    const bottomBorder = 
        '└─' + '─'.repeat(columns.filePath) + 
        '─┴─' + '─'.repeat(columns.title) + 
        '─┴─' + '─'.repeat(columns.date) + 
        '─┴─' + '─'.repeat(columns.tags) + '─┘';
    
    console.log(topBorder);
    console.log(headerRow);
    console.log(separatorRow);
    
    // Data rows
    for (const draft of drafts) {
        const row = 
            '│ ' + draft.filePath.padEnd(columns.filePath) + 
            ' │ ' + draft.title.padEnd(columns.title) + 
            ' │ ' + draft.date.padEnd(columns.date) + 
            ' │ ' + draft.tags.padEnd(columns.tags) + ' │';
        console.log(row);
    }
    
    console.log(bottomBorder);
}

/**
 * Main function
 */
async function main() {
    try {
        const postsDir = path.join(__dirname, 'src', 'content', 'posts');
        
        if (!fs.existsSync(postsDir)) {
            console.error('Error: Posts directory not found at', postsDir);
            process.exit(1);
        }
        
        console.log('🔍 Scanning for draft blog posts...');
        
        // Find all MDX files
        const mdxFiles = scanForMDXFiles(postsDir);
        const drafts = [];
        
        for (const filePath of mdxFiles) {
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                const frontmatter = parseFrontmatter(content);
                
                if (frontmatter && frontmatter.draft === true) {
                    const relativePath = path.relative(__dirname, filePath);
                    const title = frontmatter.title || 'Untitled';
                    const date = formatDate(frontmatter.date || '');
                    const tags = formatTags(frontmatter.tags);
                    
                    drafts.push({
                        filePath: relativePath,
                        title,
                        date,
                        tags,
                        fullPath: filePath
                    });
                }
            } catch (error) {
                // Skip files that can't be read or parsed
                console.warn(`Warning: Could not parse ${filePath}: ${error.message}`);
            }
        }
        
        // Sort drafts by date (newest first)
        drafts.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });
        
        displayDraftsTable(drafts);
        
    } catch (error) {
        console.error('Error listing draft posts:', error.message);
        process.exit(1);
    }
}

main();