#!/usr/bin/env node
/**
 * Context Builder for AI Assistants
 *
 * Generates markdown files with relevant code context for specific tasks.
 * Makes it easy to provide focused, relevant context to LLMs.
 *
 * Usage:
 *   npm run context:build use-case auth login
 *   npm run context:build feature auth
 *   npm run context:build layer application
 */

import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

interface ContextConfig {
  task: string;
  feature?: string;
  entity?: string;
  layer?: string;
  outputDir?: string;
}

interface FileContext {
  path: string;
  content: string;
  language: string;
}

class ContextBuilder {
  private rootDir: string;
  private outputDir: string;

  constructor(rootDir: string = process.cwd()) {
    this.rootDir = rootDir;
    this.outputDir = path.join(rootDir, ".ai", "generated-context");
  }

  /**
   * Build context for adding a use case
   */
  async buildUseCaseContext(feature: string, entity?: string): Promise<string> {
    console.log(
      `Building use case context for feature: ${feature}${entity ? `, entity: ${entity}` : ""}`
    );

    const files: FileContext[] = [];

    // 1. Include existing use cases from the feature
    const featureUseCases = await this.findFiles(
      `packages/application/${feature}/**/*UseCase.ts`,
      { ignore: ["**/*.spec.ts", "**/*.test.ts"] }
    );
    files.push(...featureUseCases);

    // 2. Include related domain entities
    const domainEntities = await this.findFiles(
      `packages/core/${feature}/**/*.ts`,
      { ignore: ["**/*.spec.ts", "**/*.test.ts"] }
    );
    files.push(...domainEntities.slice(0, 5)); // Limit to avoid context overflow

    // 3. Include ports if they exist
    const ports = await this.findFiles(
      `packages/application/${feature}/ports/**/*.ts`
    );
    files.push(...ports);

    // 4. Include architectural documentation
    const docs = [
      ".ai/patterns/use-case.md",
      ".ai/layers/application.md",
      ".ai/contexts/add-use-case.md",
    ];

    for (const docPath of docs) {
      const fullPath = path.join(this.rootDir, docPath);
      if (fs.existsSync(fullPath)) {
        files.push({
          path: docPath,
          content: fs.readFileSync(fullPath, "utf-8"),
          language: "markdown",
        });
      }
    }

    return this.generateMarkdown({
      title: `Use Case Context: ${feature}${entity ? ` - ${entity}` : ""}`,
      description: `Context for adding a new use case to the ${feature} feature`,
      files,
      instructions: this.getUseCaseInstructions(feature, entity),
    });
  }

  /**
   * Build context for an entire feature (cross-layer)
   */
  async buildFeatureContext(feature: string): Promise<string> {
    console.log(`Building feature context for: ${feature}`);

    const files: FileContext[] = [];

    // Include all layers for this feature
    const layers = ["core", "application", "infrastructure", "presentation"];

    for (const layer of layers) {
      const layerFiles = await this.findFiles(
        `packages/${layer}/${feature}/**/*.ts`,
        { ignore: ["**/*.spec.ts", "**/*.test.ts"], limit: 10 }
      );
      files.push(...layerFiles);
    }

    // Include architectural docs
    const docs = [
      ".ai/architecture.md",
      ".ai/patterns/use-case.md",
      ".ai/patterns/entity.md",
    ];

    for (const docPath of docs) {
      const fullPath = path.join(this.rootDir, docPath);
      if (fs.existsSync(fullPath)) {
        files.push({
          path: docPath,
          content: fs.readFileSync(fullPath, "utf-8"),
          language: "markdown",
        });
      }
    }

    return this.generateMarkdown({
      title: `Feature Context: ${feature}`,
      description: `Complete cross-layer context for the ${feature} feature`,
      files,
      instructions: this.getFeatureInstructions(feature),
    });
  }

