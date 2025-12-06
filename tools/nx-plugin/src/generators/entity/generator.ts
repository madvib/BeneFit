import { Tree, formatFiles, generateFiles, names } from '@nx/devkit';
import * as path from 'path';

interface EntityGeneratorSchema {
  name: string;
  feature: string;
  properties?: string;
}

interface Property {
  name: string;
  type: string;
  optional: boolean;
}

export default async function (tree: Tree, schema: EntityGeneratorSchema) {
  const { name, feature, properties } = schema;
  const normalizedNames = names(name);
  const featureNames = names(feature);

  // Parse properties
  const parsedProps = parseProperties(properties || '');

  // Generate entity file
  const entityPath = `packages/core/src/${featureNames.fileName}/entities`;

  generateFiles(tree, path.join(__dirname, 'files'), entityPath, {
    ...normalizedNames,
    feature: featureNames.fileName,
    featureClassName: featureNames.className,
    properties: parsedProps,
    propsInterface: generatePropsInterface(parsedProps),
    getters: generateGetters(parsedProps),
    factoryProps: generateFactoryProps(parsedProps),
    template: '',
  });

  // Generate test file
  generateFiles(tree, path.join(__dirname, 'test-files'), entityPath, {
    ...normalizedNames,
    feature: featureNames.fileName,
    properties: parsedProps,
    template: '',
  });
  // Update index.ts
  updateIndex(tree, entityPath, normalizedNames.className);

  await formatFiles(tree);

  return () => {
    console.log(`✅ Entity ${normalizedNames.className} created!`);
    console.log(`   Location: ${entityPath}/${normalizedNames.className}.ts`);
    console.log(`   Tests: ${entityPath}/${normalizedNames.className}.spec.ts`);
  };
}

function parseProperties(propsString: string): Property[] {
  if (!propsString) return [];

  return propsString.split(',').map((prop) => {
    const [name, typeWithOptional] = prop.trim().split(':');
    const optional = typeWithOptional?.endsWith('?');
    const type = optional
      ? typeWithOptional.slice(0, -1)
      : typeWithOptional || 'string';

    return { name: name.trim(), type: type.trim(), optional };
  });
}

function generatePropsInterface(properties: Property[]): string {
  if (properties.length === 0) {
    return '  // TODO: Add properties';
  }

  return properties
    .map((prop) => `  ${prop.name}${prop.optional ? '?' : ''}: ${prop.type};`)
    .join('\n');
}

function generateGetters(properties: Property[]): string {
  if (properties.length === 0) {
    return '  // TODO: Add getters';
  }

  return properties
    .map((prop) => {
      return `  get ${prop.name}(): ${prop.type}${prop.optional ? ' | undefined' : ''} {
    return this.props.${prop.name};
  }`;
    })
    .join('\n\n');
}

function generateFactoryProps(properties: Property[]): string {
  const defaultProps = ['isActive', 'createdAt', 'updatedAt'];
  const userProps = properties.filter((p) => !defaultProps.includes(p.name));

  if (userProps.length === 0) {
    return '{}';
  }

  return `Omit<Props, 'createdAt'> & { id: string }`;
}

function updateIndex(tree: Tree, entityPath: string, className: string): void {
  const indexPath = path.join(path.dirname(entityPath), 'index.ts');

  let content = '';
  if (tree.exists(indexPath)) {
    content = tree.read(indexPath, 'utf-8') || '';
  }

  const exportStatement = `export * from './entities/${className}';\n`;

  if (!content.includes(exportStatement)) {
    tree.write(indexPath, content + exportStatement);
  }
}
