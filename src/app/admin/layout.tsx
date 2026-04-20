"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaShieldAlt, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  // Admin access is restricted to info@nlitedu.com for this phase
  const ADMIN_EMAIL = "info@nlitedu.com";

  useEffect(() => {
    if (!loading) {
      if (!user || user.email !== ADMIN_EMAIL) {
        // Not authorized, redirect to home
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } else {
        setAuthorized(true);
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 text-center border border-red-100 dark:border-red-900/30"
        >
          <div className="bg-red-50 dark:bg-red-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShieldAlt className="text-red-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            You do not have administrative privileges to access this portal. Redirecting you to the homepage...
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
          >
            <FaArrowLeft /> Go Home Now
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-slate-950 transition-colors duration-300">
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b-2 border-primary/10 dark:border-primary/5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
        <div className="container mx-auto px-6 h-22 flex items-center justify-between py-4">
          <div className="flex items-center gap-5">
            <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20">
              <FaShieldAlt className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">NLITedu <span className="text-primary">Admin</span></h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">Institutional Oversight</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            <Link href="/" className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-primary transition-all">Public Portal</Link>
            <Link href="/admin" className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-primary pb-1">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">Super Admin</p>
             </div>
             <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 p-0.5 shadow-lg shadow-primary/20">
                <div className="h-full w-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center font-black text-primary text-lg">
                   {user?.email?.charAt(0).toUpperCase()}
                </div>
             </div>
          </div>
        </div>
      </header>
      <main className="pt-28 pb-12">
        {children}
      </main>
    </div>
  );
}
