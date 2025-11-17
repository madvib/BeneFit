'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import Button from '@/components/common/ui-primitives/buttons/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid rendering theme-dependent UI on the server
    return (
      <Button aria-label="Toggle theme">
        <div className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun data-testid="theme-icon" className="h-5 w-5" />
      ) : (
        <Moon data-testid="theme-icon" className="h-5 w-5" />
      )}
    </Button>
  );
}
