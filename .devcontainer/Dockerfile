# Stage 1: Base Image and Dependencies
# Use the same base image specified in your devcontainer.json
FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

# 1. Install pnpm globally (mimics your 'features' setting)
# The base image already has node/npm installed
RUN npm install -g pnpm

# 2. Set environment variables for the node user
# This is crucial for matching the paths in your devcontainer.json
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

# 3. Create the directory used for the pnpm store and ensure ownership
# This prevents permission issues during install/mounting
RUN mkdir -p $PNPM_HOME/store \
    && chown -R node:node /home/node

# 4. Switch to the non-root user 'node' for all subsequent steps (as defined by remoteUser)
USER node

# 5. Set the working directory (where your project code will be mounted)
WORKDIR /workspaces/bene

# --- Build Stage (Optional but Recommended for Caching) ---
# This stage pulls package metadata for better image layer caching.
# You can skip this if your project dependencies change constantly.
# COPY package.json pnpm-lock.yaml ./
# RUN pnpm fetch

# --- Final Build Execution will happen via VS Code CLI or postCreateCommand ---
# The actual 'pnpm install' will happen in postCreateCommand using the mounted volume.