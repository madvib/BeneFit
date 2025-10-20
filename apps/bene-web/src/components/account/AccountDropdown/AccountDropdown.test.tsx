import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AccountDropdown from "./AccountDropdown";

// Mock AccountDropdownContent
vi.mock("../AccountDropdownContent/AccountDropdownContent", () => ({
  default: vi.fn(({ showThemeToggle, showLogoutButton }) => (
    <div data-testid="account-dropdown-content">
      {showThemeToggle && <span data-testid="theme-toggle">Theme</span>}
      {showLogoutButton && <span data-testid="logout">Logout</span>}
    </div>
  )),
}));

describe("AccountDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any event listeners that might have been added
    document.removeAllListeners?.(); // This is just a safety call since DOM cleanup happens automatically
  });

  it("renders nothing when user is not logged in", () => {
    render(<AccountDropdown isLoggedIn={false} />);

    expect(screen.queryByLabelText("Account menu")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("account-dropdown-content"),
    ).not.toBeInTheDocument();
  });

  it("renders account button when user is logged in", () => {
    render(<AccountDropdown isLoggedIn={true} />);

    const accountButton = screen.getByLabelText("Account menu");
    expect(accountButton).toBeInTheDocument();
    expect(accountButton).toHaveAttribute("aria-label", "Account menu");
    expect(accountButton).toHaveAttribute("aria-expanded", "false");
  });

  it("opens dropdown when account button is clicked", () => {
    render(<AccountDropdown isLoggedIn={true} />);

    const accountButton = screen.getByLabelText("Account menu");
    fireEvent.click(accountButton);

    expect(accountButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByTestId("account-dropdown-content")).toBeInTheDocument();
  });

  it("closes dropdown when account button is clicked again", () => {
    render(<AccountDropdown isLoggedIn={true} />);

    const accountButton = screen.getByLabelText("Account menu");

    // Open dropdown
    fireEvent.click(accountButton);
    expect(accountButton).toHaveAttribute("aria-expanded", "true");

    // Close dropdown
    fireEvent.click(accountButton);
    expect(accountButton).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByTestId("account-dropdown-content"),
    ).not.toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", async () => {
    render(<AccountDropdown isLoggedIn={true} />);

    // Get the first button instance (since multiple test renders may create multiple buttons)
    const accountButtons = screen.getAllByLabelText("Account menu");
    const accountButton = accountButtons[0];

    // Open dropdown
    fireEvent.click(accountButton);
    expect(accountButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByTestId("account-dropdown-content")).toBeInTheDocument();

    // Click outside the dropdown
    fireEvent.mouseDown(document.body);

    // Wait for the event listener to process the click
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Get buttons again after the click event
    const updatedButtons = screen.getAllByLabelText("Account menu");
    const updatedButton = updatedButtons[0];

    expect(updatedButton).toHaveAttribute("aria-expanded", "false");
  });

  it("renders AccountDropdownContent with correct props when open", () => {
    render(<AccountDropdown isLoggedIn={true} />);

    const accountButton = screen.getByLabelText("Account menu");
    fireEvent.click(accountButton);

    expect(screen.getByTestId("account-dropdown-content")).toBeInTheDocument();
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("logout")).toBeInTheDocument();
  });

  it("has correct button styling", () => {
    render(<AccountDropdown isLoggedIn={true} />);

    const accountButton = screen.getByLabelText("Account menu");
    expect(accountButton).toHaveClass(
      "btn",
      "btn-ghost",
      "rounded-full",
      "p-2",
    );
  });
});
