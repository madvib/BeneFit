import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/presentation/auth/session-provider";
import { createClient } from "@/infrastructure/supabase/server";
import { ThemeProvider } from "@/presentation/theme/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bene",
  description: "Your personal wellness coach",
};

export default async function RootLayout({
  modal,
  children,
}: Readonly<{
  modal: React.ReactNode;
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
          <SessionProvider serverSession={user!}>
            <div>{modal}</div>
            <div>{children}</div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
