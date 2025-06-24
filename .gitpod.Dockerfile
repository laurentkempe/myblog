FROM gitpod/workspace-node:latest

USER gitpod

# Install pnpm
RUN npm install -g pnpm@latest

# Set environment
ENV NODE_ENV=development