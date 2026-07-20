"use client";

import { motion } from "framer-motion";
import { 
  FaTimes, FaFileAlt, FaExternalLinkAlt, FaUser, 
  FaUniversity, FaRegIdBadge, FaMapMarkerAlt, FaVenusMars,
  FaCalendarAlt, FaPhoneAlt, FaEnvelope, FaBriefcase, FaDownload
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { supabase } from "@/lib/supabaseClient";

interface EnrollmentDetailProps {
  enrollment: any;
  onClose: () => void;
}

export default function EnrollmentDetail({ enrollment, onClose }: EnrollmentDetailProps) {
  let internshipMode = enrollment.internship_mode || null;
  let cleanMessage = enrollment.message || "";
  if (!internshipMode && cleanMessage.includes("[Internship Mode:")) {
    const match = cleanMessage.match(/\[Internship Mode:\s*([^\]]+)\]/);
    if (match) {
      internshipMode = match[1];
      cleanMessage = cleanMessage.replace(/\[Internship Mode:\s*[^\]]+\]\s*/, "").trim();
    }
  }

  const [isGenerating, setIsGenerating] = useState(false);
  const [publishedCertificate, setPublishedCertificate] = useState<any>(null);

  useEffect(() => {
    async function fetchCertificate() {
      if (enrollment.email && enrollment.course_title) {
        if (!supabase) return;
        const { data, error } = await supabase
          .from("certificates")
          .select("pdf_url, certificate_number")
          .eq("user_email", enrollment.email)
          .eq("course_title", enrollment.course_title)
          .maybeSingle();
        
        if (data) {
          setPublishedCertificate(data);
        }
      }
    }
    fetchCertificate();
  }, [enrollment]);

  const handleDownloadInvoice = async () => {
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

      // 1. Header Blue Band
      pdf.setFillColor(37, 99, 235);
      pdf.rect(0, 0, pdfWidth, 45, "F");

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
      pdf.text(`Transaction ID: ${enrollment.cf_payment_id || "N/A"}`, pdfWidth - margin, 26, { align: "right" });

      // 2. Receipt Details Header
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
      pdf.text((enrollment.email || "").split("@")[0].toUpperCase(), margin, y);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(`Date: ${new Date(enrollment.created_at || Date.now()).toLocaleDateString()}`, pdfWidth - margin, y, { align: "right" });

      y += 5;
      pdf.setTextColor(51, 65, 85);
      pdf.text(enrollment.email || "N/A", margin, y);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(16, 185, 129);
      pdf.text(`Status: ${enrollment.status || "UNKNOWN"}`, pdfWidth - margin, y, { align: "right" });

      y += 15;
      // Calculate price using same logic as enroll/page.tsx as a fallback
      let calculatedFee = 0;
      let originalPrice = 6999;
      
      const isInternship = (!enrollment.enrollment_type || enrollment.enrollment_type === 'internship');
      
      if (isInternship) {
          if (enrollment.state === "Bihar") {
            const duration = enrollment.duration || "";
            const mode = internshipMode || "Online";

            if (enrollment.college_type === "govt") {
              if (mode === "Online") {
                if (duration.includes("2")) calculatedFee = 799;
                else if (duration.includes("4")) calculatedFee = 999;
                else if (duration.includes("6")) calculatedFee = 1199;
                else if (duration.includes("8")) calculatedFee = 1399;
                else calculatedFee = 999;
              } else {
                if (duration.includes("2")) calculatedFee = 1299;
                else if (duration.includes("4")) calculatedFee = 1499;
                else if (duration.includes("6")) calculatedFee = 1999;
                else if (duration.includes("8")) calculatedFee = 2499;
                else calculatedFee = 1499;
              }
            }
            else if (enrollment.college_type === "private") {
              if (mode === "Online") {
                if (duration.includes("2")) calculatedFee = 999;
                else if (duration.includes("4")) calculatedFee = 1499;
                else if (duration.includes("6")) calculatedFee = 1999;
                else if (duration.includes("8")) calculatedFee = 2499;
                else calculatedFee = 1999;
              } else {
                if (duration.includes("2")) calculatedFee = 1799;
                else if (duration.includes("4")) calculatedFee = 1999;
                else if (duration.includes("6")) calculatedFee = 2499;
                else if (duration.includes("8")) calculatedFee = 2999;
                else calculatedFee = 1999;
              }
            }
            else if (enrollment.college_type === "job") calculatedFee = 2999;
          }
          else {
            if (enrollment.college_type === "govt") calculatedFee = 1499;
            else if (enrollment.college_type === "private") calculatedFee = 1999;
            else if (enrollment.college_type === "job") calculatedFee = 2999;
          }
      } else {
         calculatedFee = 499;
         originalPrice = 1499;
      }

      if (calculatedFee === 0) calculatedFee = 999;
      
      let paidAmount = calculatedFee;

      // First check if the exact amount is already saved in the database
      if (enrollment.payment_amount != null) {
        paidAmount = Number(enrollment.payment_amount);
      } 
      // Try to get exact amount from gateway if payment ID exists and we didn't find it in DB
      else if (enrollment.cf_payment_id) {
        try {
          if (!supabase) {
            throw new Error("Supabase client is not initialized");
          }
          
          const isRazorpay = enrollment.cf_payment_id.startsWith("NLIT_RZP_");
          const functionName = isRazorpay ? "verify-razorpay-payment" : "verify-cashfree-payment";
          const payload = isRazorpay 
            ? { orderId: enrollment.cf_payment_id } // Our Edge Function supports this now for backward compatibility
            : { orderId: enrollment.cf_payment_id };
            
          const { data } = await supabase.functions.invoke(functionName, {
            body: payload,
          });
          
          let parsedData = data;
          if (typeof data === "string") {
            try { parsedData = JSON.parse(data); } catch (e) {}
          }
          
          if (parsedData?.amount) {
            paidAmount = parsedData.amount;
          }
        } catch (e) {
          console.warn("Could not fetch exact amount from Cashfree, using fallback:", e);
        }
      }

      // 3. Table Header
      pdf.setFillColor(241, 245, 249);
      pdf.rect(margin, y, pdfWidth - (margin * 2), 10, "F");
      
      pdf.setTextColor(71, 85, 105);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.text("COURSE / ITEM DESCRIPTION", margin + 5, y + 6.5);
      pdf.text("STATUS", pdfWidth - margin - 35, y + 6.5, { align: "right" });
      pdf.text("AMOUNT", pdfWidth - margin - 5, y + 6.5, { align: "right" });

      y += 10;
      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin, y, pdfWidth - margin, y);

      y += 8;
      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text(enrollment.course_title || "Unknown Course", margin + 5, y);

      pdf.setTextColor(16, 185, 129);
      pdf.text(enrollment.status || "PAID", pdfWidth - margin - 35, y, { align: "right" });

      pdf.setTextColor(15, 23, 42);
      pdf.text(`Rs. ${paidAmount.toLocaleString("en-IN")}.00`, pdfWidth - margin - 5, y, { align: "right" });

      y += 4.5;
      pdf.setTextColor(100, 116, 139);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.text("Includes full curriculum, mentorship sessions, and certificate of completion.", margin + 5, y);

      y += 10;
      pdf.line(margin, y, pdfWidth - margin, y);

      // 5. Total Section
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

      // 6. Support Details Card
      y += 20;
      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(margin, y, pdfWidth - (margin * 2), 35, 3, 3, "F");
      pdf.setDrawColor(241, 245, 249);
      pdf.roundedRect(margin, y, pdfWidth - (margin * 2), 35, 3, 3, "D");

      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text("Important Notice:", margin + 8, y + 8);

      pdf.setTextColor(71, 85, 105);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);
      pdf.text("1. This is a system-generated copy of the student's enrollment receipt.", margin + 8, y + 14);
      pdf.text("2. Please verify the transaction ID in the payment gateway if necessary.", margin + 8, y + 19);

      // 7. Footer
      pdf.setDrawColor(226, 232, 240);
      pdf.line(margin, pdfHeight - 30, pdfWidth - margin, pdfHeight - 30);

      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184);
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

      pdf.save(`Admin_Invoice_${(enrollment.cf_payment_id || "N/A").substring(0, 8)}.pdf`);
    } catch (err: any) {
      console.error("Failed to generate PDF", err);
      alert("PDF Generation Error: " + (err.message || "Unknown error"));
    } finally {
      setIsGenerating(false);
    }
  };

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
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                Student Dossier
                {(!enrollment.enrollment_type || enrollment.enrollment_type === 'internship') && (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest">Internship</span>
                )}
                {enrollment.enrollment_type === 'workshop' && (
                  <span className="px-2 py-0.5 rounded-md bg-fuchsia-100 text-fuchsia-700 text-[10px] font-black uppercase tracking-widest">Workshop</span>
                )}
                {enrollment.enrollment_type === 'site-visit' && (
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 text-[10px] font-black uppercase tracking-widest">Site Visit</span>
                )}
              </h2>
              <p className="text-xs font-mono font-bold text-primary tracking-widest uppercase mt-1">
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
                  {publishedCertificate && publishedCertificate.pdf_url && (
                    <div className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-3 bg-purple-500 rounded-full" /> Issued Certificate
                      </h4>
                      <DocumentLink 
                        label={`Certificate ID: ${publishedCertificate.certificate_number}`} 
                        url={publishedCertificate.pdf_url} 
                        color="blue" 
                      />
                    </div>
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
            {internshipMode && (
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">Internship Mode</p>
                <p className="text-sm font-bold text-primary">{internshipMode}</p>
              </div>
            )}
            {enrollment.duration && (
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">Internship Duration</p>
                <p className="text-sm font-bold text-primary">{enrollment.duration}</p>
              </div>
            )}
            {cleanMessage && (
              <div className="w-full bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl">
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-1">Additional Notes</p>
                <p className="text-sm italic text-slate-600 dark:text-slate-400">{cleanMessage}</p>
              </div>
            )}
            
            {/* Download Invoice Button */}
            {enrollment.status === "PAID" && (
              <div className="w-full mt-4 flex justify-end">
                <button
                  onClick={handleDownloadInvoice}
                  disabled={isGenerating}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FaDownload />
                      Download Invoice PDF
                    </>
                  )}
                </button>
              </div>
            )}
            {/* Interested Internship Courses removed */}
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
