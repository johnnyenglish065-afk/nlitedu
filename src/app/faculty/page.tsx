import Breadcrumb from "@/components/Common/Breadcrumb";

import Team2 from "@/components/Team2";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Faculty & Experts",
  description: "Meet the experienced professionals and industry experts leading the tech programs at NLITedu.",
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
