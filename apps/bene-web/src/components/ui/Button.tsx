'use client';

import { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
};

export default function Button({ children, onClick, className, type = 'button' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${className}`}
    >
      {children}
    </button>
  );
}
