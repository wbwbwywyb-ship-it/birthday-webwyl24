
import React, { useRef } from 'react';
import { useStore } from '../store';
import { Phase, Gesture } from '../types';

export const UI: React.FC = () => {
  const { phase, gesture, photos, addPhotos } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos = Array.from(files).map((file, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      isLandscape: false, // In a real app we'd measure this
    }));
    addPhotos(newPhotos);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-8">
      {/* Top Left: Status & Instructions */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl w-fit pointer-events-auto">
        <h2 className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">System Status</h2>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-2 h-2 rounded-full animate-pulse ${gesture !== Gesture.NONE ? 'bg-green-400' : 'bg-red-400'}`} />
          <span className="text-white text-sm font-medium">Gesture: {gesture.toUpperCase()}</span>
        </div>
        
        <div className="space-y-2">
          <p className="text-white/60 text-xs">
            <span className="text-white font-bold">Open Palm:</span> {phase === Phase.CAKE ? 'Bloom Cake' : 'Rotate Nebula'}
          </p>
          <p className="text-white/60 text-xs">
            <span className="text-white font-bold">Closed Fist:</span> {phase === Phase.NEBULA ? 'Collapse Nebula' : 'Idle'}
          </p>
        </div>
      </div>

      {/* Bottom Center: Phase Title */}
      <div className="self-center text-center">
        <h1 className="text-5xl md:text-7xl font-cursive text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 drop-shadow-lg opacity-80">
          {phase === Phase.CAKE ? 'A Sweet Beginning' : 'Galaxy of Memories'}
        </h1>
      </div>

      {/* Bottom Right: Photo Upload */}
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
          className="group relative flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all overflow-hidden"
        >
          <span className="relative z-10 text-white text-xs font-bold tracking-widest">ADD MEMORIES</span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <svg className="w-4 h-4 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};
