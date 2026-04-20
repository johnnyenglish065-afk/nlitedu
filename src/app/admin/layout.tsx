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
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-slate-950">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-2 rounded-xl">
              <FaShieldAlt className="text-primary text-xl" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Admin Portal</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Institutional Management</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Website</Link>
            <Link href="/admin" className="text-sm font-bold text-primary">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.email}</p>
                <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Super Admin</p>
             </div>
             <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400">
                {user?.email?.charAt(0).toUpperCase()}
             </div>
          </div>
        </div>
      </header>
      <main className="pt-24 pb-12">
        {children}
      </main>
    </div>
  );
}
