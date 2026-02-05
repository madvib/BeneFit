import {
  Tree,
  formatFiles,
  generateFiles,
  joinPathFragments,
  readProjectConfiguration,
  getProjects,
  names,
} from '@nx/devkit';
import * as path from 'path';
import * as fs from 'fs';

interface Schema {
  dryRun?: boolean;
}

interface DomainModule {
  name: string;
  types: string[];
  commands: string[];
  queries: string[];
  entities: string[];
  valueObjects: string[];
}

interface UseCase {
  name: string;
  source: string;
  description: string;
  dependencies: string[];
}

export default async function (tree: Tree, schema: Schema) {
  const projects = getProjects(tree);
  const domainModules: Record<string, DomainModule> = {
    Core: { name: 'Core', types: [], commands: [], queries: [], entities: [], valueObjects: [] },
    Coach: { name: 'Coach', types: [], commands: [], queries: [], entities: [], valueObjects: [] },
    Integrations: { name: 'Integrations', types: [], commands: [], queries: [], entities: [], valueObjects: [] },
  };
  const useCases: UseCase[] = [];
  let allTypesContent = '';

  // Helper to read file content
  const readFile = (path: string) => {
    return tree.read(path)?.toString() || '';
  };

  // Helper to extract description (simple JSDoc or comment)
  const extractDescription = (content: string, itemName: string): string => {
    const lines = content.split('\n');
    const itemIndex = lines.findIndex(l => l.includes(itemName));
    if (itemIndex > 0) {
      const prevLine = lines[itemIndex - 1].trim();
      if (prevLine.startsWith('//') || prevLine.startsWith('*')) {
        return prevLine.replace(/^\/\/|\*|\/\*\*|\*\//g, '').trim();
      }
    }
    return '';
  };

  // Scan Projects
  for (const [projectName, config] of projects) {
    if (!config.sourceRoot) continue;

    // Determine Module
    let moduleName = '';
    if (projectName.includes('training-core')) moduleName = 'Core';
    else if (projectName.includes('coach')) moduleName = 'Coach';
    else if (projectName.includes('integrations')) moduleName = 'Integrations';
    
    // Scan for Types, Commands, Queries
    if (moduleName) {
        const visit = (dir: string) => {
            const children = tree.children(dir);
            for (const child of children) {
                const fullPath = path.join(dir, child);
                if (tree.isFile(fullPath)) {
                    const content = readFile(fullPath);
                    
                    // Types
                    if (fullPath.endsWith('.types.ts')) {
                        allTypesContent += `\n// --- ${child} ---\n${content}\n`;
                        // Extract exported types/interfaces
                        const typeMatches = content.matchAll(/export (?:type|interface) (\w+)/g);
                        for (const match of typeMatches) {
                             // Simple heuristic for Entity vs VO
                             if (fullPath.includes('aggregates') || fullPath.includes('entities')) {
                                 domainModules[moduleName].entities.push(match[1]);
                             } else if (fullPath.includes('value-objects')) {
                                 domainModules[moduleName].valueObjects.push(match[1]);
                             } else {
                                 domainModules[moduleName].types.push(match[1]);
                             }
                        }
                    }

                    // Commands
                    if (fullPath.endsWith('.commands.ts')) {
                        const matches = content.matchAll(/export function (\w+)/g);
                        for (const match of matches) {
                            domainModules[moduleName].commands.push(match[1]);
                        }
                    }

                    // Queries
                    if (fullPath.endsWith('.queries.ts')) {
                        const matches = content.matchAll(/export function (\w+)/g);
                        for (const match of matches) {
                            domainModules[moduleName].queries.push(match[1]);
                        }
                    }
                } else {
                    visit(fullPath);
                }
            }
        };
        visit(config.sourceRoot);
    }

    // Scan for Use Cases (Application Layer)
    if (projectName.includes('application') || projectName.includes('coach') || projectName.includes('integrations')) {
         const visitUseCases = (dir: string) => {
            const children = tree.children(dir);
            for (const child of children) {
                const fullPath = path.join(dir, child);
                if (tree.isFile(fullPath) && fullPath.endsWith('.ts') && !fullPath.endsWith('.spec.ts')) {
                    const content = readFile(fullPath);
                    if (content.includes('implements UseCase')) {
                        const nameMatch = content.match(/export class (\w+)[\s\n]+implements/);
                        if (nameMatch) {
                            const name = nameMatch[1];
                            const source = projectName.includes('training') ? 'Training' : (projectName.includes('coach') ? 'Coach' : 'Integrations');
                            
                            // Extract dependencies from constructor
                            const deps: string[] = [];
                            const constructorMatch = content.match(/constructor\(([\s\S]*?)\)/);
                            if (constructorMatch) {
                                const params = constructorMatch[1].split(',');
                                for (const param of params) {
                                    const typeMatch = param.match(/: ([A-Z]\w+)/); // Simple type extraction
                                    if (typeMatch) deps.push(typeMatch[1]);
                                }
                            }

                            useCases.push({
                                name,
                                source,
                                description: extractDescription(content, `export class ${name}`) || `${name} use case`,
                                dependencies: deps
                            });
                        }
                    }
                } else if (!tree.isFile(fullPath)) {
                    visitUseCases(fullPath);
                }
            }
         };
         // Look specifically in use-cases dirs if possible, or just scan source
         const useCaseDir = path.join(config.sourceRoot, 'use-cases');
         if (tree.exists(useCaseDir)) {
             visitUseCases(useCaseDir);
         } else {
             // Try finding application/use-cases
             const appUseCaseDir = path.join(config.sourceRoot, 'application', 'use-cases');
             if (tree.exists(appUseCaseDir)) {
                 visitUseCases(appUseCaseDir);
             }
         }
    }
  }

  // Generate Artifacts
  const artifactDir = '/home/madvib/.gemini/antigravity/brain/3b9b63cf-9e4d-4630-aee2-1ddc0c4e958d';
  
  // 1. domain_inventory.md
  let inventoryMd = '# Domain Inventory\n\n';
  for (const module of Object.values(domainModules)) {
      if (module.entities.length === 0 && module.commands.length === 0) continue;
      inventoryMd += `## ${module.name} Module\n\n`;
      inventoryMd += '| Type | Name | Kind | Description |\n| :--- | :--- | :--- | :--- |\n';
      
      [...module.entities].sort().forEach(n => inventoryMd += `| **Entity** | \`${n}\` | Entity | - |\n`);
      [...module.valueObjects].sort().forEach(n => inventoryMd += `| **Value Object** | \`${n}\` | VO | - |\n`);
      [...module.commands].sort().forEach(n => inventoryMd += `| **Command** | \`${n}\` | Command | - |\n`);
      [...module.queries].sort().forEach(n => inventoryMd += `| **Query** | \`${n}\` | Query | - |\n`);
      inventoryMd += '\n';
  }
  
  // 2. application_inventory.md
  let appInventoryMd = '# Application Use Cases Inventory\n\n';
  appInventoryMd += '| Use Case | Source | Description | Dependencies |\n| :--- | :--- | :--- | :--- |\n';
  useCases.sort((a, b) => a.name.localeCompare(b.name)).forEach(uc => {
      appInventoryMd += `| \`${uc.name}\` | ${uc.source} | ${uc.description} | \`${uc.dependencies.join('`, `')}\` |\n`;
  });

  // Write files (using fs directly for absolute paths outside of tree root if needed, or tree for relative)
  // Since artifacts are in a specific absolute path, we might need fs. But tree.write is safer for NX.
  // Let's try to write to the tree first, but the artifact path is outside the workspace usually?
  // Actually, the artifact path is absolute. NX tree usually works relative to workspace root.
  // We will use fs for the artifact output to ensure it goes to the right place.
  
  if (!schema.dryRun) {
      fs.writeFileSync(path.join(artifactDir, 'domain_inventory.md'), inventoryMd);
      fs.writeFileSync(path.join(artifactDir, 'application_inventory.md'), appInventoryMd);
      fs.writeFileSync(path.join(artifactDir, 'all_domain_types.ts'), allTypesContent);
  }

  await formatFiles(tree);
}
