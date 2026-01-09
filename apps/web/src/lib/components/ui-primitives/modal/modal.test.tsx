import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './modal';
import { useRouter } from 'next/navigation';

// Mock the useRouter hook
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('Modal', () => {
  beforeEach(() => {
    // Reset the mock before each test
    (useRouter as vi.MockedFunction<typeof useRouter>).mockReturnValue({
      back: vi.fn(),
    });
  });

  it('renders title and children correctly', () => {
    render(
      <Modal title="Test Modal">
        <div>Modal content</div>
      </Modal>,
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('renders close button with correct aria-label', () => {
    render(
      <Modal title="Test Modal">
        <div>Modal content</div>
      </Modal>,
    );

    const closeButton = screen.getByLabelText('Close modal');
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn();
    render(
      <Modal title="Test Modal" onClose={mockOnClose}>
        <div>Modal content</div>
      </Modal>,
    );

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('uses router.back when no onClose is provided', () => {
    const mockRouterBack = vi.fn();
    (useRouter as vi.MockedFunction<typeof useRouter>).mockReturnValue({
      back: mockRouterBack,
    });

    render(
      <Modal title="Test Modal">
        <div>Modal content</div>
      </Modal>,
    );

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    expect(mockRouterBack).toHaveBeenCalledTimes(1);
  });
});
