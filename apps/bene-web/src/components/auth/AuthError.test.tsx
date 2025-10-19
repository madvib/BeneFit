import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthError } from "./AuthError";

describe("AuthError", () => {
  it("renders error message when provided", () => {
    render(<AuthError message="Invalid credentials" />);

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    // Find the SVG icon by className since it doesn't have role="img"
    expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
  });

  it("does not render when no message is provided", () => {
    render(<AuthError message="" />);

    // When no message, component returns null so nothing should be in the document
    expect(
      screen.queryByTestId("auth-error-container"),
    ).not.toBeInTheDocument();
  });

  it("renders with correct styling", () => {
    render(<AuthError message="Test error" />);

    const errorContainer = screen.getByTestId("auth-error-container");
    expect(errorContainer).toHaveClass("bg-error/15");
  });

  it("renders icon correctly", () => {
    render(<AuthError message="Test error" />);

    // Find by test ID or by the lucide icon class
    expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
  });
});
