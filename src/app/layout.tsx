import { Inter } from "next/font/google";
import { Metadata } from "next";
import Script from "next/script";
import { Providers } from "./providers";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import "../styles/index.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | NLITedu",
    default: "NLITedu | Empowering Future Innovators, Today!",
  },
  description:
    "Technology training, certification, internship programs and real-world skills development at Nexgen Learning Institute of Technology (NLIT).",
  keywords: ["NLIT", "Technology Training", "Internships", "Certifications", "Workshops", "Tech Education"],
  openGraph: {
    title: "NLITedu | Nexgen Learning Institute of Technology",
    description: "Technology training, certification, internship programs and real-world skills development.",
    url: "https://nlitedu.com",
    siteName: "NLITedu",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
