#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

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
        if (!arrayContent.trim()) {
            return [];
        }
        return arrayContent.split(',').map(item => item.trim().replace(/^["']|["']$/g, ''));
    }
    
    // Handle booleans
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    // Handle numbers
    if (/^\d+$/.test(value)) {
        return parseInt(value, 10);
    }
    
    // Return as string
    return value;
}

/**
 * Recursively scan directories for MDX files
 */
function scanForMDXFiles(dir) {
    let files = [];
    
    try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                files = files.concat(scanForMDXFiles(fullPath));
            } else if (item.endsWith('.mdx')) {
                files.push(fullPath);
            }
        }
    } catch (error) {
        throw new Error(`Could not scan ${dir}: ${error.message}`);
    }
    
    return files;
}

/**
 * Create a URL slug from a title string
 */
function createSlug(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace any non-alphanumeric character with a dash
        .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
}

/**
 * Format date for frontmatter (MM/DD/YYYY HH:MM:SS)
 */
function formatDateForFrontmatter(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Generate disqusIdentifier from date (YYYYMMDDHHMMSS format)
 */
function generateDisqusIdentifier(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Generate permalink from date and slug
 */
function generatePermalink(date, slug) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `/${year}/${month}/${day}/${slug}/`;
}

/**
 * Update frontmatter with new publication data
 */
function updateFrontmatter(content, newDate, slug) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        throw new Error('No frontmatter found');
    }
    
    const frontmatterText = match[1];
    const restOfContent = content.slice(match[0].length);
    
    // Parse current frontmatter
    const frontmatter = parseFrontmatter(content);
    if (!frontmatter) {
        throw new Error('Could not parse frontmatter');
    }
    
    // Update with new values
    const updatedLines = [];
    const lines = frontmatterText.split('\n');
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            updatedLines.push(line);
            continue;
        }
        
        const keyValueMatch = trimmedLine.match(/^([^:]+):\s*(.*)$/);
        if (keyValueMatch) {
            const key = keyValueMatch[1].trim();
            
            if (key === 'permalink') {
                updatedLines.push(`permalink: ${generatePermalink(newDate, slug)}`);
            } else if (key === 'date') {
                updatedLines.push(`date: ${formatDateForFrontmatter(newDate)}`);
            } else if (key === 'disqusIdentifier') {
                updatedLines.push(`disqusIdentifier: ${generateDisqusIdentifier(newDate)}`);
            } else if (key === 'draft') {
                // Remove draft line entirely
                continue;
            } else {
                updatedLines.push(line);
            }
        } else {
            updatedLines.push(line);
        }
    }
    
    const newFrontmatter = updatedLines.join('\n');
    return `---\n${newFrontmatter}\n---${restOfContent}`;
}

/**
 * Interactive draft selector with keyboard navigation
 */
async function selectDraftInteractively(drafts) {
    return new Promise((resolve, reject) => {
        let selectedIndex = 0;
        
        // Set up readline for raw input
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        // Enable raw mode to capture individual key presses
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        
        function displayMenu() {
            console.clear();
            console.log('📝 Select a draft blog post or speaking entry to publish:\n');
            
            drafts.forEach((draft, index) => {
                const prefix = index === selectedIndex ? '▶ ' : '  ';
                const title = draft.title.substring(0, 50) + (draft.title.length > 50 ? '...' : '');
                const date = new Date(draft.date).toDateString();
                console.log(`${prefix}[${draft.collectionLabel}] ${title} (${date})`);
            });
            
            console.log('\n↑/↓ Navigate • Enter: Select • q: Quit');
        }
        
        function handleInput(key) {
            switch (key) {
                case '\u001b[A': // Up arrow
                    selectedIndex = Math.max(0, selectedIndex - 1);
                    displayMenu();
                    break;
                    
                case '\u001b[B': // Down arrow
                    selectedIndex = Math.min(drafts.length - 1, selectedIndex + 1);
                    displayMenu();
                    break;
                    
                case '\r': // Enter
                case '\n':
                    process.stdin.setRawMode(false);
                    process.stdin.pause();
                    rl.close();
                    resolve(drafts[selectedIndex]);
                    break;
                    
                case 'q':
                case '\u0003': // Ctrl+C
                    process.stdin.setRawMode(false);
                    process.stdin.pause();
                    rl.close();
                    resolve(null);
                    break;
                    
                default:
                    // Ignore other keys
                    break;
            }
        }
        
        // Display initial menu
        displayMenu();
        
        // Handle input
        process.stdin.on('data', handleInput);
        
        // Handle process exit
        process.on('SIGINT', () => {
            process.stdin.setRawMode(false);
            process.stdin.pause();
            rl.close();
            resolve(null);
        });
    });
}

