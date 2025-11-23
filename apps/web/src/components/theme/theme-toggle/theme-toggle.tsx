'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components';
import { useEffect, useRef } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  if (!mounted) {
    // Avoid rendering theme-dependent UI on the server
    return (
      <Button aria-label="Toggle theme" variant={'ghost'}>
        <div className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
      variant={'ghost'}
    >
      {theme === 'dark' ? (
        <Sun data-testid="theme-icon" className="text-muted-foreground h-5 w-5" />
      ) : (
        <Moon data-testid="theme-icon" className="text-muted-foreground h-5 w-5" />
      )}
    </Button>
  );
}
