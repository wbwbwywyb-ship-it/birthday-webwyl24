
export enum Phase {
  CAKE = 'cake',
  BLOOMING = 'blooming',
  NEBULA = 'nebula',
  COLLAPSING = 'collapsing'
}

export enum Gesture {
  NONE = 'none',
  OPEN = 'open',
  CLOSED = 'closed'
}

export interface PhotoData {
  id: string;
  url: string;
  isLandscape: boolean;
}

export interface AppState {
  phase: Phase;
  gesture: Gesture;
  photos: PhotoData[];
  cameraEnabled: boolean;
  selectedPhotoIndex: number | null;
  setPhase: (phase: Phase) => void;
  setGesture: (gesture: Gesture) => void;
  toggleCamera: () => void;
  addPhotos: (newPhotos: PhotoData[]) => void;
  setSelectedPhoto: (index: number | null) => void;
}
