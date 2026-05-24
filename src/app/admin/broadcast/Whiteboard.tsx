"use client";
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';
import { FaTimes, FaDesktop, FaCompress, FaPlay, FaStop } from 'react-icons/fa';

// Excalidraw MUST be dynamically imported with ssr: false to avoid Next.js document/window errors
const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then((mod) => mod.Excalidraw),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-[#fdfdfd]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading Excalidraw...</p>
        </div>
      </div>
    ) 
  }
);

interface WhiteboardProps {
  onClose: () => void;
  isOpen: boolean;
  isMinimized: boolean;
  setIsMinimized: (val: boolean) => void;
  isSharing: boolean;
  toggleShare: () => void;
  channel?: string;
}

export default function WhiteboardModal({ 
  onClose, 
  isOpen,
  isMinimized, 
  setIsMinimized,
  isSharing,
  toggleShare,
  channel = 'default'
}: WhiteboardProps) {

  return (
    <div className={`fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center transition-all duration-300 ${(!isOpen || isMinimized) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="w-full h-full max-w-[1400px] bg-[#fdfdfd] rounded-2xl shadow-2xl flex flex-col relative border border-slate-700 overflow-hidden">
        
        {/* Header Bar */}
        <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-[10]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
              <FaDesktop />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">Interactive Whiteboard (Excalidraw)</h2>
              <p className="text-slate-400 text-xs">Advanced smartclass tools enabled</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleShare}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                isSharing 
                  ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isSharing ? (
                <><FaStop className="text-xs" /> Stop Sharing</>
              ) : (
                <><FaPlay className="text-xs" /> Share to Class</>
              )}
            </button>
            <div className="w-px h-6 bg-slate-700 mx-2"></div>
            <button 
              onClick={() => setIsMinimized(true)}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-colors"
              title="Minimize Whiteboard"
            >
              <FaCompress />
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-colors"
              title="Close Whiteboard"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Excalidraw Canvas */}
        <div className="flex-1 relative overflow-hidden" style={{ width: '100%', height: '100%' }}>
          <div className="absolute inset-0">
            <ErrorBoundary fallback={<div className="p-10 text-red-500 font-bold bg-white h-full w-full flex items-center justify-center">Excalidraw failed to load. Please clear your cache and try again.</div>}>
              <Excalidraw theme="light" />
            </ErrorBoundary>
          </div>
          
          {/* Foolproof Watermark Cover that blocks clicks (covers bottom right if needed) */}
          <div 
            className="absolute bottom-0 right-0 w-[200px] h-[60px] bg-transparent z-[9999] rounded-tl-lg cursor-default pointer-events-auto pointer-events-none"
          ></div>
        </div>
      </div>
    </div>
  );
}
