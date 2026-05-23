"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaDesktop, FaPhoneSlash, FaBroadcastTower } from "react-icons/fa";

// Dynamically import Agora to avoid SSR issues
let AgoraRTC: any = null;
if (typeof window !== "undefined") {
  AgoraRTC = require("agora-rtc-sdk-ng").default || require("agora-rtc-sdk-ng");
}

const APP_ID = "b9a89d915dbf42f18e467c5481d37d8c";

function BroadcastStudioContent() {
  const searchParams = useSearchParams();
  const channel = searchParams.get("channel") || "test_channel";

  const [isLive, setIsLive] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [loading, setLoading] = useState(false);

  const clientRef = useRef<any>(null);
  const localAudioTrackRef = useRef<any>(null);
  const localVideoTrackRef = useRef<any>(null);
  const screenTrackRef = useRef<any>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!AgoraRTC) return;
    
    const initAgora = async () => {
      try {
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        localAudioTrackRef.current = audioTrack;
        localVideoTrackRef.current = videoTrack;
        
        if (videoContainerRef.current) {
          videoTrack.play(videoContainerRef.current);
        }
      } catch (error) {
        console.error("Error creating tracks:", error);
        alert("Could not access camera/microphone. Please allow permissions in your browser.");
      }
    };
    initAgora();

    return () => {
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
      }
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.stop();
        localVideoTrackRef.current.close();
      }
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current.close();
      }
      if (clientRef.current) {
        clientRef.current.leave();
      }
    };
  }, []);

  const toggleGoLive = async () => {
    if (!AgoraRTC) return;
    
    if (isLive) {
      // Stop broadcasting
      setLoading(true);
      try {
        if (clientRef.current) {
          await clientRef.current.unpublish();
          await clientRef.current.leave();
        }
        setIsLive(false);
        setIsScreenSharing(false);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    } else {
      // Start broadcasting
      setLoading(true);
      try {
        clientRef.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        await clientRef.current.join(APP_ID, channel, null, null);
        await clientRef.current.publish([localAudioTrackRef.current, localVideoTrackRef.current]);
        setIsLive(true);
      } catch (error) {
        console.error("Failed to join channel:", error);
        alert("Failed to go live. Check console for details.");
      }
      setLoading(false);
    }
  };

  const toggleMic = async () => {
    if (localAudioTrackRef.current) {
      await localAudioTrackRef.current.setMuted(!micMuted);
      setMicMuted(!micMuted);
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrackRef.current) {
      await localVideoTrackRef.current.setMuted(!videoMuted);
      setVideoMuted(!videoMuted);
    }
  };

  const toggleScreenShare = async () => {
    if (!AgoraRTC || !clientRef.current || !isLive) {
      alert("You must be live to share your screen.");
      return;
    }

    if (isScreenSharing) {
      // Stop screen sharing
      try {
        await clientRef.current.unpublish(screenTrackRef.current);
        if (screenTrackRef.current) {
          screenTrackRef.current.stop();
          screenTrackRef.current.close();
        }
        
        // Re-publish webcam if it's not muted
        if (localVideoTrackRef.current && !videoMuted) {
          await clientRef.current.publish(localVideoTrackRef.current);
          if (videoContainerRef.current) {
            localVideoTrackRef.current.play(videoContainerRef.current);
          }
        }
        setIsScreenSharing(false);
      } catch (error) {
        console.error("Error stopping screen share:", error);
      }
    } else {
      // Start screen sharing
      try {
        // Create screen track
        const screenTrack = await AgoraRTC.createScreenVideoTrack({}, "auto");
        screenTrackRef.current = Array.isArray(screenTrack) ? screenTrack[0] : screenTrack;
        
        // Handle user clicking "Stop sharing" on the browser native bar
        screenTrackRef.current.on("track-ended", async () => {
          await toggleScreenShare();
        });

        // Unpublish webcam video to publish screen instead
        await clientRef.current.unpublish(localVideoTrackRef.current);
        await clientRef.current.publish(screenTrackRef.current);
        
        // Play screen track locally
        if (videoContainerRef.current) {
          localVideoTrackRef.current.stop();
          screenTrackRef.current.play(videoContainerRef.current);
        }
        
        setIsScreenSharing(true);
      } catch (error) {
        console.error("Error starting screen share:", error);
        alert("Could not start screen sharing.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
            <FaBroadcastTower className="text-primary text-xl" />
          </div>
          <div>
            <h1 className="text-white font-black text-lg leading-tight">Broadcast Studio</h1>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Channel: <span className="text-primary">{channel}</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isLive && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-red-500 font-bold text-[10px] uppercase tracking-wider">Live Now</span>
            </div>
          )}
          <button 
            onClick={toggleGoLive}
            disabled={loading}
            className={`px-8 py-2.5 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${
              isLive 
                ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20" 
                : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
            }`}
          >
            {loading ? "Loading..." : isLive ? <><FaPhoneSlash /> END BROADCAST</> : <><FaBroadcastTower /> GO LIVE</>}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 overflow-hidden relative">
        {/* Video Preview Area */}
        <div className="flex-1 bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-slate-800 flex items-center justify-center">
          <div ref={videoContainerRef} className="absolute inset-0 w-full h-full object-cover"></div>
          
          {/* Muted Indicator Overlay */}
          {videoMuted && !isScreenSharing && (
            <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                <FaVideoSlash className="text-slate-500 text-3xl" />
              </div>
              <p className="text-slate-300 font-bold tracking-widest text-sm uppercase">Camera Disabled</p>
            </div>
          )}
        </div>

        {/* Controls Bar */}
        <div className="mt-6 flex justify-center gap-4">
          <button 
            onClick={toggleMic}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              micMuted ? "bg-red-500/20 text-red-500 border border-red-500/50" : "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
            }`}
            title={micMuted ? "Unmute" : "Mute"}
          >
            {micMuted ? <FaMicrophoneSlash size={22} /> : <FaMicrophone size={22} />}
          </button>
          
          <button 
            onClick={toggleVideo}
            disabled={isScreenSharing}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              videoMuted ? "bg-red-500/20 text-red-500 border border-red-500/50" : "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
            }`}
            title={videoMuted ? "Turn on Camera" : "Turn off Camera"}
          >
            {videoMuted ? <FaVideoSlash size={22} /> : <FaVideo size={22} />}
          </button>

          <button 
            onClick={toggleScreenShare}
            className={`px-6 h-14 rounded-2xl flex items-center gap-3 font-bold transition-all ${
              isScreenSharing ? "bg-primary/20 text-primary border border-primary/50" : "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700"
            }`}
          >
            <FaDesktop size={20} />
            {isScreenSharing ? "Stop Sharing" : "Share Screen"}
          </button>
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
