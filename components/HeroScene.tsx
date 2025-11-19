'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function RedPill(props: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Rotation animation
    meshRef.current.rotation.y += delta * (hovered ? 2 : 0.5);
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
  });

  return (
    <group {...props}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={hovered ? 1.2 : 1}
      >
        {/* Capsule Geometry: Radius, Length, CapSegments, RadialSegments */}
        <capsuleGeometry args={[1, 3, 4, 16]} />
        <meshPhysicalMaterial
          color="#FF0033"      // The Red Pill Color
          roughness={0.1}      // Shiny
          metalness={0.1}      // Slight metal look
          clearcoat={1}        // Glossy coating
          emissive="#330000"   // Slight inner glow
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="h-[80vh] w-full relative">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="red" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="blue" />

        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <RedPill />
        </Float>

        {/* Background Particles */}
        <Sparkles count={200} scale={10} size={2} speed={0.4} opacity={0.5} color="#FF0033" />

        <Environment preset="city" />
        <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color="#FF0033" />
      </Canvas>
    </div>
  );
}
