import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../src/lib/components/theme/theme-provider';
import { UIProvider } from '../src/lib/providers/ui-context';
import '../src/app/globals.css';

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
    nextjs: {
      appDirectory: true,
    },
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
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <UIProvider>
          <QueryClientProvider client={queryClient}>
            <Story />
          </QueryClientProvider>
        </UIProvider>
      </ThemeProvider>
    ),
  ],
};

export default preview;
