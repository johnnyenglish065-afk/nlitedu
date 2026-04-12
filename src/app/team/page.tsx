import Team from "@/components/Team";
import { Metadata } from "next";

// Metadata for the team page
export const metadata: Metadata = {
  title: "Team Page | NLIT Education",
  description: "Team page for nlit nexgen institute of technology",
};

const TeamPage = () => {
  // Team member data

  return <Team />;
};

export default TeamPage;
