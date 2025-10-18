import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/auth/SessionProvider';
import { createClient } from '@/lib/supabase/server';
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bene',
  description: 'Your personal wellness coach',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
           <ThemeProvider>

        <SessionProvider serverSession={user}>
          {children}
        </SessionProvider>
           </ThemeProvider>
      </body>
    </html>
  );
}
