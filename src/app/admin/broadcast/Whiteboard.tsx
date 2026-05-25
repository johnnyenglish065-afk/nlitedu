"use client";
import { useEffect, useRef, useState, useCallback } from 'react';
import { FaTimes, FaCompress, FaPlay, FaStop, FaPen, FaHighlighter, FaEraser, FaSquare, FaCircle, FaFont, FaMinus, FaUndo, FaRedo, FaTrashAlt, FaMousePointer, FaTh, FaLongArrowAltRight, FaStar, FaDownload } from 'react-icons/fa';

// ─── Types ───
type Tool = 'select' | 'pen' | 'highlighter' | 'eraser' | 'line' | 'arrow' | 'rect' | 'circle' | 'triangle' | 'star' | 'text';

interface WhiteboardProps {
  onClose: () => void;
  isOpen: boolean;
  isMinimized: boolean;
  setIsMinimized: (val: boolean) => void;
  isSharing: boolean;
  toggleShare: () => void;
  channel?: string;
}

// ─── Color Palette ───
const COLORS = [
  '#1e1e1e', '#ffffff', '#e03131', '#2f9e44', '#1971c2', '#f08c00',
  '#6741d9', '#e8590c', '#0c8599', '#d6336c', '#862e9c', '#5c940d',
];

const LINE_WIDTHS = [2, 4, 6, 10, 16];

const HEADER_H = 56;
const TOOLBAR_H = 52;

