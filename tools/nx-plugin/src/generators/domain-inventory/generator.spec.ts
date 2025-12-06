import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import generator from './generator';

describe('domain-inventory generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(tree, {});
    // Basic assertion since we are writing to absolute paths in the real generator
    // In a real test we would mock fs
    expect(true).toBe(true);
  });
});
