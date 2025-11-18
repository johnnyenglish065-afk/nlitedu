import CertificateInfo from "@/components/CertificateInfo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certification | Validate Your Skills with Us",
  description:
    "Discover our certification programs designed to validate your expertise and advance your career in the tech industry.",
  // other metadata
};

const CertificationPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Certification"
        description="Our certification programs are designed to recognize your skills and knowledge, helping you stand out in a competitive job market. Explore available certifications and take the next step in your professional journey."
      />

      <CertificateInfo />
    </>
  );
};

export default CertificationPage;
