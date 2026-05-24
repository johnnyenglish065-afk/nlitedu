"use client";
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { FaTimes, FaDesktop, FaCompress, FaPlay, FaStop } from 'react-icons/fa';

interface WhiteboardProps {
  onClose: () => void;
  isMinimized: boolean;
  setIsMinimized: (val: boolean) => void;
  isSharing: boolean;
  toggleShare: () => void;
}

export default function WhiteboardModal({ 
  onClose, 
  isMinimized, 
  setIsMinimized,
  isSharing,
  toggleShare 
}: WhiteboardProps) {
  return (
    <div className={`fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center transition-all duration-300 ${isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="w-full h-full max-w-[1400px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col relative border border-slate-700">
        
        {/* Header Bar */}
        <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
              <FaDesktop className="text-primary" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm flex items-center gap-2">
                Interactive Whiteboard 
                {isSharing ? (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 text-[10px] animate-pulse">LIVE</span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 text-[10px]">Private</span>
                )}
              </h2>
              <p className="text-slate-400 text-[10px]">{isSharing ? 'Students can see this.' : 'Only you can see this right now.'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleShare}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${isSharing ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-primary hover:bg-primary/80 text-black'}`}
              title={isSharing ? "Stop sharing your screen" : "Click to select 'Current Tab' and share the whiteboard"}
            >
              {isSharing ? (
                <><FaStop /> Stop Sharing</>
              ) : (
                <><FaPlay /> Share to Class</>
              )}
            </button>
            <div className="w-px h-6 bg-slate-700 mx-1"></div>
            <button 
              onClick={() => setIsMinimized(true)}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-colors"
              title="Minimize"
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

        {/* Tldraw Canvas */}
        <div style={{ position: 'relative', width: '100%', height: '100%', flex: 1, backgroundColor: '#f8f9fa' }}>
          <style dangerouslySetInnerHTML={{__html: `
            /* Hide the tldraw license watermark via pointer events just in case */
            a[href*="tldraw.dev"] {
              pointer-events: none !important;
            }
          `}} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <Tldraw persistenceKey="nlitedu-broadcast-whiteboard" />
          </div>
          
          {/* Foolproof Watermark Cover that blocks clicks */}
          <div 
            className="absolute bottom-0 right-0 w-[200px] h-[60px] bg-[#f8f9fa] z-[9999] rounded-tl-lg cursor-default"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
