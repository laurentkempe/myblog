# Dev Container for Laurent's Blog

This Dev Container provides a fully configured development environment for Laurent's Astro-based blog.

## Features

- **Node.js 20 LTS**: Compatible with Astro 5.x requirements
- **pnpm**: Package manager automatically installed and configured
- **Pre-installed dependencies**: All blog dependencies are installed on container creation
- **VS Code Extensions**: Astro, TypeScript, Tailwind CSS, and other essential extensions
- **GitHub Tools**: Git and GitHub CLI pre-installed
- **Port Forwarding**: Astro dev server (port 4321) automatically forwarded

## Usage

### With GitHub Codespaces

1. Open the repository in GitHub
2. Click the green "Code" button
3. Select "Codespaces" tab
4. Click "Create codespace on main"
5. Wait for the container to build and dependencies to install
6. Run `pnpm run dev` to start the development server

### With Visual Studio Code

1. Install the "Dev Containers" extension
2. Open the repository in VS Code
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
4. Type "Dev Containers: Reopen in Container"
5. Wait for the container to build and dependencies to install
6. Run `pnpm run dev` to start the development server

### With JetBrains WebStorm/Gateway

1. Open JetBrains Gateway
2. Select "Dev Containers" 
3. Choose "From Local Project" or "From VCS Project"
4. Navigate to this repository
5. Select the `.devcontainer/devcontainer.json` file
6. Wait for the container to build and dependencies to install
7. Run `pnpm run dev` to start the development server

## Development Commands

- `pnpm run dev` - Start the development server
- `pnpm run build` - Build the site for production
- `pnpm run preview` - Preview the production build

## Accessing the Development Server

Once `pnpm run dev` is running, the Astro development server will be available at:
- Local: http://localhost:4321/
- The port will be automatically forwarded in supported environments

## Notes

- The container uses the `node` user to avoid permission issues
- All dependencies are automatically installed when the container is created
- The development server supports hot reloading for immediate feedback on changes