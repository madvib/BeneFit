import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders correctly", () => {
    render(<LoadingSpinner />);
    const spinnerContainer = screen.getByTestId("loading-spinner");
    expect(spinnerContainer).toBeInTheDocument();

    const spinner = spinnerContainer.querySelector(".w-8.h-8");
    expect(spinner).toBeInTheDocument();
  });

  it("applies size classes correctly", () => {
    const { rerender } = render(
      <LoadingSpinner size="sm" data-testid="loading-spinner" />,
    );
    let spinner = screen
      .getByTestId("loading-spinner")
      .querySelector(".w-4.w-4");
    expect(spinner).toBeInTheDocument();

    rerender(<LoadingSpinner size="md" data-testid="loading-spinner" />);
    spinner = screen.getByTestId("loading-spinner").querySelector(".w-8.h-8");
    expect(spinner).toBeInTheDocument();

    rerender(<LoadingSpinner size="lg" data-testid="loading-spinner" />);
    spinner = screen.getByTestId("loading-spinner").querySelector(".w-12.h-12");
    expect(spinner).toBeInTheDocument();
  });

  it("defaults to md size", () => {
    render(<LoadingSpinner data-testid="loading-spinner" />);
    const spinner = screen
      .getByTestId("loading-spinner")
      .querySelector(".w-8.h-8");
    expect(spinner).toBeInTheDocument();
  });

  it("applies className prop", () => {
    render(
      <LoadingSpinner className="custom-class" data-testid="loading-spinner" />,
    );
    const container = screen.getByTestId("loading-spinner");
    expect(container).toHaveClass("custom-class");
  });
});
