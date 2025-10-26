"use client";

import React, { useState, useEffect } from "react";

// Inline EnrollDropdown to avoid missing-module error and provide types
type Selection = { type: "govt" | "private"; state: string } | null;
const EnrollDropdown: React.FC<{ onSelectionChange: (sel: Selection) => void }> = ({
  onSelectionChange,
}) => {
  const [type, setType] = useState<"govt" | "private" | "">("");
  const [state, setState] = useState<string>("");

  useEffect(() => {
    if (type && state) {
      onSelectionChange({ type, state });
    } else {
      onSelectionChange(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, state]);

  return (
    <div className="space-y-4">
      {/* College Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          College Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "govt" | "private" | "")}
          className="mt-2 w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="">Select College Type</option>
          <option value="govt">Govt College</option>
          <option value="private">Private College</option>
        </select>
      </div>

      {/* State */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="mt-2 w-full rounded border px-3 py-2 dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="">Select State</option>
          <option>Bihar</option>
          <option>Delhi</option>
          <option>Maharashtra</option>
          <option>Karnataka</option>
          <option>Tamil Nadu</option>
          <option>Uttar Pradesh</option>
          <option>Madhya Pradesh</option>
          <option>Gujarat</option>
          <option>Rajasthan</option>
          <option>West Bengal</option>
          <option>Jharkhand</option>
          <option>Haryana</option>
          <option>Punjab</option>
          <option>Kerala</option>
          <option>Telangana</option>
          <option>Andhra Pradesh</option>
          <option>Goa</option>
          <option>Arunachal Pradesh</option>
          <option>Chhattisgarh</option>
          <option>Himachal Pradesh</option>
          <option>Manipur</option>
          <option>Meghalaya</option>
          <option>Mizoram</option>
          <option>Nagaland</option>
          <option>Odisha</option>
          <option>Sikkim</option>
          <option>Tripura</option>
          <option>Uttarakhand</option>
        </select>
      </div>
    </div>
  );
};

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
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l9 21H3L12 2z" />
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 8c1.5 0 3 1 3 3s-1.5 3-3 3H8v-6h8z" />
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
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
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selection, setSelection] = useState<{ type: "govt" | "private"; state: string } | null>(null);

  // Auto-close modal on scroll (like Hero)
  useEffect(() => {
    if (!showEnrollModal) return;
    let scrollTimer: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => setShowEnrollModal(false), 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [showEnrollModal]);

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
          To enroll in any of our industry-aligned courses, click the{" "}
          <span className="font-semibold">Enroll Now</span> button below, select your college type and
          state, and complete the form.
        </p>

        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(({ title, description, icon }, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-lg border border-gray-200 bg-gray-50 p-8 shadow-lg transition-transform hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex flex-col items-center text-center">
                {icon}
                <h3 className="mb-4 text-2xl font-semibold text-black dark:text-white">{title}</h3>
                <p className="text-body-color mb-8 dark:text-gray-300">{description}</p>
              </div>

              <button
                onClick={() => setShowEnrollModal(true)}
                className="mx-auto inline-block rounded bg-blue-600 px-8 py-3 text-center text-base font-semibold text-white transition hover:bg-blue-700"
              >
                Enroll Now ▾
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Enroll Modal (copied from Hero) */}
      {showEnrollModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEnrollModal(false);
          }}
        >
          <div className="animate-fade-in relative mx-4 max-h-[90vh] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
            <div className="max-h-[50vh] space-y-6 overflow-y-auto p-6">
              <EnrollDropdown onSelectionChange={setSelection} />
            </div>

            <div className="flex justify-end space-x-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
              <button
                onClick={() => setShowEnrollModal(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Close
              </button>

              <button
                onClick={() => {
                  if (!selection) {
                    alert("Please select a state and college type first!");
                    return;
                  }
                  const formLink =
                    selection.type === "govt"
                      ? selection.state === "Bihar"
                        ? "https://forms.gle/xsFxaEjdXPKPi6ZK9" // Bihar Govt
                        : "https://forms.gle/EUWHf7F3nVg3tb4H8" // Other Govt
                      : selection.state === "Bihar"
                        ? "https://forms.gle/m3AcGciiqKxfFUKK9" // Bihar Pvt
                        : "https://forms.gle/DKPKjqEpdH9t55CH8"; // Other Pvt

                  window.open(formLink, "_blank", "noopener,noreferrer");
                }}
                className={`rounded-md px-4 py-2 text-sm font-medium text-white transition ${
                  selection
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "cursor-not-allowed bg-gray-400 hover:bg-gray-500"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
       
      )}
    </section>
  );
};

export default CourseEnrollment;
