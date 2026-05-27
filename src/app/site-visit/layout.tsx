import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industrial Site Visits | Engineering Training | NLITedu",
  description: "Experience real-world engineering with our industrial site visits. Explore Electrical, Automobile, Leather, and Chemical engineering plants. Gain practical exposure and enhance your career.",
  keywords: "Site Visit, Industrial Visit, Engineering Training, Electrical Engineering, Automobile Engineering, Leather Engineering, Chemical Engineering, NLITedu",
  alternates: {
    canonical: "https://nlitedu.com/site-visit",
  },
};

export default function SiteVisitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
