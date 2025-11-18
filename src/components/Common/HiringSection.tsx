"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const HiringSection = () => {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Image
              src="/images/hiring-graph.jpg"
              alt="We are hiring at NLIT"
              width={500}
              height={300}
              className="rounded-xl object-cover shadow-xl"
            />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
              Join Our Mission at NLIT 🚀
            </h2>

            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              We&apos;re looking for passionate educators, tech experts, and creative
              minds who want to transform the way technology is taught.
              <br />
              <br />
              At NLIT, you won&apos;t just be an employee — you&apos;ll be part of a
              movement to inspire future innovators. If you&apos;re ready to work on
              cutting-edge education, lead real-world projects, and make a
              difference — we want you on our team.
            </p>

            {/* Highlights */}
            <ul className="mt-6 space-y-3 text-left text-base text-gray-700 dark:text-gray-300">
              <li>✅ Work with a skilled, passionate team</li>
              <li>✅ Flexible, growth-oriented environment</li>
              <li>✅ Opportunities in teaching, tech, marketing & more</li>
            </ul>

            {/* Apply Button */}
            <div className="mt-8">
              <a
                href="https://forms.gle/pNHq3yqkz5xkPj7K9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition duration-300 hover:bg-indigo-700"
              >
                Apply Now
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HiringSection;
