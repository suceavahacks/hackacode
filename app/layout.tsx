import { ThemeProvider } from "next-themes";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
