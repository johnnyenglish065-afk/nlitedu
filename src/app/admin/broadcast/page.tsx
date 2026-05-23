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
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const handleGoLive = async () => {
    setIsStarting(true);
    try {
      const { data } = await supabase
        .from('live_sessions')
        .select('id')
        .or(`session_url.eq.livekit://${channel},session_url.eq.agora://${channel}`)
        .single();
        
      if (data?.id) {
        await supabase.from('live_sessions').update({ is_live: true, started_at: new Date().toISOString() }).eq('id', data.id);
      }
      setIsLive(true);
    } catch (e) {
      console.error(e);
      alert("Failed to go live");
    } finally {
      setIsStarting(false);
    }
  };

  const handleEndBroadcast = async () => {
    setIsEnding(true);
    try {
      const { data } = await supabase
        .from('live_sessions')
        .select('id')
        .or(`session_url.eq.livekit://${channel},session_url.eq.agora://${channel}`)
        .single();
        
      if (data?.id) {
        await supabase.from('live_sessions').update({ is_live: false }).eq('id', data.id);
      }
      setIsLive(false);
    } catch (e) {
      console.error(e);
      alert("Failed to end broadcast");
    } finally {
      setIsEnding(false);
    }
  };

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
          {!isLive ? (
            <button 
              onClick={handleGoLive}
              disabled={!token || isStarting}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 min-w-[140px] flex items-center justify-center"
            >
              {isStarting ? "Starting..." : "START BROADCAST"}
            </button>
          ) : (
            <button 
              onClick={handleEndBroadcast}
              disabled={isEnding}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors border border-slate-700 disabled:opacity-50 min-w-[140px] flex items-center justify-center"
            >
              {isEnding ? "Ending..." : "End Broadcast"}
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-hidden relative bg-black" data-lk-theme="default">
          {token && serverUrl ? (
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
