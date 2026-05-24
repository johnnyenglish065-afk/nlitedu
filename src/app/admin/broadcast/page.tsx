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
  useLocalParticipant,
  Chat,
  useParticipants,
  useRoomContext,
  useDataChannel,
  ConnectionQualityIndicator,
  PreJoin,
  type LocalUserChoices
} from '@livekit/components-react';
import { Track, VideoPresets } from 'livekit-client';
import { FaUsers, FaMicrophoneSlash, FaBan, FaHandPaper, FaChalkboard } from "react-icons/fa";
import WhiteboardModal from './Whiteboard';

function ParticipantModeration({ isVisible }: { isVisible: boolean }) {
  const participants = useParticipants();
  const room = useRoomContext();
  
  const [raisedHands, setRaisedHands] = useState<Set<string>>(new Set());
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [activePoll, setActivePoll] = useState<{question: string, options: string[]} | null>(null);
  const [pollResults, setPollResults] = useState<Record<string, number>>({});

  useDataChannel((msg) => {
    try {
      const decoder = new TextDecoder();
      const payloadStr = decoder.decode(msg.payload);
      const data = JSON.parse(payloadStr);
      
      if (data.action === "RAISE_HAND") {
        setRaisedHands(prev => new Set(prev).add(msg.from?.identity || ""));
      }
      if (data.action === "LOWER_HAND") {
        setRaisedHands(prev => {
          const next = new Set(prev);
          next.delete(msg.from?.identity || "");
          return next;
        });
      }
      if (data.action === "POLL_VOTE") {
        setPollResults(prev => ({
          ...prev,
          [data.optionId]: (prev[data.optionId] || 0) + 1
        }));
      }
    } catch(e) {}
  });

  const handleLowerHand = (identity: string) => {
    setRaisedHands(prev => {
      const next = new Set(prev);
      next.delete(identity);
      return next;
    });
    // Optional: send a signal back to student to lower their hand locally
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify({ action: 'LOWER_HAND', target: identity }));
    room.localParticipant.publishData(data, { reliable: true });
  };
  
  const handleKick = async (identity: string) => {
    if (!confirm(`Are you sure you want to kick ${identity} from the live class?`)) return;

    try {
      const response = await fetch('/api/livekit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room: room.name, identity }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to kick participant');

      alert(`${identity} has been removed from the class.`);
    } catch (error: any) {
      alert(`Error kicking participant: ${error.message}`);
      console.error(error);
    }
  };

  const handleMute = (identity: string) => {
    alert(`Mute request sent to ${identity}.`);
    // Send a data message requesting mute via LiveKit
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify({ action: 'MUTE_MIC', target: identity }));
    room.localParticipant.publishData(data, { reliable: true });
  };

  return (
    <div style={{ display: isVisible ? 'flex' : 'none' }} className="flex-col h-full bg-slate-900 border-l border-slate-800 w-[350px] shrink-0 z-20 shadow-2xl">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
        <h2 className="text-white font-bold text-sm flex items-center gap-2">
          <FaUsers className="text-primary" /> Students ({participants.length})
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {participants.map((p) => (
          <div key={p.identity} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
                {p.name ? p.name.substring(0, 2) : p.identity.substring(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-white text-xs font-bold">{p.name || p.identity}</p>
                  {raisedHands.has(p.identity) && (
                    <span className="text-amber-400 animate-bounce" title="Hand Raised">✋</span>
                  )}
                  <ConnectionQualityIndicator participant={p} className="text-xs" />
                </div>
                <p className="text-slate-400 text-[10px]">{p.isMicrophoneEnabled ? "Mic On" : "Mic Off"}</p>
              </div>
            </div>
            
            {!p.isLocal && (
              <div className="flex gap-2">
                {raisedHands.has(p.identity) && (
                  <button onClick={() => handleLowerHand(p.identity)} className="p-1.5 bg-amber-500/20 hover:bg-amber-500/40 rounded text-amber-500 transition" title="Lower Hand">
                    <FaHandPaper className="text-[10px]" />
                  </button>
                )}
                <button onClick={() => handleMute(p.identity)} className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition" title="Request Mute">
                  <FaMicrophoneSlash className="text-[10px]" />
                </button>
                <button onClick={() => handleKick(p.identity)} className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded text-red-500 transition" title="Kick Student">
                  <FaBan className="text-[10px]" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Poll Manager Section */}
      <div className="border-t border-slate-800 p-4 bg-slate-900 flex-shrink-0 flex flex-col max-h-[300px] overflow-y-auto">
        <h2 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
          <FaBroadcastTower className="text-primary" /> Live Polls
        </h2>
        
        {activePoll ? (
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <h3 className="text-white text-xs font-bold mb-2">{activePoll.question}</h3>
            <div className="space-y-2 mb-3">
              {activePoll.options.map((opt: string, idx: number) => {
                const count = pollResults[idx] || 0;
                const total = Object.values(pollResults).reduce((a, b) => a + b, 0) || 1;
                const percent = Math.round((count / total) * 100);
                
                return (
                  <div key={idx} className="relative bg-slate-900 rounded overflow-hidden p-2">
                    <div className="absolute top-0 left-0 bottom-0 bg-primary/20 transition-all" style={{ width: `${percent}%` }}></div>
                    <div className="relative flex justify-between items-center z-10">
                      <span className="text-slate-300 text-xs">{opt}</span>
                      <span className="text-white font-bold text-[10px]">{percent}% ({count})</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <button 
              onClick={() => {
                setActivePoll(null);
                const encoder = new TextEncoder();
                const data = encoder.encode(JSON.stringify({ action: 'END_POLL' }));
                room.localParticipant.publishData(data, { reliable: true });
              }} 
              className="w-full py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-500 text-xs font-bold rounded transition"
            >
              End Poll
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Ask a question..." 
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white text-xs focus:outline-none focus:border-primary"
            />
            {pollOptions.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder={`Option ${i + 1}`} 
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...pollOptions];
                    newOpts[i] = e.target.value;
                    setPollOptions(newOpts);
                  }}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded p-2 text-white text-xs focus:outline-none focus:border-primary"
                />
                {pollOptions.length > 2 && (
                  <button onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))} className="text-red-500 px-2 hover:bg-red-500/20 rounded">
                    ×
                  </button>
                )}
              </div>
            ))}
            <div className="flex justify-between items-center pt-2">
              <button 
                onClick={() => setPollOptions([...pollOptions, ""])} 
                className="text-primary text-xs font-bold hover:underline"
              >
                + Add Option
              </button>
              <button 
                disabled={!pollQuestion || pollOptions.some(o => !o.trim())}
                onClick={() => {
                  const pollData = { question: pollQuestion, options: pollOptions };
                  setActivePoll(pollData);
                  setPollResults({});
                  const encoder = new TextEncoder();
                  const data = encoder.encode(JSON.stringify({ action: 'START_POLL', poll: pollData }));
                  room.localParticipant.publishData(data, { reliable: true });
                }} 
                className="px-3 py-1.5 bg-primary hover:bg-primary/80 text-white text-xs font-bold rounded disabled:opacity-50 transition"
              >
                Launch Poll
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TrackStateSaver() {
  const { localParticipant } = useLocalParticipant();
  useEffect(() => {
    if (localParticipant) {
      sessionStorage.setItem('livekit-screenshare', localParticipant.isScreenShareEnabled ? 'true' : 'false');
    }
  }, [localParticipant?.isScreenShareEnabled]);
  return null;
}

function WhiteboardPublisher({ 
  isWhiteboardOpen, 
  setIsWhiteboardOpen,
  isWhiteboardMinimized,
  setIsWhiteboardMinimized
}: { 
  isWhiteboardOpen: boolean, 
  setIsWhiteboardOpen: (val: boolean) => void,
  isWhiteboardMinimized: boolean,
  setIsWhiteboardMinimized: (val: boolean) => void
}) {
  const { localParticipant } = useLocalParticipant();
  const [isSharing, setIsSharing] = useState(false);
  
  // Sync the isSharing state with actual screen share state
  useEffect(() => {
    if (localParticipant) {
      setIsSharing(localParticipant.isScreenShareEnabled);
    }
  }, [localParticipant, localParticipant?.isScreenShareEnabled]);

  const toggleShare = async () => {
    if (!localParticipant) return;
    
    if (!localParticipant.isScreenShareEnabled) {
      try {
        // Request the current tab with a preference to hide the popup's surface switching if possible
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
          preferCurrentTab: true,
          video: { displaySurface: "browser" } 
        } as any);
        
        const videoTrack = stream.getVideoTracks()[0];
        if (!videoTrack) return;
        
        // Use modern Region Capture API to crop the screen share to ONLY the whiteboard container!
        if ('CropTarget' in window) {
          try {
            const targetDiv = document.querySelector('.whiteboard-container');
            if (targetDiv) {
              // @ts-ignore - TS might not have CropTarget typings yet
              const cropTarget = await (window as any).CropTarget.fromElement(targetDiv);
              // @ts-ignore
              await videoTrack.cropTo(cropTarget);
            }
          } catch (cropErr) {
            console.warn("Region Capture (CropTarget) failed or not fully supported", cropErr);
          }
        }
        
        // Listen for when the user clicks "Stop Sharing" on the browser's native floating bar
        videoTrack.onended = () => {
          localParticipant.unpublishTrack(videoTrack);
        };
        
        await localParticipant.publishTrack(videoTrack, { 
          name: 'whiteboard',
          source: Track.Source.ScreenShare 
        });
      } catch (e) {
        console.error("Failed to start custom screen share", e);
      }
    } else {
      try {
        // Find the active screen share track and stop it
        const screenTrack = localParticipant.getTrackPublication(Track.Source.ScreenShare);
        if (screenTrack) {
          await localParticipant.unpublishTrack(screenTrack.track!);
          screenTrack.track?.stop();
        }
      } catch (e) {
        console.error("Failed to stop screen share", e);
      }
    }
  };

  const handleClose = () => {
    setIsWhiteboardOpen(false);
    setIsWhiteboardMinimized(false);
  };

  if (!isWhiteboardOpen) return null;
  
  return (
    <>
      <WhiteboardModal 
        onClose={handleClose} 
        isMinimized={isWhiteboardMinimized}
        setIsMinimized={setIsWhiteboardMinimized}
        isSharing={isSharing}
        toggleShare={toggleShare}
      />
      {/* Floating Restore Button when minimized */}
      {isWhiteboardMinimized && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-slate-900 border border-primary p-2 rounded-lg shadow-2xl animate-pulse">
          <FaChalkboard className="text-primary text-xl" />
          <div className="flex flex-col mr-4">
            <span className="text-white text-xs font-bold">Whiteboard Active</span>
            <span className="text-[10px] text-slate-400">{isSharing ? 'Currently sharing to class' : 'Hidden from class'}</span>
          </div>
          <button 
            onClick={() => setIsWhiteboardMinimized(false)}
            className="px-3 py-1.5 bg-primary hover:bg-primary/80 text-black text-xs font-bold rounded"
          >
            Restore
          </button>
        </div>
      )}
    </>
  );
}

function BroadcastStudioContent() {
  const searchParams = useSearchParams();
  const channel = searchParams.get("channel") || "test_channel";

  const [token, setToken] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [initialVideoEnabled, setInitialVideoEnabled] = useState(true);
  const [initialAudioEnabled, setInitialAudioEnabled] = useState(true);
  const [initialScreenEnabled, setInitialScreenEnabled] = useState(false);
  const [choicesLoaded, setChoicesLoaded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isModerationOpen, setIsModerationOpen] = useState(false);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [isWhiteboardMinimized, setIsWhiteboardMinimized] = useState(false);
  const [preJoinChoices, setPreJoinChoices] = useState<LocalUserChoices | undefined>(undefined);

  const handleGoLive = async () => {
    if (!supabase) {
      alert("Supabase is not initialized. Cannot go live.");
      return;
    }
    setIsStarting(true);
    try {
      const { data, error } = await supabase
        .from('live_sessions')
        .select('id')
        .or(`session_url.eq.livekit://${channel},session_url.eq.agora://${channel}`)
        .maybeSingle(); // Use maybeSingle to prevent throw on 0 rows
        
      if (data?.id) {
        await supabase.from('live_sessions').update({ is_live: true, started_at: new Date().toISOString() }).eq('id', data.id);
      } else {
        // Create the session if it doesn't exist
        await supabase.from('live_sessions').insert({
          title: `Live Class: ${channel}`,
          session_url: `livekit://${channel}`,
          is_live: true,
          started_at: new Date().toISOString(),
          status: 'live'
        });
      }
      setIsLive(true);
    } catch (e) {
      console.error("Error going live:", e);
      alert("Failed to go live");
    } finally {
      setIsStarting(false);
    }
  };

  const handleEndBroadcast = async () => {
    if (!supabase) {
      alert("Supabase is not initialized. Cannot end broadcast.");
      return;
    }
    setIsEnding(true);
    try {
      const { data } = await supabase
        .from('live_sessions')
        .select('id')
        .or(`session_url.eq.livekit://${channel},session_url.eq.agora://${channel}`)
        .maybeSingle();
        
      if (data?.id) {
        await supabase.from('live_sessions').update({ is_live: false, status: 'ended' }).eq('id', data.id);
      }
      setIsLive(false);
    } catch (e) {
      console.error("Error ending broadcast:", e);
      alert("Failed to end broadcast");
    } finally {
      setIsEnding(false);
    }
  };

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    try {
      // 1. Capture screen and system audio
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920, max: 2560 },
          height: { ideal: 1080, max: 1440 },
          frameRate: { ideal: 30, max: 60 }
        },
        audio: true,
      });

      // 2. Capture microphone audio (instructor's voice)
      const voiceStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000
        },
        video: false,
      });

      // 3. Mix audio streams so both screen and mic are recorded
      const audioContext = new AudioContext();
      const destination = audioContext.createMediaStreamDestination();
      
      if (displayStream.getAudioTracks().length > 0) {
        const displaySource = audioContext.createMediaStreamSource(new MediaStream([displayStream.getAudioTracks()[0]]));
        displaySource.connect(destination);
      }
      
      if (voiceStream.getAudioTracks().length > 0) {
        const voiceSource = audioContext.createMediaStreamSource(new MediaStream([voiceStream.getAudioTracks()[0]]));
        voiceSource.connect(destination);
      }

      // Combine video from display and mixed audio
      const combinedStream = new MediaStream([
        ...displayStream.getVideoTracks(),
        ...destination.stream.getAudioTracks()
      ]);

      // Determine best supported codec and force high bitrate
      let options: MediaRecorderOptions = { videoBitsPerSecond: 5000000, audioBitsPerSecond: 128000 };
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
        options.mimeType = 'video/webm;codecs=vp9,opus';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
        options.mimeType = 'video/webm;codecs=vp8,opus';
      } else {
        options.mimeType = 'video/webm';
      }

      const recorder = new MediaRecorder(combinedStream, options);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `nlitedu-broadcast-${new Date().toISOString().slice(0,10)}.webm`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        recordedChunksRef.current = [];
        setIsRecording(false);
        
        // Cleanup tracks
        displayStream.getTracks().forEach(t => t.stop());
        voiceStream.getTracks().forEach(t => t.stop());
        audioContext.close();
      };

      // Stop recording if the user clicks "Stop sharing" on the browser native UI
      displayStream.getVideoTracks()[0].onended = () => {
        if (recorder.state !== 'inactive') recorder.stop();
      };

      recordedChunksRef.current = [];
      recorder.start(1000); // chunk every 1 second
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Failed to start recording. Please ensure you grant screen and microphone permissions.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  // Fetch token and restore session state
  useEffect(() => {
    let realtimeChannel: any = null;
    
    (async () => {
      try {
        // 1. Fetch token
        const resp = await fetch(`/api/livekit?room=${channel}&username=Instructor&role=instructor`);
        const data = await resp.json();
        if (data.token) {
          setToken(data.token);
        } else {
          console.error("Token fetch failed:", data.error);
        }

        // 2. Fetch current session status to survive page reloads
        if (supabase) {
          const { data: sessionData, error } = await supabase
            .from('live_sessions')
            .select('is_live')
            .or(`session_url.eq.livekit://${channel},session_url.eq.agora://${channel}`)
            .maybeSingle();
            
          if (sessionData && sessionData.is_live) {
            setIsLive(true);
          }

          // Subscribe to real-time updates for this session
          // Generate a unique channel name for this specific effect run to prevent "already subscribed" errors in React Strict Mode
          const uniqueChannelName = `live-session-updates-${channel}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
          realtimeChannel = supabase.channel(uniqueChannelName);
          realtimeChannel
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'live_sessions' },
              (payload: any) => {
                const newRecord = payload.new as any;
                if (newRecord && newRecord.session_url && newRecord.session_url.includes(channel)) {
                  if (newRecord.is_live !== undefined) {
                    setIsLive(newRecord.is_live);
                  }
                }
              }
            )
            .subscribe();
        }
        
        // 3. Restore camera/mic preferences and screen share state
        try {
          const savedChoices = localStorage.getItem('lk-user-choices');
          if (savedChoices) {
            const parsed = JSON.parse(savedChoices);
            if (parsed.videoEnabled !== undefined) setInitialVideoEnabled(parsed.videoEnabled);
            if (parsed.audioEnabled !== undefined) setInitialAudioEnabled(parsed.audioEnabled);
          }
          const savedScreenShare = sessionStorage.getItem('livekit-screenshare');
          if (savedScreenShare === 'true') {
            setInitialScreenEnabled(true);
          }
          const savedPreJoin = sessionStorage.getItem('nlitedu-prejoin-choices');
          if (savedPreJoin) {
            setPreJoinChoices(JSON.parse(savedPreJoin));
          }
        } catch (e) {
          console.error("Error reading user choices", e);
        } finally {
          setChoicesLoaded(true);
        }
      } catch (e) {
        console.error("Error fetching token or session state", e);
        setChoicesLoaded(true); // Always render eventually
      }
    })();
    
    // Cleanup on unmount or re-render
    return () => {
      if (realtimeChannel && supabase) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [channel]);

  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!preJoinChoices) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col font-sans overflow-hidden items-center justify-center" data-lk-theme="default">
        <div className="w-full max-w-4xl p-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-primary/20 border-primary/30">
              <FaBroadcastTower className="text-2xl text-primary" />
            </div>
            <div>
              <h1 className="text-white text-3xl font-black leading-tight">Studio Green Room</h1>
              <p className="text-slate-400 text-sm font-bold tracking-wider uppercase">Channel: <span className="text-primary">{channel}</span></p>
            </div>
          </div>
          <p className="text-slate-400 text-center mb-8">Test your camera and microphone before entering the live broadcast studio.</p>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-4">
            <PreJoin
              defaults={{
                videoEnabled: initialVideoEnabled,
                audioEnabled: initialAudioEnabled,
              }}
              onSubmit={(values) => {
                sessionStorage.setItem('nlitedu-prejoin-choices', JSON.stringify(values));
                setPreJoinChoices(values);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

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
          <button
            onClick={() => {
              setIsModerationOpen(!isModerationOpen);
              if (!isModerationOpen) setIsChatOpen(false);
            }}
            className={`px-4 py-2 flex items-center gap-2 text-xs font-bold rounded-lg transition-all border ${isModerationOpen ? 'bg-primary/20 border-primary text-primary' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
          >
            <FaUsers className="text-sm" />
            {isModerationOpen ? 'Hide Students' : 'Students'}
          </button>

          <button
            onClick={() => {
              setIsWhiteboardOpen(true);
            }}
            className="px-4 py-2 flex items-center gap-2 text-xs font-bold rounded-lg transition-all border bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            title="Open Interactive Whiteboard"
          >
            <FaChalkboard className="text-sm" />
            Whiteboard
          </button>

          <button
            onClick={() => {
              setIsChatOpen(!isChatOpen);
              if (!isChatOpen) setIsModerationOpen(false);
            }}
            className={`px-4 py-2 flex items-center gap-2 text-xs font-bold rounded-lg transition-all border ${isChatOpen ? 'bg-primary/20 border-primary text-primary' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
          >
            <FaComments className="text-sm" />
            {isChatOpen ? 'Hide Chat' : 'Show Chat'}
          </button>

          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`px-4 py-2 flex items-center gap-2 text-xs font-bold rounded-lg transition-all ${
              isRecording 
                ? 'bg-slate-800 text-red-500 border border-red-500/50 hover:bg-slate-700 animate-pulse' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="Records your screen and microphone directly to your computer (No cloud storage required)"
          >
            <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500' : 'bg-slate-500'}`}></div>
            {isRecording ? "Stop Recording" : "Record Offline"}
          </button>

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
        <style dangerouslySetInnerHTML={{__html: `
          /* Hide the local participant's screen share video by default to prevent the infinite mirror effect */
          .lk-participant-tile[data-lk-local-participant="true"][data-lk-source="screen_share"] video {
            opacity: 0.05 !important;
            transition: all 0.3s ease;
          }
          
          /* Show the video fully when hovered for preview */
          .lk-participant-tile[data-lk-local-participant="true"][data-lk-source="screen_share"]:hover video {
            opacity: 1 !important;
          }

          /* Overlay message */
          .lk-participant-tile[data-lk-local-participant="true"][data-lk-source="screen_share"]::after {
            content: "🖥️ Screen Share Active\\A\\A👀 Hover here to preview your screen\\A\\A💡 Tip: To prevent the mirror effect, share a specific Window or Tab instead of the Entire Screen.";
            white-space: pre-wrap;
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 3rem;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(12px);
            color: #cbd5e1;
            font-size: 1.1rem;
            font-weight: 600;
            line-height: 1.8;
            z-index: 10;
            transition: opacity 0.3s ease;
            pointer-events: none;
            border-radius: 12px;
            margin: 16px;
            border: 1px solid rgba(255,255,255,0.1);
          }

          /* Hide overlay when hovering to show preview */
          .lk-participant-tile[data-lk-local-participant="true"][data-lk-source="screen_share"]:hover::after {
            opacity: 0;
          }

          /* Picture-in-Picture for local camera when screen share is active (Focus Layout) */
          .lk-focus-layout .lk-participant-tile[data-lk-local-participant="true"][data-lk-source="camera"] {
            position: absolute !important;
            bottom: 80px !important; /* Above control bar */
            right: 24px !important;
            width: 240px !important;
            height: 160px !important;
            border-radius: 16px !important;
            border: 2px solid rgba(255,255,255,0.1) !important;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6) !important;
            z-index: 50 !important;
            overflow: hidden !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }

          /* Force Connection Quality Indicator on all tiles */
          .lk-participant-tile .lk-connection-quality {
            display: flex !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
        `}} />
        <div className="flex-1 flex flex-col overflow-hidden relative bg-black" data-lk-theme="default">
          {token && serverUrl && choicesLoaded ? (
            <LiveKitRoom
              video={preJoinChoices.videoEnabled}
              audio={preJoinChoices.audioEnabled}
              screen={initialScreenEnabled}
              token={token}
              serverUrl={serverUrl}
              connect={true}
              className="flex-1 w-full h-full relative flex"
              options={{
                videoCaptureDefaults: {
                  resolution: VideoPresets.h1080.resolution,
                  deviceId: preJoinChoices.videoDeviceId,
                },
                audioCaptureDefaults: {
                  deviceId: preJoinChoices.audioDeviceId,
                  echoCancellation: true,
                  noiseSuppression: true,
                  autoGainControl: true,
                },
                publishDefaults: {
                  videoSimulcastLayers: [
                    VideoPresets.h1080,
                    VideoPresets.h720,
                    VideoPresets.h360,
                  ],
                  screenShareEncoding: VideoPresets.h1080.encoding,
                }
              }}
            >
              <div className="flex-1 flex flex-col relative h-full">
                <TrackStateSaver />
                <WhiteboardPublisher 
                  isWhiteboardOpen={isWhiteboardOpen} 
                  setIsWhiteboardOpen={setIsWhiteboardOpen} 
                  isWhiteboardMinimized={isWhiteboardMinimized}
                  setIsWhiteboardMinimized={setIsWhiteboardMinimized}
                />
                <VideoConference />
                <RoomAudioRenderer />
              </div>
              
              {/* Chat Sidebar */}
              {isChatOpen && (
                <div className="w-[350px] h-full border-l border-slate-800 bg-slate-900 flex flex-col relative shrink-0 z-20 shadow-2xl">
                  <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <h2 className="text-white font-bold text-sm flex items-center gap-2">
                      <FaComments className="text-primary" /> Live Class Chat
                    </h2>
                    <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white text-xs">Close</button>
                  </div>
                  <div className="flex-1 overflow-hidden relative">
                    <style dangerouslySetInnerHTML={{__html: `
                      .lk-chat { width: 100% !important; height: 100% !important; max-height: 100% !important; border: none !important; border-radius: 0 !important; }
                      .lk-chat-messages { padding: 1rem !important; }
                      .lk-chat-form { padding: 1rem !important; border-top: 1px solid rgba(255,255,255,0.05); }
                    `}} />
                    <Chat />
                  </div>
                </div>
              )}

              {/* Moderation Sidebar */}
              <ParticipantModeration isVisible={isModerationOpen} />
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
