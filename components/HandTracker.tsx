
import React, { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { Gesture } from '../types';

export const HandTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { cameraEnabled, setGesture, toggleCamera } = useStore();
  const landmarkerRef = useRef<any>(null);

  useEffect(() => {
    let animationFrameId: number;
    let stream: MediaStream | null = null;

    const initHandLandmarker = async () => {
      try {
        const { HandLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });
      } catch (e) {
        console.error("Failed to load HandLandmarker", e);
      }
    };

    const startCamera = async () => {
      if (cameraEnabled && videoRef.current) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          requestAnimationFrame(predict);
        } catch (e) {
          console.error("Camera access denied", e);
        }
      }
    };

    const predict = () => {
      if (landmarkerRef.current && videoRef.current && videoRef.current.readyState >= 2) {
        const results = landmarkerRef.current.detectForVideo(videoRef.current, performance.now());
        
        if (results.landmarks && results.landmarks.length > 0) {
          const landmarks = results.landmarks[0];
          
          // Basic gesture heuristic:
          // Closed Fist: Finger tips are closer to wrist than middle joints
          // Open Palm: Finger tips are far from wrist
          const wrist = landmarks[0];
          const indexTip = landmarks[8];
          const middleTip = landmarks[12];
          const ringTip = landmarks[16];
          const pinkyTip = landmarks[20];
          
          const distance = (a: any, b: any) => Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2);
          const avgDist = (distance(wrist, indexTip) + distance(wrist, middleTip) + distance(wrist, ringTip) + distance(wrist, pinkyTip)) / 4;
          
          if (avgDist < 0.2) {
            setGesture(Gesture.CLOSED);
          } else if (avgDist > 0.45) {
            setGesture(Gesture.OPEN);
          } else {
            setGesture(Gesture.NONE);
          }
        } else {
          setGesture(Gesture.NONE);
        }
      }
      animationFrameId = requestAnimationFrame(predict);
    };

    initHandLandmarker();
    if (cameraEnabled) startCamera();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraEnabled, setGesture]);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
      <div className={`w-48 h-36 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-500 ${cameraEnabled ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
        <video ref={videoRef} className="w-full h-full object-cover mirror transform -scale-x-100" muted playsInline />
      </div>
      <button 
        onClick={toggleCamera}
        className="px-4 py-2 bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-widest transition-all"
      >
        {cameraEnabled ? 'CLOSE CAMERA' : 'OPEN CAMERA'}
      </button>
    </div>
  );
};
