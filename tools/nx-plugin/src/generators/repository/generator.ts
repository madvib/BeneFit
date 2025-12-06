import { Tree, formatFiles, generateFiles, names } from '@nx/devkit';
import * as path from 'path';

interface RepositoryGeneratorSchema {
  entity: string;
  feature: string;
  implementation: string;
}

export default async function (tree: Tree, schema: RepositoryGeneratorSchema) {
  const { entity, feature, implementation } = schema;
  const entityNames = names(entity);
  const featureNames = names(feature);
  const implNames = names(implementation);

  // Generate port (Application layer)
  const portPath = `packages/application/src/${featureNames.fileName}/ports`;
  generateFiles(tree, path.join(__dirname, 'port-files'), portPath, {
    entity: entityNames.className,
    entityFileName: entityNames.fileName,
    feature: featureNames.fileName,
    template: '',
  });

  // Generate implementation (Infrastructure layer)
  const implPath = `packages/infrastructure/src/${featureNames.fileName}/repositories`;
  generateFiles(tree, path.join(__dirname, 'impl-files'), implPath, {
    entity: entityNames.className,
    entityFileName: entityNames.fileName,
    feature: featureNames.fileName,
    implementation: implNames.className,
    template: '',
  });

  // Generate tests
  generateFiles(tree, path.join(__dirname, 'test-files'), implPath, {
    entity: entityNames.className,
    entityFileName: entityNames.fileName,
    feature: featureNames.fileName,
    implementation: implNames.className,
    template: '',
  });

  // Update indexes
  updateApplicationIndex(tree, portPath, entityNames.className);
  updateInfrastructureIndex(
    tree,
    implPath,
    entityNames.className,
    implNames.className,
  );

  await formatFiles(tree);

  return () => {
    console.log(`✅ Repository created!`);
    console.log(`   Port: ${portPath}/I${entityNames.className}Repository.ts`);
    console.log(
      `   Implementation: ${implPath}/${implNames.className}${entityNames.className}Repository.ts`,
    );
  };
}

function updateApplicationIndex(
  tree: Tree,
  portPath: string,
  entity: string,
): void {
  const indexPath = path.join(path.dirname(portPath), 'index.ts');

  let content = '';
  if (tree.exists(indexPath)) {
    content = tree.read(indexPath, 'utf-8') || '';
  }

  const exportStatement = `export * from './ports/I${entity}Repository';\n`;

  if (!content.includes(exportStatement)) {
    tree.write(indexPath, content + exportStatement);
  }
}

function updateInfrastructureIndex(
  tree: Tree,
  implPath: string,
  entity: string,
  implementation: string,
): void {
  const indexPath = path.join(path.dirname(implPath), 'index.ts');

  let content = '';
  if (tree.exists(indexPath)) {
    content = tree.read(indexPath, 'utf-8') || '';
  }

  const exportStatement = `export * from './repositories/${implementation}${entity}Repository';\n`;

  if (!content.includes(exportStatement)) {
    tree.write(indexPath, content + exportStatement);
  }
}
