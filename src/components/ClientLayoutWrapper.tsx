"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import WelcomeAnimation from "@/components/Common/WelcomeAnimation";
import AppDownloadPopup from "@/components/AppDownloadPopup";

export default function ClientLayoutWrapper({
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

  if (showWelcome) {
    return <WelcomeAnimation />;
  }

  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {/* Only show website header/footer if NOT in admin dashboard */}
      {!isAdminRoute && <Header />}
      {children}
      {!isAdminRoute && <Footer />}
      <ScrollToTop />
      <AppDownloadPopup />
    </>
  );
}
