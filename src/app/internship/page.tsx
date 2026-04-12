import Breadcrumb from "@/components/Common/Breadcrumb";
import CourseEnrollment from "@/components/CourseEnrollment";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Internship Opportunities | Gain Real-World Experience",
  description:
    "Explore our internship programs designed to provide hands-on experience and skill development for aspiring professionals.",
  // other metadata
};

const InternshipPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Internship"
        description="Join our internship programs to gain valuable real-world experience, develop professional skills, and kickstart your career in a dynamic and supportive environment."
      />

      <CourseEnrollment />
    </>
  );
};

export default InternshipPage;
