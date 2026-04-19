import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In Page | NLITedu",
  description: "This is Sign In Page for NLITedu",
};

export default function SigninLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
