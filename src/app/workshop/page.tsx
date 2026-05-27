"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EnrollDropdown from "@/components/Hero/EnrollDropdown";
import {
  FaDraftingCompass,
  FaBuilding,
  FaCalculator,
  FaJava,
  FaPython,
  FaChartBar,
  FaCode,
  FaMobileAlt,
  FaBrain,
  FaArrowRight,
  FaCheckCircle
} from "react-icons/fa";

const workshops = [
  {
    slug: "autocad",
    title: "AutoCAD Drafting & Design",
    description: "Master 2D drafting, drawing modifications, annotation, dimensioning, and 3D modeling fundamentals.",
    icon: FaDraftingCompass,
    color: "from-orange-500 to-red-500",
    shadow: "shadow-orange-500/10 dark:shadow-orange-500/5",
    syllabus: ["Drafting and Editing", "Geometric Constraints", "Dimensions & Layouts", "3D Solid Modeling"]
  },
  {
    slug: "revit",
    title: "Revit BIM Technology",
    description: "Explore Building Information Modeling (BIM) workflows, building components, parametric design, and walkthrough creation.",
    icon: FaBuilding,
    color: "from-indigo-500 to-blue-500",
    shadow: "shadow-indigo-500/10 dark:shadow-indigo-500/5",
    syllabus: ["BIM Interface & Walls", "Structural Components", "Revit Families & Parameters", "Rendering & Documentation"]
  },
  {
    slug: "matlab",
    title: "MATLAB & Scientific Computing",
    description: "Learn matrix calculations, data visualization, signal processing, algorithms, and Simulink simulations.",
    icon: FaCalculator,
    color: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/10 dark:shadow-emerald-500/5",
    syllabus: ["Data Types & Vectors", "Mathematical Operations", "Data Plotting & Analysis", "Simulink & Modeling"]
  },
  {
    slug: "java",
    title: "Java Core & Enterprise",
    description: "Master core Java programming, object-oriented concepts, multithreading, collections framework, and REST APIs.",
    icon: FaJava,
    color: "from-red-600 to-rose-500",
    shadow: "shadow-red-600/10 dark:shadow-red-600/5",
    syllabus: ["Object-Oriented Programming", "Exception Handling", "Java Collections Framework", "Web Services & JDBC"]
  },
  {
    slug: "python",
    title: "Python General Programming",
    description: "Beginner to advanced Python syntax, object orientation, libraries, scripting, automation, and project structures.",
    icon: FaPython,
    color: "from-blue-600 to-cyan-500",
    shadow: "shadow-blue-600/10 dark:shadow-blue-600/5",
    syllabus: ["Python Syntax & Types", "Control Flows & Functions", "File Handling & Modules", "OOP & Package Structures"]
  },
  {
    slug: "data-science",
    title: "Applied Data Science",
    description: "Master data wrangling, cleaning, predictive analytics, statistical modelling, and interactive dashboards.",
    icon: FaChartBar,
    color: "from-teal-600 to-cyan-600",
    shadow: "shadow-teal-600/10 dark:shadow-teal-600/5",
    syllabus: ["NumPy & Pandas Analytics", "Matplotlib & Seaborn Plots", "Statistical Analysis", "Data Cleaning Techniques"]
  },
  {
    slug: "cpp",
    title: "C++ High Performance",
    description: "Learn low-level memory control, pointer manipulation, templates, and the Standard Template Library (STL).",
    icon: FaCode,
    color: "from-sky-500 to-indigo-600",
    shadow: "shadow-sky-500/10 dark:shadow-sky-500/5",
    syllabus: ["Pointers & References", "Classes & Polymorphism", "Templates & STL Containers", "Memory Optimization"]
  },
  {
    slug: "android-ios",
    title: "Mobile Application Dev",
    description: "Build modern, cross-platform Android and iOS applications with seamless state management and API integrations.",
    icon: FaMobileAlt,
    color: "from-green-500 to-emerald-600",
    shadow: "shadow-green-500/10 dark:shadow-green-500/5",
    syllabus: ["Flutter or React Native", "UI & Custom Widgets", "State Management & Auth", "Play Store & App Store Deploy"]
  },
  {
    slug: "ai",
    title: "Artificial Intelligence & ML",
    description: "Explore machine learning models, neural networks, Natural Language Processing, and generative AI integrations.",
    icon: FaBrain,
    color: "from-purple-600 to-fuchsia-500",
    shadow: "shadow-purple-600/10 dark:shadow-purple-600/5",
    syllabus: ["Supervised & Unsupervised ML", "Neural Network Architectures", "NLP & Computer Vision", "LLMs & APIs"]
  }
];

