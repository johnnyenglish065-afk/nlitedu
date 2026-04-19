"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { FaGoogle, FaGithub, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { user, resetPasswordForEmail } = useAuth();
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!supabase) {
      setError("Supabase client is not initialized.");
      setLoading(false);
      return;
    }

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.host === 'localhost:3000' ? 'http://localhost:3000' : window.location.origin}/auth/callback`,
      },
    });
  };

  const handleGithubSignIn = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.host === 'localhost:3000' ? 'http://localhost:3000' : window.location.origin}/auth/callback`,
      },
    });
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    
    setLoading(true);
    const { error } = await resetPasswordForEmail(email);
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Reset link sent! Please check your inbox.");
      setError(null);
    }
  };

  if (user) return null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f3f4f6] dark:bg-[#090E34] flex items-center justify-center py-20 px-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 h-full w-full overflow-hidden z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            x: [0, -100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-400/20 blur-[130px]" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-[500px]"
      >
        <div className="backdrop-blur-xl bg-white/70 dark:bg-dark/60 border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="text-center mb-10">
              <motion.h3 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-black dark:text-white mb-2"
              >
                Welcome Back
              </motion.h3>
              <p className="text-body-color dark:text-body-color-dark font-medium">
                Log in to access your dashboard
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-stroke dark:border-white/10 bg-white dark:bg-white/5 py-3 px-6 text-base font-medium text-dark dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-white/10"
              >
                <FaGoogle className="text-red-500" />
                <span>Continue with Google</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGithubSignIn}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-stroke dark:border-white/10 bg-white dark:bg-white/5 py-3 px-6 text-base font-medium text-dark dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-white/10"
              >
                <FaGithub />
                <span>Continue with Github</span>
              </motion.button>
            </div>

            <div className="relative mb-8 text-center">
              <span className="absolute left-0 top-1/2 h-[1px] w-full bg-stroke dark:bg-white/10" />
              <span className="relative z-10 bg-[#fbfbfb] dark:bg-[#1d2144] px-4 text-sm text-body-color dark:text-body-color-dark">
                Or sign in with email
              </span>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="mb-6 rounded-xl bg-red-400/10 border border-red-400/20 p-4 text-sm text-red-500"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="mb-6 rounded-xl bg-green-400/10 border border-green-400/20 p-4 text-sm text-green-500"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSignin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-dark dark:text-white flex items-center gap-2 px-1">
                  <FaEnvelope className="text-primary opacity-70" /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-stroke dark:border-white/10 bg-gray-50 dark:bg-white/5 py-3 px-5 text-base text-dark dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all dark:focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-sm font-semibold text-dark dark:text-white flex items-center gap-2">
                    <FaLock className="text-primary opacity-70" /> Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-primary text-xs font-bold hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-stroke dark:border-white/10 bg-gray-50 dark:bg-white/5 py-3 px-5 text-base text-dark dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all dark:focus:border-primary"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01, boxShadow: "0 10px 15px -3px rgba(74, 108, 247, 0.4)" }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-primary/90 disabled:opacity-70"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Sign In <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </form>

            <p className="mt-10 text-center text-sm font-medium text-body-color dark:text-body-color-dark">
              New here?{" "}
              <Link href="/signup" className="text-primary font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SigninPage;
;
