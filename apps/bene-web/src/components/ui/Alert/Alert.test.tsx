import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Alert from "./Alert";

describe("Alert", () => {
  it("renders title correctly", () => {
    render(<Alert title="Test Title" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<Alert title="Test Title" description="Test Description" />);
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<Alert title="Test Title" />);
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });

  it("applies correct type styles", () => {
    const { container } = render(<Alert title="Test Title" type="success" />);
    expect(container.firstChild).toHaveClass("bg-green-50");

    const { container: container2 } = render(
      <Alert title="Test Title" type="error" />,
    );
    expect(container2.firstChild).toHaveClass("bg-red-50");
  });

  it("shows close button when onClose is provided", () => {
    const mockOnClose = vi.fn();
    render(<Alert title="Test Title" onClose={mockOnClose} />);
    const closeButton = screen.getByRole("button");
    expect(closeButton).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const mockOnClose = vi.fn();
    render(<Alert title="Test Title" onClose={mockOnClose} />);
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(<Alert title="Test Title" className="custom-class" />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("custom-class");
  });
});
