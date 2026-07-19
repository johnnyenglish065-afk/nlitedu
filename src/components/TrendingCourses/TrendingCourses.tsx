"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { FaShareAlt } from "react-icons/fa";

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  category_color: string;
  duration: string;
  level: string;
  rating: number;
  price: string;
  highlights: string[];
  instructor_name: string;
  instructor_image: string;
  total_reviews: number;
  is_bestseller: boolean;
  is_featured: boolean;
  govt_price: number;
  pvt_price: number;
  job_price: number;
  syllabus: string[];
}

const TrendingCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const handleShare = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/courses/${slug}`;
    if (navigator.share) {
      navigator.share({
        title: 'Check out this course from NLIT!',
        url: url
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      setToastMessage("Course link copied to clipboard! 📋");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  useEffect(() => {
    const fetchTrendingCourses = async () => {
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("program_type", "Trending")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching trending courses:", error);
      } else {
        setCourses(data || []);
      }
      setLoading(false);
    };

    fetchTrendingCourses();
  }, []);

  const getDiscountPercent = (originalPriceStr: string, currentPrice: number) => {
    const original = parseInt(originalPriceStr.replace(/\D/g, "")) || 9999;
    if (original <= currentPrice) return 0;
    return Math.round(((original - currentPrice) / original) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="bg-white dark:bg-gray-950 py-16 md:py-20 border-b border-gray-100 dark:border-gray-900">
      <div className="container mx-auto px-4">
        {/* Header section with gradient line */}
        <div className="relative mb-12 text-center">
          <span className="inline-block bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs font-extrabold tracking-widest uppercase px-3 py-1 rounded-full mb-3">
            🏆 Featured Packages
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white tracking-tight">
            TRENDING COURSE PACKAGES
          </h2>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-center text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Comprehensive bundles with intensive curriculum, real-world projects, live training, and verified certifications at special prices.
          </p>
        </div>

        {/* Udemy-Style Grid layout */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {courses.map((course) => {
            const displayPriceInt = parseInt(course.price?.replace(/\D/g, "")) || 9999;
            const discountPercent = getDiscountPercent(course.price, course.govt_price);

            return (
              <div
                key={course.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Badges on Top */}
                <span className="absolute top-3 left-3 z-20 bg-purple-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow-sm">
                  Premium Package
                </span>
                
                {course.is_bestseller && (
                  <span className="absolute top-3 right-3 z-20 bg-amber-400 text-gray-900 text-[10px] font-bold px-2.5 py-0.5 rounded shadow-sm">
                    Bestseller
                  </span>
                )}

                {/* Course Image */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
                  <Link href={`/courses/${course.slug}`} className="block h-full w-full">
                    <Image
                      src={course.image_url}
                      alt={course.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  {/* Floating Share Button */}
                  <button
                    onClick={(e) => handleShare(e, course.slug)}
                    title="Share Course Package"
                    className="absolute bottom-3 right-3 z-30 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-purple-600 shadow-md border border-gray-100 dark:bg-gray-900/90 dark:hover:bg-gray-900 dark:text-gray-300 dark:hover:text-purple-400 dark:border-gray-800 transition-all hover:scale-110"
                  >
                    <FaShareAlt className="text-xs" />
                  </button>
                </div>

                {/* Card Main Body */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Category & Duration Row */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-purple-600 dark:text-purple-400 mb-2 uppercase tracking-wide">
                    <span>{course.category}</span>
                    <span className="bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      ⏱ {course.duration.replace(" of Live Training", "")}
                    </span>
                  </div>

                  {/* Title */}
                  <Link href={`/courses/${course.slug}`}>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-1.5 h-11">
                      {course.title}
                    </h3>
                  </Link>

                  {/* Instructor name */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
                    Created by: <span className="font-medium text-gray-700 dark:text-gray-300">{course.instructor_name}</span>
                  </p>

                  {/* Rating Stars & Count */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <span className="text-sm font-extrabold text-amber-700 dark:text-amber-500">
                      {course.rating.toFixed(1)}
                    </span>
                    <div className="flex text-amber-400 text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      ({course.total_reviews.toLocaleString()} reviews)
                    </span>
                  </div>

                  {/* Tiered Price Table */}
                  <div className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-3 mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-extrabold text-green-600 dark:text-green-400 tracking-wider">
                          ₹****
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{displayPriceInt.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded">
                        Special Offer Price Locked 🔒
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 text-center mt-1">
                      Enroll to reveal special offer price
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2.5">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="flex-1 rounded-lg border border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 py-2.5 text-center text-xs font-bold hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all"
                    >
                      Explore Details
                    </Link>
                    <Link
                      href={`/enroll?course=${course.slug}`}
                      className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 py-2.5 text-center text-xs font-bold text-white shadow-md hover:shadow-lg transition-all"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[9999] bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 font-semibold text-xs border border-gray-800 dark:border-gray-200 animate-slide-up">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
};

export default TrendingCourses;
