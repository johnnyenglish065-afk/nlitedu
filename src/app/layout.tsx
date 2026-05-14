// app/layout.tsx (or app/layout.jsx)

"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import WelcomeAnimation from "@/components/Common/WelcomeAnimation";
import AppDownloadPopup from "@/components/AppDownloadPopup";
import { Inter } from "next/font/google";
// @ts-ignore: allow side-effect import of global CSS (global stylesheet)
import "../styles/index.css";
import { Providers } from "./providers";
import { usePathname } from "next/navigation";
import Script from "next/script";

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
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="beforeInteractive" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7082934973695027"
          crossorigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
          {showWelcome ? (
            <WelcomeAnimation />
          ) : (
            <>
              {/* Only show website header/footer if NOT in admin dashboard */}
              {!pathname?.startsWith("/admin") && <Header />}
              {children}
              {!pathname?.startsWith("/admin") && <Footer />}
              <ScrollToTop />
              <AppDownloadPopup />
            </>
          )}
        </Providers>
      </body>
    </html>
  );
}
