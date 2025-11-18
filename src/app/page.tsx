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
export const metadata: Metadata = {
  title: "NLIT | Empowering Future Innovators, Today!",
  description:
    "Technology training, certification, internship programs and real-world skills development at Nexgen Learning Institute of Technology (NLIT).",
};

export default function Home() {
  return (
    <>
      <ScrollUp />

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Announcement / Offer Banner */}

      {/* 3. Key Features of NLIT */}
      <Features />

      {/* 4. Company Intro Video */}
      <Video />

      {/* 5. Strategic Partners */}
      <Brands />

      {/* 6. About the Company (History, Mission, Vision) */}
      <AboutSectionOne />

      {/* 7. Importance of Courses, Skill Focus */}
      <AboutSectionTwo />

      <HiringSection />

      {/* 8. Internship Program Details */}
      <InternshipProgram />

      {/* 9. Course Enrollment Instructions */}
      <CourseEnrollment />

      {/* 10. Sample Certificate & Benefits */}
      <CertificateInfo />

      {/* 11. Testimonials / Student Feedback */}
      <Testimonials />

      {/* 12. Course Pricing (Optional, only if public) */}
      {/* <Pricing /> */}

      {/* 13. Frequently Asked Questions (Optional) */}
      <FAQ />

      {/* 14. Contact Info */}
      <Contact />
    </>
  );
}
