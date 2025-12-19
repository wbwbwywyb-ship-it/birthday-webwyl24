
import { create } from 'zustand';
import { AppState, Phase, Gesture, PhotoData } from './types';

// Default placeholder photos
const INITIAL_PHOTOS: PhotoData[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `default-${i}`,
  url: `https://picsum.photos/seed/${i + 100}/800/1000`,
  isLandscape: false,
}));

export const useStore = create<AppState>((set) => ({
  phase: Phase.CAKE,
  gesture: Gesture.NONE,
  photos: INITIAL_PHOTOS,
  cameraEnabled: false,
  selectedPhotoIndex: null,
  setPhase: (phase) => set({ phase }),
  setGesture: (gesture) => set({ gesture }),
  toggleCamera: () => set((state) => ({ cameraEnabled: !state.cameraEnabled })),
  addPhotos: (newPhotos) => set((state) => ({ photos: [...newPhotos, ...state.photos].slice(0, 48) })),
  setSelectedPhoto: (index) => set({ selectedPhotoIndex: index }),
}));
