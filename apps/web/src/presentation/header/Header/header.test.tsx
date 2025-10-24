import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

// Mock UnifiedHeader to test the wrapper component
vi.mock("../UnifiedHeader/UnifiedHeader", () => ({
  default: vi.fn(({ variant }) => (
    <div data-testid="unified-header" data-variant={variant}>
      Unified Header ({variant})
    </div>
  )),
}));

describe("Header", () => {
  it("renders with default marketing variant", () => {
    render(<Header />);

    expect(screen.getByTestId("unified-header")).toBeInTheDocument();
    expect(screen.getByTestId("unified-header")).toHaveAttribute(
      "data-variant",
      "marketing",
    );
  });

  it("renders with specified variant", () => {
    render(<Header variant="dashboard" />);

    expect(screen.getByTestId("unified-header")).toBeInTheDocument();
    expect(screen.getByTestId("unified-header")).toHaveAttribute(
      "data-variant",
      "dashboard",
    );
  });

  it("renders with user variant", () => {
    render(<Header variant="user" />);

    expect(screen.getByTestId("unified-header")).toBeInTheDocument();
    expect(screen.getByTestId("unified-header")).toHaveAttribute(
      "data-variant",
      "user",
    );
  });

  it("defaults to marketing variant when no variant is provided", () => {
    render(<Header />);

    expect(screen.getByTestId("unified-header")).toHaveAttribute(
      "data-variant",
      "marketing",
    );
  });

  it("passes marketing variant correctly to UnifiedHeader", () => {
    render(<Header variant="marketing" />);
    expect(screen.getByTestId("unified-header")).toHaveAttribute(
      "data-variant",
      "marketing",
    );
  });

  it("passes dashboard variant correctly to UnifiedHeader", () => {
    render(<Header variant="dashboard" />);
    expect(screen.getByTestId("unified-header")).toHaveAttribute(
      "data-variant",
      "dashboard",
    );
  });

  it("passes user variant correctly to UnifiedHeader", () => {
    render(<Header variant="user" />);
    expect(screen.getByTestId("unified-header")).toHaveAttribute(
      "data-variant",
      "user",
    );
  });
});
