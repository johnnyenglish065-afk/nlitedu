"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const courseList = [
  {
    slug: "autocad-2d-3d-design",
    title: "AutoCAD 2D & 3D Design",
    description:
      "Master industry-standard AutoCAD tools for precise 2D drafting and 3D modeling essential for architects, engineers, and designers.",
    highlights: [
      "2D Drafting and 3D Modeling",
      "Industry-standard AutoCAD workflow",
      "Project-based learning for real-world design",
    ],
  },
  {
    slug: "revit-bim",
    title: "Revit Building Information Modeling (BIM)",
    description:
      "Learn BIM workflows and Revit software to create collaborative building designs with real-world applications.",
    highlights: [
      "BIM modeling and collaboration",
      "Architecture, structure, and MEP support",
      "Live project-based Revit exercises",
    ],
  },
  {
    slug: "java-programming",
    title: "Java Programming",
    description:
      "Develop robust enterprise-level applications by mastering Java fundamentals and advanced programming concepts.",
    highlights: [
      "Core Java fundamentals",
      "Object-oriented design and data structures",
      "Build real applications with practical examples",
    ],
  },
  {
    slug: "python-data-science-ai",
    title: "Python for Data Science & AI",
    description:
      "Dive into Python programming with a focus on data analysis, AI, and machine learning applications.",
    highlights: [
      "Python programming for analytics",
      "Data visualization and machine learning",
      "Hands-on AI use cases with Python",
    ],
  },
  {
    slug: "python-programming",
    title: "Python Programming",
    description:
      "Master Python for data science, scripting, and automation with hands-on programming practice.",
    highlights: [
      "Python fundamentals and scripting",
      "Data processing and automation",
      "Build practical Python projects",
    ],
  },
  {
    slug: "matlab-scientific-computing",
    title: "MATLAB for Scientific Computing",
    description:
      "Gain critical skills in MATLAB for data analysis, control systems, and engineering computations.",
    highlights: [
      "MATLAB for engineering workflows",
      "Simulation and numerical computing",
      "Data analysis with MATLAB toolboxes",
    ],
  },
  {
    slug: "staadpro",
    title: "STAAD Pro",
    description:
      "Learn advanced structural analysis and design using STAAD Pro for civil and structural engineering.",
    highlights: [
      "Structural modeling and analysis",
      "Load case simulation",
      "Design optimization for real-world structures",
    ],
  },
  {
    slug: "solidworks",
    title: "SolidWorks",
    description:
      "Master mechanical design, simulation, and product development using SolidWorks CAD.",
    highlights: [
      "3D mechanical design",
      "Assembly modeling and simulation",
      "Manufacturing-ready product design",
    ],
  },
  {
    slug: "catia",
    title: "CATIA",
    description:
      "Explore advanced CAD/CAM workflows with CATIA for automotive, aerospace, and industrial design.",
    highlights: [
      "Advanced surface modeling",
      "CAD/CAM integration",
      "Industry-standard product design techniques",
    ],
  },
  {
    slug: "android-ios-mobile-development",
    title: "Android & iOS Mobile Development",
    description:
      "Build modern mobile applications for Android and iOS platforms with hands-on project experience.",
    highlights: [
      "Cross-platform mobile app development",
      "Hands-on app design and deployment",
      "Build real mobile projects for your portfolio",
    ],
  },
  {
    slug: "general",
    title: "NLIT Course Enrollment",
    description:
      "Select your course and fill out the enrollment form so we can reserve your seat and help you begin your learning journey.",
    highlights: [
      "Choose from courses across design, development, AI, and engineering",
      "Secure admission with a simple online form",
      "Receive course guidance from the NLIT team",
    ],
  },
];

const semesters = [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
];

const genders = ["Male", "Female", "Prefer not to say"];

const EnrollmentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseSlug = searchParams.get("course") || "general";
  const course = useMemo(
    () => courseList.find((item) => item.slug === courseSlug) ?? courseList.find((item) => item.slug === "general")!,
    [courseSlug],
  );

  const [form, setForm] = useState({
    fullName: "",
    fatherName: "",
    gender: "",
    email: "",
    whatsapp: "",
    dob: "",
    brn: "",
    branch: "",
    semester: "",
    collegeName: "",
    collegeType: searchParams.get("type") || "",
    state: searchParams.get("state") || "",
    course: course.title,
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabaseConfigured = Boolean(supabase);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      course: course.title,
      collegeType: searchParams.get("type") || current.collegeType,
      state: searchParams.get("state") || current.state,
    }));
  }, [course.title, searchParams]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Please enter your full name.";
    if (!form.fatherName.trim()) return "Please enter your father's name.";
    if (!form.gender) return "Please select your gender.";
    if (!form.email.trim()) return "Please enter your email.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Please enter a valid email.";
    if (!form.whatsapp.trim()) return "Please enter your WhatsApp number.";
    if (!form.dob) return "Please select your date of birth.";
    if (!form.brn.trim()) return "Please enter your BRN.";
    if (!form.branch.trim()) return "Please enter your branch.";
    if (!form.semester) return "Please select your semester.";
    if (!form.collegeName.trim()) return "Please enter your college name.";
    if (!form.collegeType) return "Please select your college type.";
    if (!form.state) return "Please select your state.";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!supabaseConfigured) {
      setError(
        "Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
      );
      return;
    }

    setSubmitting(true);

    const payload = {
      full_name: form.fullName,
      father_name: form.fatherName,
      gender: form.gender,
      email: form.email,
      whatsapp: form.whatsapp,
      dob: form.dob,
      brn: form.brn,
      branch: form.branch,
      semester: form.semester,
      college_name: form.collegeName,
      college_type: form.collegeType,
      state: form.state,
      course_title: form.course,
      message: form.message || null,
    };

    const { data, error: supabaseError } = await supabase!.from("enrollments").insert([payload]);

    setSubmitting(false);

    if (supabaseError) {
      setError(supabaseError.message || "Unable to submit enrollment. Please try again.");
      return;
    }

    setSuccess("Enrollment submitted successfully! Our team will contact you soon.");
    setForm({
      fullName: "",
      fatherName: "",
      gender: "",
      email: "",
      whatsapp: "",
      dob: "",
      brn: "",
      branch: "",
      semester: "",
      collegeName: "",
      collegeType: form.collegeType,
      state: form.state,
      course: course.title,
      message: "",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-[160px] pb-14 px-4 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-10 flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm uppercase tracking-[0.2em] font-semibold text-blue-600 dark:text-blue-400">
                📝 Enrollment Form
              </p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">{course.title}</h1>
            </div>
            <Link
              href="/"
              className="rounded-full bg-blue-50 border border-blue-200 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-700 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 whitespace-nowrap"
            >
              ← Back Home
            </Link>
          </div>

          <p className="mb-8 text-base text-slate-600 leading-relaxed dark:text-slate-300 border-l-4 border-blue-500 pl-4">{course.description}</p>

          {!supabaseConfigured && (
            <div className="rounded-2xl bg-yellow-50 p-4 mb-6 text-sm text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700">
              <strong>⚠️ Supabase not configured:</strong> Add your project URL and anon key to <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800 font-mono text-xs">.env.local</code>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-200">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-200">
                {success}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Full Name</span>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="Enter your full name"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Father's Name</span>
                <input
                  name="fatherName"
                  value={form.fatherName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="Enter father's name"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Gender</span>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                >
                  <option value="">Select Gender</option>
                  {genders.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Email</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="Enter your email"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">WhatsApp Number</span>
                <input
                  name="whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="Enter WhatsApp number"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Date of Birth</span>
                <input
                  name="dob"
                  type="date"
                  value={form.dob}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">BRN</span>
                <input
                  name="brn"
                  value={form.brn}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="Enter BRN"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Branch</span>
                <input
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="Enter branch"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Semester</span>
                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                >
                  <option value="">Select Semester</option>
                  {semesters.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">College Name</span>
                <input
                  name="collegeName"
                  value={form.collegeName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="Enter college name"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">College Type</span>
                <select
                  name="collegeType"
                  value={form.collegeType}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                >
                  <option value="">Select College Type</option>
                  <option value="govt">Govt College</option>
                  <option value="private">Private College</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">State</span>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="Enter state"
                  required
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Additional Notes</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                placeholder="Any additional details for the enrollment team"
              />
            </label>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 dark:border-slate-800">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 text-base font-semibold text-white transition hover:shadow-lg hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
              >
                {submitting ? "⏳ Submitting..." : "✓ Submit Enrollment"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-8 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
              >
                ← Return Home
              </button>
            </div>
          </form>
        </section>

        <aside className="sticky top-[170px] space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8 h-fit">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">📋 Course Summary</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Review your enrollment details before submitting.</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700">
            <p className="text-xs uppercase tracking-widest font-bold text-blue-600 dark:text-blue-400">🎓 Course</p>
            <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">{course.title}</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{course.description}</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700">
            <p className="text-xs uppercase tracking-widest font-bold text-purple-600 dark:text-purple-400">✨ Highlights</p>
            <ul className="mt-4 space-y-2.5 text-slate-700 dark:text-slate-300">
              {course.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-blue-600"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-6 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700">
            <p className="text-xs uppercase tracking-widest font-bold text-green-600 dark:text-green-400">✓ Enrollment Details</p>
            <dl className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <dt className="font-medium">Course</dt>
                <dd>{course.title}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-medium">College Type</dt>
                <dd>{form.collegeType || "Not selected"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-medium">State</dt>
                <dd>{form.state || "Not selected"}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      {/* Enhanced Footer */}
      <footer className="mt-20 pt-16 border-t-2 border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-blue-400">
              🚀 Nexgen Learning Institute of Technology 🚀
            </h2>
            <p className="mt-3 text-lg font-semibold text-slate-700 dark:text-slate-300">
              Empowering Your Future with Online Training & Internships
            </p>
          </div>

          {/* About Section */}
          <div className="mb-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-8 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700">
              <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">About NLIT</h3>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                Welcome to Nexgen Learning Institute of Technology (NLIT), affiliated with Wits Education. We are your premier destination for industry-relevant online training and certified internships, designed to bridge the gap between academic knowledge and professional expertise.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                We specialize in delivering high-impact, practical education across crucial domains in Engineering Design, Software Development, and Data Science, ensuring our participants are not just skilled, but truly job-ready.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-8 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700">
              <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">💡 Diverse Curriculum</h3>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-blue-600 dark:text-blue-400">▸</span>
                  <strong>CAD/CAE:</strong> AutoCAD, Revit, StaadPro, CATIA, SolidWorks
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-purple-600 dark:text-purple-400">▸</span>
                  <strong>Programming:</strong> Java, Python, Web Development
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-pink-600 dark:text-pink-400">▸</span>
                  <strong>Mobile Apps:</strong> Android & iOS Development
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-green-600 dark:text-green-400">▸</span>
                  <strong>Data Science:</strong> MATLAB, Python, Data Analysis
                </li>
              </ul>
            </div>
          </div>

          {/* What You Get */}
          <div className="mb-12 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 p-8 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700">
            <h3 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              ✨ What You Get in This Course
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <span className="text-slate-700 dark:text-slate-300"><strong>Proper Live Classes</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎓</span>
                <span className="text-slate-700 dark:text-slate-300"><strong>Online & Offline Certification</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📖</span>
                <span className="text-slate-700 dark:text-slate-300"><strong>Free E-Books</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎁</span>
                <span className="text-slate-700 dark:text-slate-300"><strong>Surprise Gifts</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🆘</span>
                <span className="text-slate-700 dark:text-slate-300"><strong>24/7 Doubt Support</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <span className="text-slate-700 dark:text-slate-300"><strong>Real-World Projects</strong></span>
              </div>
            </div>
          </div>

          {/* Contact & Social Media */}
          <div className="mb-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700">
              <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">📞 Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">WhatsApp Support (24/7)</p>
                    <a
                      href="https://wa.me/918092378320"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-bold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                    >
                      +91 8092378320
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
                    <a
                      href="mailto:info@nlitedu.com"
                      className="text-lg font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      info@nlitedu.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Website</p>
                    <a
                      href="https://www.nlitedu.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      www.nlitedu.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 p-8 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-700">
              <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">🌍 Follow Us On Social Media</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <a
                  href="https://www.facebook.com/share/17FWqVtL9b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 rounded-2xl bg-blue-100 p-6 transition hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-900/60"
                >
                  <span className="text-4xl">📘</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Facebook</span>
                </a>
                <a
                  href="https://www.instagram.com/nlitedu?igsh=MXNqZW1udjY2eHg3bA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 rounded-2xl bg-pink-100 p-6 transition hover:bg-pink-200 dark:bg-pink-900/40 dark:hover:bg-pink-900/60"
                >
                  <span className="text-4xl">📷</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Instagram</span>
                </a>
                <a
                  href="https://wa.me/918092378320"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 rounded-2xl bg-green-100 p-6 transition hover:bg-green-200 dark:bg-green-900/40 dark:hover:bg-green-900/60"
                >
                  <span className="text-4xl">💬</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Internship Experience */}
          <div className="mb-12 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 p-8 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700">
            <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">🌟 Real-World Internship Experience & Certification</h3>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              What sets Nexgen apart is our commitment to practical application. Every program culminates in an online internship component where learners work on real-world projects and case studies under the guidance of seasoned industry mentors. This project-based approach ensures you gain practical experience, develop problem-solving skills, and build a powerful portfolio.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Upon successful completion of the training and internship, you receive an <strong>industry-recognized certification from Nexgen Learning Institute of Technology</strong>. This certification validates your proficiency, significantly boosting your resume and providing a competitive edge in job applications.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default EnrollmentPage;