  /**
   * Build context for a specific layer
   */
  async buildLayerContext(layer: string, feature?: string): Promise<string> {
    console.log(
      `Building layer context for: ${layer}${feature ? ` (${feature})` : ""}`
    );

    const files: FileContext[] = [];

    // Include all files from the layer (optionally filtered by feature)
    const pattern = feature
      ? `packages/${layer}/${feature}/**/*.ts`
      : `packages/${layer}/**/*.ts`;

    const layerFiles = await this.findFiles(pattern, {
      ignore: ["**/*.spec.ts", "**/*.test.ts"],
      limit: 20,
    });
    files.push(...layerFiles);

    // Include layer-specific documentation
    const layerDoc = `.ai/layers/${layer}.md`;
    const fullPath = path.join(this.rootDir, layerDoc);
    if (fs.existsSync(fullPath)) {
      files.push({
        path: layerDoc,
        content: fs.readFileSync(fullPath, "utf-8"),
        language: "markdown",
      });
    }

    // Include general architecture
    const archDoc = ".ai/architecture.md";
    const archPath = path.join(this.rootDir, archDoc);
    if (fs.existsSync(archPath)) {
      files.push({
        path: archDoc,
        content: fs.readFileSync(archPath, "utf-8"),
        language: "markdown",
      });
    }

    return this.generateMarkdown({
      title: `Layer Context: ${layer}${feature ? ` - ${feature}` : ""}`,
      description: `Context for working in the ${layer} layer`,
      files,
      instructions: this.getLayerInstructions(layer),
    });
  }

  /**
   * Build context for refactoring
   */
  async buildRefactorContext(pattern: string): Promise<string> {
    console.log(`Building refactor context for pattern: ${pattern}`);

    const files = await this.findFiles(pattern, { limit: 30 });

    return this.generateMarkdown({
      title: `Refactor Context: ${pattern}`,
      description: `Files matching pattern for refactoring`,
      files,
      instructions: `
# Refactoring Instructions

When refactoring these files:
1. Maintain existing tests (all must pass)
2. Follow architectural rules (see .ai/architecture.md)
3. Keep changes focused and minimal
4. Update related documentation if needed
5. Run \`nx affected:test\` after changes

## Common Refactoring Patterns
- Extract common logic into shared utilities
- Remove duplication while maintaining readability
- Improve naming for clarity
- Add missing error handling
- Enhance type safety
      `.trim(),
    });
  }

  /**
   * Find files matching a glob pattern
   */
  private async findFiles(
    pattern: string,
    options: { ignore?: string[]; limit?: number } = {}
  ): Promise<FileContext[]> {
    const { ignore = [], limit = Infinity } = options;

    const files = await glob(pattern, {
      cwd: this.rootDir,
      ignore: ["**/node_modules/**", "**/dist/**", "**/.next/**", ...ignore],
    });

    return files.slice(0, limit).map((file) => {
      const fullPath = path.join(this.rootDir, file);
      const content = fs.readFileSync(fullPath, "utf-8");
      const ext = path.extname(file).slice(1);

      return {
        path: file,
        content,
        language: this.getLanguage(ext),
      };
    });
  }

  /**
   * Generate markdown output
   */
  private generateMarkdown(options: {
    title: string;
    description: string;
    files: FileContext[];
    instructions: string;
  }): string {
    const { title, description, files, instructions } = options;

    let markdown = `# ${title}\n\n`;
    markdown += `${description}\n\n`;
    markdown += `**Generated:** ${new Date().toISOString()}\n\n`;
    markdown += `**File count:** ${files.length}\n\n`;
    markdown += `---\n\n`;

    markdown += `## Instructions\n\n`;
    markdown += `${instructions}\n\n`;
    markdown += `---\n\n`;

    markdown += `## Files\n\n`;

    for (const file of files) {
      markdown += `### ${file.path}\n\n`;
      markdown += `\`\`\`${file.language}\n`;
      markdown += file.content;
      markdown += `\n\`\`\`\n\n`;
    }

    markdown += `---\n\n`;
    markdown += `## Summary\n\n`;
    markdown += `This context includes ${files.length} files:\n\n`;

    const filesByType = this.groupFilesByType(files);
    for (const [type, count] of Object.entries(filesByType)) {
      markdown += `- ${count} ${type} file(s)\n`;
    }

    return markdown;
  }

