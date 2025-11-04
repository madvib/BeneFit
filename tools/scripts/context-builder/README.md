# Context Builder Setup & Usage Guide

## Installation

### 1. Add Dependencies

```bash
npm install --save-dev glob tsx
# or
pnpm add -D glob tsx
```

### 2. Add Script to package.json

```json
{
  "scripts": {
    "context:build": "tsx tools/scripts/build-context.ts"
  }
}
```

### 3. Create the Script File

Save the `ContextBuilder` TypeScript file to:

```
tools/scripts/build-context.ts
```

### 4. Make it Executable (Optional)

```bash
chmod +x tools/scripts/build-context.ts
```

## Usage Examples

### Adding a Use Case

Generate context for adding a new use case:

```bash
# General use case for auth feature
npm run context:build use-case auth

# Specific entity (e.g., login)
npm run context:build use-case auth login

# Another example: billing
npm run context:build use-case billing create-subscription
```

**Output:** `.ai/generated-context/use-case-auth-login.md`

**What's included:**

- Existing use cases from the feature (for pattern matching)
- Domain entities from Core layer
- Port definitions
- Relevant documentation (`.ai/patterns/use-case.md`, etc.)

### Working on an Entire Feature

Get cross-layer context for a feature:

```bash
npm run context:build feature auth
npm run context:build feature billing
npm run context:build feature users
```

**Output:** `.ai/generated-context/feature-auth.md`

**What's included:**

- Core entities and value objects
- Application use cases and ports
- Infrastructure implementations
- Presentation components
- Architecture documentation

### Working in a Specific Layer

Focus on a single architectural layer:

```bash
# All of Application layer
npm run context:build layer application

# Application layer, specific feature
npm run context:build layer application auth

# Core layer
npm run context:build layer core

# Infrastructure for billing
npm run context:build layer infrastructure billing
```

**Output:** `.ai/generated-context/layer-application-auth.md`

**What's included:**

- All files from the specified layer
- Layer-specific rules and documentation
- Architecture overview

### Refactoring

Generate context for files matching a pattern:

```bash
# All use cases
npm run context:build refactor "packages/application/**/*UseCase.ts"

# All repositories
npm run context:build refactor "packages/infrastructure/**/*Repository.ts"

# Specific feature across all layers
npm run context:build refactor "packages/*/auth/**/*.ts"

# All components
npm run context:build refactor "packages/presentation/**/*.tsx"
```

**Output:** `.ai/generated-context/refactor-1234567890.md`

**What's included:**

- All files matching the glob pattern
- Refactoring instructions and guidelines

## Workflow with AI Assistants

### Example 1: Adding a New Use Case with Claude

```bash
# 1. Generate context
npm run context:build use-case auth register

# 2. Copy to clipboard (macOS)
cat .ai/generated-context/use-case-auth-register.md | pbcopy

# 3. In Claude (or your AI assistant):
```

**Prompt:**

```
I need to add a RegisterUserUseCase to our auth feature. I've provided the
context below. Please implement the use case following our established patterns.

Requirements:
- Input: email, password, name
- Validate email format and password strength
- Check if user already exists
- Hash password
- Create user entity
- Save to repository
- Send welcome email
- Return user DTO and token

[Paste context here]
```

### Example 2: Refactoring with Cursor/GitHub Copilot

```bash
# Generate context for refactoring
npm run context:build refactor "packages/application/**/*UseCase.ts"

# The context file can be added to your .cursorrules or as a comment
# at the top of files you're working on
```

### Example 3: Understanding a Feature

```bash
# Get complete feature context
npm run context:build feature billing

# Use with AI to ask questions:
```

**Prompt:**

```
Using the provided context for the billing feature, explain:
1. How subscription creation works
2. What payment methods are supported
3. How billing events are handled

[Paste context here]
```

## Advanced Usage

### Custom Context Builder

You can extend the ContextBuilder class for custom contexts:

```typescript
// tools/scripts/custom-context.ts
import { ContextBuilder } from "./build-context";
import * as path from "path";

class CustomContextBuilder extends ContextBuilder {
  /**
   * Build context for API endpoint implementation
   */
  async buildApiEndpointContext(feature: string, endpoint: string) {
    const files = [];

    // Include use case
    const useCaseFiles = await this.findFiles(
      `packages/application/${feature}/**/*UseCase.ts`
    );
    files.push(...useCaseFiles);

    // Include API route examples
    const apiExamples = await this.findFiles(`apps/web/app/api/**/*.ts`);
    files.push(...apiExamples.slice(0, 3));

    // Include DTOs
    const dtoFiles = await this.findFiles(
      `packages/application/${feature}/dto/**/*.ts`
    );
    files.push(...dtoFiles);

    return this.generateMarkdown({
      title: `API Endpoint Context: ${endpoint}`,
      description: `Context for implementing ${endpoint} API endpoint`,
      files,
      instructions: `
