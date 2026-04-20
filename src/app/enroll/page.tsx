"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { FiCheckCircle, FiCopy, FiDownload, FiExternalLink, FiX } from "react-icons/fi";

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
  "Passed Out"
];

const genders = ["Male", "Female", "Prefer not to say"];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Lakshadweep", "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
].sort();

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
    marks10: "",
    marks12: "",
    marksSem: "",
    qualification: "",
    marksheet12Url: "",
    marksheetSemUrl: "",
  });
  const [marksheet12File, setMarksheet12File] = useState<File | null>(null);
  const [marksheetSemFile, setMarksheetSemFile] = useState<File | null>(null);

  const handle12FileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 100 * 1024) {
        alert("Maximum file size strictly limited to 100 KB.");
        return;
      }
      setMarksheet12File(e.target.files[0]);
    }
  };

  const handleSemFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 100 * 1024) {
        alert("Maximum file size strictly limited to 100 KB.");
        return;
      }
      setMarksheetSemFile(e.target.files[0]);
    }
  };

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const supabaseConfigured = Boolean(supabase);

  // Persistence helpers
  const saveFormToLocal = (formData: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pending_enrollment", JSON.stringify(formData));
    }
  };

  const loadFormFromLocal = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pending_enrollment");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  };

  const clearFormFromLocal = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("pending_enrollment");
    }
  };

  // Initialize Cashfree
  const [cashfree, setCashfree] = useState<any>(null);
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Cashfree) {
      const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox";
      setCashfree((window as any).Cashfree({ mode }));
    }
  }, []);

  // Post-payment verification effect
  useEffect(() => {
    const status = searchParams.get("payment_status");
    const orderId = searchParams.get("order_id");

    if (status === "SUCCESS" && orderId) {
      handleSuccessfulPayment(orderId);
    } else if (status === "FAILED") {
      setError("Payment failed. Please try again.");
      const savedForm = loadFormFromLocal();
      if (savedForm) setForm(savedForm);
    }
  }, [searchParams]);

  const handleSuccessfulPayment = async (orderId: string) => {
    setSubmitting(true);
    try {
      const savedForm = loadFormFromLocal();
      const currentForm = savedForm || form;

      if (!supabase) throw new Error("Database connection lost.");

      const { error: dbError } = await supabase.from("enrollments").upsert([
        {
          ...currentForm,
          payment_id: orderId,
          payment_status: "PAID",
          enrolled_at: new Date().toISOString(),
        },
      ], { onConflict: "payment_id" });

      if (dbError) throw dbError;

      setSuccess("Enrollment Successful!");
      setPaymentVerified(true);
      clearFormFromLocal();

      // Trigger Confetti Celebration
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#9333ea", "#10b981"],
      });
    } catch (err: any) {
      console.error("Post-payment error:", err);
      setError("Payment received, but we couldn't save your enrollment. Please contact support.");
    } finally {
      setSubmitting(false);
    }
  };

  // Determine fee based on college type and state
  const enrollmentFee = useMemo(() => {
    if (form.collegeType === "govt") {
      return form.state === "Bihar" ? 999 : 1499;
    }
    return form.collegeType === "private" ? 1999 : 0;
  }, [form.collegeType, form.state]);

  // Check if form is fully filled
  const isFormComplete = useMemo(() => {
    return (
      form.fullName.trim() !== "" &&
      form.fatherName.trim() !== "" &&
      form.gender !== "" &&
      form.email.trim() !== "" &&
      form.whatsapp.trim() !== "" &&
      form.dob !== "" &&
      form.brn.trim() !== "" &&
      form.branch.trim() !== "" &&
      form.semester !== "" &&
      form.collegeName.trim() !== "" &&
      form.collegeType !== "" &&
      form.state !== "" &&
      form.qualification !== "" &&
      form.marks10.trim() !== "" &&
      form.marks12.trim() !== "" &&
      form.marksSem.trim() !== "" &&
      marksheet12File !== null &&
      marksheetSemFile !== null
    );
  }, [form, marksheet12File, marksheetSemFile]);

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
    if (!form.brn.trim()) return "Please enter your College/University Reg. No.";
    if (!form.branch.trim()) return "Please enter your branch.";
    if (!form.semester) return "Please select your semester.";
    if (!form.collegeName.trim()) return "Please enter your college name.";
    if (!form.collegeType) return "Please select your college type.";
    if (!form.state) return "Please select your state.";
    if (!form.qualification) return "Please select your qualification.";
    if (!form.marks10.trim()) return "Please enter your 10th marks.";
    if (!form.marks12.trim()) return "Please enter your 12th/Diploma marks.";
    if (!form.marksSem.trim()) return "Please enter your Last semester marks.";
    if (!marksheet12File) return "Please upload your 10th/12th marksheet.";
    if (!marksheetSemFile) return "Please upload your latest semester marksheet.";
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
        "Supabase is not configured. Please contact support.",
      );
      return;
    }
    setPaymentLoading(true);

    try {
      const orderId = `NLIT_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      if (!supabase) throw new Error("Database not initialized");

      let uploaded12Url = "";
      let uploadedSemUrl = "";
      
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      
      if ((marksheet12File || marksheetSemFile) && (!cloudName || !uploadPreset)) {
        throw new Error("Cloudinary configuration is missing. Please set Environment Variables.");
      }

      const uploadToCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset!);
        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Failed to upload marksheet to Cloudinary. Please try again.");
        const cloudData = await uploadRes.json();
        return cloudData.secure_url;
      };

      if (marksheet12File) uploaded12Url = await uploadToCloudinary(marksheet12File);
      if (marksheetSemFile) uploadedSemUrl = await uploadToCloudinary(marksheetSemFile);

      // 1. Save Pending Enrollment
      const pendingData = {
        ...form,
        marksheet12Url: uploaded12Url,
        marksheetSemUrl: uploadedSemUrl,
        payment_id: orderId,
        payment_status: "PENDING",
      };
      const { error: pendingError } = await supabase.from("enrollments").insert([
        pendingData
      ]);

      if (pendingError) {
        console.warn("Could not save pending enrollment:", pendingError);
        // We continue anyway, as the payment is the priority
      }

      // 2. Create Cashfree Order
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-cashfree-order`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount: enrollmentFee,
            order_id: orderId,
            customer_id: form.email.replace(/[^a-zA-Z0-9]/g, "_"),
            customer_email: form.email,
            customer_phone: form.whatsapp,
          }),
        }
      );

      const orderData = await response.json();
      
      if (!response.ok) {
        throw new Error(orderData.message || orderData.error || "Payment system unavailable");
      }


      if (!orderData.payment_session_id) {
        console.error("Missing payment_session_id. Full response:", orderData);
        throw new Error("Payment session could not be created. Please try again.");
      }

      // Ensure SDK is initialized
      let cfInstance = cashfree;
      if (!cfInstance && typeof window !== "undefined" && (window as any).Cashfree) {
        const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox";
        cfInstance = (window as any).Cashfree({ mode });
        setCashfree(cfInstance);
      }

      if (!cfInstance) {
        throw new Error("Payment gateway (Cashfree SDK) failed to load. Please refresh the page.");
      }

      saveFormToLocal(form);

      cfInstance.checkout({
        paymentSessionId: orderData.payment_session_id,
      });
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setError(err.message || "Failed to initiate payment. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
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
                <span className="mb-2 block text-sm font-medium">Course Name / Qualification</span>
                <select
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                >
                  <option value="">Select Qualification</option>
                  <option value="Diploma">Diploma</option>
                  <option value="B-Tech">B-Tech</option>
                  <option value="BBA/BMS">BBA/BMS</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="MBA">MBA</option>
                  <option value="MBBS">MBBS</option>
                  <option value="B.Pharma">B.Pharma</option>
                </select>
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
                <span className="mb-2 block text-sm font-medium">College/University Reg. No.</span>
                <input
                  name="brn"
                  value={form.brn}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="Enter Registration No."
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
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                >
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">10th Marks (%)</span>
                <input
                  name="marks10"
                  value={form.marks10}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="E.g. 85%"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">12th/Diploma Marks (%)</span>
                <input
                  name="marks12"
                  value={form.marks12}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="E.g. 80%"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Last Sem Marks (CGPA/%)</span>
                <input
                  name="marksSem"
                  value={form.marksSem}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder="E.g. 8.5 CGPA"
                  required
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Upload 10th/12th Marksheet (Max 100KB)</span>
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file-1" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:border-slate-700 dark:hover:border-slate-600 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                            <svg className="w-8 h-8 mb-3 text-slate-500 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">{marksheet12File ? marksheet12File.name : "Click to upload"}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">PDF, JPG, PNG (MAX. 100KB)</p>
                        </div>
                        <input id="dropzone-file-1" type="file" className="hidden" accept=".pdf,image/*" onChange={handle12FileChange} required/>
                    </label>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Upload Latest Sem Marksheet (Max 100KB)</span>
                <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file-2" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:border-slate-700 dark:hover:border-slate-600 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                            <svg className="w-8 h-8 mb-3 text-slate-500 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">{marksheetSemFile ? marksheetSemFile.name : "Click to upload"}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">PDF, JPG, PNG (MAX. 100KB)</p>
                        </div>
                        <input id="dropzone-file-2" type="file" className="hidden" accept=".pdf,image/*" onChange={handleSemFileChange} required/>
                    </label>
                </div>
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
                disabled={submitting || paymentLoading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 text-base font-semibold text-white transition hover:shadow-lg hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-500"
              >
                {paymentLoading ? (
                  <>⏳ Initiating Payment...</>
                ) : submitting ? (
                  <>⏳ Processing...</>
                ) : isFormComplete ? (
                  <>💳 Pay ₹{enrollmentFee} & Enroll</>
                ) : (
                  <>✓ Fill Form to Enroll</>
                )}
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

        <AnimatePresence>
          {success && (
            <SuccessModal 
              onClose={() => setSuccess(null)} 
              courseTitle={course.title} 
              orderId={searchParams.get("order_id") || "N/A"}
            />
          )}
        </AnimatePresence>

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
              {isFormComplete && enrollmentFee > 0 && (
                <div className="flex items-center justify-between pt-3 border-t border-green-200 dark:border-green-700">
                  <dt className="font-bold text-green-700 dark:text-green-400">Total Fee</dt>
                  <dd className="font-bold text-green-700 dark:text-green-400">₹{enrollmentFee}</dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </main>
  );
};

const SuccessModal = ({ onClose, courseTitle, orderId }: { onClose: () => void, courseTitle: string, orderId: string }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-800"
      >
        <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
        >
          <FiX className="h-5 w-5" />
        </button>

        <div className="p-8 pt-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <FiCheckCircle className="h-10 w-10" />
          </div>

          <h2 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">
            Welcome to the Course!
          </h2>
          <p className="mb-8 text-slate-600 dark:text-slate-400">
            Your enrollment for <span className="font-semibold text-blue-600 dark:text-blue-400">{courseTitle}</span> has been confirmed.
          </p>

          <div className="mb-8 rounded-2xl border border-slate-100 bg-slate-50 p-6 text-left dark:border-slate-700 dark:bg-slate-900/50">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Enrollment Details</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Transaction ID</span>
                <span className="flex items-center gap-2 font-mono text-sm font-medium">
                  {orderId.substring(0, 12)}...
                  <FiCopy className="cursor-pointer text-slate-400 hover:text-blue-600" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                  PAID & VERIFIED
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
              <FiDownload className="h-4 w-4" />
              Receipt
            </button>
            <Link 
              href="/profile"
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Go to Dashboard
              <FiExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="bg-slate-50 px-8 py-4 text-center dark:bg-slate-900/30">
          <p className="text-xs text-slate-500">
            A confirmation has been sent to your WhatsApp and Email.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EnrollmentPage;
