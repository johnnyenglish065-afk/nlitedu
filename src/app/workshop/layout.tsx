import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Workshops | NLITedu",
  description: "Accelerate your career with our short-term, intensive technical workshops. Hands-on projects, expert trainers, and certificates.",
};

export default function WorkshopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
