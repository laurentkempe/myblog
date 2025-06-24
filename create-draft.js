#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create a URL slug from a title string
 */
function createSlug(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace any non-alphanumeric character with a dash
        .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
}

/**
 * Format date for permalink generation (MM/DD/YYYY)
 */
function formatDateForPermalink(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
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
    return `permalink: /${year}/${month}/${day}/${slug}/`;
}

/**
 * Replace template placeholders with actual values
 */
function replaceTemplatePlaceholders(template, title, date, slug) {
    const formattedDate = formatDateForFrontmatter(date);
    const permalink = generatePermalink(date, slug);
    const disqusIdentifier = `disqusIdentifier: ${generateDisqusIdentifier(date)}`;
    
    return template
        .replace(/\{\{Title\}\}/g, title)
        .replace(/\{\{now\.ToPermalink\(slug\)\}\}/g, permalink)
        .replace(/\{\{now\}\}/g, formattedDate)
        .replace(/\{\{now\.ToDisqusIdentifier\(\)\}\}/g, disqusIdentifier);
}

/**
 * Get title from command line argument or prompt user
 */
async function getTitle() {
    // Check if title was provided as command line argument
    const args = process.argv.slice(2);
    if (args.length > 0) {
        return args.join(' ');
    }

    // Prompt user for title
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Enter the blog post title: ', (title) => {
            rl.close();
            resolve(title.trim());
        });
    });
}

/**
 * Main function
 */
async function main() {
    try {
        // Get title
        const title = await getTitle();
        if (!title) {
            console.error('Error: Title is required');
            process.exit(1);
        }

        // Generate slug
        const slug = createSlug(title);
        
        // Get current date
        const now = new Date();
        const year = now.getFullYear();

        // Read template
        const templatePath = path.join(__dirname, 'templates', 'blog-post.mdx');
        if (!fs.existsSync(templatePath)) {
            console.error(`Error: Template file not found at ${templatePath}`);
            process.exit(1);
        }

        const template = fs.readFileSync(templatePath, 'utf-8');

        // Replace placeholders
        const content = replaceTemplatePlaceholders(template, title, now, slug);

        // Create year directory if it doesn't exist
        const yearDir = path.join(__dirname, 'src', 'content', 'posts', year.toString());
        if (!fs.existsSync(yearDir)) {
            fs.mkdirSync(yearDir, { recursive: true });
        }

        // Create filename
        const filename = `${slug}.mdx`;
        const filepath = path.join(yearDir, filename);

        // Check if file already exists
        if (fs.existsSync(filepath)) {
            console.error(`Error: File already exists at ${filepath}`);
            process.exit(1);
        }

        // Write file
        fs.writeFileSync(filepath, content);

        console.log(`✅ Draft blog post created successfully!`);
        console.log(`📄 File: ${filepath}`);
        console.log(`📝 Title: ${title}`);
        console.log(`🔗 Slug: ${slug}`);
        console.log(`📅 Date: ${formatDateForFrontmatter(now)}`);
        console.log(`\n🚀 To edit your post, open: ${filepath}`);

    } catch (error) {
        console.error('Error creating blog post:', error.message);
        process.exit(1);
    }
}

main();