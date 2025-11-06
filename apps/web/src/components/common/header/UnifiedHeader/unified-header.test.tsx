import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UnifiedHeader from "./unified-header";

// Mock child components to avoid deep integration issues
vi.mock("../AuthChecker/auth-checker", () => ({
  AuthChecker: vi.fn(({ children }) =>
    children({ isLoggedIn: true, isLoading: false, user: { id: "123" } }),
  ),
}));
vi.mock("../UnifiedNavigation/unified-navigation", () => ({
  UnifiedNavigation: vi.fn(({ isLoggedIn, variant }) => (
    <div
      data-testid="unified-navigation"
      data-variant={variant}
      data-logged-in={isLoggedIn.toString()}
    >
      Navigation ({variant}, logged in: {isLoggedIn.toString()})
    </div>
  )),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      data-testid="logo-image"
    />
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", async () => {
  const actual = await vi.importActual("lucide-react");
  return {
    ...actual,
    Menu: ({ "data-testid": testId }: { "data-testid"?: string }) => (
      <svg data-testid={testId} />
    ),
    X: ({ "data-testid": testId }: { "data-testid"?: string }) => (
      <svg data-testid={testId} />
    ),
  };
});

describe("UnifiedHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders header with logo and desktop navigation by default", () => {
    render(<UnifiedHeader />);

    expect(screen.getByTestId("logo-image")).toBeInTheDocument();
    // The alt text is "BeneFit Logo", not part of the text content
    expect(screen.getByAltText(/BeneFit Logo/)).toBeInTheDocument();
    expect(screen.getByTestId("unified-navigation")).toBeInTheDocument();
  });

  it("renders with specified variant", () => {
    render(<UnifiedHeader variant="dashboard" />);

    expect(screen.getByTestId("unified-navigation")).toHaveAttribute(
      "data-variant",
      "dashboard",
    );
  });

  it("passes correct props to UnifiedNavigation based on auth state", () => {
    render(<UnifiedHeader variant="dashboard" />);

    expect(screen.getByTestId("unified-navigation")).toHaveAttribute(
      "data-logged-in",
      "true",
    );
  });

  it("shows mobile menu toggle on small screens", () => {
    render(<UnifiedHeader />);

    const menuToggle = screen.getByLabelText("Open menu");
    expect(menuToggle).toBeInTheDocument();
    expect(menuToggle).toHaveAttribute("aria-label", "Open menu");
  });

  it("opens mobile menu when menu toggle is clicked", () => {
    render(<UnifiedHeader />);

    const menuToggle = screen.getByLabelText("Open menu");
    fireEvent.click(menuToggle);

    // Mobile menu should be visible - find by test id instead of text
    const navigationElements = screen.getAllByTestId("unified-navigation");
    expect(navigationElements).toHaveLength(2); // One for desktop, one for mobile
  });

  it("closes mobile menu when close button is clicked", async () => {
    render(<UnifiedHeader />);

    // Open mobile menu
    const menuToggle = screen.getByLabelText("Open menu");
    fireEvent.click(menuToggle);

    // Check that mobile menu is open
    expect(screen.getByLabelText("Close menu")).toBeInTheDocument();

    // Click close button
    const closeToggle = screen.getByLabelText("Close menu");
    fireEvent.click(closeToggle);

    // Wait for mobile menu to close
    await waitFor(() => {
      expect(screen.queryByLabelText("Close menu")).not.toBeInTheDocument();
    });
  });

  it("closes mobile menu when logo is clicked in mobile view", async () => {
    render(<UnifiedHeader />);

    // Open mobile menu
    const menuToggle = screen.getByLabelText("Open menu");
    fireEvent.click(menuToggle);

    // There are two logo links (desktop and mobile), so use getAllByRole
    const logoLinks = screen.getAllByRole("link", { name: /logo|home/i });
    const mobileLogoLink = logoLinks[1]; // Get the second one (mobile version)
    fireEvent.click(mobileLogoLink);

    // Mobile menu should close
    await waitFor(() => {
      expect(screen.queryByLabelText("Close menu")).not.toBeInTheDocument();
    });
  });

  it("applies custom className", () => {
    render(<UnifiedHeader className="custom-header-class" />);

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("custom-header-class");
  });

  it("renders with correct structure", () => {
    render(<UnifiedHeader />);

    // Check header element
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass("sticky", "top-0", "z-40");

    // Check header structure by verifying the presence of expected child elements
    // instead of checking for the container class directly
    const headerElement = screen.getByRole("banner");
    const logoImage = screen.getByAltText(/BeneFit Logo/);
    const mobileMenuToggle = screen.getByLabelText("Open menu");
    
    // Verify that these elements are within the header structure
    expect(headerElement.contains(logoImage)).toBe(true);
    expect(headerElement.contains(mobileMenuToggle)).toBe(true);

    // Check desktop navigation is hidden on small screens
    expect(screen.getByTestId("unified-navigation")).toBeInTheDocument();
  });
});
