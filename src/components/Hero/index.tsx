"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import ShinyText from "./shinnytext";
import EnrollDropdown from "./EnrollDropdown";
import { FaLaptopCode, FaTools, FaIndustry, FaArrowLeft } from "react-icons/fa";

const Hero = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  // Show Quick Signup modal only for non-logged in users after mount
  useEffect(() => {
    if (!authLoading && !user) {
      const timer = setTimeout(() => setShowModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: "",
    consent: false,
  });
   

  // selection state for EnrollDropdown
  const [selection, setSelection] = useState<
    { type: "govt" | "private"; state: string } | null
  >(null);

  const [enrollStep, setEnrollStep] = useState<"choice" | "details">("choice");
  const [selectedProgram, setSelectedProgram] = useState<"internship" | "workshop" | "site-visit" | null>(null);

  const handleOpenEnrollModal = () => {
    setEnrollStep("choice");
    setSelectedProgram(null);
    setSelection(null);
    setShowEnrollModal(true);
  };


  // useEffect(() => {
  //   // show modal 1s after mount — change/remove timeout as you like
  //   const t = setTimeout(() => setShowModal(true), 800);
  //   return () => clearTimeout(t);
  // }, []);
  // 👇 close modal on scroll
  useEffect(() => {
    // setTimeout(() => setShowModal(true), 800);
    if (!showEnrollModal) return;

    let scrollTimer: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      // clear any previous timer
      if (scrollTimer) clearTimeout(scrollTimer);

      // close 400ms after scroll stops
      scrollTimer = setTimeout(() => {
        setShowEnrollModal(false);
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [showEnrollModal]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim()) return "Please enter your email.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Please enter a valid email.";
    if (!form.course) return "Please select a course.";
    if (!form.consent) return "Please accept contact consent.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSending(true);

    try {
      // Replace with your Formspree ID: e.g. https://formspree.io/f/mnqzleky
      const FORM_ENDPOINT = "https://formspree.io/f/xanpvgqk";

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        course: form.course,
        message: form.message || "-",
        consent: form.consent ? "yes" : "no",
        source: "Website modal - Hero",
        timestamp: new Date().toISOString(),
      };

      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Submission failed");
      }

      setSuccess(
        "Thank you! We received your request — we&apos;ll contact you soon.",
      );
      setForm({
        name: "",
        email: "",
        phone: "",
        course: "",
        message: "",
        consent: false,
      });

      // optionally close after a short delay
      setTimeout(() => setShowModal(false), 1600);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Try again.");
    } finally {
      setSending(false);
    }
  };
  

  return (
    <>
      <section
        id="home"
        className="dark:bg-gray-dark relative z-10 bg-white pt-[70px] sm:pt-[90px] md:pt-[120px] xl:pt-[150px] 2xl:pt-[210px] pb-12 md:pb-20"
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="w-full order-2 lg:order-1">
              <h1 className="mb-5 text-3xl leading-tight font-bold text-black sm:text-4xl sm:leading-tight md:text-5xl lg:text-5xl dark:text-white">
                <ShinyText
                  text="Transform Your Future with Hands-On Tech Training & Internships"
                />
              </h1>
              <p className="text-body-color dark:text-body-color-dark mb-8 text-base sm:text-lg">
                At Nexgen Learning Institute of Technology (NLIT), we
                don&apos;t just teach theory — we build careers. Gain
                real-world skills, work on live projects, workshop in all
                branches and earn industry-recognized internship
                certifications in Java, Python, AutoCAD, Revit, StaadPro, Solid
                Work, Catia, Android/iOS, MATLAB, and more.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Enroll Now Button */}
                <button
                  onClick={handleOpenEnrollModal}
                  className="inline-block rounded bg-blue-600 px-8 py-3 text-base font-medium text-white transition hover:bg-blue-700 w-full sm:w-auto text-center shadow-lg shadow-blue-600/20"
                >
                  Enroll Now ▾
                </button>

                {/* Learn More Button */}
                <Link
                  href="#about"
                  className="inline-block rounded border border-blue-600 px-8 py-3 text-base font-medium text-blue-600 transition hover:bg-blue-50 w-full sm:w-auto text-center"
                >
                  Learn More
                </Link>
              </div>

            </div>

            {/* Right Column - Hero Image */}
            <div className="relative w-full order-1 lg:order-2 pt-6 lg:pt-0">
              {/* Decorative Glow */}
              <div className="absolute -top-20 -right-20 w-64 h-64 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full blur-3xl hidden lg:block"></div>
              
              {/* Hero Image Container */}
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg lg:shadow-2xl w-full aspect-[4/3]">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcRkZkRwnkAActPCUpBDXAWILWAzsIUm-suEqSRyCN0kkJFjo_nWtHF_fIXBCFUe3P0ILvZfPNNKFhb85tST6VNAtIeJ4e3-MSGkZ58UQ8GTyBN0ea02y4NvT3TQaWQVQZeoKNmTDiyzCwvO9u8gIj0KmmyMPSZ5zraFWXwh68193EM2KRU4xwwQwc-zokJfhNs6zbjJAXql8vuUbWeuNGEluJn_gNDPRlChaZdemyMvvLOS5tXiLB40k42DZFfBWieabo-0Ha4m0"
                  alt="A diverse group of focused engineering students working together in a modern high-tech laboratory with blueprints and computer screens"
                  fill
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/40 to-transparent"></div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 left-4 sm:bottom-4 sm:left-6 bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg max-w-[200px] sm:max-w-xs">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center text-green-600">
                    <span className="text-sm sm:text-base">✓</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                      Industry Certified
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                      Globally recognized programs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="450"
            height="556"
            viewBox="0 0 450 556"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="277"
              cy="63"
              r="225"
              fill="url(#paint0_linear_25:217)"
            />
            <circle
              cx="17.9997"
              cy="182"
              r="18"
              fill="url(#paint1_radial_25:217)"
            />
            <circle
              cx="76.9997"
              cy="288"
              r="34"
              fill="url(#paint2_radial_25:217)"
            />
            <circle
              cx="325.486"
              cy="302.87"
              r="180"
              transform="rotate(-37.6852 325.486 302.87)"
              fill="url(#paint3_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="184.521"
              cy="315.521"
              r="132.862"
              transform="rotate(114.874 184.521 315.521)"
              stroke="url(#paint4_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="356"
              cy="290"
              r="179.5"
              transform="rotate(-30 356 290)"
              stroke="url(#paint5_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="191.659"
              cy="302.659"
              r="133.362"
              transform="rotate(133.319 191.659 302.659)"
              fill="url(#paint6_linear_25:217)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_25:217"
                x1="-54.5003"
                y1="-178"
                x2="222"
                y2="288"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4af792ff" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint1_radial_25:217"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(17.9997 182) rotate(90) scale(18)"
              >
                <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
              </radialGradient>
              <radialGradient
                id="paint2_radial_25:217"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(76.9997 288) rotate(90) scale(34)"
              >
                <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
              </radialGradient>
              <linearGradient
                id="paint3_linear_25:217"
                x1="226.775"
                y1="-66.1548"
                x2="292.157"
                y2="351.421"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_25:217"
                x1="184.521"
                y1="182.159"
                x2="184.521"
                y2="448.882"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_25:217"
                x1="356"
                y1="110"
                x2="356"
                y2="470"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_25:217"
                x1="118.524"
                y1="29.2497"
                x2="166.965"
                y2="338.63"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="364"
            height="201"
            viewBox="0 0 364 201"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.88928 72.3303C33.6599 66.4798 101.397 64.9086 150.178 105.427C211.155 156.076 229.59 162.093 264.333 166.607C299.076 171.12 337.718 183.657 362.889 212.24"
              stroke="url(#paint0_linear_25:218)"
            />
            <path
              d="M-22.1107 72.3303C5.65989 66.4798 73.3965 64.9086 122.178 105.427C183.155 156.076 201.59 162.093 236.333 166.607C271.076 171.12 309.718 183.657 334.889 212.24"
              stroke="url(#paint1_linear_25:218)"
            />
            <path
              d="M-53.1107 72.3303C-25.3401 66.4798 42.3965 64.9086 91.1783 105.427C152.155 156.076 170.59 162.093 205.333 166.607C240.076 171.12 278.718 183.657 303.889 212.24"
              stroke="url(#paint2_linear_25:218)"
            />
            <path
              d="M-98.1618 65.0889C-68.1416 60.0601 4.73364 60.4882 56.0734 102.431C120.248 154.86 139.905 161.419 177.137 166.956C214.37 172.493 255.575 186.165 281.856 215.481"
              stroke="url(#paint3_linear_25:218)"
            />
            <circle
              opacity="0.8"
              cx="214.505"
              cy="60.5054"
              r="49.7205"
              transform="rotate(-13.421 214.505 60.5054)"
              stroke="url(#paint4_linear_25:218)"
            />
            <circle cx="220" cy="63" r="43" fill="url(#paint5_radial_25:218)" />
            <defs>
              <linearGradient
                id="paint0_linear_25:218"
                x1="184.389"
                y1="69.2405"
                x2="184.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_25:218"
                x1="156.389"
                y1="69.2405"
                x2="156.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_25:218"
                x1="125.389"
                y1="69.2405"
                x2="125.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_25:218"
                x1="93.8507"
                y1="67.2674"
                x2="89.9278"
                y2="210.214"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_25:218"
                x1="214.505"
                y1="10.2849"
                x2="212.684"
                y2="99.5816"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint5_radial_25:218"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(220 63) rotate(90) scale(43)"
              >
                <stop offset="0.145833" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.08" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </section>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-gray-800">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Quick Signup
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Enter a few details and we&apos;ll contact you with next
                  steps.
                </p>
              </div>
              <button
                aria-label="Close modal"
                onClick={() => setShowModal(false)}
                className="ml-4 rounded-md px-2 py-1 text-gray-500 hover:text-gray-800 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Name*
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Email*
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Which course are you interested in?*
                </label>
                <select
                  name="course"
                  aria-label="Select a course"
                  value={form.course}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select a course</option>
                  <option>Java Programming</option>
                  <option>Python Programming</option>
                  <option>AutoCAD</option>
                  <option>Revit</option>
                  <option>STAAD Pro</option>
                  <option>SolidWorks</option>
                  <option>CATIA</option>
                  <option>Android / iOS Development</option>
                  <option>MATLAB</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Message (optional)
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Any questions or details..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={form.consent}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                />
                <label
                  htmlFor="consent"
                  className="text-xs text-gray-600 dark:text-gray-300"
                >
                  I agree to be contacted about this course.
                </label>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500"
                >
                  {sending ? "Sending..." : "Submit"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-sm text-gray-600 hover:underline dark:text-gray-300"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Modal — rendered outside the z-10 section so it appears above the header */}
      {showEnrollModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget)
              setShowEnrollModal(false);
          }}
        >
          <div
            className={`animate-fade-in relative mx-4 max-h-[90vh] w-full overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 transition-all duration-300 ${
              enrollStep === "choice" ? "max-w-3xl" : "max-w-2xl"
            }`}
          >
            <div className="max-h-[70vh] space-y-6 overflow-y-auto p-6 md:p-8">
              {enrollStep === "choice" ? (
                <>
                  <div className="text-center mb-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                      Next-Gen Learning
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                      Choose Your Program Path
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                      Select an option below to fill out the enrollment application.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Internship Card */}
                    <button
                      onClick={() => {
                        setSelectedProgram("internship");
                        setEnrollStep("details");
                      }}
                      className="flex flex-col items-center p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 hover:bg-blue-50/40 dark:bg-slate-900/50 dark:hover:bg-blue-950/20 hover:border-blue-500 dark:hover:border-blue-500 text-center transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mb-4 transition-transform group-hover:scale-110 shadow-md shadow-blue-500/10">
                        <FaLaptopCode className="w-7 h-7" />
                      </div>
                      <span className="font-bold text-lg text-slate-800 dark:text-white mb-2">
                        Internship
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Work on industry-led live projects and earn credentials.
                      </span>
                      <span className="mt-4 text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full">
                        4-12 Weeks
                      </span>
                    </button>

                    {/* Workshop Card */}
                    <button
                      onClick={() => {
                        setSelectedProgram("workshop");
                        setEnrollStep("details");
                      }}
                      className="flex flex-col items-center p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 hover:bg-violet-50/40 dark:bg-slate-900/50 dark:hover:bg-violet-950/20 hover:border-violet-500 dark:hover:border-violet-500 text-center transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="p-4 rounded-2xl bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 mb-4 transition-transform group-hover:scale-110 shadow-md shadow-violet-500/10">
                        <FaTools className="w-7 h-7" />
                      </div>
                      <span className="font-bold text-lg text-slate-800 dark:text-white mb-2">
                        Workshop
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Outcome-based intensive bootcamps led by tech experts.
                      </span>
                      <span className="mt-4 text-xs font-semibold bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 px-3 py-1.5 rounded-full">
                        7-28 Days
                      </span>
                    </button>

                    {/* Site Visit Card */}
                    <button
                      onClick={() => {
                        setSelectedProgram("site-visit");
                        setEnrollStep("details");
                      }}
                      className="flex flex-col items-center p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 hover:bg-emerald-50/40 dark:bg-slate-900/50 dark:hover:bg-emerald-950/20 hover:border-emerald-500 dark:hover:border-emerald-500 text-center transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mb-4 transition-transform group-hover:scale-110 shadow-md shadow-emerald-500/10">
                        <FaIndustry className="w-7 h-7" />
                      </div>
                      <span className="font-bold text-lg text-slate-800 dark:text-white mb-2">
                        Site Visit
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Real-world industrial exposure at engineering plants.
                      </span>
                      <span className="mt-4 text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full">
                        7-21 Days
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setEnrollStep("choice");
                        setSelection(null);
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
                    >
                      <FaArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {selectedProgram === "internship" && "Internship Enrollment"}
                        {selectedProgram === "workshop" && "Technical Workshop Enrollment"}
                        {selectedProgram === "site-visit" && "Industrial Site Visit Enrollment"}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Step 2 of 2: Confirm State and College Category
                      </p>
                    </div>
                  </div>
                  <EnrollDropdown onSelectionChange={setSelection} />
                </>
              )}
            </div>

            {/* Buttons section */}
            <div className="flex justify-end space-x-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              {enrollStep === "choice" ? (
                <button
                  onClick={() => setShowEnrollModal(false)}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEnrollStep("choice");
                      setSelection(null);
                    }}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    Back
                  </button>

                  <button
                    onClick={() => {
                      if (!selection) {
                        alert("Please select a state and college type first!");
                        return;
                      }
                      let path = "/enroll";
                      let queryParams = `course=general&type=${selection.type}&state=${encodeURIComponent(
                        selection.state
                      )}`;
                      if (selectedProgram === "workshop") {
                        path = "/workshop/enroll";
                      } else if (selectedProgram === "site-visit") {
                        path = "/site-visit/enroll";
                      } else if (selectedProgram === "internship") {
                        queryParams += "&program=internship";
                      }
                      router.push(`${path}?${queryParams}`);
                      setShowEnrollModal(false);
                    }}
                    className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition ${
                      selection
                        ? "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/10"
                        : "cursor-not-allowed bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-500"
                    }`}
                  >
                    Next
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
