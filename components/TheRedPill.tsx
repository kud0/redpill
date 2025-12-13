'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, ContactShadows } from '@react-three/drei';
import { useRef, useState, Suspense } from 'react';
import * as THREE from 'three';

function RedPill() {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle rotation
    meshRef.current.rotation.y = t * 0.5;
    meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <group ref={meshRef}>
      <Float
        speed={2} // Animation speed
        rotationIntensity={1} // XYZ rotation intensity
        floatIntensity={2} // Up/down float intensity
      >
        <group
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          scale={hovered ? 1.1 : 1}
        >
          {/* Left Hemisphere */}
          <mesh position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color="#ff0033"
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>

          {/* Cylinder Body */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1, 1, 1.4, 32]} />
            <meshStandardMaterial
              color="#ff0033"
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>

          {/* Right Hemisphere */}
          <mesh position={[0.7, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color="#cc0028"
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -5, -5]} intensity={1} color="#ff0033" />

      <RedPill />
    </>
  );
}

export default function RedPillExperience() {
  return (
    <div className="w-full h-[600px] relative bg-black overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <div className="z-10 mt-[250px] pointer-events-none">
        <h2 className="text-white font-mono text-xl tracking-[0.2em] font-bold animate-pulse text-shadow-glow">
          THE MATRIX IS REAL
        </h2>
      </div>

      <style jsx global>{`
        .text-shadow-glow {
          text-shadow: 0 0 10px rgba(255, 0, 51, 0.8), 0 0 20px rgba(255, 0, 51, 0.4);
        }
      `}</style>
    </div>
  );
}
