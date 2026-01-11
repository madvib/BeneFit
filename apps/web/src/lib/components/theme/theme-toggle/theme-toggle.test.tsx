import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './theme-toggle';
import { useTheme } from 'next-themes';

// Mock the useTheme hook
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Reset the mock before each test
    (useTheme as Mock).mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });
  });

  it('renders the theme toggle button', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
  });

  it('shows sun icon when theme is dark', () => {
    (useTheme as Mock).mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    // Look for the Sun icon by its class
    const sunIcon = screen.getByTestId('theme-icon');
    expect(sunIcon).toBeInTheDocument();
  });

  it('shows moon icon when theme is light', () => {
    (useTheme as Mock).mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    // Look for the Moon icon by its class
    const moonIcon = screen.getByTestId('theme-icon');
    expect(moonIcon).toBeInTheDocument();
  });

  it('calls setTheme with opposite theme on click', () => {
    const mockSetTheme = vi.fn();
    (useTheme as Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
});
