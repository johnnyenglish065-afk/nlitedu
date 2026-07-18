"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { FiCheckCircle, FiCopy, FiDownload, FiExternalLink, FiLock, FiLogOut, FiMail, FiSmartphone, FiUser, FiX } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Suspense } from "react";

import { fetchCourses } from "@/data/courses";
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

const EnrollmentPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const courseSlug = searchParams.get("course") || "general";
  const programParam = searchParams.get("program");
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    fetchCourses().then((data) => {
      setCourses(data);
      setLoadingCourses(false);
    });
  }, []);

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
    course: "",
    message: "",
    marks10: "",
    marks12: "",
    marksSem: "",
    qualification: "",
    marksheet12Url: "",
    marksheetSemUrl: "",
    duration: "",
    internshipMode: "",
  });

  const course = useMemo(() => {
    const defaultCourse = {
      slug: "general",
      title: "NLIT Course Enrollment",
      description: "Select your course and fill out the enrollment form so we can reserve your seat and begin your learning journey.",
      highlights: ["Choose from courses across design, development, AI, and engineering", "Secure admission with a simple online form", "Receive course guidance from the NLIT team"],
      program_type: "Internship",
      govt_price: 0,
      pvt_price: 0,
      job_price: 0,
    };

    if (loadingCourses) {
      return {
        ...defaultCourse,
        title: "Loading...",
        description: "Loading course details...",
        highlights: [],
      };
    }

    let found = courses.find((item) => item.title === form.course);
    if (!found) {
      found = courses.find((item) => item.slug === courseSlug);
    }

    if (!found) return defaultCourse;

    return {
      ...found,
      highlights: Array.isArray(found.highlights) ? found.highlights : [],
    };
  }, [form.course, courseSlug, courses, loadingCourses]);
  const [marksheet12File, setMarksheet12File] = useState<File | null>(null);
  const [marksheetSemFile, setMarksheetSemFile] = useState<File | null>(null);
  const [collegeIdFile, setCollegeIdFile] = useState<File | null>(null);

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

  const handleCollegeIdFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 200 * 1024) {
        alert("College ID file size must be under 200 KB.");
        return;
      }
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, JPEG, or PNG files are allowed for College ID.");
        return;
      }
      setCollegeIdFile(file);
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
      localStorage.setItem("pending_enrollment", JSON.stringify({ ...formData, _fee: fee, _mrp: mrp }));
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
      localStorage.removeItem("nlitedu_enrollment_draft");
    }
  };

  // Global Resume Feature: Load draft on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const draft = localStorage.getItem("nlitedu_enrollment_draft");
        if (draft) {
          const parsed = JSON.parse(draft);
          setForm((prev) => ({
            ...prev,
            ...parsed,
            // Override with URL params if they exist
            collegeType: searchParams.get("type") || parsed.collegeType || prev.collegeType,
            state: searchParams.get("state") || parsed.state || prev.state,
            course: searchParams.get("course") && searchParams.get("course") !== "general" ? course?.title || prev.course : parsed.course || prev.course
          }));
        }
      } catch (e) {
        console.error("Failed to parse draft form", e);
      }
    }
  }, [searchParams, course?.title]);

  // Global Resume Feature: Auto-save draft on form change
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (form.fullName || form.email || form.whatsapp) {
        localStorage.setItem("nlitedu_enrollment_draft", JSON.stringify(form));
      }
    }
  }, [form]);

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
    // Check if we returned from Cashfree checkout with an order_id
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
    
    setSuccess("Enrollment Successful!");
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

  const verifyPaymentStatus = async (payload: any, retryCount = 0) => {
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
        setSubmitting(false);
      } else {
        if (retryCount < 3) {
          setError(`Verifying payment status (attempt ${retryCount + 1}/3)...`);
          await new Promise((resolve) => setTimeout(resolve, 3000));
          await verifyPaymentStatus(payload, retryCount + 1);
          return;
        }
        setError("Payment could not be verified or is still processing. Please wait a moment and click 'Retry Verification' below.");
        const savedForm = loadFormFromLocal();
        if (savedForm) setForm(savedForm);
        setSubmitting(false);
      }
    } catch (err: any) {
      console.error("Post-payment error:", err);
      if (retryCount < 3) {
        setError(`Verifying payment status (attempt ${retryCount + 1}/3)...`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await verifyPaymentStatus(payload, retryCount + 1);
        return;
      }
      setError("Payment received, but we couldn't verify your enrollment. Please click 'Retry Verification' below or contact support.");
      const savedForm = loadFormFromLocal();
      if (savedForm) setForm(savedForm);
      setSubmitting(false);
    }
  };

  const isInternship = useMemo(() => {
    if (course?.program_type) {
      return course.program_type === "Internship";
    }
    return programParam === "internship" || courseSlug === "general" || !course?.govt_price;
  }, [programParam, courseSlug, course]);

  // Determine fee based on college type and course
  const enrollmentFee = useMemo(() => {
    if (loadingCourses) return 0;

    // Apply legacy pricing rules (Bihar/Other State) for internship/general courses
    if (isInternship) {
      if (form.state === "Bihar") {
        const duration = form.duration || "";
        const mode = form.internshipMode || "Online";

        if (form.collegeType === "govt") {
          if (mode === "Online") {
            if (duration.includes("2")) return 799;
            if (duration.includes("4")) return 999;
            if (duration.includes("6")) return 1199;
            if (duration.includes("8")) return 1399;
            return 999; // default fallback before selection
          } else { // Online + Offline or Both
            if (duration.includes("2")) return 1299;
            if (duration.includes("4")) return 1499;
            if (duration.includes("6")) return 1999;
            if (duration.includes("8")) return 2499;
            return 1499; // default fallback before selection
          }
        }
        if (form.collegeType === "private") {
          if (mode === "Online") {
            if (duration.includes("2")) return 999;
            if (duration.includes("4")) return 1499;
            if (duration.includes("6")) return 1999;
            if (duration.includes("8")) return 2499;
            return 1999; // default fallback before selection
          } else { // Online + Offline or Both
            if (duration.includes("2")) return 1799;
            if (duration.includes("4")) return 1999;
            if (duration.includes("6")) return 2499;
            if (duration.includes("8")) return 2999;
            return 1999; // default fallback before selection
          }
        }
        if (form.collegeType === "job") return 2999;
        return 0;
      }

      // Other States
      if (form.collegeType === "govt") {
        return 1499;
      }
      if (form.collegeType === "private") return 1999;
      if (form.collegeType === "job") return 2999;
      return 0;
    }

    // Apply strict tiered pricing for Foundation courses
    if (form.collegeType === "govt") return course?.govt_price || 0;
    if (form.collegeType === "private") return course?.pvt_price || 0;
    if (form.collegeType === "job") return course?.job_price || 0;
    return 0;
  }, [form.collegeType, form.state, form.duration, form.internshipMode, course, isInternship, loadingCourses]);

  const displayPrice = course?.price ? (parseInt(course.price.replace(/\D/g, '')) || 0) : ((course?.pvt_price || 2999) + 4000);

  const isCollegeStudent = form.collegeType === "govt" || form.collegeType === "private";

  // Check if form is fully filled
  const isFormComplete = useMemo(() => {
    const baseComplete =
      form.fullName.trim() !== "" &&
      form.fatherName.trim() !== "" &&
      form.gender !== "" &&
      form.email.trim() !== "" &&
      form.whatsapp.trim() !== "" &&
      form.dob !== "" &&
      (isInternship || form.brn.trim() !== "") &&
      form.branch.trim() !== "" &&
      form.semester !== "" &&
      form.collegeName.trim() !== "" &&
      form.collegeType !== "" &&
      form.state !== "" &&
      form.course !== "" &&
      form.course !== "NLIT Course Enrollment" &&
      form.qualification !== "" &&
      form.marks10.trim() !== "" &&
      form.marksSem.trim() !== "" &&
      (!isInternship || (form.duration !== "" && form.internshipMode !== "")) &&
      (marksheet12File !== null || marksheetSemFile !== null);

    // College ID is mandatory for college students (govt/private), not for job professionals
    // Internship students are exempt from ID card upload
    if (isCollegeStudent && !isInternship) {
      return baseComplete && collegeIdFile !== null;
    }
    return baseComplete;
  }, [form, marksheet12File, marksheetSemFile, collegeIdFile, isCollegeStudent, isInternship]);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      course: course.title === "NLIT Course Enrollment" ? current.course : course.title,
      collegeType: searchParams.get("type") || current.collegeType,
      state: searchParams.get("state") || current.state,
      email: user?.email || current.email,
    }));
  }, [course.title, searchParams, user]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "course") {
      const selected = courses.find((c) => c.title === value);
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (selected) {
          params.set("course", selected.slug);
          if (selected.program_type) {
            params.set("program", selected.program_type.toLowerCase());
          }
        } else {
          params.set("course", "general");
        }
        router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
      }
    }
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Please enter your full name.";
    if (!form.fatherName.trim()) return "Please enter your father's name.";
    if (!form.gender) return "Please select your gender.";
    if (!form.email.trim()) return "Please enter your email.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Please enter a valid email.";
    if (!form.whatsapp.trim()) return "Please enter your WhatsApp number.";
    if (!form.dob) return "Please select your date of birth.";
    if (!isInternship && !form.brn.trim()) return "Please enter your College/University Reg. No.";
    if (!form.branch.trim()) return "Please enter your branch.";
    if (!form.semester) return "Please select your semester.";
    if (!form.collegeName.trim()) return "Please enter your college name.";
    if (!form.collegeType) return "Please select your college type.";
    if (!form.course || form.course === "NLIT Course Enrollment") return "Please select a course.";
    if (!form.state) return "Please select your state.";
    if (!form.qualification) return "Please select your qualification.";
    if (!form.marks10.trim()) return "Please enter your 10th marks.";
    if (!form.marksSem.trim()) return "Please enter your Last semester marks.";
    if (!marksheet12File && !marksheetSemFile) return "Please upload your 10th/12th marksheet OR your latest semester marksheet.";
    if (marksheet12File && marksheetSemFile) return "Please upload ONLY ONE certificate (do not upload both).";
    if (isInternship && !form.internshipMode) return "Please select internship mode.";
    if (isInternship && !form.duration) return "Please select internship duration.";
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
      const activeGateway = process.env.NEXT_PUBLIC_ACTIVE_PAYMENT_GATEWAY || "cashfree";
      const orderIdPrefix = activeGateway === "razorpay" ? "NLIT_RZP_" : "NLIT_";
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

        // Determine resource type: 'raw' for PDFs to bypass image-specific restrictions, 'auto' for others
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

      // 1. Save Pending Enrollment
      const pendingData: any = {
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
        duration: isInternship ? form.duration : null,
        internship_mode: isInternship ? form.internshipMode : null,
        message: isInternship ? `[Internship Mode: ${form.internshipMode}] ${form.message}` : form.message,
        qualification: form.qualification,
        marks10: form.marks10,
        marks12: form.marks12,
        marksSem: form.marksSem,
        marksheet12Url: uploaded12Url,
        marksheetSemUrl: uploadedSemUrl,
        user_id: user?.id,
        cf_payment_id: orderId,
        status: "PENDING",
        enrollment_type: course?.program_type ? course.program_type.toLowerCase() : (isInternship ? "internship" : "foundation"),
      };
      let { error: pendingError } = await supabase.from("enrollments").insert([
        pendingData
      ]);

      if (pendingError && (pendingError.message?.includes("internship_mode") || pendingError.code === "42703")) {
        // Fallback if database table has not been altered yet
        const { internship_mode, ...fallbackData } = pendingData;
        const fallbackResult = await supabase.from("enrollments").insert([fallbackData]);
        pendingError = fallbackResult.error;
      }

      if (pendingError) {
        console.warn("Could not save pending enrollment:", pendingError);
        // We continue anyway, as the payment is the priority
      }

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
        setPendingOrderId(orderId);

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
            color: "#2563EB" // Blue-600 to match site theme
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
          returnUrl: `${window.location.origin}/enroll?order_id=${orderId}`
        });
      }

    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setError(err.message || "Failed to initiate payment. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };


  // Maintenance Mode Check - Only applies to Foundation courses
  // Maintenance mode manually disabled via update
  const isMaintenanceMode = (process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true") && !isInternship;

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
                Please sign in to your NLITedu account to enroll in <span className="font-semibold text-blue-600">{course.title}</span> and track your certificates.
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

              <Link href="/" className="mt-8 inline-block text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400">
                ← Back to Courses
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

      {/* Maintenance Mode Overlay */}
      {isMaintenanceMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="mx-4 max-w-lg w-full rounded-3xl border border-amber-200 bg-white/95 p-10 shadow-2xl dark:border-amber-800 dark:bg-slate-900/95 text-center animate-[fadeIn_0.3s_ease-out]">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <svg className="h-10 w-10 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Enrollment Temporarily Unavailable
            </h1>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              We are currently performing scheduled maintenance and upgrades to improve your enrollment experience. The enrollment system will be back online shortly.
            </p>
            <div className="mt-6 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-6 py-4">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                📧 For urgent inquiries, please contact the development team.
              </p>
            </div>
            <Link
              href="/"
              className="mt-8 inline-block rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              ← Return to Home
            </Link>
          </div>
        </div>
      )}

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
                <p>{error}</p>
                {pendingOrderId && !submitting && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => verifyPaymentStatus({ orderId: pendingOrderId })}
                      disabled={submitting}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                      🔄 Retry Verification
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPendingOrderId(null);
                        setError(null);
                        // Optional: Clear URL params to ensure clean slate
                        if (typeof window !== "undefined") {
                          const url = new URL(window.location.href);
                          url.searchParams.delete("order_id");
                          window.history.replaceState({}, "", url.toString());
                        }
                      }}
                      disabled={submitting}
                      className="rounded-lg border border-red-200 bg-red-100 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    >
                      ❌ Payment Failed? Restart Payment
                    </button>
                  </div>
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
                <span className="mb-2 block text-sm font-medium">Qualification / Degree</span>
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
                  required={!isInternship}
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
                  <option value="job">Job Professional</option>
                </select>
              </label>

              {/* College ID Upload — only for Govt/Private students, not for internships */}
              {(isCollegeStudent && !isInternship) && (
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-medium">Upload College ID Card <span className="text-red-500">*</span> <span className="text-xs text-slate-400">(Max 200KB — JPG/PNG only)</span></span>
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-college-id" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:border-slate-700 dark:hover:border-slate-600 transition">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                        <svg className="w-8 h-8 mb-3 text-slate-500 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">{collegeIdFile ? collegeIdFile.name : "Click to upload College ID"}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">JPG, JPEG, PNG (MAX. 200KB)</p>
                      </div>
                      <input id="dropzone-college-id" type="file" className="hidden" accept="image/jpeg,image/jpg,image/png" onChange={handleCollegeIdFileChange} />
                    </label>
                  </div>
                  {collegeIdFile && (
                    <p className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium">✓ {collegeIdFile.name} ({(collegeIdFile.size / 1024).toFixed(1)} KB)</p>
                  )}
                </label>
              )}
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

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium">Select Course <span className="text-red-500">*</span></span>
                <select
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                >
                  <option value="">Select a Course</option>
                  {courses
                    .filter((c) => {
                      if (isInternship) {
                        return c.program_type === "Internship";
                      } else {
                        return c.program_type === "Foundation";
                      }
                    })
                    .map((c) => (
                    <option key={c.slug} value={c.title}>{c.title}</option>
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
                placeholder="Any additional details for the enrollment team"
              />
            </label>

            {isInternship && (
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Internship Mode <span className="text-red-500">*</span>
                  </span>
                  <select
                    name="internshipMode"
                    value={form.internshipMode}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    required
                  >
                    <option value="">Select Internship Mode</option>
                    <option value="Online">Online</option>
                    <option value="Online + Offline">Online + Offline</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Internship Duration <span className="text-red-500">*</span>
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["2 Weeks", "4 Weeks", "6 Weeks", "8 Weeks"].map((dur) => (
                      <label key={dur} className={`cursor-pointer rounded-xl border-2 px-4 py-3 text-center font-semibold transition ${form.duration === dur ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600"}`}>
                        <input
                          type="radio"
                          name="duration"
                          value={dur}
                          checked={form.duration === dur}
                          onChange={handleChange}
                          className="hidden"
                        />
                        {dur}
                      </label>
                    ))}
                  </div>
                </label>
              </div>
            )}

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
                  <><span className="line-through text-white/60 mr-1">₹{displayPrice.toLocaleString("en-IN")}</span> 💳 Pay ₹{enrollmentFee.toLocaleString("en-IN")} & Enroll</>
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
              orderId={searchParams.get("order_id") || pendingOrderId || "N/A"}
              customerEmail={user?.email || form.email || ""}
              paidAmount={paidFee}
              originalPrice={originalPrice}
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
              {course.highlights?.map((item: string) => (
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
                <dt className="font-medium">Duration</dt>
                <dd>{isInternship && form.duration ? form.duration : (course.duration || "—")}</dd>
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
                      <dd className="font-medium text-slate-400 line-through">₹{displayPrice.toLocaleString("en-IN")}</dd>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <dt className="font-bold text-green-700 dark:text-green-400 text-base">Offer Price</dt>
                      <dd className="font-extrabold text-green-700 dark:text-green-400 text-lg">₹{enrollmentFee.toLocaleString("en-IN")}</dd>
                    </div>
                    <div className="rounded-lg bg-green-100 dark:bg-green-900/30 px-3 py-2 text-center mt-2">
                      <span className="text-xs font-bold text-green-700 dark:text-green-400">💰 You save ₹{(displayPrice - enrollmentFee).toLocaleString("en-IN")} ({Math.round(((displayPrice - enrollmentFee) / displayPrice) * 100)}% OFF)</span>
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

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297
      const margin = 20;

      // 1. Header Blue Band
      pdf.setFillColor(37, 99, 235); // Blue-600
      pdf.rect(0, 0, pdfWidth, 45, "F");

      // Header Text
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(26);
      pdf.setFont("helvetica", "bold");
      pdf.text("NLITedu", margin, 20);

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text("NLIT EDU (OPC) PVT. LTD.", margin, 26);

      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text("GSTIN: 10AALCN7967P1ZO", margin, 32);

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("OFFICIAL ENROLLMENT RECEIPT", pdfWidth - margin, 20, { align: "right" });

      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Transaction ID: ${orderId}`, pdfWidth - margin, 26, { align: "right" });

      // 2. Receipt Details Header
      let y = 65;
      pdf.setTextColor(100, 116, 139); // Slate-500
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("RECEIPT TO:", margin, y);
      pdf.text("RECEIPT DETAILS:", pdfWidth - margin, y, { align: "right" });

      y += 6;
      pdf.setTextColor(15, 23, 42); // Slate-900
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text(customerEmail.split("@")[0].toUpperCase(), margin, y);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, pdfWidth - margin, y, { align: "right" });

      y += 5;
      pdf.setTextColor(51, 65, 85); // Slate-700
      pdf.text(customerEmail, margin, y);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(16, 185, 129); // Emerald-500
      pdf.text("Status: PAID & VERIFIED", pdfWidth - margin, y, { align: "right" });

      y += 15;
      // 3. Table Header
      pdf.setFillColor(241, 245, 249); // Slate-100
      pdf.rect(margin, y, pdfWidth - (margin * 2), 10, "F");
      
      pdf.setTextColor(71, 85, 105); // Slate-600
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.text("COURSE / ITEM DESCRIPTION", margin + 5, y + 6.5);
      pdf.text("STATUS", pdfWidth - margin - 35, y + 6.5, { align: "right" });
      pdf.text("AMOUNT", pdfWidth - margin - 5, y + 6.5, { align: "right" });

      y += 10;
      // 4. Table Row
      pdf.setDrawColor(226, 232, 240); // Slate-200
      pdf.line(margin, y, pdfWidth - margin, y);

      y += 8;
      pdf.setTextColor(15, 23, 42); // Slate-900
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text(courseTitle, margin + 5, y);

      pdf.setTextColor(16, 185, 129); // Emerald-500
      pdf.text("PAID", pdfWidth - margin - 35, y, { align: "right" });

      pdf.setTextColor(15, 23, 42); // Slate-900
      pdf.text(`Rs. ${paidAmount.toLocaleString("en-IN")}.00`, pdfWidth - margin - 5, y, { align: "right" });

      y += 4.5;
      pdf.setTextColor(100, 116, 139); // Slate-500
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.text("Includes full curriculum, mentorship sessions, and certificate of completion.", margin + 5, y);

      y += 10;
      pdf.line(margin, y, pdfWidth - margin, y);

      // 5. Total Section
      y += 10;
      pdf.setTextColor(71, 85, 105); // Slate-600
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
      pdf.setTextColor(15, 23, 42); // Slate-900
      pdf.text(`Rs. ${paidAmount.toLocaleString("en-IN")}.00`, pdfWidth - margin - 5, y, { align: "right" });

      y += 6;
      pdf.setTextColor(71, 85, 105); // Slate-600
      pdf.text("Tax (GST 0%):", pdfWidth - margin - 40, y, { align: "right" });
      pdf.setTextColor(15, 23, 42); // Slate-900
      pdf.text("Rs. 0.00", pdfWidth - margin - 5, y, { align: "right" });

      y += 8;
      pdf.setDrawColor(226, 232, 240); // Slate-200
      pdf.line(pdfWidth - margin - 60, y - 4, pdfWidth - margin, y - 4);
      pdf.setTextColor(37, 99, 235); // Blue-600
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("Total Paid:", pdfWidth - margin - 40, y, { align: "right" });
      pdf.text(`Rs. ${paidAmount.toLocaleString("en-IN")}.00`, pdfWidth - margin - 5, y, { align: "right" });

      // 6. Support Details Card
      y += 20;
      pdf.setFillColor(248, 250, 252); // Slate-50
      pdf.roundedRect(margin, y, pdfWidth - (margin * 2), 35, 3, 3, "F");
      pdf.setDrawColor(241, 245, 249);
      pdf.roundedRect(margin, y, pdfWidth - (margin * 2), 35, 3, 3, "D");

      pdf.setTextColor(15, 23, 42); // Slate-900
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text("Important Notice & Next Steps:", margin + 8, y + 8);

      pdf.setTextColor(71, 85, 105); // Slate-600
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.text("1. A confirmation email has been sent to your registered email address.", margin + 8, y + 14);
      pdf.text("2. Our onboarding team will contact you on your WhatsApp number within 24 hours.", margin + 8, y + 19);
      pdf.text("3. If you have any questions, please feel free to reach out directly to info@nlitedu.com.", margin + 8, y + 24);

      // 7. Footer
      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin, pdfHeight - 30, pdfWidth - margin, pdfHeight - 30);

      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184); // Slate-400
      pdf.text("NLIT EDU (OPC) PVT. LTD. - nliteedu.com", pdfWidth / 2, pdfHeight - 20, { align: "center" });
      pdf.text("This is an electronically generated official receipt and does not require a physical signature.", pdfWidth / 2, pdfHeight - 15, { align: "center" });

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

      pdf.save(`NLITedu_Receipt_${orderId.substring(0, 8)}.pdf`);
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

const EnrollmentPage = () => {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    }>
      <EnrollmentPageContent />
    </Suspense>
  );
};

export default EnrollmentPage;
