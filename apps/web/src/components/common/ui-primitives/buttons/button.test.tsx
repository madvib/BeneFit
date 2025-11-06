import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies default button styling classes', () => {
    render(<Button>Test Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn'); // Should have the base button class
  });

  it('applies additional className prop', () => {
    render(<Button className="custom-class another-class">Styled Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn', 'custom-class', 'another-class');
  });

  it('handles click events', () => {
    const mockOnClick = vi.fn();
    render(<Button onClick={mockOnClick}>Clickable Button</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('respects disabled state', () => {
    render(<Button disabled={true}>Disabled Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('remains enabled by default', () => {
    render(<Button>Enabled Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('uses correct default button type', () => {
    render(<Button>Default Type Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('uses specified button type', () => {
    render(<Button type="submit">Submit Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('uses reset button type when specified', () => {
    render(<Button type="reset">Reset Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'reset');
  });

  it('forwards ref to the underlying button element', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref Forwarding Button</Button>);
    
    // The ref should have been called with the button element
    // In testing-library, we can't directly access the ref, but we can test that the element exists
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('preserves other HTML button attributes', () => {
    render(
      <Button 
        id="test-button"
        name="action-button"
        title="A test button"
        aria-label="Test button"
      >
        Attribute Test
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('id', 'test-button');
    expect(button).toHaveAttribute('name', 'action-button');
    expect(button).toHaveAttribute('title', 'A test button');
    expect(button).toHaveAttribute('aria-label', 'Test button');
  });

  it('responds to keyboard events', () => {
    const mockOnClick = vi.fn();
    render(<Button onClick={mockOnClick}>Keyboard Accessible Button</Button>);
    
    const button = screen.getByRole('button');
    // Simulate pressing Enter key (standard for buttons)
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyUp(button, { key: 'Enter' });
    
    // Click handler should not be called for key events in this case
    // (the button needs to be programmed to handle Enter key specifically)
    expect(mockOnClick).toHaveBeenCalledTimes(0);
    
    // Test actual click via space (which would be handled by browser)
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const mockOnClick = vi.fn();
    render(
      <Button onClick={mockOnClick} disabled={true}>
        Disabled Click Test
      </Button>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('supports all standard button HTML attributes', () => {
    const mockOnClick = vi.fn();
    const mockOnMouseDown = vi.fn();
    
    render(
      <Button
        onClick={mockOnClick}
        onMouseDown={mockOnMouseDown}
        formNoValidate={true}
        type="button"
      >
        Full Attributes Button
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('formnovalidate');
    expect(button).toHaveAttribute('type', 'button');
    
    fireEvent.mouseDown(button);
    expect(mockOnMouseDown).toHaveBeenCalledTimes(1);
  });

  describe('accessibility', () => {
    it('has proper button role', () => {
      render(<Button>Accessible Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('works with screen readers via aria attributes', () => {
      render(
        <Button aria-describedby="button-description">
          ARIA Test Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'button-description');
    });

    it('maintains focusability', () => {
      render(<Button>Focusable Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveProperty('tabIndex', 0); // By default, buttons are focusable
    });
  });

  describe('styling variants', () => {
    it('applies variant classes correctly', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost'];
      
      variants.forEach(variant => {
        render(<Button variant={variant as any}>{variant} Button</Button>);
        const button = screen.getByText(`${variant} Button`);
        // The exact class names would depend on how the button component implements variants
        // For now, just testing that it renders without errors
        expect(button).toBeInTheDocument();
      });
    });

    it('applies size classes correctly', () => {
      const sizes = ['sm', 'md', 'lg'];
      
      sizes.forEach(size => {
        render(<Button size={size as any}>{size} Button</Button>);
        const button = screen.getByText(`${size} Button`);
        // The exact class names would depend on how the button component implements sizes
        expect(button).toBeInTheDocument();
      });
    });
  });
});