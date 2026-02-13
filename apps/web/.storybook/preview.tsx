import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { handlers } from '@bene/react-api-client/test';
import { initializeApiClients } from '@bene/react-api-client';
import { ThemeProvider } from '../src/lib/providers/theme-provider';
import { UIProvider } from '../src/lib/providers/ui-context';
import '../src/styles.css';
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
  createRootRoute,
} from '@tanstack/react-router';
import { useMemo } from 'react';

// Initialize API clients for Storybook
initializeApiClients({
  baseUrl: 'http://localhost:8787', // Mock base URL for Storybook
});

// Initialize MSW with default handlers for all stories (only in browser)
if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
  initialize({
    onUnhandledRequest: 'bypass', // Don't warn for unhandled requests
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#09090b' }, // matches zinc-950/background
        { name: 'light', value: '#ffffff' },
      ],
    },
    // Default MSW handlers for all stories
    msw: {
      handlers,
    },
  },
  loaders: [mswLoader], // Enable MSW loader
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => {
      const router = useMemo(() => {
        const rootRoute = createRootRoute({
          component: () => <Story />,
        });
        return createRouter({
          routeTree: rootRoute,
          history: createMemoryHistory(),
        });
      }, []);

      return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <UIProvider>
            <QueryClientProvider client={queryClient}>
              <RouterProvider router={router} />
            </QueryClientProvider>
          </UIProvider>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
