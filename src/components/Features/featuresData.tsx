import { Feature } from "@/types/feature";
import {
  FaChalkboardTeacher,
  FaLaptopCode,
  FaCertificate,
  FaHandsHelping,
  FaUsers,
  FaClock,
} from "react-icons/fa";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: <FaChalkboardTeacher size={30} />,
    title: "Expert-Led Training",
    paragraph:
      "Learn from industry professionals with real-world experience who guide you through practical and up-to-date course content.",
  },
  {
    id: 2,
    icon: <FaLaptopCode size={30} />,
    title: "Hands-On Projects",
    paragraph:
      "Gain practical skills by working on real projects designed to simulate workplace challenges and prepare you for job success.",
  },
  {
    id: 3,
    icon: <FaCertificate size={30} />,
    title: "Certified Internship Program",
    paragraph:
      "Complete a 4- or 6-week internship that provides hands-on experience, professional mentorship, and a certificate that employers value.",
  },
  {
    id: 4,
    icon: <FaHandsHelping size={30} />,
    title: "Career Support & Guidance",
    paragraph:
      "Receive personalized career advice, resume building, and interview preparation to boost your confidence in the job market.",
  },
  {
    id: 5,
    icon: <FaUsers size={30} />,
    title: "Community & Networking",
    paragraph:
      "Join a vibrant community of learners and professionals, opening doors to industry connections and collaborative opportunities.",
  },
  {
    id: 6,
    icon: <FaClock size={30} />,
    title: "Flexible Learning Schedule",
    paragraph:
      "Access courses and live sessions that fit your busy lifestyle, allowing you to learn at your own pace from anywhere.",
  },
];

export default featuresData;
