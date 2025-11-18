"use client";

import React from "react";

const GOOGLE_FORM_URL = "https://forms.gle/hxmbFF9MfopLTXGo6"; // Replace with your actual Google Form URL

const courses = [
  {
    title: "AutoCAD 2D & 3D Design",
    description:
      "Master industry-standard AutoCAD tools for precise 2D drafting and 3D modeling essential for architects, engineers, and designers.",
    icon: (
      <svg
        className="text-primary mb-4 h-12 w-12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 2l9 21H3L12 2z"
        ></path>
      </svg>
    ),
  },
  {
    title: "Revit Building Information Modeling (BIM)",
    description:
      "Learn BIM workflows and Revit software to create collaborative building designs with real-world applications.",
    icon: (
      <svg
        className="text-primary mb-4 h-12 w-12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7h18M3 12h18M3 17h18"
        ></path>
      </svg>
    ),
  },
  {
    title: "Java Programming",
    description:
      "Develop robust enterprise-level applications by mastering Java fundamentals and advanced programming concepts.",
    icon: (
      <svg
        className="text-primary mb-4 h-12 w-12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 8c1.5 0 3 1 3 3s-1.5 3-3 3H8v-6h8z"
        ></path>
      </svg>
    ),
  },
  {
    title: "Python for Data Science & AI",
    description:
      "Dive into Python programming with a focus on data analysis, AI, and machine learning applications.",
    icon: (
      <svg
        className="text-primary mb-4 h-12 w-12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 2a10 10 0 100 20 10 10 0 000-20z"
        ></path>
      </svg>
    ),
  },
  {
    title: "MATLAB for Scientific Computing",
    description:
      "Gain critical skills in MATLAB for data analysis, control systems, and engineering computations.",
    icon: (
      <svg
        className="text-primary mb-4 h-12 w-12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4"
        ></path>
      </svg>
    ),
  },
  {
    title: "Android & iOS Mobile Development",
    description:
      "Build modern mobile applications for Android and iOS platforms with hands-on project experience.",
    icon: (
      <svg
        className="text-primary mb-4 h-12 w-12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M8 16l4-4-4-4" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

const CourseEnrollment = () => {
  return (
    <section
      id="course-enrollment"
      className="overflow-hidden bg-white py-16 md:py-20 lg:py-28 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-black sm:text-4xl dark:text-white">
          Course Enrollment Instructions
        </h2>

        <p className="text-body-color mx-auto mb-14 max-w-3xl text-center leading-relaxed dark:text-gray-300">
          To enroll in any of our industry-aligned courses, simply click the{" "}
          <span className="font-semibold">Enroll Now</span> button on your
          desired course card. Fill out the Google Form with your details, and
          our NLIT team will contact you shortly for payment and onboarding
          instructions.
        </p>

        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(({ title, description, icon }, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-lg border border-gray-200 bg-gray-50 p-8 shadow-lg transition-transform hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex flex-col items-center text-center">
                {icon}
                <h3 className="mb-4 text-2xl font-semibold text-black dark:text-white">
                  {title}
                </h3>
                <p className="text-body-color mb-8 dark:text-gray-300">
                  {description}
                </p>
              </div>

              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary hover:bg-primary-dark focus:ring-primary/50 mx-auto inline-block rounded px-8 py-3 text-center text-base font-semibold text-white transition focus:ring-4 focus:outline-none"
                aria-label={`Enroll in ${title} course`}
              >
                Enroll Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseEnrollment;
