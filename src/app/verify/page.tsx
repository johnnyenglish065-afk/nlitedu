"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "@/lib/supabaseClient";
import {
  HiShieldCheck,
  HiShieldExclamation,
  HiSearch,
  HiOutlineClipboard,
  HiCheck,
  HiPrinter,
  HiOutlineAcademicCap,
  HiCalendar,
  HiClock,
  HiBriefcase,
  HiArrowLeft,
  HiQrcode
} from "react-icons/hi";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idParam = searchParams.get("id") || searchParams.get("number") || "";

  const [searchVal, setSearchVal] = useState(idParam);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (idParam) {
      setSearchVal(idParam);
      handleVerify(idParam);
    }
  }, [idParam]);

  const handleVerify = async (queryVal: string) => {
    const cleanVal = queryVal.trim();
    if (!cleanVal) return;

    setLoading(true);
    setErrorMsg("");
    setResult(null);
    setSearched(true);

    try {
      let foundCert = null;

      // 1. Try querying certificates table if client is initialized
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("certificates")
            .select("*")
            .or(`certificate_number.eq.${cleanVal},id.eq.${cleanVal}`)
            .maybeSingle();

          if (!error && data) {
            foundCert = {
              student_name: data.student_name,
              course_name: data.course_name,
              college_name: data.college_name || "NLIT Authorized Center",
              grade: data.grade || "A",
              duration: data.duration || "N/A",
              issue_date: data.issue_date,
              certificate_number: data.certificate_number,
              pdf_url: data.pdf_url,
              is_fallback: false,
              status: "ACTIVE"
            };
          }
        } catch (e) {
          console.warn("Certificates table not queried or does not exist yet. Falling back to enrollments.", e);
        }
      }

      // 2. Fallback to enrollments table if not found
      if (!foundCert && supabase) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanVal);
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanVal);

        if (isUuid || isEmail) {
          let query = supabase.from("enrollments").select("*");
          if (isUuid) {
            query = query.eq("id", cleanVal);
          } else {
            query = query.eq("email", cleanVal);
          }

          const { data: enrollData, error: enrollError } = await query.maybeSingle();

          if (enrollData) {
            foundCert = {
              student_name: enrollData.full_name,
              course_name: enrollData.course_title,
              college_name: enrollData.college_name || "N/A",
              grade: "VERIFIED",
              duration: enrollData.duration || "Training Program",
              issue_date: new Date(enrollData.created_at).toISOString().split("T")[0],
              certificate_number: `ENROLL-${enrollData.id.slice(0, 8).toUpperCase()}`,
              is_fallback: true,
              fallback_type: "enrollment",
              status: enrollData.status
            };
          }
        }
      }

      if (foundCert) {
        setResult(foundCert);
      } else {
        setErrorMsg("No matching certificate record found. Please verify the ID or format.");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setErrorMsg("An error occurred while connecting to the verification database.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!result) return;
    const shareUrl = `${window.location.origin}/verify?id=${result.certificate_number}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 dark:bg-black transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition mb-8 dark:text-slate-400 dark:hover:text-white"
        >
          <HiArrowLeft /> Back to home
        </Link>

        {/* Header Title */}
        <div className="text-center mb-12">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest inline-block mb-4 dark:bg-blue-900/30 dark:text-blue-400">
            NLIT Security Ledger
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight mb-4">
            Certificate Verification Portal
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-lg">
            Verify the authenticity and status of academic credentials and certificates issued by NLIT EDU (OPC) PVT. LTD.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl mb-12 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80 relative overflow-hidden">
          {/* Subtle decoration gradient */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl -z-10" />

          <h2 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2.5">
            <HiQrcode className="text-primary text-2xl dark:text-blue-400" />
            Enter Certificate Credentials
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify(searchVal);
            }}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="relative flex-1">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
              <input
                type="text"
                placeholder="e.g. NLIT-2026-1001 or Enrollment UUID"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-semibold text-black dark:text-white focus:border-primary dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchVal.trim()}
              className="py-4 px-8 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Certificate"
              )}
            </button>
          </form>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 leading-relaxed">
            * Note: Certificates scanned via QR codes will automatically populate the credentials. Recruiter inquiries can also verify status by student registration UUID.
          </p>
        </div>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6 dark:border-blue-500" />
              <p className="text-slate-500 dark:text-slate-400 font-bold animate-pulse">
                Querying security ledger nodes...
              </p>
            </motion.div>
          )}

          {!loading && searched && result && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="print-section"
            >
              {/* Premium Verification Badge */}
              <div className="bg-white dark:bg-slate-900 border-2 border-green-500/30 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md">
                {/* Header status bar */}
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <HiShieldCheck className="text-4xl" />
                    <div>
                      <h3 className="font-black text-lg tracking-tight uppercase">Credential Verified</h3>
                      <p className="text-xs text-green-100">Secured & registered in NLIT registry</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.pdf_url && (
                      <a
                        href={result.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-950/30 border border-emerald-500/20"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download PDF
                      </a>
                    )}
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      {copied ? <HiCheck size={14} /> : <HiOutlineClipboard size={14} />}
                      {copied ? "Copied!" : "Share Link"}
                    </button>
                    <button
                      onClick={handlePrint}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <HiPrinter size={14} />
                      Print
                    </button>
                  </div>
                </div>

                {/* Details layout */}
                <div className="p-8 md:p-10 space-y-8">
                  {/* Student Name */}
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-6 text-center sm:text-left">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Certified Candidate
                    </p>
                    <h2 className="text-3xl font-black text-black dark:text-white">
                      {result.student_name}
                    </h2>
                  </div>

                  {/* Core Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 dark:bg-slate-800 text-primary dark:text-blue-400 rounded-xl">
                        <HiOutlineAcademicCap className="text-2xl" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Course Program
                        </p>
                        <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          {result.course_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-50 dark:bg-slate-800 text-purple-600 dark:text-purple-400 rounded-xl">
                        <HiBriefcase className="text-2xl" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Issuing Institution
                        </p>
                        <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          {result.college_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 rounded-xl">
                        <HiClock className="text-2xl" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Course Duration
                        </p>
                        <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          {result.duration}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-xl">
                        <HiCalendar className="text-2xl" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Date of Issue
                        </p>
                        <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          {result.issue_date}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer status card details */}
                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Verification ID
                      </p>
                      <p className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono mt-0.5 select-all">
                        {result.certificate_number}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Performance Grade
                      </p>
                      <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5">
                        {result.grade}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Status
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 mt-0.5 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {result.status || "ACTIVE"}
                      </span>
                    </div>
                  </div>

                  {result.is_fallback && (
                    <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-xl dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
                      ℹ️ Note: This verification record is mapped via enrollment status database records.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {!loading && searched && errorMsg && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-slate-900 border-2 border-red-500/20 p-8 rounded-3xl shadow-xl text-center"
            >
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiShieldExclamation className="text-4xl text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-black dark:text-white mb-2">
                Verification Failed
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                {errorMsg}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleVerify(searchVal)}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Try Again
                </button>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-950/50 transition"
                >
                  Contact Support
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin dark:border-blue-500" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
