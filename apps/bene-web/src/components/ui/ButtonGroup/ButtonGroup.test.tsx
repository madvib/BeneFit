import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import ButtonGroup from './ButtonGroup';
import Button from '../Button/Button';

describe('ButtonGroup', () => {
  it('renders children correctly', () => {
    render(
      <ButtonGroup>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    );

    expect(screen.getByText('Button 1')).toBeInTheDocument();
    expect(screen.getByText('Button 2')).toBeInTheDocument();
  });

  it('applies className prop', () => {
    render(
      <ButtonGroup className="custom-class">
        <Button>Button</Button>
      </ButtonGroup>
    );

    // Find by test ID or by specific class that identifies the ButtonGroup container
    const buttonGroup = screen.getByTestId('button-group');
    expect(buttonGroup).toHaveClass('custom-class');
  });

  it('applies correct alignment classes', () => {
    const {rerender} = render(
      <ButtonGroup align="left" data-testid="button-group">
        <Button>Button</Button>
      </ButtonGroup>
    );

    expect(screen.getByTestId('button-group')).toHaveClass('justify-start');

    rerender(
      <ButtonGroup align="center" data-testid="button-group">
        <Button>Button</Button>
      </ButtonGroup>
    );

    expect(screen.getByTestId('button-group')).toHaveClass('justify-center');

    rerender(
      <ButtonGroup align="right" data-testid="button-group">
        <Button>Button</Button>
      </ButtonGroup>
    );

    expect(screen.getByTestId('button-group')).toHaveClass('justify-end');
  });

  it('defaults to left alignment', () => {
    render(
      <ButtonGroup data-testid="button-group">
        <Button>Button</Button>
      </ButtonGroup>
    );

    expect(screen.getByTestId('button-group')).toHaveClass('justify-start');
  });
});
