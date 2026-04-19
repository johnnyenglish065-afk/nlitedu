"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { motion } from "motion/react";
import { FaUser, FaEnvelope, FaCalendarAlt, FaShieldAlt, FaEdit, FaSignOutAlt, FaArrowRight } from "react-icons/fa";

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  updated_at: string;
}

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin");
      return;
    }

    const fetchProfile = async () => {
      if (!user || !supabase) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/signin");
    router.refresh();
  };

  if (authLoading || (loading && !profile)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f4f6] dark:bg-[#090E34]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Breadcrumb
        pageName="My Profile"
        description="Manage your account details and view your learning progress in one place."
      />

      <section className="relative z-10 overflow-hidden pb-16 md:pb-20 lg:pb-28">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="backdrop-blur-xl bg-white/70 dark:bg-dark/60 border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden p-8 sm:p-12"
              >
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                  <div className="relative group">
                    <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white text-5xl font-bold shadow-xl overflow-hidden">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
                      {profile?.full_name || "New Explorer"}
                    </h2>
                    <p className="text-primary font-semibold flex items-center justify-center md:justify-start gap-2">
                       <FaShieldAlt className="opacity-70" /> User Account
                    </p>
                  </div>

                  <div className="ml-auto flex flex-wrap gap-2 sm:gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 sm:px-6 py-2 rounded-xl bg-primary/10 text-primary text-sm sm:text-base font-bold transition-all hover:bg-primary hover:text-white flex items-center gap-2"
                    >
                      <FaEdit /> <span className="hidden xs:inline">Edit</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="px-4 sm:px-6 py-2 rounded-xl bg-red-500/10 text-red-500 text-sm sm:text-base font-bold transition-all hover:bg-red-500 hover:text-white flex items-center gap-2"
                    >
                      <FaSignOutAlt /> <span className="hidden xs:inline">Log Out</span>
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-stroke dark:border-white/10 group transition-all hover:border-primary/30 hover:shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <FaEnvelope />
                      </div>
                      <h4 className="font-bold text-dark dark:text-white">Email Address</h4>
                    </div>
                    <p className="text-body-color dark:text-body-color-dark font-medium px-1">
                      {user.email}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-stroke dark:border-white/10 group transition-all hover:border-primary/30 hover:shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all">
                        <FaCalendarAlt />
                      </div>
                      <h4 className="font-bold text-dark dark:text-white">Member Since</h4>
                    </div>
                    <p className="text-body-color dark:text-body-color-dark font-medium px-1">
                      {new Date(user.created_at).toLocaleDateString("en-US", { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-stroke dark:border-white/10 flex flex-wrap gap-4 justify-between items-center">
                   <div className="text-sm text-body-color dark:text-body-color-dark italic flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      Last session: {profile?.updated_at ? new Date(profile.updated_at).toLocaleString() : 'Just now'}
                   </div>
                   
                   <div className="flex items-center gap-2 text-primary font-bold text-sm cursor-pointer hover:underline">
                      View Learning Activity <FaArrowRight size={12} />
                   </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
