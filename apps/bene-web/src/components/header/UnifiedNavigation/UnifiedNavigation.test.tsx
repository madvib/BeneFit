import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UnifiedNavigation } from "./UnifiedNavigation";

// Mock child components to avoid deep integration issues
vi.mock("@/components/ui/ThemeToggle/ThemeToggle", () => ({
  ThemeToggle: vi.fn(() => (
    <button data-testid="theme-toggle">Theme Toggle</button>
  )),
}));
vi.mock("@/components", async () => {
  const actual = await vi.importActual("@/components");
  return {
    ...actual,
    AccountDropdown: vi.fn(() => (
      <div data-testid="account-dropdown">Account Dropdown</div>
    )),
  };
});
vi.mock("@/components/account/AccountDropdownContent/AccountDropdownContent", () => ({
  default: vi.fn(({ showThemeToggle, showLogoutButton }) => (
    <div data-testid="account-dropdown-content">
      {showThemeToggle && (
        <span data-testid="theme-toggle-in-dropdown">Theme Toggle</span>
      )}
      {showLogoutButton && <span data-testid="logout-button">Logout</span>}
    </div>
  )),
}));

describe("UnifiedNavigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Marketing variant", () => {
    it("renders marketing navigation links for logged-out users", () => {
      render(<UnifiedNavigation variant="marketing" isLoggedIn={false} />);

      expect(screen.getByText("Features")).toBeInTheDocument();
      expect(screen.getByText("Blog")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Login")).toBeInTheDocument();
      expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });

    it("renders marketing navigation links and dashboard link for logged-in users", () => {
      render(<UnifiedNavigation variant="marketing" isLoggedIn={true} />);

      expect(screen.getByText("Features")).toBeInTheDocument();
      expect(screen.getByText("Blog")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByTestId("account-dropdown")).toBeInTheDocument();
    });

    it("does not show dashboard links for marketing variant even when logged in", () => {
      render(<UnifiedNavigation variant="marketing" isLoggedIn={true} />);

      expect(screen.queryByText("Feeds")).not.toBeInTheDocument();
      expect(screen.queryByText("History")).not.toBeInTheDocument();
    });
  });

  describe("Dashboard variant", () => {
    it("renders dashboard navigation links for logged-in users", () => {
      render(<UnifiedNavigation variant="dashboard" isLoggedIn={true} />);

      expect(screen.getByText("Feeds")).toBeInTheDocument();
      expect(screen.getByText("History")).toBeInTheDocument();
      expect(screen.getByText("Goals")).toBeInTheDocument();
      expect(screen.getByText("Plan")).toBeInTheDocument();
      expect(screen.getByText("Coach")).toBeInTheDocument();
      expect(screen.getByTestId("account-dropdown")).toBeInTheDocument();
    });

    it("does not render dashboard links for logged-out users", () => {
      render(<UnifiedNavigation variant="dashboard" isLoggedIn={false} />);

      expect(screen.queryByText("Feeds")).not.toBeInTheDocument();
      expect(screen.queryByText("History")).not.toBeInTheDocument();
      expect(screen.queryByText("Goals")).not.toBeInTheDocument();
      expect(screen.queryByText("Plan")).not.toBeInTheDocument();
      expect(screen.queryByText("Coach")).not.toBeInTheDocument();
    });
  });

  describe("User variant", () => {
    it("does not show marketing or dashboard links for user variant", () => {
      render(<UnifiedNavigation variant="user" isLoggedIn={true} />);

      expect(screen.queryByText("Features")).not.toBeInTheDocument();
      expect(screen.queryByText("Feeds")).not.toBeInTheDocument();
    });
  });

  describe("Mobile view", () => {
    it("renders mobile navigation with large text", () => {
      render(
        <UnifiedNavigation
          variant="marketing"
          isLoggedIn={true}
          isMobile={true}
        />,
      );

      const dashboardLink = screen.getByText("Dashboard");
      expect(dashboardLink).toHaveClass("text-2xl");
    });

    it("renders AccountDropdownContent instead of AccountDropdown in mobile view", () => {
      render(
        <UnifiedNavigation
          variant="marketing"
          isLoggedIn={true}
          isMobile={true}
        />,
      );

      expect(
        screen.getByTestId("account-dropdown-content"),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("account-dropdown")).not.toBeInTheDocument();
    });

    it("calls onClose when navigation item is clicked in mobile view", () => {
      const mockOnClose = vi.fn();
      render(
        <UnifiedNavigation
          variant="marketing"
          isLoggedIn={true}
          isMobile={true}
          onClose={mockOnClose}
        />,
      );

      fireEvent.click(screen.getByText("Dashboard"));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Auth section", () => {
    it("shows login and signup buttons for logged-out users", () => {
      render(<UnifiedNavigation variant="marketing" isLoggedIn={false} />);

      expect(screen.getByText("Login")).toBeInTheDocument();
      expect(screen.getByText("Sign Up")).toBeInTheDocument();
      expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    });

    it("shows account dropdown for logged-in users", () => {
      render(<UnifiedNavigation variant="marketing" isLoggedIn={true} />);

      expect(screen.getByTestId("account-dropdown")).toBeInTheDocument();
      expect(screen.queryByText("Login")).not.toBeInTheDocument();
      expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
    });
  });
});
