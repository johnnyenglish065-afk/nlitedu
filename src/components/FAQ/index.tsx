"use client"

import React, { useState } from "react";

const faqs = [
  {
    question: "How do I enroll in a course?",
    answer:
      "Simply click the 'Enroll Now' button on the course card you’re interested in, and you will be redirected to our Google Form to fill out your details.",
  },
  {
    question: "Are there any prerequisites for the courses?",
    answer:
      "Most courses are designed for beginners, but some advanced topics may require basic knowledge. Check each course description for specific requirements.",
  },
  {
    question: "Do you provide certificates after course completion?",
    answer:
      "Yes! Upon successful completion of the course and internship (if applicable), you will receive a certificate recognized by the industry.",
  },
  {
    question: "Can I access the course content after completion?",
    answer:
      "Yes, you will have lifetime access to the course materials so you can revisit anytime for reference.",
  },
  {
    question: "Is there any support if I face issues during the course?",
    answer:
      "Absolutely! Our NLIT team provides dedicated support via email and chat to assist you throughout your learning journey.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <section
      id="faq"
      className="bg-white py-16 md:py-20 lg:py-28 dark:bg-gray-900"
    >
      <div className="container mx-auto max-w-4xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-black sm:text-4xl dark:text-white">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqs.map(({ question, answer }, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <button
                className="flex w-full items-center justify-between text-left text-lg font-medium text-black dark:text-white"
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
              >
                <span>{question}</span>
                <svg
                  className={`h-6 w-6 transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              {activeIndex === index && (
                <p className="text-body-color mt-4 dark:text-gray-300">
                  {answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
