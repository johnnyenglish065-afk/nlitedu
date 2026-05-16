"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  FaSearch, FaDownload, FaUserGraduate, FaCreditCard, 
  FaClock, FaEye, FaUniversity, FaFilter, FaFileCsv,
  FaVideo, FaStop, FaPlay, FaUsers, FaLink, FaBroadcastTower,
  FaClipboardList, FaPlus, FaTrash, FaEnvelope, FaEdit
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import EnrollmentDetail from "../../components/Admin/EnrollmentDetail";
import { fetchCourses } from "@/data/courses";

interface LiveSession {
  id: string;
  course_id: string;
  course_title: string;
  session_url: string;
  is_live: boolean;
  started_at: string;
  scheduled_at?: string;
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
  status: string; 
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
  interested_internships?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  course_slug: string;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  scheduled_for?: string | null;
}

interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  options: string[];
  correct_index: number;
  points: number;
  order_index: number;
}

export default function AdminDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  
  // Courses
  const [courses, setCourses] = useState<any[]>([]);

  // Live Class State
  const [activeAdminTab, setActiveAdminTab] = useState<"STUDENTS" | "LIVE" | "QUIZZES" | "EMAIL" | "COURSES">("STUDENTS");
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [liveAttendance, setLiveAttendance] = useState<LiveAttendance[]>([]);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [newSession, setNewSession] = useState({ course: "", url: "", scheduled_at: "" });

  // Quiz State
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ title: "", description: "", course_slug: "global", duration_minutes: 30, scheduled_for: "" });
  const [newQuestion, setNewQuestion] = useState({ question_text: "", options: ["", "", "", ""], correct_index: 0, points: 1 });
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Course Management State
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    slug: "",
    description: "",
    category: "DESIGN",
    govt_price: 1999,
    pvt_price: 2999,
    job_price: 3999,
    duration: "12 Weeks",
    level: "Intermediate",
    is_bestseller: false,
    instructor_name: "NLITedu Official",
    highlights: ["", "", ""],
    syllabus: ["", "", ""]
  });

  const handleSaveCourse = async () => {
    if (!newCourse.title || !newCourse.slug || !supabase) {
      alert("Please fill title and slug.");
      return;
    }
    setIsCreatingCourse(true);
    try {
      const payload = {
        ...newCourse,
        price: "₹999*", // Default label
        rating: 4.8,
        total_reviews: 1200,
        image_url: `https://www.nlitedu.com/fontimage/${newCourse.slug}.png`,
        instructor_image: `https://ui-avatars.com/api/?name=${newCourse.instructor_name.replace(" ", "+")}&background=random`,
        is_legacy_pricing: false
      };

      if (editingCourseId) {
        const { error } = await supabase.from("courses").update(payload).eq("id", editingCourseId);
        if (error) throw error;
        alert("Course updated!");
      } else {
        const { error } = await supabase.from("courses").insert([payload]);
        if (error) throw error;
        alert("Course created!");
      }
      setEditingCourseId(null);
      setIsCreatingCourse(false);
      setNewCourse({
        title: "", slug: "", description: "", category: "DESIGN",
        govt_price: 1999, pvt_price: 2999, job_price: 3999,
        duration: "12 Weeks", level: "Intermediate", is_bestseller: false,
        instructor_name: "NLITedu Official", highlights: ["", "", ""], syllabus: ["", "", ""]
      });
      const updated = await fetchCourses();
      setCourses(updated);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
    setIsCreatingCourse(false);
  };

  const handleEditCourse = (course: any) => {
    setEditingCourseId(course.id);
    setNewCourse({
      title: course.title,
      slug: course.slug,
      description: course.description,
      category: course.category,
      govt_price: course.govt_price,
      pvt_price: course.pvt_price,
      job_price: course.job_price,
      duration: course.duration,
      level: course.level,
      is_bestseller: course.is_bestseller,
      instructor_name: course.instructor_name,
      highlights: course.highlights || ["", "", ""],
      syllabus: course.syllabus || ["", "", ""]
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    if (!supabase) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (!error) {
      const updated = await fetchCourses();
      setCourses(updated);
    }
  };

  // Email Blaster State
  const [emailBlast, setEmailBlast] = useState({ audience: "ALL", subject: "", message: "" });
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    fetchEnrollments();
    fetchLiveSessions();
    fetchAttendance();
    fetchQuizzes();
    fetchCourses().then(setCourses);

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
      const { data, error } = await supabase
        .from("enrollments")
        .select("id, full_name, email, course_title, status, cf_payment_id, created_at, user_id, college_name, college_type, branch, semester, whatsapp, father_name, gender, dob, brn, state, qualification, marksheet12Url, marksheetSemUrl, message, interested_internships")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setEnrollments(data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchLiveSessions = async () => {
    if (!supabase) return;
    // Fetch sessions that are either currently live OR scheduled for the future/recently
    const { data } = await supabase
      .from("live_sessions")
      .select("id, course_id, course_title, session_url, is_live, started_at, scheduled_at")
      .or("is_live.eq.true,scheduled_at.neq.null")
      .order("scheduled_at", { ascending: true });
    if (data) setLiveSessions(data);
  };

  const fetchAttendance = async () => {
    if (!supabase) return;
    const { data } = await supabase.from("live_attendance").select("id, session_id, student_name, student_email, joined_at").order("joined_at", { ascending: false }).limit(20);
    if (data) setLiveAttendance(data);
  };

  const fetchQuizzes = async () => {
    if (!supabase) return;
    const { data } = await supabase.from("quizzes").select("*").order("created_at", { ascending: false });
    if (data) setQuizzes(data);
  };

  const fetchQuizQuestions = async (quizId: string) => {
    if (!supabase) return;
    const { data } = await supabase.from("quiz_questions").select("*").eq("quiz_id", quizId).order("order_index", { ascending: true });
    if (data) setQuizQuestions(data);
  };

  const handleStartLive = async (isScheduled: boolean = false) => {
    if (!newSession.course || !newSession.url || !supabase) {
      alert("Fill all fields"); return;
    }
    setIsStartingSession(true);
    const { error } = await supabase.from("live_sessions").insert([
      { 
        course_id: newSession.course, 
        course_title: newSession.course, 
        session_url: newSession.url, 
        is_live: !isScheduled,
        scheduled_at: isScheduled ? new Date(newSession.scheduled_at).toISOString() : null,
        started_at: isScheduled ? null : new Date().toISOString()
      }
    ]);
    if (!error) { 
      setNewSession({ course: "", url: "", scheduled_at: "" }); 
      alert(isScheduled ? "Class Scheduled!" : "Class Started!"); 
      fetchLiveSessions();
    } else {
      alert("Error: " + error.message);
    }
    setIsStartingSession(false);
  };

  const handleActivateScheduled = async (id: string) => {
    if (!supabase) return;
    const { error } = await supabase
      .from("live_sessions")
      .update({ is_live: true, started_at: new Date().toISOString() })
      .eq("id", id);
    if (!error) fetchLiveSessions();
  };

  const handleEndLive = async (id: string) => {
    if (!supabase) return;
    await supabase.from("live_sessions").update({ is_live: false }).eq("id", id);
    fetchLiveSessions();
  };

  const handleDeleteSession = async (id: string) => {
    if (!supabase || !confirm("Delete this session?")) return;
    await supabase.from("live_sessions").delete().eq("id", id);
    fetchLiveSessions();
  };

  const handleCreateQuiz = async () => {
    if (!newQuiz.title || !newQuiz.course_slug || !supabase) {
      alert("Please fill title and course slug.");
      return;
    }
    setIsCreatingQuiz(true);
    try {
      const payload = {
        title: newQuiz.title,
        description: newQuiz.description,
        course_slug: newQuiz.course_slug,
        duration_minutes: newQuiz.duration_minutes,
        ...(newQuiz.scheduled_for ? { scheduled_for: new Date(newQuiz.scheduled_for).toISOString() } : {})
      };

      if (editingQuizId) {
        const { error } = await supabase.from("quizzes").update(payload).eq("id", editingQuizId);
        if (error) {
          console.error("Error updating quiz:", error);
          alert("Failed to update test: " + error.message);
        } else {
          setNewQuiz({ title: "", description: "", course_slug: "global", duration_minutes: 30, scheduled_for: "" });
          setEditingQuizId(null);
          fetchQuizzes();
          alert("Test updated successfully!");
        }
      } else {
        const { data, error } = await supabase.from("quizzes").insert([payload]).select();
        if (error) {
          console.error("Error creating quiz:", error);
          alert("Failed to create test: " + error.message);
        } else if (data) {
          setNewQuiz({ title: "", description: "", course_slug: "global", duration_minutes: 30, scheduled_for: "" });
          fetchQuizzes();
          alert("Test created successfully!");
        }
      }
    } catch (err: any) {
      console.error("Exception creating quiz:", err);
      alert("Exception: " + err.message);
    }
    setIsCreatingQuiz(false);
  };

  const handleDownloadQuizResults = async (quizId: string, quizTitle: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("quiz_attempts")
        .select("user_email, score, total_points")
        .eq("quiz_id", quizId)
        .order("score", { ascending: false });
        
      if (error) throw error;
      if (!data || data.length === 0) {
        alert("No attempts yet for this test.");
        return;
      }
      
      const headers = ["User Email", "Score", "Total Points"].join(",");
      const rows = data.map(r => [r.user_email, r.score, r.total_points].join(","));
      const blob = new Blob([[headers, ...rows].join("\n")], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; 
      a.download = `Results_${quizTitle.replace(/\s+/g, '_')}.csv`; 
      a.click();
    } catch (e: any) {
      alert("Failed to download results: " + e.message);
    }
  };

  const handleSendEmailBlast = async () => {
    if (!emailBlast.subject || !emailBlast.message) {
      alert("Please fill subject and message.");
      return;
    }

    setIsSendingEmail(true);
    try {
      // Calculate target emails from pre-loaded enrollments
      let targetEmails: string[] = [];
      
      if (emailBlast.audience === "ALL") {
        targetEmails = enrollments.map(e => e.email);
      } else if (emailBlast.audience === "ALL_REGISTERED") {
        // For All Registered, we don't have the list in memory (it's 'profiles' table)
        // We'll let the server handle this one, but we'll still pass targetEmails: []
        targetEmails = [];
      } else {
        // It's a specific course slug. We need to match by course_title since enrollments doesn't have slug.
        // We find the course title for this slug first.
        const course = courses.find(c => c.slug === emailBlast.audience);
        if (course) {
          targetEmails = enrollments
            .filter(e => e.course_title === course.title)
            .map(e => e.email);
        }
      }

      const payload = {
        ...emailBlast,
        targetEmails: targetEmails.filter(Boolean)
      };

      const response = await fetch("/api/email/blast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        alert("Emails sent successfully!");
        setEmailBlast({ audience: "ALL", subject: "", message: "" });
      } else {
        alert("Failed to send emails: " + (data.error || "Unknown error"));
      }
    } catch (e: any) {
      alert("Error sending emails: " + e.message);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!selectedQuiz || !newQuestion.question_text || newQuestion.options.some(o => !o) || !supabase) {
      alert("Please fill question and all options.");
      return;
    }
    const payload = {
      quiz_id: selectedQuiz.id,
      ...newQuestion
    };

    if (editingQuestionId) {
      const { error } = await supabase.from("quiz_questions").update(payload).eq("id", editingQuestionId);
      if (error) {
        alert("Failed to update question: " + error.message);
      } else {
        setNewQuestion({ question_text: "", options: ["", "", "", ""], correct_index: 0, points: 1 });
        setEditingQuestionId(null);
        fetchQuizQuestions(selectedQuiz.id);
        alert("Question updated!");
      }
    } else {
      const { error } = await supabase.from("quiz_questions").insert([payload]);
      if (error) {
        alert("Failed to add question: " + error.message);
      } else {
        setNewQuestion({ question_text: "", options: ["", "", "", ""], correct_index: 0, points: 1 });
        fetchQuizQuestions(selectedQuiz.id);
        alert("Question added!");
      }
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!supabase || !confirm("Are you sure you want to delete this test?")) return;
    
    // Explicitly delete attempts first to satisfy foreign keys lacking ON DELETE CASCADE
    await supabase.from("quiz_attempts").delete().eq("quiz_id", id);
    await supabase.from("quiz_questions").delete().eq("quiz_id", id);
    
    const { error } = await supabase.from("quizzes").delete().eq("id", id);
    if (error) alert("Failed to delete test: " + error.message);
    else fetchQuizzes();
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!supabase || !selectedQuiz) return;
    const { error } = await supabase.from("quiz_questions").delete().eq("id", id);
    if (error) alert("Failed to delete question: " + error.message);
    else fetchQuizQuestions(selectedQuiz.id);
  };

  const downloadCSV = () => {
    if (enrollments.length === 0) return;
    const headers = ["ID", "Name", "Email", "Course", "Status", "College"].join(",");
    const rows = enrollments.map(e => [e.id, e.full_name, e.email, e.course_title, e.status, e.college_name].join(","));
    const blob = new Blob([[headers, ...rows].join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "enrollments.csv"; a.click();
  };

  const filteredEnrollments = enrollments.filter(e => {
    const matchesSearch = e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || e.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: enrollments.length,
    paid: enrollments.filter(e => e.status === "PAID").length,
    pending: enrollments.filter(e => e.status === "PENDING").length,
    revenue: enrollments.filter(e => e.status === "PAID").length * 499
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
          <button onClick={() => setActiveAdminTab("QUIZZES")} className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 ${activeAdminTab === "QUIZZES" ? "bg-white dark:bg-slate-700 text-primary shadow" : "text-slate-500"}`}>
            <FaClipboardList /> Quizzes
          </button>
          <button onClick={() => setActiveAdminTab("EMAIL")} className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 ${activeAdminTab === "EMAIL" ? "bg-white dark:bg-slate-700 text-primary shadow" : "text-slate-500"}`}>
            <FaEnvelope /> Email Blaster
          </button>
          <button onClick={() => setActiveAdminTab("COURSES")} className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 ${activeAdminTab === "COURSES" ? "bg-white dark:bg-slate-700 text-primary shadow" : "text-slate-500"}`}>
            <FaUniversity /> Courses
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
        {activeAdminTab === "STUDENTS" && (
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
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black ${e.status === "PAID" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                            {e.status}
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
        )}
        
        {activeAdminTab === "LIVE" && (
          <motion.div key="lv" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-xl font-black mb-6 flex items-center gap-3"><FaBroadcastTower className="text-primary" /> Live Session Control</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Select Course</label>
                    <select value={newSession.course} onChange={e => setNewSession({...newSession, course: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none">
                      <option value="">Choose Course...</option>
                      {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Meeting URL</label>
                    <input type="url" placeholder="https://" value={newSession.url} onChange={e => setNewSession({...newSession, url: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Schedule For (Optional)</label>
                    <input type="datetime-local" value={newSession.scheduled_at} onChange={e => setNewSession({...newSession, scheduled_at: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => handleStartLive(false)} disabled={isStartingSession} className="flex-1 py-4 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20">
                    <FaPlay /> {isStartingSession ? "Launching..." : "GO LIVE NOW"}
                  </button>
                  <button onClick={() => handleStartLive(true)} disabled={isStartingSession || !newSession.scheduled_at} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black rounded-2xl flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-700 disabled:opacity-50">
                    <FaClock /> SCHEDULE
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <span className="font-black text-xs uppercase text-slate-500">Live & Scheduled Sessions</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {liveSessions.length === 0 ? <p className="p-10 text-center text-slate-400 italic">No classes found.</p> : liveSessions.map(s => (
                    <div key={s.id} className="p-6 flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black uppercase text-sm">{s.course_title}</h4>
                          {s.is_live ? (
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="LIVE NOW" />
                          ) : (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[8px] font-black rounded-full uppercase">Scheduled</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate max-w-[250px]">{s.session_url}</p>
                        {s.scheduled_at && <p className="text-[10px] text-primary font-bold mt-1">Target: {new Date(s.scheduled_at).toLocaleString()}</p>}
                      </div>
                      <div className="flex gap-2">
                        {!s.is_live && (
                          <button onClick={() => handleActivateScheduled(s.id)} className="px-4 py-2 bg-green-50 text-green-600 text-[10px] font-black rounded-xl hover:bg-green-600 hover:text-white transition-all">START</button>
                        )}
                        {s.is_live && (
                          <button onClick={() => handleEndLive(s.id)} className="px-4 py-2 bg-red-50 text-red-600 text-[10px] font-black rounded-xl hover:bg-red-600 hover:text-white transition-all">END</button>
                        )}
                        <button onClick={() => handleDeleteSession(s.id)} className="p-2 text-slate-300 hover:text-red-500"><FaTrash size={12} /></button>
                      </div>
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

        {activeAdminTab === "QUIZZES" && (
          <motion.div key="qz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              {/* Create Quiz Form */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-xl font-black mb-6 flex items-center gap-3"><FaPlus className="text-primary" /> Create Test</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Test Title</label>
                    <input type="text" placeholder="e.g. Weekly Aptitude Test" value={newQuiz.title} onChange={e => setNewQuiz({...newQuiz, title: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Description</label>
                    <textarea placeholder="Instructions..." value={newQuiz.description} onChange={e => setNewQuiz({...newQuiz, description: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none h-24" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Duration (mins)</label>
                      <input type="number" min="1" value={newQuiz.duration_minutes} onChange={e => setNewQuiz({...newQuiz, duration_minutes: parseInt(e.target.value) || 30})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Course Target</label>
                      <select value={newQuiz.course_slug} onChange={e => setNewQuiz({...newQuiz, course_slug: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none">
                        <option value="global">Global (All Users)</option>
                        {courses.map(c => <option key={c.slug} value={c.slug}>{c.title}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Scheduled Date & Time (Optional)</label>
                    <input type="datetime-local" value={newQuiz.scheduled_for || ""} onChange={e => setNewQuiz({...newQuiz, scheduled_for: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none" />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleCreateQuiz} disabled={isCreatingQuiz || !newQuiz.title} className="flex-1 py-4 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                      {isCreatingQuiz ? "Saving..." : editingQuizId ? "Update Test" : "Create Test"}
                    </button>
                    {editingQuizId && (
                      <button onClick={() => { setEditingQuizId(null); setNewQuiz({ title: "", description: "", course_slug: "global", duration_minutes: 30, scheduled_for: "" }); }} className="py-4 px-6 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {/* List of Quizzes */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <span className="font-black text-xs uppercase text-slate-500">Active Tests</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {quizzes.length === 0 ? <p className="p-10 text-center text-slate-400 italic">No tests created yet.</p> : quizzes.map(q => (
                    <div key={q.id} className="p-6 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-black text-lg">{q.title}</h4>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">{q.course_slug}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{q.description}</p>
                        <div className="flex gap-4 text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1"><FaClock /> {q.duration_minutes} mins</span>
                          <span>• {new Date(q.created_at).toLocaleDateString()}</span>
                          {q.scheduled_for && <span className="text-primary">• Scheduled: {new Date(q.scheduled_for).toLocaleString()}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <button onClick={() => handleDownloadQuizResults(q.id, q.title)} className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all" title="Download Results"><FaDownload /></button>
                        <button onClick={() => {
                          setNewQuiz({
                            title: q.title,
                            description: q.description || "",
                            course_slug: q.course_slug,
                            duration_minutes: q.duration_minutes,
                            scheduled_for: q.scheduled_for ? new Date(q.scheduled_for).toISOString().slice(0, 16) : ""
                          });
                          setEditingQuizId(q.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all" title="Edit Test"><FaEdit /></button>
                        <button onClick={() => { setSelectedQuiz(q); fetchQuizQuestions(q.id); }} className="px-4 py-2 bg-primary/10 text-primary text-sm font-black rounded-xl hover:bg-primary hover:text-white transition-all">Questions</button>
                        <button onClick={() => handleDeleteQuiz(q.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><FaTrash /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeAdminTab === "EMAIL" && (
          <motion.div key="em" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3"><FaEnvelope className="text-primary" /> Email Blaster</h3>
              <p className="text-sm text-slate-500 mb-8">Send updates, test links, and announcements directly to enrolled students.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Audience Target</label>
                  <select value={emailBlast.audience} onChange={e => setEmailBlast({...emailBlast, audience: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-bold">
                    <option value="ALL">All Enrolled Students (Paid & Non-Paid)</option>
                    <option value="ALL_REGISTERED">All Registered Platform Users</option>
                    {courses.map(c => <option key={c.slug} value={c.slug}>{c.title} Students</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Subject Line</label>
                  <input type="text" placeholder="e.g. Important Update: New Quiz Available!" value={emailBlast.subject} onChange={e => setEmailBlast({...emailBlast, subject: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none" />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Message Body (Supports HTML)</label>
                  <textarea placeholder="<h1>Hello Students!</h1><p>...</p>" value={emailBlast.message} onChange={e => setEmailBlast({...emailBlast, message: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none min-h-[250px] font-mono text-sm" />
                </div>
                
                <button onClick={handleSendEmailBlast} disabled={isSendingEmail || !emailBlast.subject || !emailBlast.message} className="w-full py-4 bg-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-lg">
                  <FaBroadcastTower /> {isSendingEmail ? "Broadcasting Emails..." : "Send Blast"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
        {activeAdminTab === "COURSES" && (
          <motion.div key="co" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             {/* Course Management UI */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Left: Course List */}
               <div className="lg:col-span-2 space-y-4">
                 <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                   <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                     <h3 className="font-black text-xl flex items-center gap-2"><FaUniversity className="text-primary" /> All Courses</h3>
                     <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{courses.length} Active</span>
                   </div>
                   <div className="divide-y divide-slate-100 dark:divide-slate-800">
                     {courses.length === 0 && (
                       <div className="p-12 text-center text-slate-400 font-bold">No courses found in database.</div>
                     )}
                     {courses.map(course => (
                       <div key={course.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-primary border border-slate-200 dark:border-slate-700">
                             {course.category ? course.category[0] : 'C'}
                           </div>
                           <div>
                             <h4 className="font-bold">{course.title}</h4>
                             <div className="flex gap-4 mt-1">
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">₹{course.govt_price} Govt</span>
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{course.duration || 'Flexible'}</span>
                               {course.is_bestseller && <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Bestseller</span>}
                             </div>
                           </div>
                         </div>
                         <div className="flex gap-2">
                           <button onClick={() => handleEditCourse(course)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Edit Course"><FaEdit /></button>
                           <button onClick={() => handleDeleteCourse(course.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Delete Course"><FaTrash /></button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>

               {/* Right: Add/Edit Form */}
               <div className="lg:col-span-1">
                 <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl sticky top-24">
                   <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                     {editingCourseId ? <><FaEdit className="text-blue-500" /> Edit Course</> : <><FaPlus className="text-green-500" /> Add New Course</>}
                   </h3>
                   
                   <div className="space-y-4">
                     <div>
                       <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Course Title</label>
                       <input type="text" value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-primary transition-all font-semibold" placeholder="e.g. AutoCAD Mastery" />
                     </div>
                     <div>
                       <label className="text-xs font-bold text-slate-500 uppercase block mb-1">URL Slug</label>
                       <input type="text" value={newCourse.slug} onChange={e => setNewCourse({...newCourse, slug: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-primary transition-all" placeholder="e.g. autocad-mastery" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Govt Price (₹)</label>
                          <input type="number" value={newCourse.govt_price} onChange={e => setNewCourse({...newCourse, govt_price: parseInt(e.target.value)})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Private Price (₹)</label>
                          <input type="number" value={newCourse.pvt_price} onChange={e => setNewCourse({...newCourse, pvt_price: parseInt(e.target.value)})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none" />
                        </div>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Job/Training Price (₹)</label>
                        <input type="number" value={newCourse.job_price} onChange={e => setNewCourse({...newCourse, job_price: parseInt(e.target.value)})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none" />
                     </div>
                     <div>
                       <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Category</label>
                       <select value={newCourse.category} onChange={e => setNewCourse({...newCourse, category: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none font-bold">
                         <option value="DESIGN">Design</option>
                         <option value="PROGRAMMING">Programming</option>
                         <option value="ENGINEERING">Engineering</option>
                         <option value="DATA SCIENCE">Data Science</option>
                         <option value="AI">AI & Machine Learning</option>
                       </select>
                     </div>
                     <div>
                       <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Description</label>
                       <textarea value={newCourse.description} onChange={e => setNewCourse({...newCourse, description: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none min-h-[120px] text-sm" placeholder="Short course summary..." />
                     </div>

                     <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                       <input type="checkbox" id="bestseller" checked={newCourse.is_bestseller} onChange={e => setNewCourse({...newCourse, is_bestseller: e.target.checked})} className="w-5 h-5 accent-primary" />
                       <label htmlFor="bestseller" className="text-sm font-bold cursor-pointer">Mark as Bestseller</label>
                     </div>

                     <button onClick={handleSaveCourse} disabled={isCreatingCourse} className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 mt-4 disabled:opacity-50 flex items-center justify-center gap-2">
                       {isCreatingCourse ? "Saving..." : <><FaPlus /> {editingCourseId ? "Update Course" : "Create Course"}</>}
                     </button>
                     {editingCourseId && (
                        <button onClick={() => {
                          setEditingCourseId(null);
                          setNewCourse({
                            title: "", slug: "", description: "", category: "DESIGN",
                            govt_price: 1999, pvt_price: 2999, job_price: 3999,
                            duration: "12 Weeks", level: "Intermediate", is_bestseller: false,
                            instructor_name: "NLITedu Official", highlights: ["", "", ""], syllabus: ["", "", ""]
                          });
                        }} className="w-full py-2 text-slate-500 font-bold hover:text-red-500 transition-colors">Cancel Editing</button>
                     )}
                   </div>
                 </div>
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEnrollment && <EnrollmentDetail enrollment={selectedEnrollment} onClose={() => setSelectedEnrollment(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedQuiz && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
              
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <h3 className="font-black text-xl">{selectedQuiz.title} - Questions</h3>
                  <p className="text-xs text-slate-500 mt-1">Add or remove questions for this test.</p>
                </div>
                <button onClick={() => setSelectedQuiz(null)} className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-500 rounded-xl hover:bg-red-100 hover:text-red-600 transition-colors"><FaTrash className="opacity-0" style={{display: 'none'}}/><span className="text-xl leading-none">&times;</span></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 dark:bg-slate-900">
                {/* Add Question Form */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-fit">
                  <h4 className="font-black text-sm uppercase text-slate-500 mb-4 flex items-center gap-2"><FaPlus className="text-primary"/> New Question</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Question Text</label>
                      <textarea placeholder="What is..." value={newQuestion.question_text} onChange={e => setNewQuestion({...newQuestion, question_text: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                    </div>
                    
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Options & Correct Answer</label>
                      <div className="space-y-2">
                        {[0, 1, 2, 3].map(i => (
                          <div key={i} className="flex items-center gap-3">
                            <input type="radio" name="correct_option" checked={newQuestion.correct_index === i} onChange={() => setNewQuestion({...newQuestion, correct_index: i})} className="w-4 h-4 text-primary" />
                            <input type="text" placeholder={`Option ${i + 1}`} value={newQuestion.options[i]} onChange={e => {
                              const newOpts = [...newQuestion.options];
                              newOpts[i] = e.target.value;
                              setNewQuestion({...newQuestion, options: newOpts});
                            }} className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Points</label>
                      <input type="number" min="1" value={newQuestion.points} onChange={e => setNewQuestion({...newQuestion, points: parseInt(e.target.value) || 1})} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" />
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button onClick={handleAddQuestion} disabled={!newQuestion.question_text || newQuestion.options.some(o => !o)} className="flex-1 py-3 bg-primary text-white font-black rounded-xl shadow-lg disabled:opacity-50">
                        {editingQuestionId ? "Update Question" : "Add Question"}
                      </button>
                      {editingQuestionId && (
                        <button onClick={() => { setEditingQuestionId(null); setNewQuestion({ question_text: "", options: ["", "", "", ""], correct_index: 0, points: 1 }); }} className="py-3 px-4 bg-slate-100 text-slate-500 font-black rounded-xl hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Question List */}
                <div className="space-y-4">
                  <h4 className="font-black text-sm uppercase text-slate-500 mb-4">Existing Questions ({quizQuestions.length})</h4>
                  {quizQuestions.length === 0 ? (
                    <div className="p-8 text-center bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-slate-400">
                      No questions added yet.
                    </div>
                  ) : quizQuestions.map((q, idx) => (
                    <div key={q.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative group">
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => {
                          setNewQuestion({
                            question_text: q.question_text,
                            options: [...q.options],
                            correct_index: q.correct_index,
                            points: q.points
                          });
                          setEditingQuestionId(q.id);
                        }} className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><FaEdit /></button>
                        <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FaTrash /></button>
                      </div>
                      <div className="flex gap-3 mb-3 pr-8">
                        <span className="font-black text-primary">{idx + 1}.</span>
                        <p className="font-bold text-sm">{q.question_text}</p>
                      </div>
                      <div className="grid grid-cols-1 gap-2 pl-6">
                        {q.options.map((opt, i) => (
                          <div key={i} className={`text-xs p-2 rounded-lg border ${q.correct_index === i ? 'bg-green-50 border-green-200 text-green-700 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400'}`}>
                            {opt} {q.correct_index === i && '✓'}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pl-6 text-[10px] font-bold text-slate-400 uppercase">
                        Points: {q.points}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