export default function WhiteboardModal({
  onClose,
  isOpen,
  isMinimized,
  setIsMinimized,
  isSharing,
  toggleShare,
  channel = 'default'
}: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<'classic' | 'exsyncboard'>('exsyncboard');
  const whiteboardUrl = process.env.NEXT_PUBLIC_WHITEBOARD_URL || 'http://localhost:3001';
  const [activeTool, setActiveTool] = useState<Tool>('pen');
  const [activeColor, setActiveColor] = useState('#1e1e1e');
  const [lineWidth, setLineWidth] = useState(4);
  const [showGrid, setShowGrid] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showWidthPicker, setShowWidthPicker] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const isDrawingShapeRef = useRef(false);
  const shapeStartRef = useRef<{ x: number; y: number } | null>(null);
  const activeShapeRef = useRef<any>(null);

  // Save state to history
  const saveHistory = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());
    // Trim future states
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(json);
    historyIndexRef.current = historyRef.current.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
    // Persist to localStorage
    try { localStorage.setItem(`wb-${channel}`, json); } catch {}
  }, [channel]);

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current--;
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.loadFromJSON(JSON.parse(historyRef.current[historyIndexRef.current])).then(() => {
      canvas.renderAll();
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    });
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current++;
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.loadFromJSON(JSON.parse(historyRef.current[historyIndexRef.current])).then(() => {
      canvas.renderAll();
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    });
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();
    saveHistory();
  }, [saveHistory]);

  const downloadCanvas = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
    const link = document.createElement('a');
    link.download = `whiteboard-${channel}-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  }, [channel]);

  // Initialize Fabric canvas
  useEffect(() => {
    if (!isOpen || isMinimized || !canvasRef.current) return;

    let canvas: any;
    let resizeObserver: ResizeObserver;

    const initCanvas = async () => {
      const fabric = await import('fabric');
      const container = containerRef.current;
      if (!container || !canvasRef.current) return;

      const w = container.clientWidth;
      const h = container.clientHeight;

      canvas = new fabric.Canvas(canvasRef.current, {
        width: w,
        height: h,
        backgroundColor: '#ffffff',
        isDrawingMode: true,
        selection: false,
      });

      // Set up free drawing brush
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = activeColor;
      canvas.freeDrawingBrush.width = lineWidth;

      fabricRef.current = canvas;

      // Load saved state
      try {
        const saved = localStorage.getItem(`wb-${channel}`);
        if (saved) {
          await canvas.loadFromJSON(JSON.parse(saved));
          canvas.renderAll();
        }
      } catch {}

      // Save initial state
      saveHistory();

      // Event: after each path is created
      canvas.on('path:created', () => saveHistory());
      canvas.on('object:modified', () => saveHistory());

      // Handle resizing
      resizeObserver = new ResizeObserver(() => {
        if (container && canvas) {
          canvas.setDimensions({ width: container.clientWidth, height: container.clientHeight });
          canvas.renderAll();
        }
      });
      resizeObserver.observe(container);
    };

    initCanvas();

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      if (canvas) canvas.dispose();
      fabricRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isMinimized]);

  // Apply tool changes to canvas
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Clean up previous shape drawing events
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');

    const shapeTools: Tool[] = ['line', 'arrow', 'rect', 'circle', 'triangle', 'star'];

    if (activeTool === 'select') {
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.forEachObject((obj: any) => { obj.selectable = true; });
    } else if (activeTool === 'eraser') {
      canvas.isDrawingMode = true;
      canvas.selection = false;
      canvas.freeDrawingBrush = new (require('fabric').PencilBrush)(canvas);
      canvas.freeDrawingBrush.color = '#ffffff';
      canvas.freeDrawingBrush.width = lineWidth * 4;
    } else if (activeTool === 'pen') {
      canvas.isDrawingMode = true;
      canvas.selection = false;
      canvas.freeDrawingBrush = new (require('fabric').PencilBrush)(canvas);
      canvas.freeDrawingBrush.color = activeColor;
      canvas.freeDrawingBrush.width = lineWidth;
    } else if (activeTool === 'highlighter') {
      canvas.isDrawingMode = true;
      canvas.selection = false;
      canvas.freeDrawingBrush = new (require('fabric').PencilBrush)(canvas);
      // Convert hex to rgba with 40% opacity
      const hexToRgba = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},0.35)`;
      };
      canvas.freeDrawingBrush.color = hexToRgba(activeColor);
      canvas.freeDrawingBrush.width = lineWidth * 5;
    } else if (activeTool === 'text') {
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.on('mouse:down', async (opt: any) => {
        const fabric = await import('fabric');
        const pointer = canvas.getScenePoint(opt.e);
        const text = new fabric.IText('Type here', {
          left: pointer.x,
          top: pointer.y,
          fontFamily: 'Inter, sans-serif',
          fontSize: lineWidth * 6,
          fill: activeColor,
          editable: true,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        saveHistory();
        // Switch to select after placing text
        setActiveTool('select');
      });
    } else if (shapeTools.includes(activeTool)) {
      canvas.isDrawingMode = false;
      canvas.selection = false;

      canvas.on('mouse:down', (opt: any) => {
        isDrawingShapeRef.current = true;
        const pointer = canvas.getScenePoint(opt.e);
        shapeStartRef.current = { x: pointer.x, y: pointer.y };
      });

      canvas.on('mouse:move', async (opt: any) => {
        if (!isDrawingShapeRef.current || !shapeStartRef.current) return;
        const fabric = await import('fabric');
        const pointer = canvas.getScenePoint(opt.e);
        const { x: sx, y: sy } = shapeStartRef.current;
        const w = pointer.x - sx;
        const h = pointer.y - sy;

        // Remove previous preview
        if (activeShapeRef.current) canvas.remove(activeShapeRef.current);

        let shape: any;
        const commonOpts = { stroke: activeColor, strokeWidth: lineWidth, fill: 'transparent', selectable: false };

        if (activeTool === 'rect') {
          shape = new fabric.Rect({ left: Math.min(sx, pointer.x), top: Math.min(sy, pointer.y), width: Math.abs(w), height: Math.abs(h), ...commonOpts });
        } else if (activeTool === 'circle') {
          const rx = Math.abs(w) / 2;
          const ry = Math.abs(h) / 2;
          shape = new fabric.Ellipse({ left: Math.min(sx, pointer.x), top: Math.min(sy, pointer.y), rx, ry, ...commonOpts });
        } else if (activeTool === 'line') {
          shape = new fabric.Line([sx, sy, pointer.x, pointer.y], { ...commonOpts });
        } else if (activeTool === 'arrow') {
          // Arrow: line + triangle head
          shape = new fabric.Line([sx, sy, pointer.x, pointer.y], { ...commonOpts });
        } else if (activeTool === 'triangle') {
          shape = new fabric.Triangle({ left: Math.min(sx, pointer.x), top: Math.min(sy, pointer.y), width: Math.abs(w), height: Math.abs(h), ...commonOpts });
        } else if (activeTool === 'star') {
          // Use polygon for star
          const cx = (sx + pointer.x) / 2;
          const cy = (sy + pointer.y) / 2;
          const R = Math.max(Math.abs(w), Math.abs(h)) / 2;
          const r = R * 0.4;
          const points = [];
          for (let i = 0; i < 10; i++) {
            const radius = i % 2 === 0 ? R : r;
            const angle = (Math.PI / 5) * i - Math.PI / 2;
            points.push({ x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) });
          }
          shape = new fabric.Polygon(points, { ...commonOpts });
        }

        if (shape) {
          canvas.add(shape);
          activeShapeRef.current = shape;
        }
      });

      canvas.on('mouse:up', () => {
        if (activeShapeRef.current) {
          activeShapeRef.current.selectable = true;
          activeShapeRef.current = null;
        }
        isDrawingShapeRef.current = false;
        shapeStartRef.current = null;
        saveHistory();
      });
    }
  }, [activeTool, activeColor, lineWidth, saveHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
      if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObjects();
        if (active?.length) {
          active.forEach((obj: any) => canvas.remove(obj));
          canvas.discardActiveObject();
          canvas.renderAll();
          saveHistory();
        }
      }
    };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, undo, redo, saveHistory]);

  if (!isOpen || isMinimized) return null;

  // ─── Tool Button ───
  const ToolBtn = ({ tool, icon, title }: { tool: Tool; icon: React.ReactNode; title: string }) => (
    <button
      onClick={() => { setActiveTool(tool); setShowColorPicker(false); setShowWidthPicker(false); }}
      title={title}
      style={{
        width: 36, height: 36, borderRadius: 8, border: 'none',
        background: activeTool === tool ? '#3b82f6' : '#1e293b',
        color: activeTool === tool ? '#fff' : '#94a3b8',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, transition: 'all 0.15s',
      }}
    >
      {icon}
    </button>
  );

  const Divider = () => <div style={{ width: 1, height: 28, background: '#334155', margin: '0 6px' }} />;

  return (
    <>
      {/* Full-screen overlay */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div
          className="whiteboard-container"
          style={{ position: 'relative', width: '100%', height: '100%', maxWidth: 1400, background: '#fdfdfd', borderRadius: 16, boxShadow: '0 25px 80px rgba(0,0,0,0.6)', border: '1px solid #334155', overflow: 'hidden' }}
        >
          {/* ── Header Bar ── */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_H, background: '#0f172a', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                <FaPen />
              </div>
              <div>
                <h2 style={{ color: '#fff', fontWeight: 600, fontSize: 14, margin: 0 }}>Advanced Live Whiteboard</h2>
                <p style={{ color: '#94a3b8', fontSize: 11, margin: 0 }}>Powered by NLITedu</p>
              </div>
            </div>

            {/* Whiteboard Engine Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#1e293b', padding: 4, borderRadius: 8 }}>
              <button
                onClick={() => setEngine('classic')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: engine === 'classic' ? '#3b82f6' : 'transparent',
                  color: engine === 'classic' ? '#fff' : '#94a3b8',
                  transition: 'all 0.15s',
                }}
              >
                Classic
              </button>
              <button
                onClick={() => setEngine('exsyncboard')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: engine === 'exsyncboard' ? '#3b82f6' : 'transparent',
                  color: engine === 'exsyncboard' ? '#fff' : '#94a3b8',
                  transition: 'all 0.15s',
                }}
              >
                EXsyncboard
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={toggleShare} style={{ padding: '6px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', border: isSharing ? '1px solid rgba(239,68,68,0.3)' : 'none', background: isSharing ? 'rgba(239,68,68,0.1)' : '#2563eb', color: isSharing ? '#ef4444' : '#fff', transition: 'all 0.2s' }}>
                {isSharing ? <><FaStop style={{ fontSize: 10 }} /> Stop Sharing</> : <><FaPlay style={{ fontSize: 10 }} /> Share to Class</>}
              </button>
              <div style={{ width: 1, height: 24, background: '#334155', margin: '0 8px' }} />
              <button onClick={() => setIsMinimized(true)} title="Minimize" style={{ width: 32, height: 32, borderRadius: '50%', background: '#1e293b', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                <FaCompress />
              </button>
              <button onClick={onClose} title="Close" style={{ width: 32, height: 32, borderRadius: '50%', background: '#1e293b', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                <FaTimes />
              </button>
            </div>
          </div>

          {/* ── Toolbar ── */}
          {engine === 'classic' && (
            <div style={{ position: 'absolute', top: HEADER_H, left: 0, right: 0, height: TOOLBAR_H, background: '#0f172a', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 4, zIndex: 10, overflowX: 'auto' }}>
              {/* Drawing tools */}
              <ToolBtn tool="select" icon={<FaMousePointer />} title="Select (V)" />
              <ToolBtn tool="pen" icon={<FaPen />} title="Pen" />
              <ToolBtn tool="highlighter" icon={<FaHighlighter />} title="Highlighter" />
              <ToolBtn tool="eraser" icon={<FaEraser />} title="Eraser" />
              <Divider />
              {/* Shape tools */}
              <ToolBtn tool="line" icon={<FaMinus />} title="Line" />
              <ToolBtn tool="arrow" icon={<FaLongArrowAltRight />} title="Arrow" />
              <ToolBtn tool="rect" icon={<FaSquare />} title="Rectangle" />
              <ToolBtn tool="circle" icon={<FaCircle />} title="Circle" />
              <ToolBtn tool="triangle" icon={<span style={{ fontSize: 12 }}>▲</span>} title="Triangle" />
              <ToolBtn tool="star" icon={<FaStar />} title="Star" />
              <Divider />
              {/* Text */}
              <ToolBtn tool="text" icon={<FaFont />} title="Text" />
              <Divider />

              {/* Color picker toggle */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => { setShowColorPicker(!showColorPicker); setShowWidthPicker(false); }}
                  title="Color"
                  style={{ width: 36, height: 36, borderRadius: 8, border: '2px solid #334155', background: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: activeColor, border: '1px solid rgba(255,255,255,0.2)' }} />
                </button>
                {showColorPicker && (
                  <div style={{ position: 'absolute', top: 44, left: 0, background: '#1e293b', borderRadius: 12, padding: 12, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', border: '1px solid #334155', zIndex: 50 }}>
                    {COLORS.map((c) => (
                      <button key={c} onClick={() => { setActiveColor(c); setShowColorPicker(false); }} style={{ width: 28, height: 28, borderRadius: 6, background: c, border: activeColor === c ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'transform 0.1s' }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Line width picker toggle */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => { setShowWidthPicker(!showWidthPicker); setShowColorPicker(false); }}
                  title="Stroke Width"
                  style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: '#1e293b', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}
                >
                  {lineWidth}px
                </button>
                {showWidthPicker && (
                  <div style={{ position: 'absolute', top: 44, left: 0, background: '#1e293b', borderRadius: 12, padding: 10, display: 'flex', gap: 6, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', border: '1px solid #334155', zIndex: 50 }}>
                    {LINE_WIDTHS.map((w) => (
                      <button key={w} onClick={() => { setLineWidth(w); setShowWidthPicker(false); }} style={{ width: 32, height: 32, borderRadius: 6, background: lineWidth === w ? '#3b82f6' : '#0f172a', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
                        {w}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Divider />
              {/* Actions */}
              <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: '#1e293b', color: canUndo ? '#94a3b8' : '#334155', cursor: canUndo ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                <FaUndo />
              </button>
              <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)" style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: '#1e293b', color: canRedo ? '#94a3b8' : '#334155', cursor: canRedo ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                <FaRedo />
              </button>
              <button onClick={() => setShowGrid(!showGrid)} title="Toggle Grid" style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: showGrid ? '#3b82f6' : '#1e293b', color: showGrid ? '#fff' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                <FaTh />
              </button>
              <button onClick={downloadCanvas} title="Download as PNG" style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: '#1e293b', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                <FaDownload />
              </button>
              <button onClick={clearCanvas} title="Clear Canvas" style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: '#1e293b', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                <FaTrashAlt />
              </button>
            </div>
          )}

          {/* ── Canvas / Board Area ── */}
          {engine === 'classic' ? (
            <div
              ref={containerRef}
              style={{
                position: 'absolute',
                top: HEADER_H + TOOLBAR_H,
                left: 0,
                right: 0,
                bottom: 0,
                background: '#ffffff',
                backgroundImage: showGrid
                  ? 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)'
                  : 'none',
                backgroundSize: showGrid ? '24px 24px' : 'auto',
                cursor: activeTool === 'select' ? 'default' : activeTool === 'eraser' ? 'cell' : 'crosshair',
              }}
            >
              <canvas ref={canvasRef} />
            </div>
          ) : (
            <div
              style={{
                position: 'absolute',
                top: HEADER_H,
                left: 0,
                right: 0,
                bottom: 0,
                background: '#ffffff',
              }}
            >
              <iframe
                src={whiteboardUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: '#ffffff',
                }}
                allow="clipboard-read; clipboard-write"
                sandbox="allow-scripts allow-same-origin allow-forms allow-downloads"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
