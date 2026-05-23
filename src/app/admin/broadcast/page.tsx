"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FaBroadcastTower, FaCommentDots, FaPaperPlane, FaComments } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";

import '@livekit/components-styles';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ControlBar,
  useToken,
  GridLayout,
  ParticipantTile
} from '@livekit/components-react';

function BroadcastStudioContent() {
  const searchParams = useSearchParams();
  const channel = searchParams.get("channel") || "test_channel";

  const [token, setToken] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);

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

  // Fetch messages and subscribe to Supabase Realtime
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase!.from('live_chat_messages').select('*').eq('channel_name', channel).order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();

    const subscription = supabase!
      .channel('public:live_chat_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'live_chat_messages', filter: `channel_name=eq.${channel}` }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase!.removeChannel(subscription);
    };
  }, [channel]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatOpen]);

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim()) return;

    const text = chatMessage.trim();
    setChatMessage("");

    await supabase!.from('live_chat_messages').insert({
      channel_name: channel,
      sender_name: "Instructor (Admin)",
      message: text,
    });
  };

  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <FaBroadcastTower className="text-primary text-xl" />
          </div>
          <div>
            <h1 className="text-white font-black text-lg leading-tight">LiveKit Broadcast Studio</h1>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Channel: <span className="text-primary">{channel}</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isChatOpen ? "bg-primary/20 text-primary border border-primary/30" : "bg-slate-800 text-slate-300 hover:text-white border border-slate-700"}`}
            title="Toggle Chat"
          >
            <FaComments />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Video Column - LiveKit */}
        <div className="flex-1 flex flex-col overflow-hidden relative" data-lk-theme="default">
          {token && serverUrl ? (
            <LiveKitRoom
              video={true}
              audio={true}
              token={token}
              serverUrl={serverUrl}
              connect={true}
              className="flex-1 relative"
            >
              <VideoConference />
              <RoomAudioRenderer />
            </LiveKitRoom>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-white animate-pulse">Connecting to LiveKit...</div>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {isChatOpen && (
          <div className="w-[350px] bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl z-20">
            <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-slate-950/50">
              <FaCommentDots className="text-primary" />
              <h3 className="text-white font-bold text-sm tracking-wide uppercase">Live Chat</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="text-center text-slate-500 text-xs mt-10">No messages yet. Say hi!</div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender_name === 'Instructor (Admin)' ? 'items-end' : 'items-start'}`}>
                    {msg.sender_name !== 'Instructor (Admin)' && <span className="text-[10px] font-bold text-slate-400 mb-1 ml-1">{msg.sender_name}</span>}
                    <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm ${msg.sender_name === 'Instructor (Admin)' ? 'bg-primary text-white rounded-br-sm shadow-md shadow-primary/20' : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700 shadow-md shadow-black/20'}`}>
                      {msg.message}
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-950/50">
              <form onSubmit={sendMessage} className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={chatMessage} 
                  onChange={e => setChatMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:border-primary/50 transition-colors"
                />
                <button type="submit" className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 shrink-0">
                  <FaPaperPlane size={14} />
                </button>
              </form>
            </div>
          </div>
        )}
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
