import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UserAccountMenu from './account-dropdown';

// Mock AccountDropdownContent with data-testid attributes for testing
vi.mock('../account-dropdown-content/account-dropdown-content', () => {
  return {
    default: ({
      showThemeToggle,
      showLogoutButton,
    }: {
      showThemeToggle: boolean;
      showLogoutButton: boolean;
    }) => (
      <div data-testid="account-dropdown-content">
        <a href="/account" className="block px-4 py-2 text-sm">
          Account
        </a>
        <a href="/profile" className="block px-4 py-2 text-sm">
          Profile
        </a>
        <a href="/connections" className="block px-4 py-2 text-sm">
          Connections
        </a>
        <a href="/settings" className="block px-4 py-2 text-sm">
          Settings
        </a>
        {showThemeToggle && (
          <div className="px-4 py-2 text-sm" data-testid="theme-toggle-container">
            <span>Theme</span>
            <button data-testid="theme-toggle">Theme Toggle</button>
          </div>
        )}
        {showLogoutButton && (
          <div className="w-full px-4 py-2" data-testid="logout-button-container">
            <button data-testid="logout-button">Logout</button>
          </div>
        )}
      </div>
    ),
  };
});

describe('AccountDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up any event listeners that might have been added
    document.removeAllListeners?.(); // This is just a safety call since DOM cleanup happens automatically
  });

  it('renders nothing when user is not logged in', () => {
    render(<UserAccountMenu isLoggedIn={false} />);

    expect(screen.queryByLabelText('Account menu')).not.toBeInTheDocument();
    expect(screen.queryByTestId('account-dropdown-content')).not.toBeInTheDocument();
  });

  it('renders account button when user is logged in', () => {
    render(<UserAccountMenu isLoggedIn={true} />);

    const accountButton = screen.getByLabelText('Account menu');
    expect(accountButton).toBeInTheDocument();
    expect(accountButton).toHaveAttribute('aria-label', 'Account menu');
    expect(accountButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens dropdown when account button is clicked', () => {
    render(<UserAccountMenu isLoggedIn={true} />);

    const accountButton = screen.getByLabelText('Account menu');
    fireEvent.click(accountButton);

    expect(accountButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('account-dropdown-content')).toBeInTheDocument();
  });

  it('closes dropdown when account button is clicked again', () => {
    render(<UserAccountMenu isLoggedIn={true} />);

    const accountButton = screen.getByLabelText('Account menu');

    // Open dropdown
    fireEvent.click(accountButton);
    expect(accountButton).toHaveAttribute('aria-expanded', 'true');

    // Close dropdown
    fireEvent.click(accountButton);
    expect(accountButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByTestId('account-dropdown-content')).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    render(<UserAccountMenu isLoggedIn={true} />);

    const accountButton = screen.getByLabelText('Account menu');

    // Open dropdown
    fireEvent.click(accountButton);
    expect(accountButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('account-dropdown-content')).toBeInTheDocument();

    // Click outside the dropdown
    fireEvent.mouseDown(document.body);

    // Wait for the event listener to process the click
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(accountButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders AccountDropdownContent with correct props when open', () => {
    render(<UserAccountMenu isLoggedIn={true} />);

    const accountButton = screen.getByLabelText('Account menu');
    fireEvent.click(accountButton);

    expect(screen.getByTestId('account-dropdown-content')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
  });

  it('has correct button styling', () => {
    render(<UserAccountMenu isLoggedIn={true} />);

    const accountButton = screen.getByLabelText('Account menu');
    expect(accountButton).toHaveClass('btn', 'btn-ghost', 'rounded-full', 'p-2');
  });
});
