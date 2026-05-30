import CoursesSection from "@/components/CoursesSection/CoursesSection";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Courses & Certifications",
  description: "Browse our extensive catalog of professional tech courses and industry-recognized certifications at NLITedu.",
};

const CoursesPage = () => {
  return (
    <>

      <CoursesSection />
    </>
  );
};

export default CoursesPage;
