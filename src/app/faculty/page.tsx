import Breadcrumb from "@/components/Common/Breadcrumb";

import Team2 from "@/components/Team2";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Page | Free Next.js Template for Startup and SaaS",
  description: "This is Contact Page for Startup Nextjs Template",
  // other metadata
};

const FacultyPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Faculty Page"
        description="Faculty Page of nlitedu.com"
      />

      <Team2 />
    </>
  );
};

export default FacultyPage;
