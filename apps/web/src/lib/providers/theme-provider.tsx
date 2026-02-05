import {
  ThemeProvider as TanstackThemeProvider,
  ThemeProviderProps,
} from "tanstack-theme-kit";

export function ThemeProvider({ children, ...properties }: ThemeProviderProps) {
  return (
    <TanstackThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...properties}
    >
      {children}
    </TanstackThemeProvider>
  );
}
