"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const teamMembers = [
  {
    name: "Er. Nikhil Raj",
    role: "CEO & FOUNDER OF NLIT",
    image: "/company/nikhil-raj.jpg",
    description: "(Civil Engineer)",
    bio: `Er. Nikhil Raj, the visionary founder of NLIT, brings extensive expertise in AutoCAD, Revit, and StaadPro, blending advanced technical skills with over a decade of civil engineering experience. His leadership ensures that NLIT stays at the forefront of industry-relevant education, empowering students with practical knowledge and cutting-edge tools.`,
    expertise:
      "Leadership, Civil Engineering, Strategic Planning, AutoCAD, Revit, StaadPro",
  },
  {
    name: "Er. Ashutosh Kumar",
    role: "Co. Founder & MD of NLIT",
    image: "/company/ashutosh-kumar.jpg",
    description: "(Civil Engineer)",
    bio: `Er. Ashutosh Kumar has been instrumental in shaping NLIT's academic rigor. With an extensive background in civil engineering and management, Ashutosh brings a wealth of knowledge in both technical and operational domains.`,
    expertise: "Operations, Team Management, Civil Engineering, Consulting",
  },
  {
    name: "Er. Rajni Kant",
    role: "Senior Managing Director Of NLIT",
    image: "/company/rajni-kant.jpg",
    description: "(Mechanical Engineer)",
    bio: `A seasoned Mechanical Engineer, Er. Rajni Kant's extensive experience in the industry allows him to steer NLIT’s academic projects and ensure a seamless integration between theoretical learning and hands-on applications.`,
    expertise:
      "AutoCAD, Revit, SolidWorks, StaadPro, Mechanical Engineering, Research & Development",
  },
  {
    name: "Sourav Raj",
    role: "Marketing Department OF NLIT",
    image: "/company/sourav-raj.jpg",
    description: "(Marketing Specialist)",
    bio: `Sourav Raj has played a key role in building the brand and presence of NLIT. His strategic approach to marketing helps expand NLIT’s reach, making it a household name in the education sector.`,
    expertise: "Digital Marketing, Brand Management, Content Strategy",
  },
  {
    name: "Sundaram Manmohan",
    role: "Senior Marketing",
    image: "/company/sundaram-manmohan.jpg",
    description: "(Senior Marketing Specialist)",
    bio: `With a strong technical background and marketing expertise, Sundaram Manmohan is responsible for driving NLIT's digital marketing initiatives and bridging the gap between technology and customer outreach.`,
    expertise: "SEO, Technical Marketing, Content Strategy, Digital Branding",
  },
  {
    name: "Ratnesh Sharma",
    role: "Creative Media Team of NLIT",
    image: "/company/ratnesh-sharma.jpg",
    description: "(Video & Graphic Designer)",
    bio: `Ratnesh Sharma is a creative force behind NLIT’s visual identity. With expertise in both video editing and graphic design, he crafts compelling multimedia content that enhances our brand presence and engages learners across platforms.`,
    expertise:
      "Video Editing, Graphic Design, Motion Graphics, Visual Storytelling,  Content Creation",
  },
  {
    name: "Er. Prem Ranjan Kumar",
    role: "Civil Engineer",
    image: "/company/prem-ranjan-kumar.jpg",
    description: "(Specialist in AutoCAD, Revit, StadPro, E-Tab)",
    bio: `Er. Prem Ranjan Kumar is a skilled Civil Engineer with expertise in structural design and drafting. He has hands-on experience using industry-leading tools like AutoCAD, Revit, StadPro, and E-Tab to deliver precise and efficient engineering solutions.`,
    expertise: "AutoCAD, Revit, StadPro, E-Tab, Structural Design, Drafting",
  },
  {
    name: "Er. Vishal Kumar",
    role: "Electrical Engineer",
    image: "/company/vishal-kumar.jpg",
    description:
      "(B.Tech in Electrical Engineering, M.Tech in Instrumental Engineering & Control System)",
    bio: `Er. Vishal Kumar holds a B.Tech in Electrical Engineering from Muzaffarpur Institute of Technology and an M.Tech in Instrumental Engineering and Control System from Dr. APJ Abdul Kalam Technical University. His academic excellence and technical expertise make him proficient in designing, analyzing, and implementing advanced electrical and control systems.`,
    expertise:
      "Electrical Engineering, Instrumentation, Control Systems, Power Systems, Circuit Design",
  },
];

const Team = () => {
  return (
    <section className="mt-4 bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 md:text-5xl dark:text-white">
            Meet Our Leadership
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            The dedicated minds behind NLIT, shaping innovation and educational
            excellence.
          </p>
        </div>

        {/* Team Members */}
        <div className="space-y-24">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className={`flex flex-col md:flex-row ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              } items-center gap-y-8 md:items-start md:gap-x-16`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.15,
              }}
              viewport={{ once: true }}
            >
              {/* Image */}
              <div className="flex w-full justify-center md:w-1/3 md:justify-start">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={280}
                  height={280}
                  className="rounded-full object-cover shadow-xl"
                />
              </div>

              {/* Content */}
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-semibold text-gray-900 md:text-3xl dark:text-white">
                  {member.name}
                </h3>
                <p className="text-md mt-1 font-medium text-indigo-600 dark:text-indigo-400">
                  {member.role}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {member.description}
                </p>

                <p className="mt-4 text-base leading-relaxed text-gray-700 md:text-lg dark:text-gray-300">
                  {member.bio}
                </p>

                <div className="mt-4">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Expertise:
                  </span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">
                    {member.expertise}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
