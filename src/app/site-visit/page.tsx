"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EnrollDropdown from "@/components/Hero/EnrollDropdown";
import {
  FaChargingStation,
  FaCar,
  FaIndustry,
  FaFlask,
  FaArrowRight,
  FaCheckCircle,
  FaCogs
} from "react-icons/fa";

const siteVisits = [
  {
    slug: "electrical-engg",
    title: "Electrical Engineering Site Visit",
    description: "Get hands-on exposure to smart power grids, electrical substations, industrial control systems, and automated motor control units.",
    icon: FaChargingStation,
    color: "from-amber-500 to-yellow-500",
    shadow: "shadow-amber-500/10 dark:shadow-amber-500/5",
    highlights: ["Substation Automation", "Transformer Assembly & Testing", "Smart Grid Infrastructure", "Industrial PLC Panels"]
  },
  {
    slug: "automobile-engg",
    title: "Automobile Engineering Site Visit",
    description: "Visit state-of-the-art vehicle assembly lines, engine diagnostic centers, and explore electric vehicle (EV) chassis design and testing labs.",
    icon: FaCar,
    color: "from-blue-600 to-cyan-500",
    shadow: "shadow-blue-600/10 dark:shadow-blue-600/5",
    highlights: ["Automated Assembly Lines", "IC Engine Assembly & Dyno", "EV Battery & Drivetrain Lab", "Chassis Fabrication Units"]
  },
  {
    slug: "leather-engg",
    title: "Leather Engineering Site Visit",
    description: "Understand the end-to-end processing of leather, eco-friendly tannery automation, advanced testing labs, and industrial footwear manufacturing.",
    icon: FaIndustry,
    color: "from-orange-600 to-amber-700",
    shadow: "shadow-orange-600/10 dark:shadow-orange-600/5",
    highlights: ["Tanning Operations", "Effluent Treatment Plants (ETP)", "Quality Testing & Standards", "CNC Pattern Cutting & Stitching"]
  },
  {
    slug: "chemical-engg",
    title: "Chemical Engineering Site Visit",
    description: "Tour large-scale process plants, petrochemical refineries, chemical reactors, and discover industrial distillation and purification setups.",
    icon: FaFlask,
    color: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/10 dark:shadow-emerald-500/5",
    highlights: ["Distillation Columns", "Continuous Stirred-Tank Reactors", "Refinery Process Controls", "Safety & HAZOP Implementations"]
  }
];

const SiteVisitPage = () => {
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
                <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  ⚡ Industrial Site Visits
                </span>
                <h1 className="mb-5 text-2xl font-bold text-black dark:text-white sm:text-4xl">
                  Explore Live Engineering Plants & Facilities
                </h1>
                <p className="text-base font-medium leading-relaxed text-body-color mb-8">
                  Bridge the gap between theoretical knowledge and industrial reality. Join our structured site visits to premier power grids, automobile plants, automated tanneries, and chemical processing facilities.
                </p>

                {/* ── CTA buttons ── */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowEnrollModal(true)}
                    className="inline-block rounded bg-blue-600 px-8 py-3 text-base font-medium text-white transition hover:bg-blue-700 w-full sm:w-auto text-center"
                  >
                    Enroll Now ▾
                  </button>

                  <Link
                    href="#facilities"
                    className="inline-block rounded border border-blue-600 px-8 py-3 text-base font-medium text-blue-600 transition hover:bg-blue-50 w-full sm:w-auto text-center"
                  >
                    View Programs
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
                    Site Visit
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative SVGs */}
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

      {/* ── State / Type Selection Modal ── */}
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
                    `/site-visit/enroll?course=general&type=${selection.type}&state=${encodeURIComponent(selection.state)}`
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

      {/* ── Engineering Programs Grid ── */}
      <section id="facilities" className="py-20 bg-slate-50 dark:bg-slate-900/40">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl mb-4">
              Our Certified Industrial Site Visits
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Witness live machinery setups, quality checks, process controls, and safety workflows guided by expert plant engineers.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {siteVisits.map((v, index) => {
              const Icon = v.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-8 dark:border-slate-800 dark:bg-slate-950/80 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group ${v.shadow}`}
                >
                  <div>
                    <div className={`inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br ${v.color} text-white mb-6 shadow-lg shadow-inherit/25`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                      {v.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                      {v.description}
                    </p>

                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 mb-8">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                        Key Areas of Observation:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {v.highlights.map((item, i) => (
                          <span key={i} className="flex items-start text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <FaCheckCircle className="text-blue-500 w-3.5 h-3.5 mr-2 mt-0.5 shrink-0" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/site-visit/enroll?course=${v.slug}&program=site-visit`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3.5 px-6 font-bold hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white shadow-sm hover:shadow-md transition-all text-sm w-full"
                  >
                    Register for Site Visit
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

export default SiteVisitPage;
