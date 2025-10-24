import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

export const customRender = (ui: React.ReactElement, options = {}) => {
  return render(ui, {
    ...options,
  });
};

export * from "@testing-library/react";
