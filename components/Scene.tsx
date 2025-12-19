
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { Experience } from './Experience';

export const Scene: React.FC = () => {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
      <OrbitControls 
        enablePan={false} 
        minDistance={5} 
        maxDistance={30} 
        autoRotate={false}
      />
      
      <Experience />

      <Environment preset="city" />
      
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={1.2} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.4} 
        />
        <Noise opacity={0.03} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
};
