import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LogoutButton } from './logout-button';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

// Mock the getAuthClient function
const mockGetAuthClient = vi.fn();
vi.mock('@bene/react-api-client', () => ({
  getAuthClient: mockGetAuthClient,
}));

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default variant', () => {
    const signOutMutation = { mutateAsync: vi.fn(), isPending: false };
    const mockAuthClient = {
      signOut: {
        use: () => signOutMutation,
      }
    };
    mockGetAuthClient.mockReturnValue(mockAuthClient);

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('w-full'); // default variant should have w-full class
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument(); // LogOut icon
  });

  it('renders with ghost variant', () => {
    const signOutMutation = { mutateAsync: vi.fn(), isPending: false };
    const mockAuthClient = {
      signOut: {
        use: () => signOutMutation,
      }
    };
    mockGetAuthClient.mockReturnValue(mockAuthClient);

    render(<LogoutButton variant="ghost" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-ghost');
    expect(button).not.toHaveClass('w-full'); // ghost variant should not have w-full
  });

  it('applies className prop', () => {
    const signOutMutation = { mutateAsync: vi.fn(), isPending: false };
    const mockAuthClient = {
      signOut: {
        use: () => signOutMutation,
      }
    };
    mockGetAuthClient.mockReturnValue(mockAuthClient);

    render(<LogoutButton className="custom-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('calls signOut when clicked', async () => {
    const signOutMock = vi.fn().mockResolvedValue({});
    const signOutMutation = { mutateAsync: signOutMock, isPending: false };
    const mockAuthClient = {
      signOut: {
        use: () => signOutMutation,
      }
    };
    mockGetAuthClient.mockReturnValue(mockAuthClient);

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalledTimes(1);
    });
  });

  it('shows loading state when signing out', async () => {
    const signOutMutation = { mutateAsync: vi.fn(), isPending: true };
    const mockAuthClient = {
      signOut: {
        use: () => signOutMutation,
      }
    };
    mockGetAuthClient.mockReturnValue(mockAuthClient);

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(screen.getByText('Signing out...')).toBeInTheDocument();
  });

  it('shows error message in console when signOut fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const signOutMock = vi.fn().mockRejectedValue(new Error('Network error'));
    const signOutMutation = { mutateAsync: signOutMock, isPending: false };
    const mockAuthClient = {
      signOut: {
        use: () => signOutMutation,
      }
    };
    mockGetAuthClient.mockReturnValue(mockAuthClient);

    render(<LogoutButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error signing out:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});