/**
 * Main function
 */
async function main() {
    try {
        const collections = [
            { root: path.join(__dirname, 'src', 'content', 'posts'), label: 'Blog' },
            { root: path.join(__dirname, 'src', 'content', 'speaking'), label: 'Speaking' }
        ];
        
        for (const collection of collections) {
            if (!fs.existsSync(collection.root)) {
                console.error(`Error: ${collection.label} directory not found at`, collection.root);
                process.exit(1);
            }
        }
        
        console.log('🔍 Scanning for draft blog posts and speaking entries...');
        
        // Find all MDX files
        const mdxFiles = collections.flatMap(collection =>
            scanForMDXFiles(collection.root).map(fullPath => ({ fullPath, collection }))
        );
        const drafts = [];
        
        for (const { fullPath: filePath, collection } of mdxFiles) {
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                const frontmatter = parseFrontmatter(content);
                
                if (frontmatter && frontmatter.draft === true) {
                    const relativePath = path.relative(__dirname, filePath);
                    const title = frontmatter.title || 'Untitled';
                    const date = frontmatter.date || '';
                    
                    drafts.push({
                        filePath: relativePath,
                        fullPath: filePath,
                        collectionRoot: collection.root,
                        collectionLabel: collection.label,
                        title,
                        date,
                        frontmatter,
                        content
                    });
                }
            } catch (error) {
                // Skip files that can't be read or parsed
                console.warn(`Warning: Could not parse ${filePath}: ${error.message}`);
            }
        }
        
        if (drafts.length === 0) {
            console.log('📝 No draft blog posts or speaking entries found.');
            return;
        }
        
        // Sort drafts by date (newest first)
        drafts.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });
        
        // Interactive selection
        const selectedDraft = await selectDraftInteractively(drafts);
        
        if (!selectedDraft) {
            console.log('\n📝 No draft selected. Exiting...');
            return;
        }
        
        console.log(`\n🚀 Publishing [${selectedDraft.collectionLabel}]: ${selectedDraft.title}`);
        
        // Get current date for publication
        const publishDate = new Date();
        const publishYear = publishDate.getFullYear();
        
        // Extract slug from current filename
        const filename = path.basename(selectedDraft.fullPath, '.mdx');
        const slug = filename;
        
        // Update content with new frontmatter
        const updatedContent = updateFrontmatter(selectedDraft.content, publishDate, slug);
        
        // Determine new file path
        const newYearDir = path.join(selectedDraft.collectionRoot, publishYear.toString());
        const newFilePath = path.join(newYearDir, `${filename}.mdx`);
        
        // Create year directory if it doesn't exist
        if (!fs.existsSync(newYearDir)) {
            fs.mkdirSync(newYearDir, { recursive: true });
        }
        
        // Check if we need to move the file to a different year
        const currentPath = selectedDraft.fullPath;
        const needsMove = path.dirname(currentPath) !== newYearDir;
        
        if (needsMove && fs.existsSync(newFilePath)) {
            console.error(`Error: A file already exists at ${newFilePath}`);
            process.exit(1);
        }
        
        // Write the updated content
        fs.writeFileSync(newFilePath, updatedContent);
        
        // Remove the old file if we moved it
        if (needsMove && currentPath !== newFilePath) {
            fs.unlinkSync(currentPath);
            console.log(`📁 Moved from: ${selectedDraft.filePath}`);
            console.log(`📁 Moved to: ${path.relative(__dirname, newFilePath)}`);
        } else {
            console.log(`📄 Updated: ${selectedDraft.filePath}`);
        }
        
        console.log(`✅ Successfully published "${selectedDraft.title}"`);
        console.log(`📅 Publication date: ${formatDateForFrontmatter(publishDate)}`);
        console.log(`🔗 Permalink: ${generatePermalink(publishDate, slug)}`);
        if (Object.hasOwn(selectedDraft.frontmatter, 'disqusIdentifier')) {
            console.log(`🔢 Disqus ID: ${generateDisqusIdentifier(publishDate)}`);
        }
        
    } catch (error) {
        console.error('Error publishing draft:', error.message);
        process.exit(1);
    }
}

main();