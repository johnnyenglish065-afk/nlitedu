import CoursesSection from "@/components/CoursesSection/CoursesSection";
import TrendingCourses from "@/components/TrendingCourses/TrendingCourses";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Courses & Certifications",
  description: "Browse our extensive catalog of professional tech courses and industry-recognized certifications at NLITedu.",
};

const CoursesPage = () => {
  return (
    <div className="pt-24 lg:pt-28 dark:bg-gray-950">
      <TrendingCourses />
      <CoursesSection />
    </div>
  );
};

export default CoursesPage;
