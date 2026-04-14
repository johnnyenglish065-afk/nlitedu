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
    <section className="py-24 bg-surface-container-lowest dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-8">
        <div className="bg-primary rounded-[3rem] p-12 lg:p-20 flex flex-col lg:flex-row gap-16 overflow-hidden relative shadow-2xl">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="lg:w-1/2 z-10">
            <h2 className="font-headline text-4xl font-extrabold text-white mb-6">
              Ready to Start Your Tech Journey?
            </h2>
            <p className="text-blue-100 text-lg mb-10">
              Get our career guide and weekly industry updates delivered straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 mb-8">
              <input
                type="email"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder="Your work email"
                className="flex-grow px-6 py-4 rounded-xl border-none focus:ring-2 focus:ring-secondary-container bg-white/10 text-white placeholder:text-blue-200"
              />
              <button
                type="submit"
                disabled={subscribeLoading}
                className={`bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all ${subscribeLoading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {subscribeLoading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            {subscribeMessage && (
              <p className="text-sm text-white/80 mb-8">{subscribeMessage}</p>
            )}
            <div className="flex gap-6 items-center">
              <div className="flex -space-x-3">
                <img
                  className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                  alt="small circular portrait of a young man"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7C-dwnRgOl9O7cEgpvm49MVH39Dc4jAzuguIl3aKxMhRjFx16qeJs27AA76NEwvE6A88JqzBwbbSqB0wMZMfktTn3XQMuhRTJGFkamtOA466ACkXXwkBLQ-vHROFX74H97apIgyXmO_EtQcR8a2CzUKNOOiizV4wDLR_mBpgsPDPGUXU0jUqVD0p3maNwAY3acojoukJLQfZCQsw8dutJMhlWLh2PW1gSVpi9zYDHyeC6HrqkQd9kT2h-jVbanpVI9IzLhMh8LfM"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                  alt="small circular portrait of a young woman"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj0n6GF8C-gGkOeVm7z5J-rmv_4klQ6_I--efD2w4-Gv5uTfvAzy8S0tlxevldDafz6MkY80uH8JrT9mcjX7Z8y9sRMAGsCt8S7caLLHLL-0ERzmfAnZq1XVEtW-KpSsegMdmW_zBllhQoUfaSWXGMCqHnIX-ZpKdbdAmo6V9FnSPXdWSiW3MdiV9tFA8HgRNy_uhUf314j50k77xiaauajW_S9IzkRMGlqGhy9VIMVj6tiBZvj1KCC1Mepe51outsUFHr5BqCgPY"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                  alt="small circular portrait of a smiling person"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGfcUa5YqFE4j1Qz7wCmnhVaT7bpuF23EGYbPCjlMvNwlu36DrBi-uiEFGMRQD9naYDTE0wDcAZxsJlFFXnTFzhFpuxE-tfswlRcWp5LCPg1aFlvDZeoKi5FjUCfwbI25hIeZUEtnI5cE-FyFgakxRG4QW7qjUu9xN4pVyEuKuRXC05MdGZtZ0UMipiIaTuOCrqj36RzSeLEYlKA47bAcsNBpIeMWkAC558Wh4s7bHz-ukkH1bUSzbgP_Rvs5Uv7lJNGRFnWOjjcI"
                />
              </div>
              <p className="text-sm text-blue-100 font-medium">Join 5,000+ ambitious learners</p>
            </div>
          </div>
          <div className="lg:w-1/2 bg-white/10 backdrop-blur-xl p-10 rounded-[2rem] border border-white/20 z-10">
            <h4 className="text-white font-bold text-xl mb-6">Drop us a line</h4>
            {message && (
              <div className={`mb-6 rounded-lg p-4 ${message.type === "success" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"}`}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  className="bg-white/5 border-none rounded-xl px-6 py-3 text-white placeholder:text-blue-200 focus:ring-2 focus:ring-white/30"
                  placeholder="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  className="bg-white/5 border-none rounded-xl px-6 py-3 text-white placeholder:text-blue-200 focus:ring-2 focus:ring-white/30"
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
                className="w-full bg-white/5 border-none rounded-xl px-6 py-3 text-white focus:ring-2 focus:ring-white/30 appearance-none"
              >
                <option value="" className="text-gray-900 dark:text-white">Select Program</option>
                <option value="AutoCAD & BIM" className="text-gray-900 dark:text-white">AutoCAD & BIM</option>
                <option value="Java Development" className="text-gray-900 dark:text-white">Java Development</option>
                <option value="Python AI/ML" className="text-gray-900 dark:text-white">Python AI/ML</option>
              </select>
              <textarea
                className="w-full bg-white/5 border-none rounded-xl px-6 py-3 text-white placeholder:text-blue-200 focus:ring-2 focus:ring-white/30"
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
                className={`w-full bg-secondary-container text-white py-4 rounded-xl font-bold hover:bg-secondary transition-all ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
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
