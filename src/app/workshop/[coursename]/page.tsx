"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { FaPlay, FaVideo, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/Common/Breadcrumb";

interface RecordedSession {
  id: string;
  course_id: string;
  course_title: string;
  topic: string;
  video_url: string;
  recorded_at: string;
}

export default function WorkshopCoursePage({
  params,
}: {
  params: Promise<{ coursename: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const rawCourseName = unwrappedParams.coursename || "";
  
  // Decode URL (e.g. %20 or - to spaces)
  const courseName = decodeURIComponent(rawCourseName).replace(/-/g, " ");

  const [sessions, setSessions] = useState<RecordedSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<RecordedSession | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!supabase || !courseName) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from("recorded_sessions")
        .select("*")
        .ilike("course_title", `%${courseName}%`)
        .order("recorded_at", { ascending: true });

      if (data && data.length > 0) {
        setSessions(data);
        setActiveSession(data[0]); // Default to first video
      }
      setLoading(false);
    };

    fetchSessions();
  }, [courseName]);

  if (loading) {
    return (
      <>
        <Breadcrumb pageName="Loading..." description="Fetching course materials" />
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </>
    );
  }

  if (sessions.length === 0) {
    return (
      <>
        <Breadcrumb pageName={courseName} description="Workshop Recorded Sessions" />
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
          <FaVideo className="text-6xl text-slate-300 dark:text-slate-700 mb-4" />
          <h1 className="text-3xl font-black text-black dark:text-white mb-2">No Recordings Found</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            We couldn't find any recorded sessions for <span className="text-primary font-bold capitalize">{courseName}</span>. 
            Please check the URL or contact your instructor.
          </p>
          <button 
            onClick={() => router.push("/")}
            className="mt-8 px-6 py-3 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition border border-primary/20"
          >
            Return Home
          </button>
        </div>
      </>
    );
  }

  // Helper to construct embeddable URLs
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    let embedUrl = url;
    if (url.includes("youtube.com/watch?v=")) {
      embedUrl = url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      embedUrl = url.replace("youtu.be/", "youtube.com/embed/");
    }
    if (embedUrl.includes("youtube.com/embed/")) {
      const separator = embedUrl.includes("?") ? "&" : "?";
      embedUrl = `${embedUrl}${separator}rel=0&modestbranding=1`;
    }
    return embedUrl;
  };

  return (
    <>
      <Breadcrumb 
        pageName={<span className="capitalize">{courseName}</span> as any}
        description={`Access recorded sessions for the ${courseName} workshop program. Select a topic below to start learning.`} 
      />

      <section className="pb-16 pt-8 md:pb-20 lg:pb-28">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8">
          
          {/* Video Player Section */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative group">
              {activeSession ? (
                <iframe
                  src={getEmbedUrl(activeSession.video_url)}
                  title={activeSession.topic}
                  className="w-full h-full absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaPlay className="text-slate-500 text-6xl" />
                </div>
              )}
            </div>

            {activeSession && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={activeSession.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                    Now Playing
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    <FaClock /> {new Date(activeSession.recorded_at).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-black dark:text-white mb-2">{activeSession.topic}</h2>
                <p className="text-body-color dark:text-slate-400 text-sm">
                  Recorded session for the <span className="capitalize font-semibold">{activeSession.course_title}</span> program. 
                  Watch carefully and take notes. If you have any doubts, reach out to your instructor.
                </p>
              </motion.div>
            )}
          </div>

          {/* Playlist / Sidebar */}
          <div className="w-full lg:w-1/3 flex flex-col">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col max-h-[600px] lg:h-auto lg:max-h-[800px]">
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0">
                <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                  <FaVideo className="text-primary" /> Course Content
                </h3>
                <p className="text-body-color dark:text-slate-400 text-xs mt-1">Select a session to start watching ({sessions.length} lessons)</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {sessions.map((session, index) => {
                  const isActive = activeSession?.id === session.id;
                  return (
                    <button
                      key={session.id}
                      onClick={() => setActiveSession(session)}
                      className={`w-full text-left p-4 rounded-xl flex items-start gap-4 transition-all duration-300 ${
                        isActive 
                          ? "bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30" 
                          : "bg-transparent border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                        isActive ? "bg-primary text-white shadow-md" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}>
                        {isActive ? <FaPlay className="text-[10px] ml-0.5" /> : index + 1}
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm leading-tight mb-1 ${isActive ? "text-primary" : "text-black dark:text-slate-200"}`}>
                          {session.topic}
                        </h4>
                        <p className="text-[10px] font-semibold text-body-color dark:text-slate-500 flex items-center gap-1">
                          <FaClock className="text-[9px]" /> 
                          {new Date(session.recorded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569; 
        }
      `}} />
    </>
  );
}

