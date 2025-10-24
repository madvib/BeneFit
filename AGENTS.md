# Agent Instructions for the 'bene' Monorepo

This document provides instructions for AI agents and automated tools to interact with, build, and test the `bene` monorepo.

## Overview

This is a monorepo managed with pnpm and Turborepo. It contains the following:

- `apps/`: Houses individual applications.
  - `bene-web`: A Next.js web application.
- `packages/`: Intended for shared libraries, UI components, and configurations (e.g., TypeScript, ESLint).

## Tech Stack

- **Package Manager**: pnpm
- **Build System**: Turborepo
- **Framework (bene-web)**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint

## Getting Started

To install all dependencies for the entire monorepo, run the following command from the root directory:

```bash
pnpm install
```

## Core Commands

All commands should be run from the root of the monorepo.

### Run Development Server

To start the development server for the `bene-web` application:

```bash
pnpm --filter web dev
```

### Build for Production

To build the `bene-web` application for production:

```bash
pnpm --filter web build
```

### Lint the Code

To run the linter on the `bene-web` application:

```bash
pnpm --filter web lint
```

## Testing

There are currently no test scripts configured for the applications.

## Contribution Guidelines

- Ensure all code passes the linter before committing.
- Update relevant documentation if you introduce new features or changes.
- If adding new dependencies, use `pnpm add -w <package>` for root dependencies or `pnpm add --filter <workspace> <package>` for specific apps/packages.
