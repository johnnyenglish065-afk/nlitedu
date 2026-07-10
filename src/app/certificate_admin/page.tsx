"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

type CertResult = {
  name: string;
  course: string;
  college?: string;
  certNumber?: string;
  cloudinaryUrl?: string;
  emailSent?: boolean;
  dbError?: string;
  status: string;
  error?: string;
};

type Certificate = {
  id: string;
  student_name: string;
  course_name: string;
  college_name: string;
  certificate_number: string;
  pdf_url: string;
  issue_date: string;
  grade: string;
};

export default function CertificateAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [adminPass, setAdminPass] = useState("");

  const [generationMode, setGenerationMode] = useState<"bulk" | "individual">("bulk");
  const [studentQuery, setStudentQuery] = useState("");
  const [sendEmail, setSendEmail] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [courses, setCourses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CertResult[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [tab, setTab] = useState<"generate" | "history">("generate");
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId && adminPass) {
      // Test credentials with a quick check request
      setIsLoading(true);
      fetch(`/api/generate_certificates?action=courses&adminId=${encodeURIComponent(adminId)}&adminPass=${encodeURIComponent(adminPass)}`)
        .then((r) => {
          if (r.ok) {
            setIsAuthenticated(true);
            return r.json();
          } else {
            throw new Error("Invalid credentials.");
          }
        })
        .then((d) => setCourses(d.courses || []))
        .catch((err) => {
          setMessage({ type: "error", text: err.message || "Failed to authenticate." });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const loadCourses = () => {
    if (!isAuthenticated) return;
    fetch(`/api/generate_certificates?action=courses&adminId=${encodeURIComponent(adminId)}&adminPass=${encodeURIComponent(adminPass)}`)
      .then((r) => r.json())
      .then((d) => setCourses(d.courses || []))
      .catch(() => {});
  };

  const loadCertificates = async () => {
    setLoadingCerts(true);
    try {
      const res = await fetch(`/api/generate_certificates?action=certificates&adminId=${encodeURIComponent(adminId)}&adminPass=${encodeURIComponent(adminPass)}`);
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const data = await res.json();
      setCertificates(data.certificates || []);
    } catch { /* ignore */ }
    setLoadingCerts(false);
  };

  useEffect(() => {
    if (isAuthenticated && tab === "history") {
      loadCertificates();
    }
  }, [isAuthenticated, tab]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setResults([]);
    try {
      const res = await fetch("/api/generate_certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId,
          adminPass,
          startDate,
          endDate,
          courseFilter: generationMode === "bulk" ? courseFilter : undefined,
          mode: generationMode,
          studentQuery: generationMode === "individual" ? studentQuery : undefined,
          sendEmail,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setResults(data.results || []);
      } else {
        if (res.status === 401) {
          setIsAuthenticated(false);
          return;
        }
        setMessage({ type: "error", text: data.error || "Failed." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Network error." });
    }
    setIsLoading(false);
  };

  const filteredCerts = certificates.filter(
    (c) =>
      c.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.certificate_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.course_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── LOGIN ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="p-8 text-center bg-gradient-to-br from-indigo-500 to-purple-600">
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
            <p className="text-indigo-100 mt-2 text-sm">Secure Certificate Generation</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Admin ID</label>
              <input type="text" value={adminId} onChange={(e) => setAdminId(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Enter Admin ID" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="••••••••" required />
            </div>
            {message && message.type === "error" && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                {message.text}
              </div>
            )}
            <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-50">
              {isLoading ? "Authenticating..." : "Authenticate"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ── DASHBOARD ──
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-8 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Certificate Admin</h1>
            <p className="text-slate-500 text-sm mt-1">Generate &amp; manage NLIT certificates</p>
          </div>
          <button onClick={() => { setIsAuthenticated(false); setAdminPass(""); setMessage(null); }} className="text-sm px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition">Logout</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl mb-8 w-fit">
          {(["generate", "history"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === t ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow" : "text-slate-500 hover:text-slate-700"}`}>
              {t === "generate" ? "🎓 Generate" : "📋 History"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "generate" && (
            <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Certificate Generation System</h2>
                <form onSubmit={handleGenerate} className="space-y-6">
                  {/* Mode Selector */}
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Generation Mode</label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setGenerationMode("bulk")}
                        className={`flex-1 py-3 px-4 rounded-xl border text-center font-semibold transition-all ${
                          generationMode === "bulk"
                            ? "border-indigo-600 bg-indigo-50/50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/20 dark:text-indigo-400"
                            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                        }`}
                      >
                        📂 Bulk Mode (Paid Enrollments)
                      </button>
                      <button
                        type="button"
                        onClick={() => setGenerationMode("individual")}
                        className={`flex-1 py-3 px-4 rounded-xl border text-center font-semibold transition-all ${
                          generationMode === "individual"
                            ? "border-indigo-600 bg-indigo-50/50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/20 dark:text-indigo-400"
                            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                        }`}
                      >
                        👤 Individual Mode (ID / Email)
                      </button>
                    </div>
                  </div>

                  {/* Mode-Specific inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {generationMode === "bulk" ? (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Course Filter</label>
                        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none">
                          <option value="all">All Courses</option>
                          {courses.map((c) => (<option key={c} value={c}>{c}</option>))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Student ID or Email</label>
                        <input
                          type="text"
                          value={studentQuery}
                          onChange={(e) => setStudentQuery(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g. 44 or student@email.com"
                          required
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Training Start Date</label>
                      <input type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" placeholder="DD-MM-YYYY" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Training End Date</label>
                      <input type="text" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" placeholder="DD-MM-YYYY" required />
                    </div>
                  </div>

                  {/* Delivery Checkboxes */}
                  <div className="flex flex-wrap gap-6 items-center pt-2">
                    <label className="flex items-center gap-3 cursor-pointer select-none text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={sendEmail}
                        onChange={(e) => setSendEmail(e.target.checked)}
                        className="w-5 h-5 rounded text-indigo-600 border-slate-300 dark:border-slate-700 focus:ring-indigo-500 cursor-pointer"
                      />
                      📧 Deliver via Email (GoDaddy SMTP)
                    </label>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                      <span>📱 Automatically syncs to Student App (certificates table)</span>
                    </div>
                  </div>

                  {message && (
                    <div className={`p-4 rounded-lg border ${message.type === "success" ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400" : "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"}`}>
                      <p className="font-medium">{message.text}</p>
                    </div>
                  )}

                  <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> Generating...</>
                    ) : generationMode === "bulk" ? "🚀 Generate Batch Certificates" : "🚀 Generate Individual Certificate"}
                  </button>
                </form>
              </div>

              {/* Results Table */}
              {results.length > 0 && (
                <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Generation Results ({results.length})</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Student</th>
                          <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Course</th>
                          <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Cert Number</th>
                          <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
                          <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Email Delivery</th>
                          <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {results.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                              {r.name}
                            </td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{r.course}</td>
                            <td className="px-6 py-4 font-mono text-xs text-slate-700 dark:text-slate-300">{r.certNumber || "—"}</td>
                            <td className="px-6 py-4">
                              {r.status === "success" ? (
                                <div className="flex flex-col gap-1 items-start">
                                  <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold dark:bg-green-900/30 dark:text-green-400">✅ Success</span>
                                  {r.dbError && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-semibold dark:bg-amber-900/30 dark:text-amber-400" title={r.dbError}>⚠️ DB RLS Bypassed</span>
                                  )}
                                </div>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold dark:bg-red-900/30 dark:text-red-400" title={r.error}>❌ Error</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {sendEmail ? (
                                r.emailSent ? (
                                  <span className="text-green-600 dark:text-green-400 font-semibold text-xs">📧 Delivered</span>
                                ) : (
                                  <span className="text-red-500 dark:text-red-400 font-semibold text-xs">⚠️ Failed</span>
                                )
                              ) : (
                                <span className="text-slate-400 dark:text-slate-500 text-xs">Skipped</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {r.cloudinaryUrl && (
                                <a href={r.cloudinaryUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 text-xs font-bold dark:text-indigo-400">View ↗</a>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {tab === "history" && (
            <motion.div key="hist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between gap-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Issued Certificates ({filteredCerts.length})</h3>
                  <input type="text" placeholder="Search by name, course, or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white outline-none w-full sm:w-72" />
                </div>
                {loadingCerts ? (
                  <div className="p-12 text-center"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
                ) : filteredCerts.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">No certificates found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Student</th>
                          <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Course</th>
                          <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Cert ID</th>
                          <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Issued</th>
                          <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredCerts.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{c.student_name}</td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{c.course_name}</td>
                            <td className="px-6 py-4 font-mono text-xs text-slate-700 dark:text-slate-300">{c.certificate_number}</td>
                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{c.issue_date}</td>
                            <td className="px-6 py-4 flex gap-2">
                              {c.pdf_url && <a href={c.pdf_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 text-xs font-bold dark:text-indigo-400">View ↗</a>}
                              <a href={`/verify?id=${c.certificate_number}`} target="_blank" className="text-emerald-600 hover:text-emerald-800 text-xs font-bold dark:text-emerald-400">Verify</a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
