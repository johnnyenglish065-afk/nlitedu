// app/layout.tsx (or app/layout.jsx)

"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import WelcomeAnimation from "@/components/Common/WelcomeAnimation";
import { Inter } from "next/font/google";
import "../styles/index.css";
import { Providers } from "./providers";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showWelcome, setShowWelcome] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      setShowWelcome(false); // don’t show on subpages
      return;
    }
    const timer = setTimeout(() => setShowWelcome(false), 4000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
          {showWelcome ? (
            <WelcomeAnimation />
          ) : (
            <>
              <Header />
              {children}
              <Footer />
              <ScrollToTop />
            </>
          )}
        </Providers>
      </body>
    </html>
  );
}
