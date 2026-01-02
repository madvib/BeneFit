'use client';

import { ReactNode, useState, useEffect } from 'react';

export default function HeaderRoot({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 border-b transition-all duration-300 ${scrolled ? 'bg-background/80 border-muted py-3 shadow-sm backdrop-blur-xl' : 'bg-background border-transparent py-5'} ${className} `}
    >
      <div className="relative flex w-full items-center justify-between px-4 md:px-6">
        {children}
      </div>
    </header>
  );
}
