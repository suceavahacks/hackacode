"use client";

import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const queryClient = new QueryClient();

  return (
    <html lang="en" suppressHydrationWarning style={{
      background: 'linear-gradient(194deg, rgba(0, 0, 0, 0.00) 66.72%, rgba(0, 0, 0, 0.14) 99.56%), rgba(14, 23, 30, 0.90)',
      overflowX: 'hidden',
    }}>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen">
            <Navbar />
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
