"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  FaSearch, FaDownload, FaUserGraduate, FaCreditCard, 
  FaClock, FaEye, FaUniversity, FaFilter, FaFileCsv,
  FaVideo, FaStop, FaPlay, FaUsers, FaLink, FaBroadcastTower
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import EnrollmentDetail from "../../components/Admin/EnrollmentDetail";

interface LiveSession {
  id: string;
  course_id: string;
  course_title: string;
  session_url: string;
  is_live: boolean;
  started_at: string;
}

interface LiveAttendance {
  id: string;
  session_id: string;
  student_name: string;
  student_email: string;
  joined_at: string;
}

interface Enrollment {
  id: string;
  full_name: string;
  email: string;
  course_title: string;
  payment_status: string; 
  cf_payment_id: string;
  created_at: string;
  user_id: string;
  college_name: string;
  college_type: string;
  branch: string;
  semester: string;
  whatsapp: string;
  father_name: string;
  gender: string;
  dob: string;
  brn: string;
  state: string;
  qualification: string;
  marksheet12Url?: string;
  marksheetSemUrl?: string;
  message?: string;
}

export default function AdminDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  
  // Live Class State
  const [activeAdminTab, setActiveAdminTab] = useState<"STUDENTS" | "LIVE">("STUDENTS");
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [liveAttendance, setLiveAttendance] = useState<LiveAttendance[]>([]);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [newSession, setNewSession] = useState({ course: "", url: "" });

  useEffect(() => {
    fetchEnrollments();
    fetchLiveSessions();
    fetchAttendance();

    const currentSupabase = supabase;
    if (!currentSupabase) return;
    
    // Subscriptions
    const subEnrollments = currentSupabase
      .channel("admin_enrollments")
      .on("postgres_changes", { event: "*", schema: "public", table: "enrollments" }, () => fetchEnrollments())
      .subscribe();

    const subLive = currentSupabase
      .channel("admin_live")
      .on("postgres_changes", { event: "*", schema: "public", table: "live_sessions" }, () => fetchLiveSessions())
      .subscribe();

    const subAttendance = currentSupabase
      .channel("admin_attendance")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "live_attendance" }, () => fetchAttendance())
      .subscribe();

    return () => {
      currentSupabase.removeChannel(subEnrollments);
      currentSupabase.removeChannel(subLive);
      currentSupabase.removeChannel(subAttendance);
    };
  }, []);

  const fetchEnrollments = async () => {
    if (!supabase) return;
    try {
      if (enrollments.length === 0) setLoading(true);
      const { data, error } = await supabase.from("enrollments").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setEnrollments(data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchLiveSessions = async () => {
    if (!supabase) return;
    const { data } = await supabase.from("live_sessions").select("*").eq("is_live", true);
    if (data) setLiveSessions(data);
  };

  const fetchAttendance = async () => {
    if (!supabase) return;
    const { data } = await supabase.from("live_attendance").select("*").order("joined_at", { ascending: false }).limit(20);
    if (data) setLiveAttendance(data);
  };

  const handleStartLive = async () => {
    if (!newSession.course || !newSession.url || !supabase) {
      alert("Fill all fields"); return;
    }
    setIsStartingSession(true);
    const { error } = await supabase.from("live_sessions").insert([
      { course_id: newSession.course, course_title: newSession.course, session_url: newSession.url, is_live: true }
    ]);
    if (!error) { setNewSession({ course: "", url: "" }); alert("Started!"); }
    setIsStartingSession(false);
  };

  const handleEndLive = async (id: string) => {
    if (!supabase) return;
    await supabase.from("live_sessions").update({ is_live: false }).eq("id", id);
  };

  const downloadCSV = () => {
    if (enrollments.length === 0) return;
    const headers = ["ID", "Name", "Email", "Course", "Status", "College"].join(",");
    const rows = enrollments.map(e => [e.id, e.full_name, e.email, e.course_title, e.payment_status, e.college_name].join(","));
    const blob = new Blob([[headers, ...rows].join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "enrollments.csv"; a.click();
  };

  const filteredEnrollments = enrollments.filter(e => {
    const matchesSearch = e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || e.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || e.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: enrollments.length,
    paid: enrollments.filter(e => e.payment_status === "PAID").length,
    pending: enrollments.filter(e => e.payment_status === "PENDING").length,
    revenue: enrollments.filter(e => e.payment_status === "PAID").length * 499
  };

  return (
    <div className="container mx-auto px-4 pb-20">
      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex gap-2 border border-slate-200 dark:border-slate-700">
          <button onClick={() => setActiveAdminTab("STUDENTS")} className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 ${activeAdminTab === "STUDENTS" ? "bg-white dark:bg-slate-700 text-primary shadow" : "text-slate-500"}`}>
            <FaUserGraduate /> Students
          </button>
          <button onClick={() => setActiveAdminTab("LIVE")} className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 ${activeAdminTab === "LIVE" ? "bg-white dark:bg-slate-700 text-primary shadow" : "text-slate-500"}`}>
            <FaVideo /> Live Control
            {liveSessions.length > 0 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Students", value: stats.total, icon: FaUserGraduate, color: "blue" },
          { label: "Paid", value: stats.paid, icon: FaCreditCard, color: "green" },
          { label: "Pending", value: stats.pending, icon: FaClock, color: "amber" },
          { label: "Revenue", value: `₹${stats.revenue}`, icon: FaDownload, color: "purple" }
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4`}>
              <s.icon className="text-primary text-lg" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
            <h3 className="text-2xl font-black mt-1">{s.value}</h3>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeAdminTab === "STUDENTS" ? (
          <motion.div key="st" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Table Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center gap-4">
                <div className="flex gap-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                  </div>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 outline-none">
                    <option value="ALL">All Status</option>
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
                <button onClick={downloadCSV} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl shadow-lg">
                  <FaFileCsv /> Export
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Student</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Course / Academic</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredEnrollments.map(e => (
                      <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{e.full_name}</span>
                            <span className="text-xs text-slate-500">{e.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{e.course_title}</span>
                            <span className="text-xs text-slate-500 truncate max-w-[200px]">{e.college_name || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black ${e.payment_status === "PAID" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                            {e.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => setSelectedEnrollment(e)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><FaEye /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="lv" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-xl font-black mb-6 flex items-center gap-3"><FaBroadcastTower className="text-primary" /> Launch Live Session</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Select Course</label>
                    <select value={newSession.course} onChange={e => setNewSession({...newSession, course: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none">
                      <option value="">Choose Course...</option>
                      {Array.from(new Set(enrollments.map(e => e.course_title))).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Meeting URL</label>
                    <input type="url" placeholder="https://" value={newSession.url} onChange={e => setNewSession({...newSession, url: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none" />
                  </div>
                </div>
                <button onClick={handleStartLive} disabled={isStartingSession} className="w-full py-4 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20">
                  <FaPlay /> {isStartingSession ? "Launching..." : "GO LIVE"}
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <span className="font-black text-xs uppercase text-slate-500">Active Sessions</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {liveSessions.length === 0 ? <p className="p-10 text-center text-slate-400 italic">No classes live.</p> : liveSessions.map(s => (
                    <div key={s.id} className="p-6 flex justify-between items-center">
                      <div>
                        <h4 className="font-black uppercase text-sm">{s.course_title}</h4>
                        <span className="text-[10px] text-slate-400">{s.session_url}</span>
                      </div>
                      <button onClick={() => handleEndLive(s.id)} className="px-4 py-2 bg-red-50 text-red-600 text-xs font-black rounded-xl hover:bg-red-600 hover:text-white transition-all">END</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-inner flex flex-col h-[600px]">
              <div className="p-6 bg-white dark:bg-slate-900 border-b flex justify-between items-center">
                <h3 className="font-black text-sm flex items-center gap-2"><FaUsers className="text-primary" /> Live Feed</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {liveAttendance.map(a => (
                  <div key={a.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-bold">{a.student_name}</p>
                    <p className="text-[10px] text-slate-500">{a.student_email}</p>
                    <p className="text-[9px] text-primary font-bold mt-1 uppercase tracking-tighter">Joined At {new Date(a.joined_at).toLocaleTimeString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEnrollment && <EnrollmentDetail enrollment={selectedEnrollment} onClose={() => setSelectedEnrollment(null)} />}
      </AnimatePresence>
    </div>
  );
}
