"use client";
import { FaTimes, FaDesktop, FaCompress, FaPlay, FaStop } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

// 1. Ensure CSS is loaded correctly
import 'tldraw/tldraw.css';

// 2. Production-safe dynamic import to completely avoid SSR/Hydration mismatches
const DynamicTldraw = dynamic(
  () => import('tldraw').then((m) => m.Tldraw),
  { 
    ssr: false,
    loading: () => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', background: '#fdfdfd', color: '#64748b' }}>
        <div style={{ width: 40, height: 40, border: '4px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 16 }} />
        <p style={{ fontSize: 14, fontWeight: 600 }}>Loading Advanced Whiteboard...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }
);

// HEADER HEIGHT constant – keeps calc() in sync
const HEADER_H = 56; // px

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

  if (!isOpen || isMinimized) return null;

  return (
    <>
      {/* Full-screen overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgba(2, 6, 23, 0.85)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        {/* Modal shell – fixed size so children get real pixels */}
        <div
          className="whiteboard-container"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            maxWidth: 1400,
            background: '#fdfdfd',
            borderRadius: 16,
            boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
            border: '1px solid #334155',
            overflow: 'hidden',
          }}
        >
          {/* ── Header Bar ── */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: HEADER_H,
              background: '#0f172a',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                <FaDesktop />
              </div>
              <div>
                <h2 style={{ color: '#fff', fontWeight: 600, fontSize: 14, margin: 0 }}>Advanced Live Whiteboard</h2>
                <p style={{ color: '#94a3b8', fontSize: 11, margin: 0 }}>Powered by Tldraw</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={toggleShare}
                style={{
                  padding: '6px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  border: isSharing ? '1px solid rgba(239,68,68,0.3)' : 'none',
                  background: isSharing ? 'rgba(239,68,68,0.1)' : '#2563eb',
                  color: isSharing ? '#ef4444' : '#fff',
                  transition: 'all 0.2s',
                }}
              >
                {isSharing ? <><FaStop style={{ fontSize: 10 }} /> Stop Sharing</> : <><FaPlay style={{ fontSize: 10 }} /> Share to Class</>}
              </button>

              <div style={{ width: 1, height: 24, background: '#334155', margin: '0 8px' }} />

              <button
                onClick={() => setIsMinimized(true)}
                title="Minimize Whiteboard"
                style={{ width: 32, height: 32, borderRadius: '50%', background: '#1e293b', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}
              >
                <FaCompress />
              </button>

              <button
                onClick={onClose}
                title="Close Whiteboard"
                style={{ width: 32, height: 32, borderRadius: '50%', background: '#1e293b', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* ── Tldraw Canvas ── */}
          <div
            style={{
              position: 'absolute',
              top: HEADER_H,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <ErrorBoundary
              fallback={
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 40, textAlign: 'center', color: '#ef4444', background: '#fef2f2' }}>
                  <p style={{ fontWeight: 'bold', fontSize: 16 }}>Failed to load whiteboard engine.</p>
                  <p style={{ fontSize: 13, marginTop: 8 }}>Please refresh the page to try again.</p>
                </div>
              }
            >
              <DynamicTldraw persistenceKey={`nlitedu-whiteboard-${channel}`} />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </>
  );
}
