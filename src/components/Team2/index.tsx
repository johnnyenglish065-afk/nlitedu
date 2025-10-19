"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Er. Nikhil Raj",
    image: "/review/beta2-removebg-preview.png",
    expertise: "AutoCAD, SolidWorks, Revit, StaadPro",
    experience: "5+ Years in Technical Training & Designing",
    qulafication: "Diploma & B-Tech in Civil Engineering",
  },
  {
    name: "Er. Rajni Kant",
    image: "/review/takla.jpg",
    expertise: "AutoCAD, Revit, SolidWorks, StaadPro Catia",
    experience: "8+ Years in technical training",
    qulafication: "B-Tech & M-Tech in Mechanical Engineering",
  },

{ name: "Er. Vishal Kumar",
    image: "/company/vishal-kumar.jpg",
    expertise: "MetLab,Crucit design, Power System,Contral System etc",
    experience: " 6+ Years Experience",
    qulafication: " B-Tech in Electrical Engineering, M-Tech in Instrumentation Engineering and Control system",
   
},
  
  {
    name: "Er. Prem Ranjan Kumar",
    image: "/company/prem-ranjan-kumar.jpg",
    expertise: "AutoCAD, Revit, StadPro, E-Tab,Site engineer,",
    experience: "10+ Years Experience teaching techinical software",
    qulafication: "Diploma in Civil Engineering",
  },
  
  

];

const TeamDisplay = () => {
  return (
    <section className="bg-gray-100 px-4 py-16 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Our Expert Mentors
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Experienced professionals guiding your learning journey.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="flex flex-col rounded-lg bg-white shadow-md transition duration-300 hover:shadow-xl dark:bg-gray-800"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Image */}
              {/* Image */}
              <div className="relative h-[250px] w-full overflow-hidden rounded-t-lg">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={400}
                  height={250}
                  className="h-full w-full object-contain "
                />
              </div>

              {/* Content */}
              <div className="flex flex-grow flex-col justify-between p-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </h3><p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                     {member.qulafication}
                  </p>
                  <p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Expertise: {member.expertise}
                  </p>
                </div>

                {/* Footer Section */}
                <div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {member.experience}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamDisplay;
