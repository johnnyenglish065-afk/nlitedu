"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", program: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!supabase) {
      setMessage({ type: "error", text: "Database not configured. Please check .env.local." });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("contact_inquiries").insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        program: formData.program,
        message: formData.message,
      },
    ]);

    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message || "Failed to send message" });
    } else {
      setMessage({ type: "success", text: "Your message has been sent successfully!" });
      setFormData({ name: "", email: "", phone: "", program: "", message: "" });
    }
  };

  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState<string | null>(null);

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribeMessage(null);

    if (!subscribeEmail.trim()) {
      setSubscribeMessage("Please enter your email address.");
      return;
    }

    if (!supabase) {
      setSubscribeMessage("Database not configured. Please check .env.local.");
      return;
    }

    setSubscribeLoading(true);

    const { error } = await supabase.from("newsletter_subscriptions").insert([
      {
        email: subscribeEmail.trim(),
      },
    ]);

    setSubscribeLoading(false);

    if (error) {
      setSubscribeMessage(error.message || "Unable to subscribe right now. Please try again.");
    } else {
      setSubscribeMessage("Thanks! You are now subscribed.");
      setSubscribeEmail("");
    }
  };

  return (
    <section className="py-12 sm:py-20 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900/90 border border-white/10 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.9)] backdrop-blur-xl p-6 sm:p-8 lg:p-12">
          <div className="absolute -right-20 -top-16 w-72 h-72 rounded-full bg-gradient-to-br from-cyan-400/15 to-sky-500/5 blur-3xl" />
          <div className="absolute left-0 top-1/2 w-full h-1/2 rounded-full bg-white/5 blur-2xl" />

          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
            <div className="lg:w-1/2">
            <h2 className="font-headline text-2xl sm:text-4xl font-extrabold text-white mb-4 sm:mb-6">
              Ready to Start Your Tech Journey?
            </h2>
            <p className="text-blue-100 text-sm sm:text-lg mb-6 sm:mb-10">
              Get our career guide and weekly industry updates delivered straight to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <label className="sr-only" htmlFor="newsletter-email">
                Your work email
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder="Your work email"
                className="w-full min-w-0 rounded-[1.5rem] border border-white/10 bg-white/10 px-4 py-3 text-slate-950 placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/95 focus:outline-none focus:ring-2 focus:ring-cyan-300/30 transition duration-200 sm:px-5 sm:py-4"
              />
              <button
                type="submit"
                disabled={subscribeLoading}
                className={`w-full sm:w-auto rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition duration-200 hover:bg-cyan-300 ${subscribeLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {subscribeLoading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            {subscribeMessage && (
              <p className="text-sm text-white/80 mb-6 sm:mb-8">{subscribeMessage}</p>
            )}
            
            <div className="flex gap-4 sm:gap-6 items-center">
              <div className="flex -space-x-2 sm:-space-x-3">
                <img
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-primary sm:border-2 object-cover"
                  alt="small circular portrait of a young man"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7C-dwnRgOl9O7cEgpvm49MVH39Dc4jAzuguIl3aKxMhRjFx16qeJs27AA76NEwvE6A88JqzBwbbSqB0wMZMfktTn3XQMuhRTJGFkamtOA466ACkXXwkBLQ-vHROFX74H97apIgyXmO_EtQcR8a2CzUKNOOiizV4wDLR_mBpgsPDPGUXU0jUqVD0p3maNwAY3acojoukJLQfZCQsw8dutJMhlWLh2PW1gSVpi9zYDHyeC6HrqkQd9kT2h-jVbanpVI9IzLhMh8LfM"
                />
                <img
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-primary sm:border-2 object-cover"
                  alt="small circular portrait of a young woman"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj0n6GF8C-gGkOeVm7z5J-rmv_4klQ6_I--efD2w4-Gv5uTfvAzy8S0tlxevldDafz6MkY80uH8JrT9mcjX7Z8y9sRMAGsCt8S7caLLHLL-0ERzmfAnZq1XVEtW-KpSsegMdmW_zBllhQoUfaSWXGMCqHnIX-ZpKdbdAmo6V9FnSPXdWSiW3MdiV9tFA8HgRNy_uhUf314j50k77xiaauajW_S9IzkRMGlqGhy9VIMVj6tiBZvj1KCC1Mepe51outsUFHr5BqCgPY"
                />
                <img
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-primary sm:border-2 object-cover"
                  alt="small circular portrait of a smiling person"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGfcUa5YqFE4j1Qz7wCmnhVaT7bpuF23EGYbPCjlMvNwlu36DrBi-uiEFGMRQD9naYDTE0wDcAZxsJlFFXnTFzhFpuxE-tfswlRcWp5LCPg1aFlvDZeoKi5FjUCfwbI25hIeZUEtnI5cE-FyFgakxRG4QW7qjUu9xN4pVyEuKuRXC05MdGZtZ0UMipiIaTuOCrqj36RzSeLEYlKA47bAcsNBpIeMWkAC558Wh4s7bHz-ukkH1bUSzbgP_Rvs5Uv7lJNGRFnWOjjcI"
                />
              </div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium">Join 5,000+ ambitious learners</p>
            </div>
          </div>
          
          <div className="lg:w-1/2 bg-white/5 sm:bg-white/10 backdrop-blur-xl p-5 sm:p-10 rounded-2xl sm:rounded-[2rem] border border-white/10 sm:border-white/20 z-10 w-full mt-4 sm:mt-0">
            <h4 className="text-white font-bold text-lg sm:text-xl mb-4 sm:mb-6">Drop us a line</h4>
            {message && (
              <div className={`mb-4 sm:mb-6 rounded-lg p-3 sm:p-4 text-sm sm:text-base ${message.type === "success" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"}`}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20 outline-none transition duration-200"
                  placeholder="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20 outline-none transition duration-200"
                  placeholder="Phone Number"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <select
                name="program"
                aria-label="Select Program"
                value={formData.program}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20 appearance-none text-sm outline-none transition duration-200"
              >
                <option value="" className="text-slate-900">Select Program</option>
                <option value="AutoCAD & BIM" className="text-slate-900">AutoCAD & BIM</option>
                <option value="Java Development" className="text-slate-900">Java Development</option>
                <option value="Python AI/ML" className="text-slate-900">Python AI/ML</option>
              </select>
              <textarea
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20 text-sm outline-none transition duration-200"
                placeholder="Your Message"
                rows={3}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-secondary-container text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base hover:bg-secondary transition-all ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

