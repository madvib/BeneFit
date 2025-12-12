# Agent Instructions for the 'bene' Monorepo

This document provides instructions for AI agents and automated tools to interact with, build, and test the `bene` monorepo.

## Overview

This is a monorepo managed with pnpm and Turborepo. It contains the following:

- `apps/`: Houses individual applications.
  - `bene-web`: A Next.js web application.
- `packages/`: Intended for shared libraries, UI components, and configurations (e.g., TypeScript, ESLint).

## Tech Stack

- **Package Manager**: pnpm
- **Build System**: NX
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

## Snippets [WIP]

-eslint-disable is NEVER an acceptable solution, either address the issue or log that you cannot with reasoning.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- You have access to the Nx MCP server and its tools, use them to help the user
- When answering questions about the repository, use the `nx_workspace` tool first to gain an understanding of the workspace architecture where applicable.
- When working in individual projects, use the `nx_project_details` mcp tool to analyze and understand the specific project structure and dependencies
- For questions around nx configuration, best practices or if you're unsure, use the `nx_docs` tool to get relevant, up-to-date docs. Always use this instead of assuming things about nx configuration
- If the user needs help with an Nx configuration or project graph error, use the `nx_workspace` tool to get any errors

<!-- nx configuration end-->

# AI Assistant Guidelines for Refactoring Work

## Critical Rules to Follow:

1. **Do Only What Is Asked**: When asked to update imports or make specific changes, ONLY make those specific changes. Do not modify implementation logic, add DTO interfaces, or make architectural changes unless explicitly requested.

2. **Respect Original Structure**: Do not move files, change directory structures, or alter file locations unless specifically instructed. The existing code structure is intentional.

3. **No Unwanted Complexity**: Do not add extra layers, conversion logic, or "helpful" abstractions that weren't requested. This creates more work, not less.

4. **Verify Before Changing**: If uncertain about any change that might affect functionality, ask for clarification rather than assuming.

5. **Small Changes Only**: Make targeted, minimal changes. Avoid sweeping refactorings that break working code.

6. **Don't Touch Working Code**: If something is working, leave it alone unless explicitly asked to modify it.

7. **Suggest missing features/functionality**: If you think a controller, utility function, or use-case is missing from the application, raise the issue and proceed with input. Do not try to fix issues or add functionality without guidance or approval.

## Working with Monorepo Architecture:

- Check package.json exports to determine correct import paths
- Use the established export patterns: @bene/core/{feature}, @bene/application/
  shared, etc.
- Do not create new interfaces or types unless specifically requested

## Git Impact Awareness:

- Large changes (400+ files) break workflows and require rework
- Focus on small, targeted commits that don't disrupt the codebase
- Avoid creating merge conflicts or breaking existing functionality

## Presentation State Management

Keep in Component:

Visual state (modals, tooltips, accordions)
Navigation state (tabs, steps)
Form input values (if controlled)
Selection state (checkboxes, rows)
Temporary UI state (hover, focus)

Extract to Controller:

API loading/error states
Business validation
Data fetching/mutations
Authentication state
Complex business logic
