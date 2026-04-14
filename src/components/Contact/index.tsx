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
    <section className="py-10 sm:py-14 bg-[#f8fafc] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.12)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.9fr] lg:items-stretch">
            <div className="relative bg-slate-50 p-8 sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blue-200/40 blur-3xl" />
              <div className="relative z-10 space-y-6">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.32em] text-primary/80">Stay updated</p>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Ready to start your tech journey?
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Get our career guide and weekly industry updates delivered straight to your inbox. Designed with mobile-first clarity for clean, comfortable reading.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <label className="sr-only" htmlFor="newsletter-email">
                    Your work email
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full min-w-0 rounded-full border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition duration-200 sm:px-5 sm:py-4"
                  />
                  <button
                    type="submit"
                    disabled={subscribeLoading}
                    className={`w-full sm:w-auto rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/15 transition duration-200 hover:bg-blue-700 ${subscribeLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {subscribeLoading ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>
                {subscribeMessage && (
                  <p className="text-sm text-slate-700">{subscribeMessage}</p>
                )}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex -space-x-2 sm:-space-x-3">
                <img
                  className="w-10 h-10 rounded-full border border-slate-300 object-cover"
                  alt="small circular portrait of a young professional"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7C-dwnRgOl9O7cEgpvm49MVH39Dc4jAzuguIl3aKxMhRjFx16qeJs27AA76NEwvE6A88JqzBwbbSqB0wMZMfktTn3XQMuhRTJGFkamtOA466ACkXXwkBLQ-vHROFX74H97apIgyXmO_EtQcR8a2CzUKNOOiizV4wDLR_mBpgsPDPGUXU0jUqVD0p3maNwAY3acojoukJLQfZCQsw8dutJMhlWLh2PW1gSVpi9zYDHyeC6HrqkQd9kT2h-jVbanpVI9IzLhMh8LfM"
                />
                <img
                  className="w-10 h-10 rounded-full border border-slate-300 object-cover"
                  alt="small circular portrait of a young professional"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj0n6GF8C-gGkOeVm7z5J-rmv_4klQ6_I--efD2w4-Gv5uTfvAzy8S0tlxevldDafz6MkY80uH8JrT9mcjX7Z8y9sRMAGsCt8S7caLLHLL-0ERzmfAnZq1XVEtW-KpSsegMdmW_zBllhQoUfaSWXGMCqHnIX-ZpKdbdAmo6V9FnSPXdWSiW3MdiV9tFA8HgRNy_uhUf314j50k77xiaauajW_S9IzkRMGlqGhy9VIMVj6tiBZvj1KCC1Mepe51outsUFHr5BqCgPY"
                />
                <img
                  className="w-10 h-10 rounded-full border border-slate-300 object-cover"
                  alt="small circular portrait of a smiling person"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGfcUa5YqFE4j1Qz7wCmnhVaT7bpuF23EGYbPCjlMvNwlu36DrBi-uiEFGMRQD9naYDTE0wDcAZxsJlFFXnTFzhFpuxE-tfswlRcWp5LCPg1aFlvDZeoKi5FjUCfwbI25hIeZUEtnI5cE-FyFgakxRG4QW7qjUu9xN4pVyEuKuRXC05MdGZtZ0UMipiIaTuOCrqj36RzSeLEYlKA47bAcsNBpIeMWkAC558Wh4s7bHz-ukkH1bUSzbgP_Rvs5Uv7lJNGRFnWOjjcI"
                />
              </div>
              <p className="text-sm font-medium text-slate-600">Join 5,000+ ambitious learners</p>
                </div>
              </div>
            </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm mt-4 lg:mt-0">
              <h4 className="text-slate-900 font-semibold text-xl sm:text-2xl mb-5">Drop us a line</h4>
              {message && (
                <div className={`mb-5 rounded-2xl p-4 text-sm sm:text-base ${message.type === "success" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                  {message.text}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition duration-200"
                    placeholder="Full Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition duration-200"
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
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none text-sm outline-none transition duration-200"
                >
                  <option value="" className="text-slate-900">Select Program</option>
                  <option value="AutoCAD & BIM" className="text-slate-900">AutoCAD & BIM</option>
                  <option value="Java Development" className="text-slate-900">Java Development</option>
                  <option value="Python AI/ML" className="text-slate-900">Python AI/ML</option>
                </select>
                <textarea
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm outline-none transition duration-200"
                  placeholder="Your Message"
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-blue-700 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