# Implementing API Endpoint: ${endpoint}

Steps:
1. Create route handler in apps/web/app/api/${feature}/
2. Import use case from Application layer
3. Set up dependency injection
4. Parse and validate request body
5. Call use case with input
6. Handle Result type (success/failure)
7. Return appropriate HTTP response

Example structure:
- 200: Success with data
- 400: Validation error
- 401: Unauthorized
- 404: Not found
- 500: Server error
      `,
    });
  }
}

// Usage
const builder = new CustomContextBuilder();
const context = await builder.buildApiEndpointContext("auth", "login");
await builder.save(context, "api-endpoint-login.md");
```

### Integration with Git Hooks

Add to `.husky/pre-commit` to generate context before commits:

```bash
#!/bin/bash

# Generate context for changed files
CHANGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx)$')

if [ -n "$CHANGED_FILES" ]; then
  echo "Generating context for changed files..."
  npm run context:build refactor "$CHANGED_FILES"
fi
```

### CI/CD Integration

Generate context in CI for PR reviews:

```yaml
# .github/workflows/pr-context.yml
name: Generate PR Context

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  generate-context:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Generate context for changed files
        run: |
          CHANGED_FILES=$(git diff --name-only origin/main...HEAD | grep -E '\.(ts|tsx)$' | tr '\n' ' ')
          if [ -n "$CHANGED_FILES" ]; then
            npm run context:build refactor "$CHANGED_FILES"
          fi

      - name: Upload context as artifact
        uses: actions/upload-artifact@v3
        with:
          name: pr-context
          path: .ai/generated-context/
```

## Tips for Effective Context

### 1. Keep Context Focused

❌ Bad:

```bash
# Too broad - includes everything
npm run context:build refactor "packages/**/*.ts"
```

✅ Good:

```bash
# Focused on specific concern
npm run context:build refactor "packages/application/**/*UseCase.ts"
```

### 2. Combine with Documentation

Always include relevant `.ai/` documentation in your prompts:

```
Context includes:
1. [Generated context file]
2. .ai/patterns/use-case.md
3. .ai/layers/application.md

Please implement following these patterns...
```

### 3. Limit File Count

For very large features, limit the number of files:

```typescript
// Modify in build-context.ts
const files = await this.findFiles(pattern, {
  limit: 15, // Adjust based on your AI's context window
});
```

### 4. Use for Onboarding

Generate comprehensive context for new team members:

```bash
# Overview of entire system
npm run context:build feature auth
npm run context:build feature billing
npm run context:build layer core

# Combine into onboarding document
cat .ai/generated-context/feature-*.md > docs/onboarding-context.md
```

## Troubleshooting

### Context Too Large

If the generated context exceeds your AI's context window:

1. **Reduce file limit:**

   ```typescript
   const files = await this.findFiles(pattern, { limit: 10 });
   ```

2. **Focus on specific subdirectories:**

   ```bash
   npm run context:build layer application auth
   # Instead of entire application layer
   ```

3. **Exclude test files:**
   ```typescript
   ignore: ["**/*.spec.ts", "**/*.test.ts", "**/__tests__/**"];
   ```

### Missing Files

If expected files aren't included:

1. **Check glob pattern:**

   ```bash
   # Test glob pattern separately
   npx glob "packages/application/**/*UseCase.ts"
   ```

2. **Check ignore patterns:**
   Look for `.gitignore` or custom ignore rules

### Script Errors

```bash
# Check TypeScript compilation
npx tsx --check tools/scripts/build-context.ts

# Run with verbose logging
DEBUG=* npm run context:build use-case auth
```

## Next Steps

1. **Set up generators** - Combine with NX generators for consistency
2. **Create templates** - Add more task-specific context builders
3. **Automate** - Integrate with your development workflow
4. **Customize** - Extend ContextBuilder for your specific needs

## Related Documentation

- `.ai/architecture.md` - System architecture overview
- `.ai/layers/` - Layer-specific rules
- `.ai/patterns/` - Code patterns and templates
- `.ai/contexts/` - Task-specific guides
