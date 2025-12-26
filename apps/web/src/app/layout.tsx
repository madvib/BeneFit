import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components';
import { Providers } from '@/providers/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bene',
  description: 'Your personal wellness coach',
};

export default async function RootLayout({
  modal,
  children,
}: Readonly<{
  modal: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Providers>
            <div>{modal}</div>
            <div>{children}</div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
