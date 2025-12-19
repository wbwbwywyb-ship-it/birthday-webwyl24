
import React, { Suspense, useEffect } from 'react';
import { Stars, Sparkles, Float, Text, Center, useProgress } from '@react-three/drei';
import { ParticleField } from './ParticleField';
import { PhotoWall } from './PhotoWall';
import { useStore } from '../store';
import { Phase, Gesture } from '../types';
import { getOrnamentColors } from '../utils/math';

const Ornaments: React.FC = () => {
  const phase = useStore(s => s.phase);
  const colors = getOrnamentColors();
  
  if (phase !== Phase.CAKE) return null;

  return (
    <group>
      {Array.from({ length: 20 }).map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1}>
          <mesh position={[
            Math.sin(i * 1.5) * 2.8,
            (i / 20) * 2 - 1,
            Math.cos(i * 1.5) * 2.8
          ]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial 
              color={colors[i % colors.length]} 
              metalness={0.9} 
              roughness={0.1} 
            />
          </mesh>
        </Float>
      ))}
      <group position={[0, 1.2, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>
        <pointLight intensity={2} color="orange" position={[0, 0.4, 0]} />
        <Text 
          position={[0, 0.6, 0]} 
          fontSize={0.8} 
          color="#ffd700"
          font="https://fonts.gstatic.com/s/dancingscript/v24/If2cXTr6fe34-3S0pXETW44.woff2"
        >
          24
        </Text>
      </group>
    </group>
  );
};

export const Experience: React.FC = () => {
  const { phase, gesture, setPhase, setIsLoading } = useStore();
  const { progress } = useProgress();

  useEffect(() => {
    // 当所有资源加载完成（progress 为 100）时隐藏加载页
    if (progress === 100) {
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [progress, setIsLoading]);

  useEffect(() => {
    if (gesture === Gesture.OPEN && phase === Phase.CAKE) {
      setPhase(Phase.BLOOMING);
    }
    if (gesture === Gesture.CLOSED && phase === Phase.NEBULA) {
      setPhase(Phase.COLLAPSING);
    }
  }, [gesture, phase, setPhase]);

  return (
    <>
      <color attach="background" args={['#020205']} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={20} size={2} speed={0.4} opacity={0.5} />

      <Suspense fallback={null}>
        <ParticleField />
        <PhotoWall />
        <Ornaments />
        
        <Center top position={[0, 4, 0]}>
          <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text
              font="https://fonts.gstatic.com/s/dancingscript/v24/If2cXTr6fe34-3S0pXETW44.woff2"
              fontSize={1.2}
              color="#ffcc33"
              maxWidth={10}
              textAlign="center"
            >
              Happy Birthday
            </Text>
          </Float>
        </Center>
      </Suspense>

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffaa55" />
      <pointLight position={[-10, 5, -5]} intensity={1} color="#55aaff" />
      <spotLight 
        position={[0, 10, 0]} 
        angle={0.3} 
        penumbra={1} 
        intensity={2} 
        castShadow 
      />
    </>
  );
};
