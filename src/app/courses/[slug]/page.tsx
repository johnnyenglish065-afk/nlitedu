"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { 
  FaStar, 
  FaCheck, 
  FaGlobe, 
  FaRegClock, 
  FaFileAlt, 
  FaLaptopCode, 
  FaMobileAlt, 
  FaChevronDown, 
  FaChevronUp, 
  FaArrowLeft,
  FaAward,
  FaPlayCircle,
  FaShareAlt,
  FaWhatsapp,
  FaTelegramPlane,
  FaTwitter,
  FaLinkedin,
  FaTimes,
  FaCopy
} from "react-icons/fa";

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
  program_type?: string;
}

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const copyToClipboard = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url);
    setToastMessage("Course link copied to clipboard! 📋");
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching course details:", error);
      } else {
        setCourse(data);
      }
      setLoading(false);
    };

    fetchCourseDetails();
  }, [slug]);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 pt-24">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 pt-24 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          The course package you are looking for might have been moved or renamed.
        </p>
        <Link
          href="/courses"
          className="flex items-center gap-2 rounded-lg bg-purple-600 text-white px-6 py-3 font-semibold hover:bg-purple-700 transition-colors shadow"
        >
          <FaArrowLeft /> Back to Courses
        </Link>
      </div>
    );
  }

  const originalPriceInt = parseInt(course.price?.replace(/\D/g, "")) || 9999;
  const govtDiscountPercent = Math.round(((originalPriceInt - course.govt_price) / originalPriceInt) * 100);
  const pvtDiscountPercent = Math.round(((originalPriceInt - course.pvt_price) / originalPriceInt) * 100);

  // Generate mock lecture names for syllabus modules to make it look detail-rich
  const getSubtopicsForModule = (moduleName: string) => {
    if (moduleName.includes("Programming") || moduleName.includes("Python")) {
      return ["Introduction to Python & IDE Setup", "Data Types, Variables and Operators", "Control Flow: Loops, Conditionals and Functions", "Data Structures: Lists, Tuples, Sets and Dictionaries", "Working with Pandas & NumPy", "Hands-on Exercise: Data Analysis Project"];
    }
    if (moduleName.includes("Database") || moduleName.includes("SQL")) {
      return ["SQL Server Installation & Configuration", "Relational Database Management Concepts", "DML Commands: SELECT, INSERT, UPDATE, DELETE", "Filtering, Sorting, and Grouping Data", "Writing Advanced Subqueries and Joins", "Project: Relational Database Schema Design"];
    }
    if (moduleName.includes("Business") || moduleName.includes("BI") || moduleName.includes("Power BI")) {
      return ["Power BI Desktop Interface Overview", "Connecting Data Sources & Data Transformation (Power Query)", "DAX Formulas & Calculations", "Designing Interactive Reports & Dashboards", "Tableau Workspace & Advanced Calculations", "Project: Interactive Business Performance Dashboard"];
    }
    if (moduleName.includes("Frontend") || moduleName.includes("Front End")) {
      return ["HTML5 Semantic Tags & Web Structure", "CSS3 Selectors, Transitions, Flexbox & Grid", "Bootstrap 5 Framework integration", "Mobile-First Design & Media Queries", "Introduction to DOM Manipulation & Event Handling", "Project: Fully Responsive Landing Page"];
    }
    if (moduleName.includes("JavaScript") || moduleName.includes("React")) {
      return ["ES6+ Javascript Concepts (Arrow functions, Destructuring, Promises)", "Asynchronous JS, Fetch API & JSON Handling", "React components, Props & State Management", "Handling forms & custom Hooks in React", "Building Single Page Applications with React Router", "Project: E-commerce Product Dashboard"];
    }
    if (moduleName.includes("Backend") || moduleName.includes("Node")) {
      return ["Introduction to Node.js Runtime Environment", "Express.js Framework & API Routing", "Handling HTTP requests, responses & CORS", "JSON Web Token (JWT) Authentication", "Creating CRUD REST APIs", "Project: Secure API backend for User Auth"];
    }
    if (moduleName.includes("AI")) {
      return ["Integrating AI models: OpenAI GPT & Gemini API", "Prompt Engineering for Code Generation (GitHub Copilot, Cursor)", "Automating boring tasks using AI APIs", "AI Vector Databases & Semantic Search", "Project: Intelligent Chatbot integration"];
    }
    if (moduleName.includes("AutoCAD")) {
      return ["AutoCAD GUI & Coordinate System", "Drawing Commands: Line, Circle, Polyline, Arc", "Modify Tools & Layer Management", "Dimensioning & Annotation Styles", "Creating 3D Solids & Extrusions", "Project: Standard Floor Plan Drafting"];
    }
    if (moduleName.includes("Revit")) {
      return ["Introduction to BIM (Building Information Modeling) & Revit Interface", "Creating architectural elements: Walls, Windows, Doors, Roofs", "Creating custom Revit Families", "Schedules, Quantities and Sheet Layouts", "BIM Coordination & Rendering", "Project: 3D Commercial Building Model"];
    }
    if (moduleName.includes("Video") || moduleName.includes("Editing")) {
      return ["Adobe Premiere Pro Workspace & Editing timeline", "Trimming, Cuts, Transition & Sound Effects", "Color Correction & Color Grading (Lumetri)", "Audio mixing & Sound design", "Motion graphics inside After Effects", "Project: Cinematic Trailer Editing"];
    }
    // Fallback topics
    return ["Introduction & Overview", "Key theoretical concepts", "Hands-on Practical Training", "Best Practices and Troubleshooting", "Code/Design Review Session", "Module Capstone Assignment"];
  };

  return (
    <div className="bg-white dark:bg-gray-950 pt-20">
      {/* 1. Udemy Dark Slate Header Banner */}
      <section className="bg-slate-900 text-white py-12 md:py-16 border-b border-slate-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col justify-center">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-4 uppercase tracking-wider">
                <span>Courses</span>
                <span>/</span>
                <span>{course.category}</span>
                <span>/</span>
                <span className="text-white font-normal capitalize">{course.slug.replace(/-/g, " ")}</span>
              </div>

              {/* Course Title */}
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
                {course.title}
              </h1>

              {/* Course Subtitle */}
              <p className="text-lg text-gray-300 font-medium mb-4 leading-relaxed">
                {course.description}
              </p>

              {/* Ratings and Meta Info */}
              <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
                <span className="bg-amber-400 text-gray-950 font-bold px-2 py-0.5 text-xs rounded">
                  Bestseller
                </span>
                <div className="flex items-center text-amber-400 gap-1 font-bold">
                  <span>{course.rating.toFixed(1)}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={i} className="text-xs" />
                    ))}
                  </div>
                </div>
                <span className="text-purple-300 underline cursor-pointer">
                  ({course.total_reviews.toLocaleString()} ratings)
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-300 font-semibold">2,500+ students enrolled</span>
              </div>

              {/* Instructor and Language */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-400">
                <p>Created by: <span className="text-purple-300 underline font-medium cursor-pointer">{course.instructor_name}</span></p>
                <div className="flex items-center gap-1.5">
                  <FaRegClock /> Last Updated 7/2026
                </div>
                <div className="flex items-center gap-1.5">
                  <FaGlobe /> English, Hindi
                </div>
              </div>
            </div>
            {/* Space on right for the sticky widget in desktop */}
            <div className="lg:col-span-1 hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* 2. Main Page Layout with Grid */}
      <section className="py-12 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            
            {/* Left Content Area (2/3 width) */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* What You'll Learn Section */}
              <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-gray-50/50 dark:bg-gray-900/30">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What you'll learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {course.highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <FaCheck className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Content Accordion Section */}
              <div>
                <div className="flex justify-between items-baseline mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Course content</h2>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {course.syllabus.length} sections • {course.syllabus.length * 6} lectures • {course.duration.includes("Hour") ? course.duration : "30+ Hours"}
                  </span>
                </div>

                <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-200 dark:divide-gray-800 shadow-sm">
                  {course.syllabus.map((moduleName, index) => {
                    const isOpen = activeAccordion === index;
                    const subtopics = getSubtopicsForModule(moduleName);

                    return (
                      <div key={index} className="bg-white dark:bg-gray-900">
                        {/* Accordion Trigger */}
                        <button
                          onClick={() => toggleAccordion(index)}
                          className="w-full flex items-center justify-between p-4 font-semibold text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            {isOpen ? <FaChevronUp className="text-purple-600 dark:text-purple-400 text-xs" /> : <FaChevronDown className="text-gray-500 text-xs" />}
                            <span>{moduleName}</span>
                          </div>
                          <span className="text-xs text-gray-400 font-normal">
                            {subtopics.length} lectures
                          </span>
                        </button>

                        {/* Accordion Content */}
                        {isOpen && (
                          <div className="px-5 pb-4 pt-1 bg-gray-50/50 dark:bg-gray-900/20 text-sm space-y-3 border-t border-gray-100 dark:border-gray-800/40">
                            {subtopics.map((topic, topicIdx) => (
                              <div key={topicIdx} className="flex items-start gap-3 py-1">
                                <FaPlayCircle className="text-gray-400 mt-1 flex-shrink-0 text-xs" />
                                <span className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                                  {topic}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Course Requirements */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Requirements</h2>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>No prior programming or design experience is required. We start from absolute scratch!</li>
                  <li>A computer (Windows, Mac, or Linux) with a decent internet connection.</li>
                  <li>All software tools and technologies used in the course are free and open-source.</li>
                  <li>A strong motivation to practice coding, drafting, or editing and build real-world portfolios.</li>
                </ul>
              </div>

              {/* Course Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Description</h2>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
                  <p>
                    Welcome to the <strong>{course.title}</strong>, the most comprehensive and job-oriented training package designed in collaboration with expert faculty and industry professionals. 
                  </p>
                  <p>
                    This training bundle is specifically structured to transition you from an absolute beginner to a confident professional. With <strong>{course.duration}</strong> of intense live sessions, hands-on workshops, real-world case studies, and code reviews, we ensure you gain actionable skills that recruiters look for.
                  </p>
                  <p className="font-semibold text-purple-600 dark:text-purple-400">
                    Why choose this NLIT Package?
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Live Interaction:</strong> Weekly live training classes led by expert mentors, where you can clear doubts instantly.</li>
                    <li><strong>Portfolio Projects:</strong> Build multiple production-ready capstone projects to show off on GitHub, LinkedIn, or Behance.</li>
                    <li><strong>Dual Price Protection:</strong> We support students from different backgrounds with special discounted prices for government and private colleges.</li>
                    <li><strong>Placement Support:</strong> Free resume builders, mock interviews, and reference connections.</li>
                  </ul>
                </div>
              </div>

              {/* Instructor Profile Card */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {course.instructor_name === "NLIT Company" ? "Training Partner" : "Instructor"}
                </h2>
                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                  {course.instructor_name === "NLIT Company" ? (
                    <div className="relative h-16 w-44 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-center p-3 flex-shrink-0 shadow-sm">
                      <Image
                        src="/company/logo.png"
                        alt="NLIT Logo"
                        layout="fill"
                        objectFit="contain"
                        className="p-2 dark:hidden"
                      />
                      <Image
                        src="/company/logo-trans-p.png"
                        alt="NLIT Logo"
                        layout="fill"
                        objectFit="contain"
                        className="p-2 hidden dark:block"
                      />
                    </div>
                  ) : (
                    <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0 bg-purple-100 dark:bg-purple-900">
                      <Image
                        src={course.instructor_image}
                        alt={course.instructor_name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white underline cursor-pointer">
                      {course.instructor_name}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                      {course.instructor_name === "NLIT Company"
                        ? "Official Training & Skill Development Partner"
                        : "Senior Technology Lead & Core Faculty at NLIT"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                      {course.instructor_name === "NLIT Company"
                        ? "NLIT is a premier education and technology organization dedicated to empowering students, developers, and working professionals with job-ready tech and design skills. Our expert faculty and industry partners design comprehensive training packages that bridge the gap between academic education and industry requirements."
                        : "Expert instructor with over 8 years of industry experience teaching thousands of developers, designers, and drafting engineers. Specializes in custom full-stack solutions, BIM systems, data engineering, and cinematic post-production workflows."}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column - Sticky Widget (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-28 border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl lg:-mt-64 z-40 bg-white relative">
                {/* Course Main Preview Image */}
                <div className="relative h-52 w-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800 group cursor-pointer">
                  <Image
                    src={course.image_url}
                    alt={course.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaPlayCircle className="text-white text-5xl animate-pulse" />
                  </div>
                  <div className="absolute bottom-3 left-0 right-0 text-center text-xs font-bold text-white bg-black/50 py-1">
                    Preview this course
                  </div>
                </div>

                {/* Sidebar Widget Body */}
                <div className="p-6">
                  {/* Urgency Message */}
                  <p className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-3 py-1.5 rounded-lg text-center mb-4 animate-pulse">
                    ⚡ Special Discount Active! Prices rising soon.
                  </p>

                  {/* Pricing Tiers header */}
                  <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">
                    SELECT ENROLLMENT TIER:
                  </h3>

                  {/* Option 1: Govt. College Student */}
                  <div className="border border-green-200 dark:border-green-900 bg-green-50/20 dark:bg-green-950/10 p-4 rounded-xl mb-4 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="inline-block bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                          Govt College Offer
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold">Government College Students</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-green-600 dark:text-green-400 block tracking-wider">
                          ₹****
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{originalPriceInt.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] font-bold text-green-600 dark:text-green-400 ml-1">
                          ({govtDiscountPercent}% OFF)
                        </span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/enroll?course=${course.slug}&type=govt`}
                      className="w-full inline-block bg-green-600 hover:bg-green-700 text-center text-xs font-bold text-white py-2.5 rounded-lg transition-colors shadow-sm"
                    >
                      Enroll Govt. Student
                    </Link>
                  </div>

                  {/* Option 2: Private College Student */}
                  <div className="border border-purple-200 dark:border-purple-900 bg-purple-50/20 dark:bg-purple-950/10 p-4 rounded-xl mb-4 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="inline-block bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                          Standard Offer
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold">Private College Students</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-purple-600 dark:text-purple-400 block tracking-wider">
                          ₹****
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{originalPriceInt.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 ml-1">
                          ({pvtDiscountPercent}% OFF)
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/enroll?course=${course.slug}&type=private`}
                      className="w-full inline-block bg-purple-600 hover:bg-purple-700 text-center text-xs font-bold text-white py-2.5 rounded-lg transition-colors shadow-sm"
                    >
                      Enroll Private Student
                    </Link>
                  </div>

                  {/* Option 3: Working Professional */}
                  <div className="border border-gray-200 dark:border-gray-800 bg-gray-50/20 p-4 rounded-xl mb-5 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="inline-block bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                          Job Professional
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold">Working Professionals</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-gray-600 dark:text-gray-400 block tracking-wider">
                          ₹****
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/enroll?course=${course.slug}&type=job`}
                      className="w-full inline-block bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-center text-xs font-bold text-white py-2.5 rounded-lg transition-colors shadow-sm"
                    >
                      Enroll Working Professional
                    </Link>
                  </div>

                  {/* Money back and details */}
                  <div className="text-center text-xs text-gray-400 mb-5">
                    100% Secure Encrypted Payments • Lifetime Access
                  </div>

                  {/* Share button (only for Trending courses) */}
                  {course.program_type === "Trending" && (
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold py-2.5 rounded-lg transition-colors mb-5 shadow-sm"
                    >
                      <FaShareAlt className="text-sm text-purple-600 dark:text-purple-400" />
                      <span>Share Course Package</span>
                    </button>
                  )}

                  {/* Features list */}
                  <div className="space-y-3.5 border-t border-gray-100 dark:border-gray-800 pt-5">
                    <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">This package includes:</h4>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <FaRegClock className="text-purple-600 dark:text-purple-400 text-sm flex-shrink-0" />
                      <span>{course.duration} of intensive live classes</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <FaLaptopCode className="text-purple-600 dark:text-purple-400 text-sm flex-shrink-0" />
                      <span>Hands-on Live Project Coding & Reviews</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <FaAward className="text-purple-600 dark:text-purple-400 text-sm flex-shrink-0" />
                      <span>Industry Recognized Certificate on Completion</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <FaMobileAlt className="text-purple-600 dark:text-purple-400 text-sm flex-shrink-0" />
                      <span>Access on Mobile, Laptop & Tablet</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <FaFileAlt className="text-purple-600 dark:text-purple-400 text-sm flex-shrink-0" />
                      <span>Premium study notes, source codes & guides</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Share this Course</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Share this premium package with your friends or classmates.
            </p>

            {/* Social Share Grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out the ${course.title} from NLIT! ${typeof window !== "undefined" ? window.location.href : ""}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/20 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
              >
                <FaWhatsapp className="text-2xl" />
                <span className="text-[10px] font-medium">WhatsApp</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(`Check out the ${course.title} from NLIT!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              >
                <FaTelegramPlane className="text-2xl" />
                <span className="text-[10px] font-medium">Telegram</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(`Check out the ${course.title} from NLIT!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <FaTwitter className="text-2xl" />
                <span className="text-[10px] font-medium">Twitter / X</span>
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
              >
                <FaLinkedin className="text-2xl" />
                <span className="text-[10px] font-medium">LinkedIn</span>
              </a>
            </div>

            {/* Copy Link Input Bar */}
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={typeof window !== "undefined" ? window.location.href : ""}
                className="flex-1 bg-gray-50 border border-gray-200 text-xs text-gray-600 rounded-lg px-3 py-2 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              />
              <button
                onClick={copyToClipboard}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <FaCopy />
                <span>Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[9999] bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 font-semibold text-xs border border-gray-800 dark:border-gray-200 animate-slide-up">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
