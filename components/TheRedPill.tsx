'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sparkles, Text } from '@react-three/drei';
import * as THREE from 'three';

function PillMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime();

    // Lazy rotation (slow idle spin)
    meshRef.current.rotation.x = Math.cos(t / 4) / 8;
    meshRef.current.rotation.y = Math.sin(t / 3) / 8;
    meshRef.current.position.y = (1 + Math.sin(t / 1.5)) / 10;

    // If hovered, spin faster on Y axis
    if (hovered) {
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        rotation={[Math.PI / 2, 0, 0]} // Rotate to lay flat or adjust as needed
        scale={hovered ? 1.1 : 1} // Pulse effect on hover
      >
        {/*
           args: [radius, length, capSegments, radialSegments]
           High segment count = smoother curves
        */}
        <capsuleGeometry args={[1, 2.5, 4, 32]} />

        {/* THE MATERIAL - The secret to the "Pro" look */}
        <meshPhysicalMaterial
          color="#ff0033"        // Deep Red
          roughness={0.1}        // Very smooth (like plastic/glass)
          metalness={0.1}        // Slight metallic reflection
          clearcoat={1}          // The "gel" coating layer
          clearcoatRoughness={0.1}
          reflectivity={1}
          emissive="#500000"     // Inner glow color
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Optional: A wireframe shell around it for that "Digital/Matrix" vibe */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.05}>
        <capsuleGeometry args={[1, 2.5, 4, 8]} />
        <meshBasicMaterial color="#ff3333" wireframe transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

export default function RedPillExperience() {
  return (
    <div className="w-full h-[600px] relative bg-black">
      <Canvas camera={{ position: [0, 0, 6], fov: 35 }}>
        {/* Lighting: Essential for the glossy look */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ff8888" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#0000ff" />

        {/* Floating Animation Wrapper */}
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
          <PillMesh />
        </Float>

        {/* 3D Text floating under the pill */}
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
           <Text
            position={[0, -2, 0]}
            fontSize={0.5}
            font="https://fonts.gstatic.com/s/sharetechmono/v15/J7aHnp1uDWRRFmbURQ8ayPMh0Q.woff" // Matrix style font
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            THE MATRIX IS REAL
          </Text>
        </Float>

        {/* Background FX */}
        <Sparkles count={50} scale={6} size={4} speed={0.4} opacity={0.5} color="#ff0000" />
        <Environment preset="city" /> {/* Adds realistic reflections to the pill */}
      </Canvas>
    </div>
  );
}
