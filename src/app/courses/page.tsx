import CoursesSection from "@/components/CoursesSection/CoursesSection";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Page | Free Next.js Template for Startup and SaaS",
  description: "This is Contact Page for Startup Nextjs Template",
  // other metadata
};

const CoursesPage = () => {
  return (
    <>

      <CoursesSection />
    </>
  );
};

export default CoursesPage;
