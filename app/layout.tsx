"use client";

import { ThemeProvider } from "next-themes";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Loading } from "@/components/Loading";
import { useUser } from "@/utils/queries/user/getUser";


function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const router = useRouter();
  const { user, loading } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (user && isHomePage && mounted) {
      router.push("/app");
      return;
    }
  }, [user, isHomePage, router, mounted]);

  if (loading || !mounted) {
    return <Loading />;
  }

  return (
    <main className={`min-h-screen`}>
      <Navbar />
      {isHomePage && !user && (
        <div className="text-center mt-20 p-3 z-20 relative">
          <span className="text-[48px] font-extrabold">
            Code smarter. Solve harder.
            <span className="color" style={{ display: 'inline-block', textAlign: 'center' }}>
              Hackacode
              <img
                src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/715d41dacbd45c35484059b4e69dc02d5f71df28_line3.png"
                style={{ display: 'block', margin: '0 auto', width: '250px' }}
                alt="Line"
              />
            </span>
          </span>
          <img
            src={"https://hc-cdn.hel1.your-objectstorage.com/s/v3/877c50b3b3034492ed81b482ca015d55eb716a2b_terminal.png"}
            className="mx-auto mt-14 px-5"
            alt="Terminal"
          />
          <div className="flex flex-wrap justify-between items-center mt-16 container mx-auto mb-auto">
            <div className="w-full md:w-[50%] px-5">
              <p className="text-3xl text-left">
                What is{" "}
                <span
                  style={{
                    textDecoration: "underline",
                    textDecorationColor: "#FF865B",
                    textDecorationStyle: "wavy",
                    textUnderlineOffset: "4px",
                  }}
                  className="color"
                >
                  Hackacode
                </span>{" "}
                all 'bout?
              </p>
              <p className="text-left mt-5 text-lg">
                Hackacode is a platform meant to help you learn and practice coding in a
                <span
                  style={{
                    textDecoration: "underline",
                    textDecorationColor: "#FF865B",
                    textDecorationStyle: "wavy",
                    textUnderlineOffset: "4px",
                  }}
                  className="color"
                >
                  {" "}
                  fun and interactive way
                </span>
                . Whether you want to solve coding challenges, 1 vs 1 with your friends
                or just learn a new programming language, Hackacode is the place for you!
              </p>
              <div className="text-left mt-5 text-lg">
                <span className="text-2xl font-bold color">
                  What does Hackacode offer?
                </span>
                <ul className="list-disc list-inside mt-4 space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="color">✔</span>
                    <span>A wide range of coding challenges to solve</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="color">✔</span>
                    <span>A 1 vs 1 mode to challenge your friends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="color">✔</span>
                    <span>A leaderboard to see how you stack up against other users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="color">✔</span>
                    <span>An interactive IDE to write your code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="color">✔</span>
                    <span>A CLI that allows you to run your code in a terminal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="color">✔</span>
                    <span>AI powered code review to help you improve your code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="color">✔</span>
                    <span>Contests to compete with other users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="color">✔</span>
                    <span>Articles and tutorials to help you learn</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full md:w-[50%] px-5 mt-10 md:mt-0 flex justify-center">
              <img
                src={
                  "https://hc-cdn.hel1.your-objectstorage.com/s/v3/bba1dfde0cb6b3fe66319c947773ebd0ccca7af9_terminal.png"
                }
                className="w-full max-w-md md:max-w-full"
                alt="Picture of the web app"
              />
            </div>
          </div>
          <div className="flex flex-row justify-between items-center mt-10 container mx-auto max-md:flex-col">
            <div className="w-[100%] lg:text-left leading-none">
              <p className="font-extrabold text-[48px]">
                We know it's tough, but with
                <span className="color"> Hackacode</span>, we've made it simple and fun!
              </p>
            </div>
            <div className="w-[30%]">
              <img
                src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/e4a06e09270ddc83e06c3471a97c8701f7466efe_laptop_work.svg"
                alt="Laptop Work"
                className="w-full h-auto"
              />
            </div>
          </div>
          <div className="bg-accent my-20 container p-10 rounded-3xl mx-auto flex flex-wrap justify-between items-center text-black">
            <div className="w-full md:w-[50%] px-5 text-center md:text-left">
              <p className="text-4xl md:text-5xl lg:text-7xl font-bold">
                🤠 So, what are you waiting for? <br /> Join us and start coding today!
              </p>
            </div>

            <div className="w-full md:w-[50%] px-5 mt-10 md:mt-0 text-center md:text-left">
              <p className="text-lg md:text-2xl">
                <span className="text-2xl md:text-3xl font-bold">Sign up <br /></span>
                It would be our pleasure to have you on board! We are still in beta, so if you have any feedback, please let us know! We are always looking for ways to improve our platform and make it better for you.
              </p>
              <button className="btn btn-lg rounded-lg mt-6 bg-black text-white px-6 py-3 hover:bg-gray-800 transition-all">
                <a href="/signup" target="_blank" rel="noopener noreferrer">
                  Sign up now!
                </a>
              </button>
            </div>
          </div>
        </div>
      )}
      {user && <Sidebar />}
      {children}
    </main>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <html lang="en" suppressHydrationWarning style={{ overflowX: 'hidden' }}>
      <body className={`bg-primary text-foreground`}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppContent>{children}</AppContent>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}