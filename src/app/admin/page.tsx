"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  FaSearch, FaDownload, FaUserGraduate, FaCreditCard, 
  FaClock, FaEye, FaUniversity, FaFilter, FaFileCsv 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import EnrollmentDetail from "../../components/Admin/EnrollmentDetail";

interface Enrollment {
  id: string;
  fullName: string;
  email: string;
  course: string;
  payment_status: string;
  payment_id: string;
  created_at: string;
  user_id: string;
  collegeName: string;
  collegeType: string;
  branch: string;
  semester: string;
  whatsapp: string;
  fatherName: string;
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

  useEffect(() => {
    fetchEnrollments();

    // Set up real-time subscription
    const currentSupabase = supabase;
    if (!currentSupabase) return;
    
    const channel = currentSupabase
      .channel("admin_enrollments_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "enrollments" },
        (payload) => {
          console.log("Real-time change detected:", payload);
          fetchEnrollments(); // Re-fetch to update metrics and list
        }
      )
      .subscribe();

    return () => {
      currentSupabase.removeChannel(channel);
    };
  }, []);

  const fetchEnrollments = async () => {
    try {
      // Only show loading on initial fetch to avoid flickering during real-time updates
      if (enrollments.length === 0) setLoading(true);
      if (!supabase) return;

      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (enrollments.length === 0) return;

    // Define headers
    const headers = [
      "Student ID", "Full Name", "Email", "WhatsApp", "Course", 
      "Status", "Payment ID", "College", "Branch", "Semester", 
      "Reg No", "State", "DOB", "Gender", "Father Name", 
      "Qualification", "Enrollment Date"
    ];

    // Map data to rows
    const rows = enrollments.map(e => [
      e.user_id?.slice(0, 8).toUpperCase() || "N/A",
      e.fullName,
      e.email,
      e.whatsapp,
      e.course,
      e.payment_status,
      e.payment_id,
      e.collegeName,
      e.branch,
      e.semester,
      e.brn,
      e.state,
      e.dob,
      e.gender,
      e.fatherName,
      e.qualification,
      new Date(e.created_at).toLocaleDateString()
    ]);

    // Construct CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `NLITedu_Enrollments_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = enrollments.filter(e => {
    const studentId = e.user_id?.slice(0, 8).toUpperCase();
    const matchesSearch = 
      e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentId?.includes(searchTerm.toUpperCase());
    
    const matchesStatus = statusFilter === "ALL" || e.payment_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: enrollments.length,
    paid: enrollments.filter(e => e.payment_status === "PAID").length,
    pending: enrollments.filter(e => e.payment_status === "PENDING").length,
    revenue: enrollments
      .filter(e => e.payment_status === "PAID")
      .reduce((acc, _) => acc + 499, 0) // Assuming flat enrollment fee for metrics
  };

  return (
    <div className="container mx-auto px-4">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Students", value: stats.total, icon: FaUserGraduate, color: "blue" },
          { label: "Paid Enrollments", value: stats.paid, icon: FaCreditCard, color: "green" },
          { label: "Pending Actions", value: stats.pending, icon: FaClock, color: "amber" },
          { label: "Est. Revenue", value: `₹${stats.revenue}`, icon: FaDownload, color: "purple" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 flex items-center justify-center mb-4`}>
              <stat.icon className={`text-${stat.color}-600 dark:text-${stat.color}-400 text-xl`} />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Table Header/Actions */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
            <div className="relative w-full sm:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Student ID, Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none appearance-none cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={downloadCSV}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-600/20"
          >
            <FaFileCsv size={18} />
            Export CSV
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student Info</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">College & Academic</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Payment Status</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <AnimatePresence>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center text-slate-500">
                      No enrollments found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-black text-primary bg-primary/5 px-2 py-1 rounded">
                          {e.user_id?.slice(0, 8).toUpperCase() || "NEW"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white">{e.fullName}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{e.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-1">
                          <FaUniversity className="text-slate-400 text-xs" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{e.collegeName}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {e.branch}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            Sem {e.semester}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {e.course}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          e.payment_status === "PAID" 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                             e.payment_status === "PAID" ? "bg-green-500" : "bg-amber-500"
                          }`} />
                          {e.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(e.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedEnrollment(e)}
                          className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                        >
                          <FaEye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedEnrollment && (
          <EnrollmentDetail 
            enrollment={selectedEnrollment} 
            onClose={() => setSelectedEnrollment(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
