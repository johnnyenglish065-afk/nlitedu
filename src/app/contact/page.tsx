import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | NLITedu",
  description: "Get in touch with the NLITedu team for any queries.",
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Contact Us"
        description="We are here to answer your questions and help you start your tech journey."
      />

      <Contact />
    </>
  );
};

export default ContactPage;