  /**
   * Group files by type for summary
   */
  private groupFilesByType(files: FileContext[]): Record<string, number> {
    const groups: Record<string, number> = {};

    for (const file of files) {
      const type =
        file.language === "markdown" ? "documentation" : file.language;
      groups[type] = (groups[type] || 0) + 1;
    }

    return groups;
  }

  /**
   * Get language identifier from file extension
   */
  private getLanguage(ext: string): string {
    const languageMap: Record<string, string> = {
      ts: "typescript",
      tsx: "typescript",
      js: "javascript",
      jsx: "javascript",
      md: "markdown",
      json: "json",
      yaml: "yaml",
      yml: "yaml",
    };

    return languageMap[ext] || ext;
  }

  /**
   * Save context to file
   */
  async save(content: string, filename: string): Promise<string> {
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    const outputPath = path.join(this.outputDir, filename);
    fs.writeFileSync(outputPath, content, "utf-8");

    console.log(`✅ Context saved to: ${outputPath}`);
    console.log(`📊 Size: ${(content.length / 1024).toFixed(2)} KB`);

    return outputPath;
  }

  private getUseCaseInstructions(feature: string, entity?: string): string {
    return `
# Adding a Use Case to ${feature}

Follow these steps:

1. **Review existing patterns** - Look at other use cases in this feature
2. **Define input/output DTOs** - Create clear interfaces
3. **Identify required ports** - What infrastructure services are needed?
4. **Implement use case** - Follow the standard pattern
5. **Write tests** - Cover success and failure cases
6. **Export from index** - Make use case available

## Key Rules

- ✅ Return \`Result<T>\` type
- ✅ Use dependency injection
- ✅ Define ports (interfaces) for infrastructure
- ❌ No direct infrastructure imports
- ❌ No domain logic (belongs in Core)

## Files to Create

- \`${feature}/${entity ? `${entity}UseCase` : "YourUseCase"}.ts\`
- \`dto/${entity ? `${entity}Input` : "Input"}.ts\`
- \`dto/${entity ? `${entity}Output` : "Output"}.ts\`
- \`ports/I${entity || "Service"}.ts\` (if new)
- Test file with \`.spec.ts\` extension

See \`.ai/contexts/add-use-case.md\` for detailed walkthrough.
    `.trim();
  }

  private getFeatureInstructions(feature: string): string {
    return `
# Working on ${feature} Feature

This context includes all layers of the ${feature} feature:
- Core: Domain entities and business rules
- Application: Use cases and business logic
- Infrastructure: External adapters
- Presentation: UI components

## When to Use This Context

- Adding a new capability that spans multiple layers
- Understanding how data flows through the feature
- Refactoring the entire feature
- Onboarding to understand the feature

## Architecture Flow

\`\`\`
Presentation → Application → Core
     ↓              ↓
Infrastructure ←────┘
\`\`\`

## Key Files to Review First

1. Core entities - Understand the domain model
2. Application use cases - See what operations are available
3. Infrastructure adapters - Know what external services are used

## Making Changes

Always work from inner layers outward:
1. Start with Core (entities, value objects)
2. Then Application (use cases)
3. Then Infrastructure (adapters)
4. Finally Presentation (UI)

This ensures dependencies flow correctly.
    `.trim();
  }

