

import { Button } from '@/lib/components';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'tanstack-theme-kit';
import { useHydrated } from '@/lib/hooks/use-hydrated';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const hydrated = useHydrated();

  return hydrated ? (
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
