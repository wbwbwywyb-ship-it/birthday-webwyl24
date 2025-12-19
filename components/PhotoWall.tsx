
import React, { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../store';
import { Phase, Gesture } from '../types';
import { Text, Image } from '@react-three/drei';

const PhotoItem: React.FC<{ url: string; index: number; count: number }> = ({ url, index, count }) => {
  const meshRef = useRef<THREE.Group>(null);
  const phase = useStore(s => s.phase);
  const gesture = useStore(s => s.gesture);
  const setSelected = useStore(s => s.setSelectedPhoto);
  const [rotationOffset, setRotationOffset] = useState(0);
  // Fix: The Image component from drei expects a 2D scale [number, number]
  const [scale, setScale] = useState<[number, number]>([2, 2]);
  
  const angle = (index / count) * Math.PI * 2;
  const radius = 10;

  // Handle Texture Load to check aspect ratio
  const handleTextureLoad = (tex: THREE.Texture) => {
    // Fix: Access width and height by casting tex.image to HTMLImageElement
    const img = tex.image as HTMLImageElement;
    if (!img) return;
    const aspect = img.width / img.height;
    if (aspect > 1.1) {
      // It's a landscape photo: rotate the frame 90 degrees
      setRotationOffset(Math.PI / 2);
      setScale([2, 2 * (1/aspect)]);
    } else {
      setRotationOffset(0);
      setScale([2, 2 * aspect]);
    }
  };

  useFrame((state) => {
    if (!meshRef.current || phase !== Phase.NEBULA) return;
    
    // Slow rotation
    const rotationSpeed = gesture === Gesture.OPEN ? 0.03 : 0.005;
    const currentAngle = angle + state.clock.getElapsedTime() * rotationSpeed;
    
    meshRef.current.position.x = Math.cos(currentAngle) * radius;
    meshRef.current.position.z = Math.sin(currentAngle) * radius;
    meshRef.current.position.y = Math.sin(currentAngle * 2) * 2; // Wave motion
    
    meshRef.current.lookAt(0, 0, 0);
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setSelected(index);
  };

  return (
    <group ref={meshRef} onClick={handleClick}>
      {/* Polaroid Frame */}
      <mesh rotation={[0, 0, rotationOffset]}>
        <planeGeometry args={[2.2, 2.8]} />
        <meshStandardMaterial color="white" roughness={0.1} />
      </mesh>
      
      {/* Image */}
      <Image
        url={url}
        transparent
        scale={scale}
        position={[0, 0.2, 0.01]}
        rotation={[0, 0, rotationOffset]}
        onLoad={handleTextureLoad}
      />
      
      <Text
        position={[0, -1.1, 0.02]}
        fontSize={0.12}
        color="black"
        anchorX="center"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf"
      >
        #MEMORY_{index + 1}
      </Text>
    </group>
  );
};

export const PhotoWall: React.FC = () => {
  const photos = useStore(s => s.photos);
  const phase = useStore(s => s.phase);
  const visible = phase === Phase.NEBULA || phase === Phase.BLOOMING || phase === Phase.COLLAPSING;

  if (!visible) return null;

  return (
    <group>
      {photos.map((photo, i) => (
        <PhotoItem 
          key={photo.id} 
          url={photo.url} 
          index={i} 
          count={photos.length}
        />
      ))}
    </group>
  );
};
