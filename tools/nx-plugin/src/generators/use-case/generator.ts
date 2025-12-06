import { Tree, formatFiles, generateFiles, names } from '@nx/devkit';
import * as path from 'path';

interface UseCaseGeneratorSchema {
  name: string;
  feature: string;
}

export default async function (tree: Tree, schema: UseCaseGeneratorSchema) {
  const { name, feature } = schema;
  const normalizedNames = names(name);
  const featureNames = names(feature);

  // Ensure name ends with UseCase
  const useCaseName = normalizedNames.className.endsWith('UseCase')
    ? normalizedNames.className
    : `${normalizedNames.className}UseCase`;

  const useCasePath = `packages/application-${featureNames.fileName}/src`;

  // Generate use case file
  generateFiles(tree, path.join(__dirname, 'files'), useCasePath, {
    className: useCaseName,
    fileName: names(useCaseName).fileName,
    feature: featureNames.fileName,
    featureClassName: featureNames.className,
    template: '',
  });

  // Generate DTO files
  const dtoPath = path.join(useCasePath, 'dto');
  generateFiles(tree, path.join(__dirname, 'dto-files'), dtoPath, {
    className: useCaseName,
    fileName: names(useCaseName).fileName,
    template: '',
  });

  // Generate test file
  generateFiles(tree, path.join(__dirname, 'test-files'), useCasePath, {
    className: useCaseName,
    fileName: names(useCaseName).fileName,
    feature: featureNames.fileName,
    template: '',
  });

  // Update index
  updateIndex(tree, useCasePath, useCaseName);

  await formatFiles(tree);

  return () => {
    console.log(`✅ Use Case ${useCaseName} created!`);
    console.log(
      `   Location: ${useCasePath}/${names(useCaseName).fileName}.ts`,
    );
    console.log(`   DTOs: ${dtoPath}/${names(useCaseName).fileName}-*.ts`);
    console.log(
      `   Tests: ${useCasePath}/${names(useCaseName).fileName}.spec.ts`,
    );
  };
}

function updateIndex(tree: Tree, useCasePath: string, className: string): void {
  const indexPath = path.join(useCasePath, 'index.ts');
  const fileName = names(className).fileName;

  let content = '';
  if (tree.exists(indexPath)) {
    content = tree.read(indexPath, 'utf-8') || '';
  }

  const exports =
    [
      `export * from './${fileName}';`,
      `export * from './dto/${fileName}-input';`,
      `export * from './dto/${fileName}-output';`,
    ].join('\n') + '\n';

  if (!content.includes(className)) {
    tree.write(indexPath, content + exports);
  }
}
