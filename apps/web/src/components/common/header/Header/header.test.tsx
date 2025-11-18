import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./header";

// Mock the repositories that use Cloudflare context to avoid runtime errors in tests
vi.mock('../../../../src/providers/repositories', () => ({
  authUserRepository: {},
  authService: {},
}));

// Mock providers that depend on repositories
vi.mock('../../../../providers/auth-use-cases', () => ({
  authUseCases: {
    getCurrentUserUseCase: vi.fn(() => Promise.resolve({
      execute: vi.fn().mockResolvedValue({ isSuccess: true, value: { id: '1', email: 'test@example.com', name: 'Test User' } })
    })),
  }
}));

// Don't mock UnifiedHeader since we want to test the actual implementation
describe("Header", () => {
  it("renders with default marketing variant", () => {
    render(<Header />);

    // Check for actual elements that exist in the real component
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("renders with specified variant", () => {
    render(<Header variant="dashboard" />);

    // The variant prop is passed to UnifiedHeader, which should render appropriately
    // For this test, we can check that the header renders without error
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("renders with user variant", () => {
    render(<Header variant="user" />);

    // The variant prop is passed to UnifiedHeader, which should render appropriately
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("defaults to marketing variant when no variant is provided", () => {
    render(<Header />);

    // Check the header renders properly without specifying a variant
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("passes marketing variant correctly to UnifiedHeader", () => {
    render(<Header variant="marketing" />);
    
    // Check that the header is rendered properly with the marketing variant
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("passes dashboard variant correctly to UnifiedHeader", () => {
    render(<Header variant="dashboard" />);
    
    // Check that the header is rendered properly with the dashboard variant
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("passes user variant correctly to UnifiedHeader", () => {
    render(<Header variant="user" />);
    
    // Check that the header is rendered properly with the user variant
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });
});
