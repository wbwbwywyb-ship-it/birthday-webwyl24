
import * as THREE from 'three';

export const generateCakePoints = (count: number) => {
  const points = [];
  const layers = 10;
  const radiusBottom = 3;
  const radiusTop = 2.5;
  const height = 2;

  for (let i = 0; i < count; i++) {
    const r = Math.sqrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const h = Math.random() * height;
    
    // Lerp radius based on height to get a truncated cone
    const currentRadius = THREE.MathUtils.lerp(radiusBottom, radiusTop, h / height) * r;
    
    const x = Math.cos(theta) * currentRadius;
    const y = h - 1; // Center vertically
    const z = Math.sin(theta) * currentRadius;
    
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
};

export const generateNebulaPoints = (count: number) => {
  const points = [];
  const radius = 12;
  const thickness = 4;

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius + (Math.random() - 0.5) * thickness;
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi) * 0.3; // Flat-ish ring
    
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
};

export const getOrnamentColors = () => [
  '#D4AF37', // Vintage Gold
  '#800020', // Burgundy
  '#6699CC', // Slate Blue
  '#E0B0FF', // Rose Pink
  '#F7E7CE', // Champagne
];
