"use client";

import { motion } from "framer-motion";
import { 
  FaTimes, FaFileAlt, FaExternalLinkAlt, FaUser, 
  FaUniversity, FaRegIdBadge, FaMapMarkerAlt, FaVenusMars,
  FaCalendarAlt, FaPhoneAlt, FaEnvelope, FaBriefcase
} from "react-icons/fa";

interface EnrollmentDetailProps {
  enrollment: any;
  onClose: () => void;
}

export default function EnrollmentDetail({ enrollment, onClose }: EnrollmentDetailProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FaRegIdBadge className="text-primary text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Student Dossier</h2>
              <p className="text-xs font-mono font-bold text-primary tracking-widest uppercase">
                ID: {enrollment.user_id?.slice(0, 8).toUpperCase() || "NEW"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-red-500 transition-colors shadow-sm"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)] custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Column 1: Personal & Contact */}
            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary rounded-full" /> Personal Profile
                </h3>
                <div className="grid grid-cols-1 gap-5">
                  <InfoItem icon={FaUser} label="Full Name" value={enrollment.full_name} />
                  <InfoItem icon={FaUser} label="Father's Name" value={enrollment.father_name} />
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem icon={FaVenusMars} label="Gender" value={enrollment.gender} />
                    <InfoItem icon={FaCalendarAlt} label="Date of Birth" value={enrollment.dob} />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-blue-500 rounded-full" /> Contact Channels
                </h3>
                <div className="grid grid-cols-1 gap-5">
                  <InfoItem icon={FaEnvelope} label="Email Address" value={enrollment.email} copyable />
                  <InfoItem icon={FaPhoneAlt} label="WhatsApp / Contact" value={enrollment.whatsapp} copyable />
                  <InfoItem icon={FaMapMarkerAlt} label="Resident State" value={enrollment.state} />
                </div>
              </section>
            </div>

            {/* Column 2: Academic & Documents */}
            <div className="space-y-8">
              <section className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-green-500 rounded-full" /> Academic Identity
                </h3>
                <div className="grid grid-cols-1 gap-5">
                  <InfoItem icon={FaUniversity} label="Institution Name" value={enrollment.college_name} />
                  <InfoItem icon={FaBriefcase} label="College Type" value={enrollment.college_type} />
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem icon={FaRegIdBadge} label="Branch" value={enrollment.branch} />
                    <InfoItem icon={FaRegIdBadge} label="Semester" value={enrollment.semester} />
                  </div>
                  <InfoItem icon={FaRegIdBadge} label="University Reg No" value={enrollment.brn} />
                  <InfoItem icon={FaBriefcase} label="Highest Qualification" value={enrollment.qualification} />
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-amber-500 rounded-full" /> Verified Documents
                </h3>
                <div className="flex flex-col gap-4">
                  {enrollment.marksheet12Url ? (
                    <DocumentLink label="10th / 12th Certificate" url={enrollment.marksheet12Url} color="blue" />
                  ) : (
                    <div className="text-[10px] text-slate-400 italic">No 12th marksheet provided.</div>
                  )}
                  {enrollment.marksheetSemUrl ? (
                    <DocumentLink label="Semester Marksheet" url={enrollment.marksheetSemUrl} color="green" />
                  ) : (
                    <div className="text-[10px] text-slate-400 italic">No semester marksheet provided.</div>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* Footer details */}
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-6">
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl">
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">Transaction ID</p>
              <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">{enrollment.cf_payment_id}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl">
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">Enrolled Course</p>
              <p className="text-sm font-bold text-primary">{enrollment.course_title}</p>
            </div>
            {enrollment.message && (
              <div className="w-full bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">Additional Notes</p>
                <p className="text-sm italic text-slate-600 dark:text-slate-400">{enrollment.message}</p>
              </div>
            )}
            {enrollment.interested_internships && (
              <div className="w-full bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-2xl border border-blue-100 dark:border-blue-800">
                <p className="text-[10px] uppercase font-black text-blue-400 tracking-wider mb-1">Interested Internship Courses</p>
                <div className="flex flex-wrap gap-2">
                  {enrollment.interested_internships.split(", ").map((item: string, i: number) => (
                    <span key={i} className="text-xs font-bold px-2 py-1 bg-white dark:bg-slate-800 rounded-lg text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 shadow-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, copyable = false }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm">
        <Icon className="text-slate-400 text-xs" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1.5">{label}</p>
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 BREAK-ALL">
          {value || "Not Provided"}
          {copyable && value && (
            <button 
              onClick={() => navigator.clipboard.writeText(value)}
              className="ml-2 text-primary hover:text-primary/70 transition-colors inline-block"
              title="Copy to clipboard"
            >
              <FaExternalLinkAlt size={10} className="inline opacity-40 hover:opacity-100" />
            </button>
          )}
        </p>
      </div>
    </div>
  );
}

function DocumentLink({ label, url, color }: { label: string, url: string, color: string }) {
  const colors: any = {
    blue: "bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100",
    green: "bg-green-50 border-green-100 text-green-700 hover:bg-green-100"
  };
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`flex items-center justify-between p-4 rounded-2xl border transition-all group ${colors[color]}`}
    >
      <div className="flex items-center gap-3">
        <FaFileAlt className="text-lg opacity-60" />
        <span className="text-sm font-bold">{label}</span>
      </div>
      <FaExternalLinkAlt className="text-xs opacity-40 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}
