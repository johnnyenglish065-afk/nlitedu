import { Metadata } from "next";

import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Video from "@/components/Video";
import Brands from "@/components/Brands";

import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";

import InternshipProgram from "@/components/InternshipProgram";
import CourseEnrollment from "@/components/CourseEnrollment";
import CertificateInfo from "@/components/CertificateInfo";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ"; // Optional but recommended
import HiringSection from "@/components/Common/HiringSection";
import HomePage from "@/components/fontimage";
export const metadata: Metadata = {
  title: "NLIT | Empowering Future Innovators, Today!",
  description:
    "Technology training, certification, internship programs and real-world skills development at Nexgen Learning Institute of Technology (NLIT).",
};

export default function Home() {
  return (
    <>
      <ScrollUp />
    

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Announcement / Offer Banner */}

      {/* 4. Key Features of NLIT */}
      <Features />

      {/* 5. Company Intro Video */}
      <Video />

      {/* 6. Strategic Partners */}
      <Brands />
      
      {/* 7. About the Company (History, Mission, Vision) */}
      <AboutSectionOne />

      {/* 8. Importance of Courses, Skill Focus */}
      <AboutSectionTwo />

      <HiringSection />

      {/* 9. Internship Program Details */}
      <InternshipProgram />

      {/* 10. Course Enrollment Instructions */}
      <CourseEnrollment />

      {/* 11. Sample Certificate & Benefits */}
      <CertificateInfo />

      {/* 12. Testimonials / Student Feedback */}
      <Testimonials />

      {/* 13. Course Pricing (Optional, only if public) */}
      {/* <Pricing /> */}

      {/* 14. Frequently Asked Questions (Optional) */}
      <FAQ />

      {/* 15. Contact Info */}
      <Contact />
    </>
  );
}
