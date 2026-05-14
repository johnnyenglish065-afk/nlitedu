"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
          aria-label="Select college type"
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
          aria-label="Select state"
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

import { COURSE_UI_DATA, fetchCourses } from "@/data/courses";

const CourseEnrollment = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | null>(null);
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

  useEffect(() => {
    const internshipSlugs = [
      "autocad-2d-3d-design",
      "java-programming",
      "python-programming",
      "data-science",
      "artificial-intelligence",
      "matlab-scientific-computing",
      "android-ios-mobile-development",
      "iot-embedded",
      "revit-bim",
      "solidworks",
      "catia",
      "sketchup",
      "etabs",
      "general"
    ];
    fetchCourses().then((data) => {
      const filtered = data.filter(course => internshipSlugs.includes(course.slug));
      setCourses(filtered);
    });
  }, []);

  return (
    <section
      id="course-enrollment"
      className="py-24 bg-background dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="font-headline text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
              Our Core Programs
            </h2>
            <p className="text-gray-600 max-w-md dark:text-gray-400">
              Specialized tracks designed by industry leaders to take you from zero to expert.
            </p>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors dark:hover:bg-gray-700"
              aria-label="Scroll left"
            >
              <span className="material-symbols-outlined text-gray-900 dark:text-gray-300">
                chevron_left
              </span>
            </button>
            <button
              className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors dark:hover:bg-gray-700"
              aria-label="Scroll right"
            >
              <span className="material-symbols-outlined text-gray-900 dark:text-gray-300">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            const ui = COURSE_UI_DATA[course.slug] || {
              icon: "code",
              color: "text-blue-600",
              bgColor: "bg-blue-100",
            };
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl group hover:shadow-xl transition-all duration-300"
              >
                {/* Icon Container */}
                <div
                  className={`w-16 h-16 rounded-2xl ${ui.bgColor} ${ui.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}
                >
                  <span className="material-symbols-outlined text-4xl font-bold">
                    {ui.icon}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-headline text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 leading-relaxed line-clamp-3">
                  {course.description}
                </p>

                {/* CTA Button */}
                <button
                  onClick={() => {
                    setSelectedCourseSlug(course.slug);
                    setShowEnrollModal(true);
                  }}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-2 transition-transform cursor-pointer"
              >
                Enroll Now
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </button>
            </div>
          );
        })}
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
                  if (!selectedCourseSlug) {
                    alert("Please select a course first!");
                    return;
                  }

                  router.push(
                    `/enroll?course=${encodeURIComponent(selectedCourseSlug)}&type=${selection.type}&state=${encodeURIComponent(
                      selection.state,
                    )}&program=internship`,
                  );
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
