import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card';
import Button from '../buttons/Button';

describe('Card', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <div>Card content</div>
      </Card>,
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Card title="Test Title">Content</Card>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('does not render title container when no title is provided', () => {
    render(<Card>Content</Card>);
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(<Card actions={<Button>Action</Button>}>Content</Card>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies className prop', () => {
    render(
      <Card className="custom-class" data-testid="card">
        Content
      </Card>,
    );
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-class');
  });

  it('applies titleClassName prop', () => {
    render(
      <Card title="Test Title" titleClassName="custom-title-class">
        Content
      </Card>,
    );
    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('custom-title-class');
  });

  it('shows both title and actions when provided', () => {
    render(
      <Card title="Test Title" actions={<Button>Action</Button>}>
        Content
      </Card>,
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
