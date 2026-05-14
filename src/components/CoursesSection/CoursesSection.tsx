"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

const CoursesSection = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_legacy_pricing", false)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching courses:", error);
      } else {
        setCourses(data || []);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const discount = (course: any) => {
    const displayPrice = parseInt(course.price?.replace(/\D/g, '') || "0") || ((course.pvt_price || 2999) + 4000);
    const startingPrice = course.govt_price || 1999;
    if (displayPrice === 0 || startingPrice === 0) return 0;
    return Math.round(((displayPrice - startingPrice) / displayPrice) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <section
      id="courses"
      className="bg-gray-50 py-16 md:py-20 lg:py-28 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">
          Explore Our Foundation Courses & Enroll
        </h2>
        <p className="mb-12 text-center text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Industry-recognized certifications with flexible pricing for Govt. College, Private College & Job Professionals
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course: any, index: number) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Discount Badge */}
              <div className="absolute top-3 right-3 z-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                {discount(course)}% OFF
              </div>

              {/* Duration Badge */}
              <div className="absolute top-3 left-3 z-10 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                ⏱ {course.duration}
              </div>

              {/* Course Image */}
              <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-700">
                <Image
                  src={course.image_url}
                  alt={course.title}
                  layout="fill"
                  className="transition-transform duration-300 group-hover:scale-105 object-contain"
                />
              </div>

              {/* Course Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {course.title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {course.description}
                </p>

                {/* Pricing */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-lg font-extrabold text-green-600 dark:text-green-400 tracking-wider">
                    ₹****
                  </span>
                  <span className="text-sm font-medium text-gray-400 line-through">
                    ₹{((course.pvt_price || 2999) + 4000).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  🔒 Enroll to reveal special offer price
                </p>

                <Link
                  href={`/enroll?course=${course.slug}`}
                  className="mt-4 inline-block w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-center text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700"
                >
                  Enroll Now →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
