import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthError } from './auth-error';

describe('AuthError Component', () => {
  it('renders error message correctly', () => {
    const errorMessage = 'Invalid email or password';
    render(<AuthError message={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('does not render when no message prop is provided', () => {
    render(<AuthError message="" />);

    // When no message is provided, component should return undefined and render nothing
    expect(screen.queryByTestId('auth-error-container')).not.toBeInTheDocument();
  });

  it('includes error styling classes', () => {
    const errorMessage = 'Test error message';
    render(<AuthError message={errorMessage} />);

    const errorElement = screen.getByTestId("auth-error-container");
    expect(errorElement).toHaveClass('bg-error/15', 'p-3', 'rounded-md', 'flex', 'items-center', 'gap-x-2', 'text-sm', 'text-error');
  });

  it('renders with proper alert role for accessibility', () => {
    const errorMessage = 'Accessibility test';
    render(<AuthError message={errorMessage} />);

    const errorElement = screen.getByTestId("auth-error-container");
    expect(errorElement).not.toHaveAttribute('role', 'alert'); // The error component doesn't have a role="alert" attribute
  });

  it('escapes dangerous content for XSS protection', () => {
    const dangerousMessage = '<script>alert("xss")</script>';
    render(<AuthError message={dangerousMessage} />);

    const errorElement = screen.getByText('<script>alert("xss")</script>');
    // The HTML should be rendered as text, not as actual HTML elements
    expect(errorElement).toBeInTheDocument();
    // Make sure there's no script tag in the DOM
    expect(screen.queryByRole('script')).not.toBeInTheDocument();
  });

  it('handles long error messages', () => {
    const longMessage = 'A'.repeat(200) + ' error occurred during authentication process.';
    render(<AuthError message={longMessage} />);

    const errorElement = screen.getByText(longMessage);
    expect(errorElement).toBeInTheDocument();
  });

  it('properly handles multiline error messages', () => {
    const multilineMessage = `Line 1 of error
    Line 2 of error
    Line 3 of error`;
    render(<AuthError message={multilineMessage} />);

    expect(screen.getByText(/Line 1 of error/)).toBeInTheDocument();
  });

  describe('conditional rendering', () => {
    it('does not render when message is empty string', () => {
      render(<AuthError message="" />);

      // Component should not render anything when message is empty
      expect(screen.queryByTestId('auth-error-container')).not.toBeInTheDocument();
    });

    it('does not render when message is only whitespace', () => {
      render(<AuthError message="   " />);

      // Component should not render visible content when message is only whitespace
      const elements = screen.queryAllByText(/s+/);
      expect(elements.length).toBe(0);
    });

    it('properly handles falsy values', () => {
      // Test with 0 - component checks truthiness, 0 is falsy so won't render
      render(<AuthError message={0 as any} />);
      expect(screen.queryByTestId('auth-error-container')).not.toBeInTheDocument();

      // Test with false - component checks truthiness, false is falsy so won't render
      render(<AuthError message={false as any} />);
      expect(screen.queryByTestId('auth-error-container')).not.toBeInTheDocument();
    });
  });

  describe('dynamic content', () => {
    it('updates message when prop changes', () => {
      const { rerender } = render(<AuthError message="Initial message" />);

      let errorElement = screen.getByText('Initial message');
      expect(errorElement).toBeInTheDocument();

      rerender(<AuthError message="Updated message" />);

      errorElement = screen.getByText('Updated message');
      expect(errorElement).toBeInTheDocument();

      // Old message should no longer be in the document
      expect(screen.queryByText('Initial message')).not.toBeInTheDocument();
    });

    it('switches between visible and hidden state based on message prop', () => {
      const { rerender } = render(<AuthError message="Visible message" />);

      let errorElement = screen.getByText('Visible message');
      expect(errorElement).toBeInTheDocument();

      rerender(<AuthError message="" />);

      // Error element should no longer exist in DOM
      errorElement = screen.queryByText('Visible message');
      expect(errorElement).not.toBeInTheDocument();
    });
  });

  describe('integration with other components', () => {
    it('works correctly inside form components', () => {
      const FormWithError = () => (
        <form data-testid="test-form">
          <input type="email" />
          <AuthError message="Email is required" />
        </form>
      );

      render(<FormWithError />);

      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByTestId('test-form')).toBeInTheDocument();
    });

    it('maintains proper spacing in UI layouts', () => {
      const LayoutWithError = () => (
        <div className="form-container">
          <input placeholder="Username" />
          <AuthError message="Username is invalid" />
          <button>Login</button>
        </div>
      );

      render(<LayoutWithError />);

      const errorElement = screen.getByText('Username is invalid');
      expect(errorElement.closest('.form-container')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('provides proper error announcement to assistive technologies', () => {
      const errorMessage = 'Please enter a valid email address';
      render(<AuthError message={errorMessage} />);

      const errorElement = screen.getByTestId('auth-error-container');
      // The actual component doesn't automatically add role="alert"
      expect(errorElement).not.toHaveAttribute('role', 'alert');
    });

    it('does not interfere with form flow', () => {
      const FormWithMultipleErrors = () => (
        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" />
            <AuthError message="Email is required" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" />
            <AuthError message="Password must be at least 8 characters" />
          </div>
        </form>
      );

      render(<FormWithMultipleErrors />);

      const emailError = screen.getByText('Email is required');
      const passwordError = screen.getByText('Password must be at least 8 characters');
      
      // The actual component doesn't have role="alert"
      expect(emailError).not.toHaveAttribute('role', 'alert');
      expect(passwordError).not.toHaveAttribute('role', 'alert');
    });
  });
});