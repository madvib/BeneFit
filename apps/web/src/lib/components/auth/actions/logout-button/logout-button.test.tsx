import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LogoutButton } from './logout-button';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

// Mock authClient
const mockAuthClient = {
  signOut: vi.fn().mockResolvedValue({ error: null }),
};
vi.mock('@bene/react-api-client', () => ({
  authClient: mockAuthClient,
}));

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default variant', () => {
    render(<LogoutButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
  });

  it('renders with ghost variant', () => {
    render(<LogoutButton variant="ghost" />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('applies className prop', () => {
    render(<LogoutButton className="custom-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('calls signOut when clicked', async () => {
    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAuthClient.signOut).toHaveBeenCalledTimes(1);
    });
  });

  it('shows loading state when signing out', async () => {
    // Temporarily mock signOut to simulate pending state
    mockAuthClient.signOut.mockImplementationOnce(() => new Promise(() => {})); // Never resolves

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(screen.getByText('Signing out...')).toBeInTheDocument();
  });

  it('shows error message in console when signOut fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockAuthClient.signOut.mockRejectedValueOnce(new Error('Network error'));

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error signing out:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
