import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Hackacode",
  description: "Maybe the best web app ever built"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{
      background: 'linear-gradient(194deg, rgba(0, 0, 0, 0.00) 66.72%, rgba(0, 0, 0, 0.14) 99.56%), rgba(14, 23, 30, 0.90)'
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
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
