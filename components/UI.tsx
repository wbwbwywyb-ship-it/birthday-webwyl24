
import React, { useRef } from 'react';
import { useStore } from '../store';
import { Phase, Gesture } from '../types';

export const UI: React.FC = () => {
  const { phase, gesture, photos, addPhotos, isLoading } = useStore() as any;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      isLandscape: false,
    }));
    addPhotos(newPhotos);
  };

  return (
    <>
      {/* 资源加载遮罩层 */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-6">
          <div className="loader-dots relative w-20 h-10">
            <div className="absolute top-0 w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="absolute top-0 w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="absolute top-0 w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="absolute top-0 w-3 h-3 rounded-full bg-yellow-500"></div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-yellow-500/80 text-xs tracking-[0.4em] animate-pulse uppercase font-bold">Initializing Magic</p>
            <p className="text-white/20 text-[10px] tracking-widest">GL Assets & Textures Loading...</p>
          </div>
        </div>
      )}

      <div className={`fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-8 transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Top Left: System Status */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl w-fit pointer-events-auto">
          <h2 className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">System Status</h2>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-2 h-2 rounded-full animate-pulse ${gesture !== Gesture.NONE ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-white text-sm font-medium uppercase tracking-tighter">Gesture: {gesture}</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-white/60 text-[11px]">
              <span className="text-white font-bold">Open Palm:</span> {phase === Phase.CAKE ? 'Bloom Cake' : 'Rotate Ring'}
            </p>
            <p className="text-white/60 text-[11px]">
              <span className="text-white font-bold">Closed Fist:</span> {phase === Phase.NEBULA ? 'Collapse' : '---'}
            </p>
          </div>
        </div>

        {/* Bottom Center: Phase Title */}
        <div className="self-center text-center">
          <h1 className="text-5xl md:text-7xl font-cursive text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-400 to-yellow-700 drop-shadow-2xl">
            {phase === Phase.CAKE ? 'A Sweet Beginning' : 'Galaxy of Memories'}
          </h1>
        </div>

        {/* Bottom Right: Upload Button */}
        <div className="self-end pointer-events-auto">
          <input 
            type="file" 
            ref={fileInputRef} 
            multiple 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full transition-all active:scale-95"
          >
            <span className="relative z-10 text-white text-[10px] font-bold tracking-[0.3em] uppercase">Add Memories</span>
            <svg className="w-4 h-4 text-yellow-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          </button>
        </div>
      </div>
    </>
  );
};