  private getLayerInstructions(layer: string): string {
    const layerInstructions: Record<string, string> = {
      core: `
# Working in Core Layer

The Core layer contains domain entities and business rules.

## Key Principles
- No dependencies on other layers
- Pure business logic only
- No infrastructure concerns (no DB, no HTTP, no frameworks)

## What Belongs Here
- Domain entities (User, Order, Product)
- Value objects (Email, Money, Address)
- Domain errors (InvalidEmailError)
- Business rules and invariants

## Testing
- Unit tests only
- No mocks needed (pure functions)
- Property-based testing recommended
      `,
      application: `
# Working in Application Layer

The Application layer orchestrates business workflows.

## Key Principles
- Depends on Core only
- Defines ports (interfaces) for infrastructure
- Contains use cases and business logic
- Returns Result<T> for error handling

## What Belongs Here
- Use cases (LoginUseCase, CreateOrderUseCase)
- Ports/interfaces (IUserRepository, IEmailService)
- DTOs (LoginInput, LoginOutput)
- Business workflow orchestration

## Testing
- Unit tests with mocked ports
- Focus on business logic paths
- Test success and failure scenarios
      `,
      infrastructure: `
# Working in Infrastructure Layer

The Infrastructure layer implements external adapters.

## Key Principles
- Implements ports defined in Application
- Contains all external dependencies
- Depends on Application and Core

## What Belongs Here
- Repository implementations (PostgresUserRepository)
- Service implementations (JwtTokenService)
- API clients (StripePaymentClient)
- Database configurations
- Third-party integrations

## Testing
- Integration tests with real dependencies
- Can use test databases/services
- Mock external APIs when needed
      `,
      presentation: `
# Working in Presentation Layer

The Presentation layer contains UI components and controllers.

## Key Principles
- Depends on Application and Core
- Assembles dependency injection
- Framework-specific code lives here

## What Belongs Here
- React/Vue/Svelte components
- API route handlers
- Pages and layouts
- UI state management
- Dependency injection setup

## Testing
- Component tests
- E2E tests
- Integration tests with real use cases
      `,
    };

    return (
      layerInstructions[layer] || "No specific instructions for this layer."
    ).trim();
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Context Builder - Generate AI-friendly context files

Usage:
  npm run context:build <task> [options]

Tasks:
  use-case <feature> [entity]    Build context for adding a use case
    Example: npm run context:build use-case auth login

  feature <feature>              Build context for entire feature (all layers)
    Example: npm run context:build feature auth

  layer <layer> [feature]        Build context for a specific layer
    Example: npm run context:build layer application auth

  refactor <pattern>             Build context for refactoring files
    Example: npm run context:build refactor "packages/application/**/*UseCase.ts"

Examples:
  npm run context:build use-case auth login
  npm run context:build feature billing
  npm run context:build layer application
  npm run context:build refactor "packages/core/**/*.ts"
    `);
    process.exit(0);
  }

  const [task, ...taskArgs] = args;
  const builder = new ContextBuilder();

  let content: string;
  let filename: string;

  try {
    switch (task) {
      case "use-case": {
        const [feature, entity] = taskArgs;
        if (!feature) {
          console.error("❌ Feature is required for use-case task");
          process.exit(1);
        }
        content = await builder.buildUseCaseContext(feature, entity);
        filename = `use-case-${feature}${entity ? `-${entity}` : ""}.md`;
        break;
      }

      case "feature": {
        const [feature] = taskArgs;
        if (!feature) {
          console.error("❌ Feature is required for feature task");
          process.exit(1);
        }
        content = await builder.buildFeatureContext(feature);
        filename = `feature-${feature}.md`;
        break;
      }

      case "layer": {
        const [layer, feature] = taskArgs;
        if (!layer) {
          console.error("❌ Layer is required for layer task");
          process.exit(1);
        }
        content = await builder.buildLayerContext(layer, feature);
        filename = `layer-${layer}${feature ? `-${feature}` : ""}.md`;
        break;
      }

      case "refactor": {
        const [pattern] = taskArgs;
        if (!pattern) {
          console.error("❌ Pattern is required for refactor task");
          process.exit(1);
        }
        content = await builder.buildRefactorContext(pattern);
        filename = `refactor-${Date.now()}.md`;
        break;
      }

      default:
        console.error(`❌ Unknown task: ${task}`);
        process.exit(1);
    }

    const outputPath = await builder.save(content, filename);

    console.log("\n✨ Context ready! Use this file with your AI assistant.");
    console.log(`\n📋 To copy to clipboard (macOS):`);
    console.log(`   cat "${outputPath}" | pbcopy`);
    console.log(`\n📋 To copy to clipboard (Linux):`);
    console.log(`   cat "${outputPath}" | xclip -selection clipboard`);
  } catch (error) {
    console.error("❌ Error building context:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { ContextBuilder };
