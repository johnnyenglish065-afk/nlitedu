"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FaBroadcastTower, FaCommentDots, FaPaperPlane, FaComments, FaVideo } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";

import '@livekit/components-styles';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react';

function BroadcastStudioContent() {
  const searchParams = useSearchParams();
  const channel = searchParams.get("channel") || "test_channel";

  const [token, setToken] = useState("");
  const [isLive, setIsLive] = useState(false);

  // Fetch token
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${channel}&username=Instructor&role=instructor`);
        const data = await resp.json();
        if (data.token) {
          setToken(data.token);
        } else {
          console.error("Token fetch failed:", data.error);
        }
      } catch (e) {
        console.error("Error fetching token", e);
      }
    })();
  }, [channel]);

  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center z-10 shadow-lg relative shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${isLive ? 'bg-red-500/20 border-red-500/30' : 'bg-primary/20 border-primary/30'}`}>
            <FaBroadcastTower className={`text-xl ${isLive ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-white font-black text-lg leading-tight">LiveKit Broadcast Studio</h1>
              {isLive && <span className="bg-red-600 text-white text-[9px] uppercase font-black px-2 py-0.5 rounded-full animate-pulse">LIVE</span>}
            </div>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Channel: <span className="text-primary">{channel}</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isLive && (
            <button 
              onClick={() => setIsLive(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors border border-slate-700"
            >
              End Broadcast
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-hidden relative bg-black" data-lk-theme="default">
          {!isLive ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>
              <div className="z-10 flex flex-col items-center bg-slate-900/80 backdrop-blur-xl p-10 rounded-3xl border border-slate-800 shadow-2xl max-w-lg w-full text-center">
                <div className="w-20 h-20 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/30">
                  <FaVideo className="text-red-500 text-3xl" />
                </div>
                <h2 className="text-3xl font-black text-white mb-4">Ready to go live?</h2>
                <p className="text-slate-400 mb-8">Click below to start broadcasting your camera and screen to all students in the <span className="text-primary font-bold">{channel}</span> channel.</p>
                
                <button 
                  onClick={() => setIsLive(true)}
                  disabled={!token}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:from-slate-700 disabled:to-slate-600 disabled:text-slate-400 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-lg"
                >
                  {!token ? "Authenticating..." : (
                    <>
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                      </span>
                      START BROADCAST
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : token && serverUrl ? (
            <LiveKitRoom
              video={true}
              audio={true}
              token={token}
              serverUrl={serverUrl}
              connect={true}
              className="flex-1 w-full h-full relative"
            >
              <VideoConference />
              <RoomAudioRenderer />
            </LiveKitRoom>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-white animate-pulse">Connecting to LiveKit Server...</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function BroadcastStudio() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-bold tracking-widest uppercase text-sm">Loading Studio...</div>}>
      <BroadcastStudioContent />
    </Suspense>
  );
}
