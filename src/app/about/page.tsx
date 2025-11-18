import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Empowering Innovation & Growth",
  description:
    "Learn more about our mission, vision, and the team driving innovation at our startup.",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About Us"
        description="We are dedicated to empowering innovators and entrepreneurs by providing cutting-edge technology solutions designed to fuel growth and success. Our team is passionate about delivering exceptional value and fostering a collaborative environment that drives innovation."
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};

export default AboutPage;
