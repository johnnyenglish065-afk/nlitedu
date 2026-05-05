"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUser, FaEnvelope, FaCalendarAlt, FaShieldAlt, FaEdit, 
  FaSignOutAlt, FaBookOpen, FaGraduationCap, FaLock, 
  FaChartLine, FaCheckCircle, FaChevronRight, FaClock,
  FaUniversity, FaRegIdBadge, FaCheck
} from "react-icons/fa";

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  updated_at: string;
  // New Institutional Fields
  college_name?: string;
  college_type?: string;
  branch?: string;
  semester?: string;
  university_reg_no?: string;
  father_name?: string;
  whatsapp_no?: string;
  resident_state?: string;
  qualification?: string;
}

interface Enrollment {
  id: string;
  course_title: string;
  status: string;
  created_at: string;
  college_name?: string;
  branch?: string;
  semester?: string;
  college_type?: string;
}

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingAcademic, setIsEditingAcademic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [academicForm, setAcademicForm] = useState<Partial<ProfileData>>({});
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin");
      return;
    }

    const fetchData = async () => {
      if (!user || !supabase) return;

      try {
        setLoading(true);
        // Fetch Profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("college_name, college_type, branch, semester, university_reg_no, father_name, whatsapp_no, resident_state, qualification, full_name, avatar_url, id")
          .eq("id", user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
          setAcademicForm({
            college_name: profileData.college_name,
            college_type: profileData.college_type,
            branch: profileData.branch,
            semester: profileData.semester,
            university_reg_no: profileData.university_reg_no,
            father_name: profileData.father_name,
            whatsapp_no: profileData.whatsapp_no,
            resident_state: profileData.resident_state,
            qualification: profileData.qualification,
          });
        }

        // Fetch Enrollments
        const { data: enrollData, error: enrollError } = await supabase
          .from("enrollments")
          .select("id, course_title, status, created_at, college_name, branch, semester, college_type")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (enrollData) {
          setEnrollments(enrollData);
          // If profile is empty, pre-fill from latest enrollment
          if (profileData && !profileData.college_name && enrollData.length > 0) {
            const latest = enrollData[0];
            setAcademicForm(prev => ({
              ...prev,
              college_name: latest.college_name,
              branch: latest.branch,
              semester: latest.semester,
              college_type: latest.college_type,
            }));
          }
        }

      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, authLoading, router]);

  const handleSaveAcademic = async () => {
    if (!user || !supabase) return;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          ...academicForm,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...academicForm } : null);
      setIsEditingAcademic(false);
      alert("Academic Profile updated successfully!");
    } catch (error) {
      console.error("Error saving academic profile:", error);
      alert("Failed to update profile. Please check if you ran the SQL script in Supabase.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/signin");
    router.refresh();
  };

  if (authLoading || (loading && !profile)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return null;

  const paidEnrollments = enrollments.filter(e => e.status === "PAID");
  const academicDetails = enrollments[0] || {}; // Use latest enrollment for academic profile

  const tabs = [
    { id: "overview", label: "Dashboard", icon: FaChartLine },
    { id: "courses", label: "My Courses", icon: FaBookOpen },
    { id: "academic", label: "Academic Profile", icon: FaUniversity },
    { id: "settings", label: "Account Settings", icon: FaLock },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Breadcrumb
        pageName="Student Dashboard"
        description="Unified portal for academic tracking, course materials, and certification status."
      />

      <section className="pb-16 pt-8 md:pb-20 lg:pb-28">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-3/12">
              <div className="sticky top-[160px] space-y-4">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  <div className="p-6 text-center border-b border-slate-100 dark:border-slate-800">
                    <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-blue-50 bg-gradient-to-tr from-primary to-blue-400 p-0 text-white shadow-inner flex items-center justify-center">
                      {profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                        <img 
                          src={profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture} 
                          alt="Avatar" 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <span className="text-3xl font-bold">
                          {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                      {profile?.full_name || "New Student"}
                    </h3>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Student ID: {user.id.slice(0, 8).toUpperCase()}</p>
                  </div>

                  <nav className="p-4 space-y-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                            activeTab === tab.id
                              ? "bg-primary text-white shadow-lg shadow-primary/20"
                              : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          <Icon className={activeTab === tab.id ? "text-white" : "text-primary/70"} />
                          {tab.label}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={handleLogout}
                      className="mt-6 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all border-t border-slate-100 dark:border-slate-800"
                    >
                      <FaSignOutAlt />
                      Log Out
                    </button>
                  </nav>
                </div>

                <div className="rounded-3xl bg-primary p-6 text-white shadow-xl">
                  <h4 className="mb-2 font-bold flex items-center gap-2 text-sm">
                    <FaGraduationCap /> Learning Progress
                  </h4>
                  <div className="mb-4 h-2 w-full rounded-full bg-white/20">
                     <div 
                      className="h-full rounded-full bg-white transition-all duration-1000" 
                      style={{ width: paidEnrollments.length > 0 ? '65%' : '10%' }}
                    />
                  </div>
                  <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Excellent Standing</p>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="w-full lg:w-9/12">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {/* Welcome Banner */}
                    <div className="relative overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl opacity-50" />
                      <div className="relative z-10">
                        <span className="mb-2 inline-block rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {new Date().getHours() < 12 ? "Good Morning" : "Good Afternoon"}, Scholar
                        </span>
                        <h2 className="mb-4 text-4xl font-black text-slate-900 dark:text-white">
                          Welcome back, <span className="text-primary">{profile?.full_name?.split(' ')[0] || "Explorer"}</span>!
                        </h2>
                        <p className="max-w-md text-slate-600 dark:text-slate-400">
                          Your academic journey is in full swing. You have <span className="font-bold text-slate-900 dark:text-white">{paidEnrollments.length} active courses</span> and 0 pending certificates.
                        </p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { label: "Courses Enrolled", value: paidEnrollments.length, color: "blue", icon: FaBookOpen },
                        { label: "Completed Projects", value: "0", color: "emerald", icon: FaCheckCircle },
                        { label: "Certifications", value: "0", color: "purple", icon: FaGraduationCap },
                      ].map((stat, i) => (
                        <div key={i} className="group relative rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition-all hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900">
                           <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:bg-${stat.color}-500 group-hover:text-white transition-all`}>
                            <stat.icon size={20} />
                           </div>
                           <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400">{stat.label}</h4>
                           <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Recent Activity */}
                    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                      <div className="mb-8 flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                        <button className="text-sm font-bold text-primary hover:underline">View All History</button>
                      </div>
                      
                      <div className="space-y-6">
                        {enrollments.length > 0 ? (
                          enrollments.slice(0, 3).map((enroll, i) => (
                            <div key={i} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/30">
                              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${enroll.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                {enroll.status === 'PAID' ? <FaCheckCircle /> : <FaClock />}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-bold text-slate-900 dark:text-white line-clamp-1">{enroll.course_title} Enrollment</h5>
                                <p className="text-xs text-slate-500">{new Date(enroll.created_at).toLocaleDateString()}</p>
                              </div>
                              <div className={`rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${enroll.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                {enroll.status}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-12 text-center">
                            <p className="text-slate-500">No recent activity found. Start your learning journey today!</p>
                            <button onClick={() => router.push('/courses')} className="mt-4 text-sm font-bold text-primary hover:underline">Explore Courses →</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "courses" && (
                  <motion.div
                    key="courses"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Active Enrollments</h3>
                       <span className="rounded-full bg-slate-100 px-4 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                         {paidEnrollments.length} Total
                       </span>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {paidEnrollments.length > 0 ? (
                        paidEnrollments.map((course, i) => (
                          <div key={i} className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                             <div className="flex flex-col md:flex-row">
                               <div className="relative h-48 w-full bg-slate-100 md:h-auto md:w-48 overflow-hidden shrink-0">
                                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-blue-600/20" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <FaBookOpen className="text-4xl text-primary/40 group-hover:scale-110 transition-transform duration-500" />
                                  </div>
                               </div>
                               <div className="flex flex-1 flex-col p-8">
                                 <div className="mb-4 flex flex-wrap items-center gap-3">
                                   <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase text-primary">Certified Track</span>
                                   <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
                                     <FaCheckCircle className="inline" /> Lifetime Access
                                   </span>
                                 </div>
                                 <h4 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{course.course_title}</h4>
                                 <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Enrolled On</p>
                                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{new Date(course.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                                    </div>
                                    <button className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                      Continue Learning
                                    </button>
                                 </div>
                               </div>
                             </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-[32px] border border-dashed border-slate-300 p-20 text-center dark:border-slate-700 bg-white/20">
                          <FaBookOpen className="mx-auto mb-4 text-5xl text-slate-300" />
                          <h4 className="text-xl font-bold text-slate-900 dark:text-white">No active courses yet</h4>
                          <p className="text-slate-500">Pick a course from our catalog to start your global education journey.</p>
                          <button onClick={() => router.push('/courses')} className="mt-8 rounded-2xl bg-primary px-8 py-4 font-black text-white shadow-xl hover:bg-primary/90 transition-all">Browse Catalog</button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === "academic" && (
                  <motion.div
                   key="academic"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="space-y-8"
                  >
                    <div className="rounded-[32px] overflow-hidden border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                       <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white dark:from-slate-950 dark:to-slate-900">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                             <div>
                               <h3 className="text-3xl font-black mb-2">Institutional Profile</h3>
                               <p className="text-sm opacity-70">Official academic registration details verified by NLITedu.</p>
                             </div>
                             {!isEditingAcademic ? (
                               <button 
                                 onClick={() => setIsEditingAcademic(true)}
                                 className="flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-3 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all font-bold"
                               >
                                  <FaEdit /> Edit Profile
                               </button>
                             ) : (
                               <div className="flex gap-3">
                                 <button 
                                   onClick={() => setIsEditingAcademic(false)}
                                   className="rounded-2xl bg-white/5 px-6 py-3 border border-white/10 hover:bg-white/10 transition-all font-bold"
                                 >
                                    Cancel
                                 </button>
                                 <button 
                                   onClick={handleSaveAcademic}
                                   disabled={saving}
                                   className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all font-bold disabled:opacity-50"
                                 >
                                    {saving ? "Saving..." : "Save Profile"}
                                 </button>
                               </div>
                             )}
                          </div>
                       </div>
                       
                       <div className="p-8">
                         {!isEditingAcademic ? (
                           <>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                  { label: "Primary Institution", value: profile?.college_name || academicDetails.college_name || "Not Provided", icon: FaUniversity, color: "blue" },
                                  { label: "Branch / Stream", value: profile?.branch || academicDetails.branch || "Not Provided", icon: FaGraduationCap, color: "purple" },
                                  { label: "Current Semester", value: profile?.semester || academicDetails.semester || "Not Provided", icon: FaChartLine, color: "emerald" },
                                  { label: "Institution Type", value: profile?.college_type || academicDetails.college_type || "Not Provided", icon: FaRegIdBadge, color: "amber" },
                                  { label: "Registration No", value: profile?.university_reg_no || "Not Provided", icon: FaRegIdBadge, color: "orange" },
                                  { label: "Father's Name", value: profile?.father_name || "Not Provided", icon: FaUser, color: "pink" },
                                ].map((item, i) => (
                                  <div key={i} className="flex gap-4 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 transition hover:border-primary/20 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                     <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                                       <item.icon size={20} />
                                     </div>
                                     <div>
                                       <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                                       <p className="text-lg font-bold text-slate-900 dark:text-white">{item.value}</p>
                                     </div>
                                  </div>
                                ))}
                             </div>

                             <div className="mt-10 rounded-2xl bg-blue-50/50 p-6 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                                <div className="flex gap-4">
                                   <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
                                      <FaCheck size={14} />
                                   </div>
                                   <div>
                                      <h4 className="font-bold text-blue-900 dark:text-blue-300">Profile Synchronization</h4>
                                      <p className="text-sm text-blue-700/70 dark:text-blue-300/50">Your global profile is used to automatically fill future enrollment forms. Keep it updated for a faster experience.</p>
                                   </div>
                                </div>
                             </div>
                           </>
                         ) : (
                           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="space-y-2">
                                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">College Name</label>
                                 <input 
                                   type="text"
                                   value={academicForm.college_name || ""}
                                   onChange={(e) => setAcademicForm({...academicForm, college_name: e.target.value})}
                                   placeholder="Full name of your institution"
                                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary dark:border-slate-800 dark:bg-slate-800/50 dark:text-white transition-all"
                                 />
                               </div>
                               <div className="space-y-2">
                                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Branch / Department</label>
                                 <input 
                                   type="text"
                                   value={academicForm.branch || ""}
                                   onChange={(e) => setAcademicForm({...academicForm, branch: e.target.value})}
                                   placeholder="e.g. Computer Science, Mechanical"
                                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary dark:border-slate-800 dark:bg-slate-800/50 dark:text-white transition-all"
                                 />
                               </div>
                               <div className="space-y-2">
                                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Semester</label>
                                 <select 
                                   value={academicForm.semester || ""}
                                   onChange={(e) => setAcademicForm({...academicForm, semester: e.target.value})}
                                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary dark:border-slate-800 dark:bg-slate-800/50 dark:text-white transition-all"
                                 >
                                   <option value="">Select Semester</option>
                                   {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={`Semester ${s}`}>Semester {s}</option>)}
                                   <option value="Completed">Course Completed</option>
                                 </select>
                               </div>
                               <div className="space-y-2">
                                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Institution Type</label>
                                 <select 
                                   value={academicForm.college_type || ""}
                                   onChange={(e) => setAcademicForm({...academicForm, college_type: e.target.value})}
                                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary dark:border-slate-800 dark:bg-slate-800/50 dark:text-white transition-all"
                                 >
                                   <option value="">Select Type</option>
                                   <option value="Government">Government</option>
                                   <option value="Private">Private</option>
                                   <option value="Semi-Government">Semi-Government</option>
                                 </select>
                               </div>
                               <div className="space-y-2">
                                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fathers Name</label>
                                 <input 
                                   type="text"
                                   value={academicForm.father_name || ""}
                                   onChange={(e) => setAcademicForm({...academicForm, father_name: e.target.value})}
                                   placeholder="Full Name"
                                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary dark:border-slate-800 dark:bg-slate-800/50 dark:text-white transition-all"
                                 />
                               </div>
                               <div className="space-y-2">
                                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">University Reg No</label>
                                 <input 
                                   type="text"
                                   value={academicForm.university_reg_no || ""}
                                   onChange={(e) => setAcademicForm({...academicForm, university_reg_no: e.target.value})}
                                   placeholder="e.g. 210111xxx"
                                   className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-primary dark:border-slate-800 dark:bg-slate-800/50 dark:text-white transition-all"
                                 />
                               </div>
                             </div>
                             
                             <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
                                <button 
                                  onClick={handleSaveAcademic}
                                  disabled={saving}
                                  className="rounded-2xl bg-primary px-12 py-4 font-black text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                  {saving ? "Finalizing Update..." : "Update Institutional Profile"}
                                </button>
                             </div>
                           </div>
                         )}
                       </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "settings" && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-8"
                  >
                    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                      <h3 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <FaShieldAlt className="text-primary" /> Security & Privacy
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all">
                           <div>
                             <h4 className="font-bold text-slate-900 dark:text-white">Email Integration</h4>
                             <p className="text-sm text-slate-500">{user.email}</p>
                           </div>
                           <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase text-emerald-600">Active</span>
                        </div>

                        <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all">
                           <div>
                             <h4 className="font-bold text-slate-900 dark:text-white">Two-Factor Auth</h4>
                             <p className="text-sm text-slate-500">Security layer via Supabase Auth</p>
                           </div>
                           <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase text-slate-400 dark:bg-slate-800">Enabled</span>
                        </div>

                        <button
                          className="w-full flex items-center justify-center gap-2 mt-8 rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white transition hover:bg-black dark:bg-primary dark:hover:bg-primary/90"
                        >
                          Update Account Credentials
                        </button>
                      </div>
                    </div>

                    <div className="rounded-[32px] border border-red-100 bg-red-50/30 p-8 dark:border-red-900/30 dark:bg-red-950/20">
                       <h4 className="mb-2 font-bold text-red-600">Danger Zone</h4>
                       <p className="mb-6 text-sm text-red-500/70">Permanently delete your NLITedu account and all learning history. This action cannot be undone.</p>
                       <button className="text-sm font-bold text-red-500 hover:underline">Delete my account permanently</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
