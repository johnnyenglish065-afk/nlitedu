"use client";
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { ErrorBoundary } from 'react-error-boundary';
import { FaTimes, FaDesktop, FaCompress, FaPlay, FaStop, FaPen, FaEraser, FaUndo, FaRedo, FaTrash } from 'react-icons/fa';
import { useState, useRef } from 'react';

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
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(4);

  const colors = ['#000000', '#e74c3c', '#2ecc71', '#3498db', '#f1c40f', '#9b59b6'];

  const handleEraserClick = () => {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  };

  const handlePenClick = () => {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  };

  const handleUndoClick = () => {
    canvasRef.current?.undo();
  };

  const handleRedoClick = () => {
    canvasRef.current?.redo();
  };

  const handleClearClick = () => {
    canvasRef.current?.clearCanvas();
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center transition-all duration-300 ${(!isOpen || isMinimized) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="w-full h-full max-w-[1400px] bg-white rounded-2xl shadow-2xl flex flex-col relative border border-slate-700 overflow-hidden">
        
        {/* Header Bar */}
        <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
              <FaDesktop />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">Interactive Whiteboard</h2>
              <p className="text-slate-400 text-xs">Only you can see this right now.</p>
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

        {/* Toolbar */}
        <div className="h-12 bg-slate-100 border-b border-slate-300 flex items-center px-4 gap-4 shrink-0">
          <div className="flex bg-white rounded-md shadow-sm border border-slate-200 p-1">
            <button 
              onClick={handlePenClick}
              className={`p-2 rounded ${!eraseMode ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
              title="Pen"
            >
              <FaPen className="text-sm" />
            </button>
            <button 
              onClick={handleEraserClick}
              className={`p-2 rounded ${eraseMode ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
              title="Eraser"
            >
              <FaEraser className="text-sm" />
            </button>
          </div>

          <div className="w-px h-6 bg-slate-300"></div>

          <div className="flex gap-1">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => { setStrokeColor(color); handlePenClick(); }}
                className={`w-6 h-6 rounded-full border-2 ${strokeColor === color && !eraseMode ? 'border-blue-500 scale-110' : 'border-transparent hover:scale-110'} transition-transform`}
                style={{ backgroundColor: color }}
                title="Color"
              />
            ))}
          </div>

          <div className="w-px h-6 bg-slate-300"></div>

          <div className="flex gap-2">
            <button onClick={handleUndoClick} className="p-2 text-slate-600 hover:bg-slate-200 rounded" title="Undo">
              <FaUndo className="text-sm" />
            </button>
            <button onClick={handleRedoClick} className="p-2 text-slate-600 hover:bg-slate-200 rounded" title="Redo">
              <FaRedo className="text-sm" />
            </button>
          </div>

          <div className="ml-auto">
            <button onClick={handleClearClick} className="p-2 text-red-600 hover:bg-red-100 rounded flex items-center gap-2 text-sm font-medium">
              <FaTrash className="text-sm" /> Clear All
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-white relative cursor-crosshair">
          <ErrorBoundary fallback={<div className="p-10 text-red-500 font-bold bg-white h-full w-full">Whiteboard failed to load.</div>}>
             <ReactSketchCanvas
                ref={canvasRef}
                strokeWidth={eraseMode ? 20 : strokeWidth}
                strokeColor={strokeColor}
                canvasColor="transparent"
                width="100%"
                height="100%"
              />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
