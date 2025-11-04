import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LogoutButton } from './logout-button';

// Mock the signOut function
vi.mock('@/app/(auth)/actions', () => ({
  signOut: vi.fn(() => Promise.resolve()),
}));

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default variant', () => {
    render(<LogoutButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('w-full'); // default variant should have w-full class
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument(); // LogOut icon
  });

  it('renders with ghost variant', () => {
    render(<LogoutButton variant="ghost" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-ghost');
    expect(button).not.toHaveClass('w-full'); // ghost variant should not have w-full
  });

  it('applies className prop', () => {
    render(<LogoutButton className="custom-class" />);

    const form = screen.getByTestId('logout-form');
    expect(form).toHaveClass('custom-class');
  });

  it('calls signOut when clicked', async () => {
    const importedModule = await import('@/app/(auth)/actions');
    const { signOutAction } = importedModule;

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(signOutAction).toHaveBeenCalledTimes(1);
    });
  });

  it('shows loading state when signing out', async () => {
    // Mock a slow signOut function
    const importedModule = await import('@/app/(auth)/actions');
    vi.mocked(importedModule.signOutAction).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 10)),
    );

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Wait for state update to happen
    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    expect(screen.getByText('Signing out...')).toBeInTheDocument();
  });

  it('shows error message in console when signOut fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock signOut to throw an error
    const importedModule2 = await import('@/app/(auth)/actions');
    vi.mocked(importedModule2.signOutAction).mockRejectedValue(
      new Error('Network error'),
    );

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error signing out:',
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });
});
