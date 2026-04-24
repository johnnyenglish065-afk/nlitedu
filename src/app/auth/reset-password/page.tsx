"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { FaLock, FaCheck, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { updatePassword, session } = useAuth();
  const router = useRouter();

  // If there is no session (no valid reset link token or not logged in), 
  // we might want to redirect, but Supabase usually handles the session injection from the URL hash.
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f3f4f6] dark:bg-[#090E34] flex items-center justify-center py-20 px-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 h-full w-full overflow-hidden z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 80, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            x: [0, -80, 0],
            y: [0, -40, 0]
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
                Reset Password
              </motion.h3>
              <p className="text-body-color dark:text-body-color-dark font-medium">
                Enter your new secure password below
              </p>
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 rounded-xl bg-green-400/10 border border-green-400/20 p-6 text-center"
                >
                  <div className="flex justify-center mb-3">
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <FaCheck size={20} />
                    </div>
                  </div>
                  <h4 className="text-green-600 font-bold mb-1">Success!</h4>
                  <p className="text-sm text-green-600/80">
                    Your password has been reset successfully. Redirecting to sign in...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!success && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-dark dark:text-white flex items-center gap-2 px-1">
                    <FaLock className="text-primary opacity-70" /> New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-stroke dark:border-white/10 bg-gray-50 dark:bg-white/5 py-3 px-5 text-base text-dark dark:text-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all dark:focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-dark dark:text-white flex items-center gap-2 px-1">
                    <FaLock className="text-primary opacity-70" /> Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                      Update Password <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>
              </form>
            )}

            <p className="mt-10 text-center text-sm font-medium text-body-color dark:text-body-color-dark">
              Remembered your password?{" "}
              <Link href="/signin" className="text-primary font-bold hover:underline">
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