const WorkshopPage = () => {
  const router = useRouter();
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selection, setSelection] = useState<{ type: "govt" | "private"; state: string } | null>(null);

  return (
    <>
      {/* ── Hero / Breadcrumb Section ── */}
      <section className="relative z-10 overflow-hidden pt-24 sm:pt-28 lg:pt-[150px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 md:w-8/12 lg:w-7/12">
              <div className="mb-8 max-w-[570px] md:mb-0 lg:mb-12">
                <h1 className="mb-5 text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Technical Workshops
                </h1>
                <p className="text-base font-medium leading-relaxed text-body-color mb-8">
                  Accelerate your knowledge with our outcome-based, instructor-led technical workshops. Gain critical industry skills, complete practical projects, and obtain verified credentials.
                </p>

                {/* ── Enroll Now & Learn More buttons (same style as homepage Hero) ── */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowEnrollModal(true)}
                    className="inline-block rounded bg-blue-600 px-8 py-3 text-base font-medium text-white transition hover:bg-blue-700 w-full sm:w-auto text-center"
                  >
                    Enroll Now ▾
                  </button>

                  <Link
                    href="#workshops"
                    className="inline-block rounded border border-blue-600 px-8 py-3 text-base font-medium text-blue-600 transition hover:bg-blue-50 w-full sm:w-auto text-center"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full px-4 md:w-4/12 lg:w-5/12">
              <div className="text-end">
                <ul className="flex items-center md:justify-end">
                  <li className="flex items-center">
                    <Link
                      href="/"
                      className="pr-1 text-base font-medium text-body-color hover:text-primary"
                    >
                      Home
                    </Link>
                    <span className="mr-3 block h-2 w-2 rotate-45 border-r-2 border-t-2 border-body-color"></span>
                  </li>
                  <li className="text-base font-medium text-primary">
                    Technical Workshops
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative SVGs (same as Breadcrumb component) */}
        <div>
          <span className="absolute left-0 top-0 z-[-1]">
            <svg width="287" height="254" viewBox="0 0 287 254" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.1" d="M286.5 0.5L-14.5 254.5V69.5L286.5 0.5Z" fill="url(#paint0_linear_111:578)" />
              <defs>
                <linearGradient id="paint0_linear_111:578" x1="-40.5" y1="117" x2="301.926" y2="-97.1485" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span className="absolute right-0 top-0 z-[-1]">
            <svg width="628" height="258" viewBox="0 0 628 258" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.1" d="M669.125 257.002L345.875 31.9983L524.571 -15.8832L669.125 257.002Z" fill="url(#paint0_linear_0:1)" />
              <path opacity="0.1" d="M0.0716344 182.78L101.988 -15.0769L142.154 81.4093L0.0716344 182.78Z" fill="url(#paint1_linear_0:1)" />
              <defs>
                <linearGradient id="paint0_linear_0:1" x1="644" y1="221" x2="429.946" y2="37.0429" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="paint1_linear_0:1" x1="18.3648" y1="166.016" x2="105.377" y2="32.3398" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4A6CF7" />
                  <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </div>
      </section>

      {/* ── Enroll Modal (college state / type picker) ── */}
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
                  router.push(
                    `/workshop/enroll?course=general&type=${selection.type}&state=${encodeURIComponent(selection.state)}`
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

      {/* ── Workshop Cards Grid ── */}
      <section id="workshops" className="py-20 bg-slate-50 dark:bg-slate-900/40">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl mb-4">
              Explore Our Live Interactive Workshops
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Each workshop is designed to be highly intensive, hands-on, and focused on building real-world projects that stand out on your resume.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {workshops.map((w, index) => {
              const Icon = w.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-8 dark:border-slate-800 dark:bg-slate-950/80 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group ${w.shadow}`}
                >
                  <div>
                    <div className={`inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br ${w.color} text-white mb-6 shadow-lg shadow-inherit/25`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {w.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                      {w.description}
                    </p>

                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 mb-8">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                        What you will learn:
                      </h4>
                      <ul className="space-y-2">
                        {w.syllabus.map((item, i) => (
                          <li key={i} className="flex items-start text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <FaCheckCircle className="text-emerald-500 w-3.5 h-3.5 mr-2 mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card CTA — direct link */}
                  <Link
                    href={`/workshop/enroll?course=${w.slug}&program=workshop`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3.5 px-6 font-bold hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white shadow-sm hover:shadow-md transition-all text-sm w-full"
                  >
                    Register for Workshop
                    <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default WorkshopPage;
