import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up Page | NLITedu",
  description: "This is Sign Up Page for NLITedu",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
