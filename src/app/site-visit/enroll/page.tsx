"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { FiCheckCircle, FiCopy, FiDownload, FiExternalLink, FiLock, FiLogOut, FiMail, FiSmartphone, FiUser, FiX } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Suspense } from "react";

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

const siteVisitsList = [
  {
    slug: "electrical-engg",
    title: "Electrical Engineering Site Visit",
    description: "Get hands-on exposure to smart power grids, electrical substations, industrial control systems, and automated motor control units.",
    highlights: ["Substation Automation", "Transformer Assembly & Testing", "Smart Grid Infrastructure", "Industrial PLC Panels"]
  },
  {
    slug: "automobile-engg",
    title: "Automobile Engineering Site Visit",
    description: "Visit state-of-the-art vehicle assembly lines, engine diagnostic centers, and explore electric vehicle (EV) chassis design and testing labs.",
    highlights: ["Automated Assembly Lines", "IC Engine Assembly & Dyno", "EV Battery & Drivetrain Lab", "Chassis Fabrication Units"]
  },
  {
    slug: "leather-engg",
    title: "Leather Engineering Site Visit",
    description: "Understand the end-to-end processing of leather, eco-friendly tannery automation, advanced testing labs, and industrial footwear manufacturing.",
    highlights: ["Tanning Operations", "Effluent Treatment Plants (ETP)", "Quality Testing & Standards", "CNC Pattern Cutting & Stitching"]
  },
  {
    slug: "chemical-engg",
    title: "Chemical Engineering Site Visit",
    description: "Tour large-scale process plants, petrochemical refineries, chemical reactors, and discover industrial distillation and purification setups.",
    highlights: ["Distillation Columns", "Continuous Stirred-Tank Reactors", "Refinery Process Controls", "Safety & HAZOP Implementations"]
  }
];

const SiteVisitEnrollmentPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const siteVisitSlug = searchParams.get("course") || "general";

  const siteVisit = useMemo(() => {
    const found = siteVisitsList.find((item) => item.slug === siteVisitSlug);
    const defaultSiteVisit = {
      slug: "general",
      title: "NLIT Site Visit Registration",
      description: "Select your engineering discipline site visit and fill out the registration form to book your slot.",
      highlights: ["Visit operational engineering plants", "Learn from industrial plant heads", "Get professional observation certificate"],
    };
    return found || defaultSiteVisit;
  }, [siteVisitSlug]);

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
    course: siteVisit.title,
    message: "",
    marks10: "",
    marks12: "",
    marksSem: "",
    qualification: "",
    marksheet12Url: "",
    marksheetSemUrl: "",
    duration: "7 Days",
    internshipMode: "Offline",
  });
  const [marksheet12File, setMarksheet12File] = useState<File | null>(null);
  const [marksheetSemFile, setMarksheetSemFile] = useState<File | null>(null);

  const handle12FileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 500 * 1024) {
        alert("Maximum file size strictly limited to 500 KB.");
        return;
      }
      setMarksheet12File(e.target.files[0]);
    }
  };

  const handleSemFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 500 * 1024) {
        alert("Maximum file size strictly limited to 500 KB.");
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
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const supabaseConfigured = Boolean(supabase);

  // Persistence helpers
  const saveFormToLocal = (formData: any, fee: number, mrp: number) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pending_site_visit_enrollment", JSON.stringify({ ...formData, _fee: fee, _mrp: mrp }));
    }
  };

  const loadFormFromLocal = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pending_site_visit_enrollment");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  };

  const clearFormFromLocal = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("pending_site_visit_enrollment");
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
    const orderId = searchParams.get("order_id");
    if (orderId) {
      setPendingOrderId(orderId);
      verifyPaymentStatus({ orderId });
    }
  }, [searchParams]);

  const [paidFee, setPaidFee] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);

  const handlePaymentSuccess = (actualAmount?: number) => {
    const saved = loadFormFromLocal();
    setPaidFee(actualAmount || (saved ? saved._fee : enrollmentFee));
    setOriginalPrice(saved ? saved._mrp : displayPrice);

    setSuccess("Site Visit Enrollment Successful!");
    setPaymentVerified(true);
    setPendingOrderId(null);
    setError(null);
    clearFormFromLocal();

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#2563eb", "#9333ea", "#10b981"],
    });
  };

  const verifyPaymentStatus = async (payload: any) => {
    setSubmitting(true);
    setError(null);

    try {
      if (!supabase) {
        throw new Error("Supabase client is not initialized");
      }
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const activeGateway = process.env.NEXT_PUBLIC_ACTIVE_PAYMENT_GATEWAY || "cashfree";
      const functionUrl = activeGateway === "razorpay" 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/verify-razorpay-payment`
        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/verify-cashfree-payment`;
      
      const res = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Verify Edge Function Error:", errText);
        let errorMsg = errText;
        try {
           const parsed = JSON.parse(errText);
           if (parsed.error) errorMsg = parsed.error;
           if (parsed.message) errorMsg = parsed.message;
        } catch(e) {}
        throw new Error(`Verification Error: ${errorMsg}`);
      }

      const data = await res.text();
      let parsedData: any = data;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        console.error("Failed to parse response data as JSON:", e);
      }

      if (parsedData?.status === "PAID") {
        handlePaymentSuccess(parsedData.amount);
      } else {
        setError("Payment could not be verified or is still processing. Please wait a moment and click 'Retry Verification' below.");
        const savedForm = loadFormFromLocal();
        if (savedForm) setForm(savedForm);
      }
    } catch (err: any) {
      console.error("Post-payment error:", err);
      setError("Payment received, but we couldn't verify your enrollment. Please click 'Retry Verification' below or contact support.");
      const savedForm = loadFormFromLocal();
      if (savedForm) setForm(savedForm);
    } finally {
      setSubmitting(false);
    }
  };

  // Site Visit pricing: flat table based on duration × college type
  // 7 Days  → Govt Rs. 999,  Private Rs. 1499
  // 14 Days → Govt Rs. 1999, Private Rs. 2499
  // 21 Days → Govt Rs. 3499, Private Rs. 3999
  const enrollmentFee = useMemo(() => {
    const duration = form.duration || "";

    if (form.collegeType === "govt") {
      if (duration.includes("7")) return 999;
      if (duration.includes("14")) return 1999;
      if (duration.includes("21")) return 3499;
      return 999;
    }
    if (form.collegeType === "private") {
      if (duration.includes("7")) return 1499;
      if (duration.includes("14")) return 2499;
      if (duration.includes("21")) return 3999;
      return 1499;
    }
    if (form.collegeType === "job") return 3999;
    return 0;
  }, [form.collegeType, form.duration]);

  const displayPrice = useMemo(() => {
    return enrollmentFee + 2000;
  }, [enrollmentFee]);

  const isCollegeStudent = form.collegeType === "govt" || form.collegeType === "private";

  // Check if form is fully filled
  const isFormComplete = useMemo(() => {
    return (
      form.fullName.trim() !== "" &&
      form.fatherName.trim() !== "" &&
      form.gender !== "" &&
      form.email.trim() !== "" &&
      form.whatsapp.trim() !== "" &&
      form.dob !== "" &&
      form.branch.trim() !== "" &&
      form.semester !== "" &&
      form.collegeName.trim() !== "" &&
      form.collegeType !== "" &&
      form.state !== "" &&
      form.qualification !== "" &&
      form.marks10.trim() !== "" &&
      form.marksSem.trim() !== "" &&
      (marksheet12File !== null || marksheetSemFile !== null)
    );
  }, [form, marksheet12File, marksheetSemFile]);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      course: siteVisit.title,
      collegeType: searchParams.get("type") || current.collegeType,
      state: searchParams.get("state") || current.state,
      email: user?.email || current.email,
    }));
  }, [siteVisit.title, searchParams, user]);

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
    if (!form.branch.trim()) return "Please enter your branch.";
    if (!form.semester) return "Please select your semester.";
    if (!form.collegeName.trim()) return "Please enter your college name.";
    if (!form.collegeType) return "Please select your college type.";
    if (!form.state) return "Please select your state.";
    if (!form.qualification) return "Please select your qualification.";
    if (!form.marks10.trim()) return "Please enter your 10th marks.";
    if (!form.marksSem.trim()) return "Please enter your Last semester marks.";
    if (!marksheet12File && !marksheetSemFile) return "Please upload your 10th/12th marksheet OR your latest semester marksheet.";
    if (marksheet12File && marksheetSemFile) return "Please upload ONLY ONE certificate (do not upload both).";
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
      setError("Supabase is not configured. Please contact support.");
      return;
    }
    setPaymentLoading(true);

    try {
      const activeGatewayForId = process.env.NEXT_PUBLIC_ACTIVE_PAYMENT_GATEWAY || "cashfree";
      const orderIdPrefix = activeGatewayForId === "razorpay" ? "NLIT_RZP_" : "NLIT_SV_";
      const orderId = `${orderIdPrefix}${Date.now()}_${Math.floor(Math.random() * 1000)}`;
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
        const resourceType = file.type === "application/pdf" ? "raw" : "auto";

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
          method: "POST",
          body: formData,
        });
        
        if (!uploadRes.ok) throw new Error("Failed to upload marksheet to Cloudinary. Please try again.");
        const cloudData = await uploadRes.json();
        return cloudData.secure_url;
      };

      if (marksheet12File) uploaded12Url = await uploadToCloudinary(marksheet12File);
      if (marksheetSemFile) uploadedSemUrl = await uploadToCloudinary(marksheetSemFile);

      // Save to enrollments table in Supabase
      const pendingData: any = {
        full_name: form.fullName,
        father_name: form.fatherName,
        gender: form.gender,
        email: form.email,
        whatsapp: form.whatsapp,
        dob: form.dob,
        brn: form.brn || "SITE VISIT",
        branch: form.branch,
        semester: form.semester,
        college_name: form.collegeName,
        college_type: form.collegeType,
        state: form.state,
        course_title: `${form.course} (Site Visit)`,
        duration: form.duration,
        internship_mode: form.internshipMode,
        message: `[Site Visit Enrollment] ${form.message}`,
        qualification: form.qualification,
        marks10: form.marks10,
        marks12: form.marks12,
        marksSem: form.marksSem,
        marksheet12Url: uploaded12Url,
        marksheetSemUrl: uploadedSemUrl,
        user_id: user?.id,
        cf_payment_id: orderId,
        status: "PENDING",
        enrollment_type: "site-visit",
      };

      const { error: pendingError } = await supabase.from("enrollments").insert([pendingData]);
      if (pendingError) {
        console.warn("Could not save pending enrollment:", pendingError);
      }

      const activeGateway = process.env.NEXT_PUBLIC_ACTIVE_PAYMENT_GATEWAY || "cashfree";
      if (activeGateway === "razorpay") {
        // 2. Create Razorpay Order using Supabase Client SDK
        if (!supabase) {
          throw new Error("Supabase client is not initialized");
        }
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;
        
        const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-razorpay-order`;
        const fnResponse = await fetch(functionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
          },
          body: JSON.stringify({
            amount: enrollmentFee,
            order_id: orderId,
            customer_id: form.email.replace(/[^a-zA-Z0-9]/g, "_"),
            customer_email: form.email,
            customer_phone: form.whatsapp,
          })
        });

        let orderData;
        if (!fnResponse.ok) {
          const errText = await fnResponse.text();
          console.error("Razorpay Edge Function Error:", errText);
          let errorMsg = errText;
          try {
             const parsed = JSON.parse(errText);
             if (parsed.error) errorMsg = parsed.error;
             if (parsed.message) errorMsg = parsed.message;
          } catch(e) {}
          throw new Error(`Payment Error: ${errorMsg}`);
        } else {
          orderData = await fnResponse.json();
        }

        if (!orderData || !orderData.id) {
          console.error("Missing Razorpay order id. Full response:", orderData);
          throw new Error("Payment session could not be created. Please try again.");
        }

        if (typeof window === "undefined" || !(window as any).Razorpay) {
          throw new Error("Razorpay SDK not loaded. Please check your connection.");
        }

        saveFormToLocal(form, enrollmentFee, displayPrice);

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "", // Fallback, usually loaded from server
          amount: orderData.amount, 
          currency: orderData.currency,
          name: "NLITedu",
          description: `Enrollment for ${form.course}`,
          image: "https://www.nlitedu.com/images/logo/logo-dark.png",
          order_id: orderData.id,
          handler: function (response: any) {
            verifyPaymentStatus({
              orderId: orderData.receipt || orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });
          },
          prefill: {
            name: form.fullName,
            email: form.email,
            contact: form.whatsapp
          },
          theme: {
            color: "#2563EB"
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any){
          setError(`Payment Failed: ${response.error.description}`);
          clearFormFromLocal();
        });
        rzp.open();
      } else {
        // 2. Create Cashfree Order using Supabase Client SDK
        if (!supabase) {
          throw new Error("Supabase client is not initialized");
        }
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;
        
        const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-cashfree-order`;
        const fnResponse = await fetch(functionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
          },
          body: JSON.stringify({
            amount: enrollmentFee,
            order_id: orderId,
            customer_id: form.email.replace(/[^a-zA-Z0-9]/g, "_"),
            customer_email: form.email,
            customer_phone: form.whatsapp,
          })
        });

        let orderData;
        if (!fnResponse.ok) {
          const errText = await fnResponse.text();
          console.error("Cashfree Edge Function Error:", errText);
          throw new Error("Payment session could not be created. Please try again.");
        } else {
          orderData = await fnResponse.json();
        }

        if (!orderData || !orderData.payment_session_id) {
          throw new Error("Payment session could not be created. Please try again.");
        }

        saveFormToLocal(form, enrollmentFee, displayPrice);

        if (!cashfree) {
          throw new Error("Cashfree SDK is not loaded. Please wait a moment and try again.");
        }

        cashfree.checkout({
          paymentSessionId: orderData.payment_session_id,
          returnUrl: `${window.location.origin}/site-visit/enroll?order_id=${orderId}`
        });
      }

    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setError(err.message || "Failed to initiate payment. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 pt-[160px] pb-14 px-4 dark:bg-slate-950">
        <div className="mx-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-blue-600 to-indigo-600" />
            <div className="p-8 pt-10 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <FiLock className="h-10 w-10" />
              </div>
              <h2 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">Account Required</h2>
              <p className="mb-8 text-slate-600 dark:text-slate-400">
                Please sign in to your NLITedu account to register for <span className="font-semibold text-blue-600">{siteVisit.title}</span> and track your verification certificates.
              </p>

              <div className="grid gap-4">
                <Link
                  href="/signin"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none"
                >
                  Sign In to Continue
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 font-bold text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
                >
                  New Student? Register Now
                </Link>
              </div>

              <Link href="/site-visit" className="mt-8 inline-block text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400">
                ← Back to Site Visits
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-[160px] pb-14 px-4 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8 relative">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="mx-auto max-w-6xl mb-8">
        <div className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
            <FiUser className="text-blue-600 h-4 w-4" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Logged in as <span className="font-bold text-slate-900 dark:text-white">{user.email}</span>
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-10 flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm uppercase tracking-[0.2em] font-semibold text-blue-600 dark:text-blue-400">
                📝 Site Visit Registration
              </p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">{siteVisit.title}</h1>
            </div>
            <Link
              href="/site-visit"
              className="rounded-full bg-blue-50 border border-blue-200 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-700 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 whitespace-nowrap"
            >
              ← Back
            </Link>
          </div>

          <p className="mb-8 text-base text-slate-600 leading-relaxed dark:text-slate-300 border-l-4 border-blue-500 pl-4">{siteVisit.description}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-200">
                <p>{error}</p>
                {pendingOrderId && !submitting && (
                  <button
                    type="button"
                    onClick={() => verifyPaymentStatus({ orderId: pendingOrderId })}
                    className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                  >
                    🔄 Retry Verification
                  </button>
                )}
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
                <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address (Linked Account)</span>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    readOnly
                    className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-11 py-3 text-sm outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 cursor-not-allowed font-medium"
                    placeholder="Enter your email"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <FiLock className="text-slate-400 h-3.5 w-3.5" />
                  </div>
                </div>
                <p className="mt-1.5 text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-widest font-bold px-1">✓ Verified via Nlitedu Account</p>
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
                <span className="mb-2 block text-sm font-medium">{form.collegeType === "job" ? "Job / Employee ID" : "College/University Reg. No."}</span>
                <input
                  name="brn"
                  value={form.brn}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  placeholder={form.collegeType === "job" ? "Enter Employee / Job ID" : "Enter Registration No."}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Site Visit Duration</span>
                <select
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                >
                  <option value="7 Days">7 Days</option>
                  <option value="14 Days">14 Days</option>
                  <option value="21 Days">21 Days</option>
                </select>
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
                  <option value="job">Job Professional</option>
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

            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm font-medium text-amber-800 dark:text-amber-400">
              Note: Please upload ONLY ONE certificate (Either 10th/12th OR Latest Semester Marksheet).
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Upload 10th/12th Marksheet (Max 500KB)</span>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file-1" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:border-slate-700 dark:hover:border-slate-600 transition">
                     <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                      <svg className="w-8 h-8 mb-3 text-slate-500 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg>
                      <p className="mb-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">{marksheet12File ? marksheet12File.name : "Click to upload"}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">PDF, JPG, PNG (MAX. 500KB)</p>
                    </div>
                    <input id="dropzone-file-1" type="file" className="hidden" accept=".pdf,image/*" onChange={handle12FileChange} />
                  </label>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Upload Latest Sem Marksheet (Max 500KB)</span>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file-2" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:border-slate-700 dark:hover:border-slate-600 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                      <svg className="w-8 h-8 mb-3 text-slate-500 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg>
                      <p className="mb-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">{marksheetSemFile ? marksheetSemFile.name : "Click to upload"}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">PDF, JPG, PNG (MAX. 500KB)</p>
                    </div>
                    <input id="dropzone-file-2" type="file" className="hidden" accept=".pdf,image/*" onChange={handleSemFileChange} />
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
                placeholder="Any additional details or special requests for the site visit team"
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
                ) : isFormComplete && enrollmentFee > 0 ? (
                  <><span className="line-through text-white/60 mr-1">Rs. {displayPrice.toLocaleString("en-IN")}</span> 💳 Pay Rs. {enrollmentFee.toLocaleString("en-IN")} & Register</>
                ) : (
                  <>✓ Fill Form to Register</>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/site-visit")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-8 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
              >
                ← Return
              </button>
            </div>
          </form>
        </section>

        <AnimatePresence>
          {success && (
            <SuccessModal
              onClose={() => setSuccess(null)}
              courseTitle={siteVisit.title}
              orderId={searchParams.get("order_id") || pendingOrderId || "N/A"}
              customerEmail={user?.email || form.email || ""}
              paidAmount={paidFee}
              originalPrice={originalPrice}
            />
          )}
        </AnimatePresence>

        <aside className="sticky top-[170px] space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8 h-fit">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">📋 Visit Summary</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Review your registration details before submitting.</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700">
            <p className="text-xs uppercase tracking-widest font-bold text-blue-600 dark:text-blue-400">🎓 Target Plant</p>
            <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">{siteVisit.title}</h3>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{siteVisit.description}</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700">
            <p className="text-xs uppercase tracking-widest font-bold text-purple-600 dark:text-purple-400">✨ Observations & Learnings</p>
            <ul className="mt-4 space-y-2.5 text-slate-700 dark:text-slate-300">
              {siteVisit.highlights?.map((item: string) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-blue-600"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-6 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700">
            <p className="text-xs uppercase tracking-widest font-bold text-green-600 dark:text-green-400">✓ Registration Details</p>
            <dl className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between">
                <dt className="font-medium">Site Visit</dt>
                <dd>{siteVisit.title}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-medium">College Type</dt>
                <dd className="capitalize">{form.collegeType === "job" ? "Job Professional" : form.collegeType ? `${form.collegeType} College` : "Not selected"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-medium">State</dt>
                <dd>{form.state || "Not selected"}</dd>
              </div>
              <div className="pt-3 border-t border-green-200 dark:border-green-700">
                {isFormComplete && enrollmentFee > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <dt className="font-medium text-slate-500 dark:text-slate-400">MRP</dt>
                      <dd className="font-medium text-slate-400 line-through">Rs. {displayPrice.toLocaleString("en-IN")}</dd>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <dt className="font-bold text-green-700 dark:text-green-400 text-base">Offer Price</dt>
                      <dd className="font-extrabold text-green-700 dark:text-green-400 text-lg">Rs. {enrollmentFee.toLocaleString("en-IN")}</dd>
                    </div>
                    <div className="rounded-lg bg-green-100 dark:bg-green-900/30 px-3 py-2 text-center mt-2">
                      <span className="text-xs font-bold text-green-700 dark:text-green-400">💰 You save Rs. {(displayPrice - enrollmentFee).toLocaleString("en-IN")} ({Math.round(((displayPrice - enrollmentFee) / displayPrice) * 100)}% OFF)</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-3 text-center">
                    <span className="text-2xl">🔒</span>
                    <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">Complete the form to unlock your special offer price</p>
                    <p className="text-xs text-slate-400">Fill all required fields to reveal the discounted price</p>
                  </div>
                )}
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </main>
  );
};

const SuccessModal = ({ onClose, courseTitle, orderId, customerEmail, paidAmount, originalPrice }: { onClose: () => void, courseTitle: string, orderId: string, customerEmail: string, paidAmount: number, originalPrice: number }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadReceipt = async () => {
    setIsGenerating(true);
    try {
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;

      pdf.setFillColor(37, 99, 235);
      pdf.rect(0, 0, pdfWidth, 45, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(26);
      pdf.setFont("helvetica", "bold");
      pdf.text("NLITedu", margin, 20);

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text("NEXGEN LEARNING INSTITUTE OF TECHNOLOGY", margin, 26);

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("OFFICIAL SITE VISIT RECEIPT", pdfWidth - margin, 20, { align: "right" });

      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Transaction ID: ${orderId}`, pdfWidth - margin, 26, { align: "right" });

      let y = 65;
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("RECEIPT TO:", margin, y);
      pdf.text("RECEIPT DETAILS:", pdfWidth - margin, y, { align: "right" });

      y += 6;
      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text(customerEmail.split("@")[0].toUpperCase(), margin, y);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, pdfWidth - margin, y, { align: "right" });

      y += 5;
      pdf.setTextColor(51, 65, 85);
      pdf.text(customerEmail, margin, y);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(16, 185, 129);
      pdf.text("Status: PAID & VERIFIED", pdfWidth - margin, y, { align: "right" });

      y += 15;
      pdf.setFillColor(241, 245, 249);
      pdf.rect(margin, y, pdfWidth - (margin * 2), 10, "F");
      
      pdf.setTextColor(71, 85, 105);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.text("SITE VISIT / FACILITY DESCRIPTION", margin + 5, y + 6.5);
      pdf.text("STATUS", pdfWidth - margin - 35, y + 6.5, { align: "right" });
      pdf.text("AMOUNT", pdfWidth - margin - 5, y + 6.5, { align: "right" });

      y += 10;
      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin, y, pdfWidth - margin, y);

      y += 8;
      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text(courseTitle, margin + 5, y);

      pdf.setTextColor(16, 185, 129);
      pdf.text("PAID", pdfWidth - margin - 35, y, { align: "right" });

      pdf.setTextColor(15, 23, 42);
      pdf.text(`Rs. ${paidAmount.toLocaleString("en-IN")}.00`, pdfWidth - margin - 5, y, { align: "right" });

      y += 4.5;
      pdf.setTextColor(100, 116, 139);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.text("Includes plant entry pass, expert engineer observations guide, and certificate of completion.", margin + 5, y);

      y += 10;
      pdf.line(margin, y, pdfWidth - margin, y);

      y += 10;
      pdf.setTextColor(71, 85, 105);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);

      if (originalPrice > paidAmount) {
         pdf.text("Course Fee:", pdfWidth - margin - 40, y, { align: "right" });
         pdf.text(`Rs. ${originalPrice.toLocaleString("en-IN")}.00`, pdfWidth - margin - 5, y, { align: "right" });
         y += 6;
         pdf.text("Discount:", pdfWidth - margin - 40, y, { align: "right" });
         pdf.text(`-Rs. ${(originalPrice - paidAmount).toLocaleString("en-IN")}.00`, pdfWidth - margin - 5, y, { align: "right" });
         y += 6;
      }

      pdf.text("Subtotal:", pdfWidth - margin - 40, y, { align: "right" });
      pdf.setTextColor(15, 23, 42);
      pdf.text(`Rs. ${paidAmount.toLocaleString("en-IN")}.00`, pdfWidth - margin - 5, y, { align: "right" });

      y += 6;
      pdf.setTextColor(71, 85, 105);
      pdf.text("Tax (GST 0%):", pdfWidth - margin - 40, y, { align: "right" });
      pdf.setTextColor(15, 23, 42);
      pdf.text("Rs. 0.00", pdfWidth - margin - 5, y, { align: "right" });

      y += 8;
      pdf.setDrawColor(226, 232, 240);
      pdf.line(pdfWidth - margin - 60, y - 4, pdfWidth - margin, y - 4);
      pdf.setTextColor(37, 99, 235);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("Total Paid:", pdfWidth - margin - 40, y, { align: "right" });
      pdf.text(`Rs. ${paidAmount.toLocaleString("en-IN")}.00`, pdfWidth - margin - 5, y, { align: "right" });

      y += 20;
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(margin, y, pdfWidth - (margin * 2), 35, 3, 3, "F");
      pdf.setDrawColor(241, 245, 249);
      pdf.roundedRect(margin, y, pdfWidth - (margin * 2), 35, 3, 3, "D");

      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text("Important Notice & Next Steps:", margin + 8, y + 8);

      pdf.setTextColor(71, 85, 105);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.text("1. A confirmation email has been sent to your registered email address.", margin + 8, y + 14);
      pdf.text("2. The operational visit coordinator will contact you on your WhatsApp number within 24 hours.", margin + 8, y + 19);
      pdf.text("3. Safety equipment guidelines (shoes, helmets) will be shared prior to the visit.", margin + 8, y + 24);

      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin, pdfHeight - 30, pdfWidth - margin, pdfHeight - 30);

      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(6);
      
      const t1 = "WEBSITE DESIGNED BY ";
      const t2 = "SAVERAGRAPHICS ";
      const t3 = "A ";
      const t4 = "sindhuragroup ";
      const t5 = "COMPANY";
      
      const w1 = pdf.getTextWidth(t1);
      const w2 = pdf.getTextWidth(t2);
      const w3 = pdf.getTextWidth(t3);
      pdf.setFont("times", "italic");
      const w4 = pdf.getTextWidth(t4);
      pdf.setFont("helvetica", "normal");
      const w5 = pdf.getTextWidth(t5);
      
      let startX = (pdfWidth - (w1 + w2 + w3 + w4 + w5)) / 2;
      const fY = pdfHeight - 8;
      
      pdf.setTextColor(148, 163, 184);
      pdf.text(t1, startX, fY); startX += w1;
      
      pdf.setTextColor(100, 116, 139); // slightly darker
      pdf.text(t2, startX, fY); startX += w2;
      
      pdf.setTextColor(148, 163, 184);
      pdf.text(t3, startX, fY); startX += w3;
      
      pdf.setFont("times", "italic");
      pdf.text(t4, startX, fY); startX += w4;
      
      pdf.setFont("helvetica", "normal");
      pdf.text(t5, startX, fY);

      pdf.save(`NLITedu_SiteVisit_Receipt_${orderId.substring(0, 8)}.pdf`);
    } catch (err: any) {
      console.error("Failed to generate PDF", err);
      alert("PDF Generation Error: " + (err.message || "Unknown error"));
    } finally {
      setIsGenerating(false);
    }
  };

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
        id="receipt-content"
      >
        <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600" />

        <button
          id="receipt-close-btn"
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
            Booking Confirmed!
          </h2>
          <p className="mb-8 text-slate-600 dark:text-slate-400">
            Your booking for <span className="font-semibold text-blue-600 dark:text-blue-400">{courseTitle}</span> has been confirmed.
          </p>

          <div className="mb-8 rounded-2xl border border-slate-100 bg-slate-50 p-6 text-left dark:border-slate-700 dark:bg-slate-900/50">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Registration Details</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Transaction ID</span>
                <span className="flex items-center gap-2 font-mono text-sm font-medium">
                  {orderId.substring(0, 15)}...
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Email</span>
                <span className="text-sm font-medium">{customerEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                  PAID & VERIFIED
                </span>
              </div>
            </div>
          </div>

          <div id="receipt-actions" className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                onClick={handleDownloadReceipt}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <FiDownload className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Download Receipt"}
              </button>
              <Link
                href="/profile"
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Dashboard
                <FiExternalLink className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="https://play.google.com/store/apps/details?id=com.nlitedu.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700 hover:shadow-blue-500/40"
              >
                <FiSmartphone className="h-5 w-5" />
                Get NLITedu on Google Play
              </a>
              <a
                href="https://github.com/saveragraphics/NLITedu-Mobile/raw/main/releases/app-release.apk"
                download
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                Or, download the APK file directly
              </a>
            </div>
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

const SiteVisitEnrollmentPage = () => {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    }>
      <SiteVisitEnrollmentPageContent />
    </Suspense>
  );
};

export default SiteVisitEnrollmentPage;
