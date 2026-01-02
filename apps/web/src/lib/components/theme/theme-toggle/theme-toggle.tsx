'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/lib/components';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return mounted ? (
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
  ) : (
    <Button aria-label="Toggle theme" variant={'ghost'}>
      <div className="h-5 w-5" />
    </Button>
  );
}
