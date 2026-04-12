"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import NewsLatterBox from "./NewsLatterBox";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!supabase) {
      setMessage({ type: "error", text: "Database not configured" });
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("contact_inquiries").insert([
      {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      },
    ]);

    setLoading(false);

    if (error) {
      setMessage({ type: "error", text: error.message || "Failed to send message" });
    } else {
      setMessage({ type: "success", text: "Your message has been sent successfully!" });
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <div
              className="shadow-three dark:bg-gray-dark mb-12 rounded-xs bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s"
            >
              <h2 className="mb-3 text-2xl font-bold text-black sm:text-3xl lg:text-2xl xl:text-3xl dark:text-white">
                Need Help?
              </h2>
              <p className="text-body-color mb-12 text-base font-medium dark:text-gray-300">
                Our support team will get back to you ASAP via email.
              </p>
              {message && (
                <div className={`mb-8 rounded-lg p-4 ${message.type === "success" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300"}`}>
                  {message.text}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="name"
                        className="text-dark mb-3 block text-sm font-medium dark:text-white"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        className="border-stroke text-body-color focus:border-primary dark:text-body-color-dark dark:shadow-two dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-none dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="email"
                        className="text-dark mb-3 block text-sm font-medium dark:text-white"
                      >
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        className="border-stroke text-body-color focus:border-primary dark:text-body-color-dark dark:shadow-two dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-none dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label
                        htmlFor="message"
                        className="text-dark mb-3 block text-sm font-medium dark:text-white"
                      >
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Enter your message"
                        className="border-stroke text-body-color focus:border-primary dark:text-body-color-dark dark:shadow-two dark:focus:border-primary w-full resize-none rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-none dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <button
                      type="submit"
                      className="bg-primary shadow-submit hover:bg-primary/90 dark:shadow-submit-dark rounded-xs px-9 py-4 text-base font-medium text-white duration-300"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            <NewsLatterBox />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
