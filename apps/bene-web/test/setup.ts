import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

export const customRender = (ui: React.ReactElement, options = {}) => {
  return render(ui, {
    ...options,
  });
};

export * from '@testing-library/react';