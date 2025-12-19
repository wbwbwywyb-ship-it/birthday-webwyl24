
import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '../store';
import { Phase } from '../types';
import { generateCakePoints, generateNebulaPoints } from '../utils/math';
import gsap from 'gsap';

const COUNT = 5000;

export const ParticleField: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const phase = useStore((s) => s.phase);
  const setPhase = useStore((s) => s.setPhase);
  const { mouse, viewport } = useThree();
  
  const pointsCake = useMemo(() => generateCakePoints(COUNT), []);
  const pointsNebula = useMemo(() => generateNebulaPoints(COUNT), []);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const positions = useMemo(() => new Float32Array(COUNT * 3), []);
  const targets = useMemo(() => new Float32Array(COUNT * 3), []);
  const currentPositions = useMemo(() => new Float32Array(COUNT * 3), []);

  useEffect(() => {
    // Initial setup
    for (let i = 0; i < COUNT; i++) {
      const p = pointsCake[i];
      currentPositions[i * 3] = p.x;
      currentPositions[i * 3 + 1] = p.y;
      currentPositions[i * 3 + 2] = p.z;
    }
  }, [pointsCake, currentPositions]);

  // Handle Transitions
  useEffect(() => {
    const transitionData = { progress: 0 };
    const sourcePoints = phase === Phase.NEBULA || phase === Phase.COLLAPSING ? pointsCake : pointsNebula;
    const destPoints = phase === Phase.NEBULA || phase === Phase.BLOOMING ? pointsNebula : pointsCake;

    if (phase === Phase.BLOOMING) {
      gsap.to(transitionData, {
        progress: 1,
        duration: 1.5,
        ease: "power4.out",
        onUpdate: () => {
          for (let i = 0; i < COUNT; i++) {
            const t = transitionData.progress;
            currentPositions[i * 3] = THREE.MathUtils.lerp(pointsCake[i].x, pointsNebula[i].x, t);
            currentPositions[i * 3 + 1] = THREE.MathUtils.lerp(pointsCake[i].y, pointsNebula[i].y, t);
            currentPositions[i * 3 + 2] = THREE.MathUtils.lerp(pointsCake[i].z, pointsNebula[i].z, t);
          }
        },
        onComplete: () => setPhase(Phase.NEBULA)
      });
    } else if (phase === Phase.COLLAPSING) {
      gsap.to(transitionData, {
        progress: 1,
        duration: 1.5,
        ease: "expo.inOut",
        onUpdate: () => {
          for (let i = 0; i < COUNT; i++) {
            const t = transitionData.progress;
            currentPositions[i * 3] = THREE.MathUtils.lerp(pointsNebula[i].x, pointsCake[i].x, t);
            currentPositions[i * 3 + 1] = THREE.MathUtils.lerp(pointsNebula[i].y, pointsCake[i].y, t);
            currentPositions[i * 3 + 2] = THREE.MathUtils.lerp(pointsNebula[i].z, pointsCake[i].z, t);
          }
        },
        onComplete: () => setPhase(Phase.CAKE)
      });
    }
  }, [phase, pointsCake, pointsNebula, currentPositions, setPhase]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;
    const mousePos = new THREE.Vector3(mouseX, mouseY, 0);

    for (let i = 0; i < COUNT; i++) {
      let x = currentPositions[i * 3];
      let y = currentPositions[i * 3 + 1];
      let z = currentPositions[i * 3 + 2];

      // Mouse Ripple in Cake mode
      if (phase === Phase.CAKE) {
        const dist = mousePos.distanceTo(new THREE.Vector3(x, y, z));
        if (dist < 2) {
          const force = (2 - dist) * 0.5;
          const dir = new THREE.Vector3(x, y, z).sub(mousePos).normalize();
          x += dir.x * force;
          y += dir.y * force;
        }
      }

      // Subtle float
      y += Math.sin(time + i) * 0.05;

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.04 + Math.sin(time * 2 + i) * 0.01);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#ff9eb5" emissive="#ff4d6d" emissiveIntensity={2} toneMapped={false} />
    </instancedMesh>
  );
};
