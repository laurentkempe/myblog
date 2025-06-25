# MCP Server Configuration

This project includes Model Context Protocol (MCP) server configuration for enhanced development experience with GitHub Copilot and VS Code.

## What is MCP?

Model Context Protocol (MCP) is an open standard that enables seamless integration between AI systems and various data sources. It allows AI assistants to access up-to-date documentation, repositories, file systems, and other tools.

## Configured MCP Servers

### 1. Context7 MCP Server
- **Purpose**: Provides up-to-date documentation for libraries and frameworks
- **Benefits**: Get current Astro.build and Tailwind CSS documentation directly in your prompts
- **Usage**: Add `use context7` to your prompts in Copilot
- **Example**: "Create a responsive card component in Astro with Tailwind CSS. use context7"

### 2. GitHub MCP Server
- **Purpose**: Access GitHub repositories, issues, pull requests, and other GitHub features
- **Benefits**: Get repository information, file contents, and GitHub data without leaving your editor
- **Usage**: Automatically available when working with GitHub-related prompts

### 3. Filesystem MCP Server
- **Purpose**: Local file system operations within the project
- **Benefits**: AI can read, analyze, and understand your project structure and files
- **Scope**: Limited to the project directory for security

### 4. Brave Search MCP Server
- **Purpose**: Web search capabilities for research and content validation
- **Benefits**: Find up-to-date information, validate blog content, and research topics
- **Configuration**: Requires BRAVE_API_KEY environment variable (optional)

## Setup Instructions

### For VS Code Users

1. The configuration is already included in `.vscode/settings.json`
2. Install VS Code Insiders (MCP support is currently in preview)
3. Open the project in VS Code Insiders
4. The MCP servers will be automatically available in Copilot

### For Other Editors

#### Cursor
Add to your `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

#### Claude Desktop
Add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "Context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

## Usage Examples

### Blog Development with Context7
```
Create a new blog post component with:
- Astro component structure
- Tailwind CSS styling for dark/light themes
- Responsive design
- SEO meta tags
use context7
```

### Project Analysis with Filesystem
```
Analyze the current blog structure and suggest improvements for:
- Component organization
- Content structure
- Build optimization
```

### Research with Brave Search
```
Research the latest trends in:
- Static site generators
- JAMstack architecture
- Web performance optimization
```

## Environment Variables

For full functionality, you may want to set up:

- `BRAVE_API_KEY`: For web search capabilities (get from [Brave Search API](https://api.search.brave.com/))
- `GITHUB_TOKEN`: For enhanced GitHub access (optional, uses public API by default)

## Troubleshooting

### Common Issues

1. **MCP servers not loading**: Ensure you're using VS Code Insiders or a compatible editor
2. **NPX command errors**: Try using `bunx` instead of `npx` in the configuration
3. **Permission errors**: Make sure the filesystem server path is correct

### Getting Help

- Check the [VS Code MCP documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
- Review individual MCP server documentation:
  - [Context7](https://github.com/upstash/context7)
  - [MCP Servers by Anthropic](https://github.com/modelcontextprotocol/servers)

## Benefits for Blog Development

With these MCP servers configured, you can:

1. **Get accurate documentation**: Always have up-to-date Astro and Tailwind CSS docs
2. **Analyze project structure**: AI understands your blog's organization
3. **Research content**: Validate facts and find current information
4. **GitHub integration**: Work with repository data seamlessly
5. **Enhanced prompts**: More contextual and accurate AI responses

This setup transforms your development environment into an AI-powered workspace specifically optimized for technical blog development.