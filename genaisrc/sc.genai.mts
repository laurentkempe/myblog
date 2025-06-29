script({
    title: "Spell check and grammar fix for markdown files",
    description: "Check and fix spelling and grammar in markdown files while preserving frontmatter, URLs, code blocks, and inline TypeScript",
    parameters: {
        base: {
            type: "string",
            description: "Base commit SHA to compare against for finding changed files"
        }
    }
})

// Get list of changed markdown files since base commit
const base = env.vars.base || "HEAD~1"
const changedFiles = await host.exec("git", ["diff", "--name-only", base, "HEAD", "--", "*.md", "*.mdx"])

if (!changedFiles.stdout?.trim()) {
    console.log("No markdown files changed")
    cancel("No markdown files to check")
}

const files = changedFiles.stdout.trim().split('\n').filter(f => f.length > 0)
console.log(`Checking ${files.length} markdown files: ${files.join(', ')}`)

for (const file of files) {
    const content = await workspace.readText(file)
    if (!content) continue
    
    console.log(`Processing ${file}...`)
    
    const res = await runPrompt((_) => {
        _.def("FILE", file, { language: "markdown" })
        _.$`
You are a technical writing assistant specializing in spell checking and grammar correction for blog posts.

Your task is to review and fix spelling and grammar errors in the following markdown content while:
1. PRESERVING all frontmatter (YAML between --- delimiters) exactly as-is
2. PRESERVING all URLs, links, and code blocks (both inline \`code\` and fenced \`\`\`code blocks\`\`\`)
3. PRESERVING all TypeScript, JavaScript, and other code syntax
4. PRESERVING the original tone and style of the blog post
5. Making ONLY minimal necessary corrections for clear spelling and grammar mistakes
6. NOT changing technical terminology, proper nouns, or domain-specific language
7. NOT restructuring sentences unless there are clear grammatical errors

Here is the content to review:

FILE

Please provide the corrected version with only essential spelling and grammar fixes applied. 
Return the COMPLETE corrected content, not just the changes.
If no corrections are needed, return the content unchanged.
`
    }, { system: ["system.diff"] })
    
    if (res.text && res.text !== content) {
        await workspace.writeText(file, res.text)
        console.log(`Fixed spelling/grammar in ${file}`)
    } else {
        console.log(`No changes needed for ${file}`)
    }
}