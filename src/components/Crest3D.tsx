import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// Custom hook to handle mouse interaction (mock or subtle tilt)
function InteractiveGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates to [-0.5, 0.5]
      const x = (event.clientX / window.innerWidth) - 0.5;
      const y = (event.clientY / window.innerHeight) - 0.5;
      setMouse({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Slow prestigious yaw oscillation (sway) instead of full spinning 360, 
    // so the intricate face of the crest (foundation date, stripes, gold stars, banner) 
    // is always beautifully visible and interactable.
    const time = state.clock.getElapsedTime();
    const baseRotationY = Math.sin(time * 0.45) * 0.35; 
    
    // Smooth tilt/yaw based on mouse position
    const targetX = mouse.y * 0.3;
    const targetY = baseRotationY + (mouse.x * 0.4);
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.08);
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}

// Custom hook or helper to create a 3D Star shape
function createStarShape() {
  const shape = new THREE.Shape();
  const spikes = 5;
  const outerRadius = 0.25;
  const innerRadius = 0.1;
  
  let rot = (Math.PI / 2) * 3;
  let x = 0;
  let y = 0;
  const step = Math.PI / spikes;

  shape.moveTo(0, outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = Math.cos(rot) * outerRadius;
    y = Math.sin(rot) * outerRadius;
    shape.lineTo(x, y);
    rot += step;

    x = Math.cos(rot) * innerRadius;
    y = Math.sin(rot) * innerRadius;
    shape.lineTo(x, y);
    rot += step;
  }
  shape.lineTo(0, outerRadius);
  return shape;
}

// Shield base vector path
function createShieldShape() {
  const shape = new THREE.Shape();
  
  // High-fidelity standard heraldic shield
  shape.moveTo(0, 1.2);
  // Top edge curving slightly to top-right
  shape.quadraticCurveTo(0.5, 1.25, 0.9, 1.1);
  // Upper right side curve
  shape.quadraticCurveTo(1.1, 0.5, 1.0, 0.1);
  // Bottom taper down to point
  shape.quadraticCurveTo(0.9, -0.6, 0, -1.3);
  // Opposite bottom curve up
  shape.quadraticCurveTo(-0.9, -0.6, -1.0, 0.1);
  // Upper left side curve
  shape.quadraticCurveTo(-1.1, 0.5, -0.9, 1.1);
  // Top left edge curving to center
  shape.quadraticCurveTo(-0.5, 1.25, 0, 1.2);

  return shape;
}

function CrestModel() {
  const shieldShape = React.useMemo(() => createShieldShape(), []);
  const starShape = React.useMemo(() => createStarShape(), []);

  // Extrude settings for 3D shield
  const shieldExtrudeSettings = {
    depth: 0.14,
    bevelEnabled: true,
    bevelSegments: 6,
    steps: 2,
    bevelSize: 0.04,
    bevelThickness: 0.05,
  };

  // Extrude settings for the gold Star
  const starExtrudeSettings = {
    depth: 0.05,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.01,
    bevelThickness: 0.01,
  };

  // Standard Mfantsipim Red & Black colors
  const CRIMSON_RED = "#E11D48";
  const EMBLEM_BLACK = "#121214";
  const BRASS_GOLD = "#D4AF37";

  // The Faithful Eight vertical stripes info (alternating Crimson and Black)
  const stripes = [
    { x: -0.49, h: 0.82, color: CRIMSON_RED },
    { x: -0.35, h: 1.10, color: EMBLEM_BLACK },
    { x: -0.21, h: 1.28, color: CRIMSON_RED },
    { x: -0.07, h: 1.38, color: EMBLEM_BLACK },
    { x: 0.07, h: 1.38, color: CRIMSON_RED },
    { x: 0.21, h: 1.28, color: EMBLEM_BLACK },
    { x: 0.35, h: 1.10, color: CRIMSON_RED },
    { x: 0.49, h: 0.82, color: EMBLEM_BLACK },
  ];

  return (
    <InteractiveGroup>
      {/* 1. MAIN GOLD SHEILD CONTAINER (Border Frame) */}
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[shieldShape, shieldExtrudeSettings]} />
        <meshStandardMaterial 
          color={BRASS_GOLD} 
          roughness={0.2}
          metalness={0.88}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* 2. INNER RED ENAMEL SHIELD COVER */}
      <mesh position={[0, -0.01, 0.05]} scale={[0.92, 0.92, 1.0]}>
        <extrudeGeometry args={[shieldShape, { ...shieldExtrudeSettings, depth: 0.11 }]} />
        <meshStandardMaterial 
          color="#3A050B" // Deep blood red backing
          roughness={0.3}
          metalness={0.3}
        />
      </mesh>

      {/* 3. THE EIGHT FAITHFUL STRIPES (Representing the original 8 foundation students) */}
      {stripes.map((stripe, idx) => (
        <group key={idx} position={[stripe.x, -0.03, 0.14]}>
          <mesh castShadow>
            <boxGeometry args={[0.11, stripe.h, 0.06]} />
            <meshStandardMaterial 
              color={stripe.color} 
              roughness={0.15}
              metalness={0.7}
            />
          </mesh>
        </group>
      ))}

      {/* 4. THE GOLDEN STAR OF PROGRESS (Est. 1876, looking forward) */}
      <mesh position={[0, 0.65, 0.17]} rotation={[0, 0, 0]}>
        <extrudeGeometry args={[starShape, starExtrudeSettings]} />
        <meshStandardMaterial 
          color={BRASS_GOLD} 
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* 5. HISTORIC FOUNDATION TEXT on Crest facade */}
      <group position={[0, -0.38, 0.18]}>
        <Text
          color={BRASS_GOLD}
          fontSize={0.16}
          fontWeight="bold"
          font="monospace"
        >
          1876
        </Text>
      </group>

      {/* 6. COAT OF ARMS TRADITIONAL SCROLL/BANNER ASSEMBLY (DWEN - HWE - KAN) */}
      {/* Center banner block */}
      <mesh position={[0, -1.18, 0.25]} castShadow>
        <boxGeometry args={[1.1, 0.26, 0.06]} />
        <meshStandardMaterial 
          color={BRASS_GOLD} 
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Center Text (HWE) */}
      <group position={[0, -1.18, 0.29]}>
        <Text
          color={EMBLEM_BLACK}
          fontSize={0.14}
          fontWeight="black"
        >
          HWE
        </Text>
      </group>

      {/* Left banner wing */}
      <mesh 
        position={[-0.67, -1.24, 0.19]} 
        rotation={[0, 0.35, -0.1]} 
        castShadow
      >
        <boxGeometry args={[0.48, 0.24, 0.05]} />
        <meshStandardMaterial 
          color="#C59F2D" // Slightly shaded gold
          roughness={0.25}
          metalness={0.8}
        />
      </mesh>
      
      {/* Left Text (DWEN) */}
      <group position={[-0.67, -1.24, 0.23]} rotation={[0, 0.35, -0.1]}>
        <Text
          color={EMBLEM_BLACK}
          fontSize={0.12}
          fontWeight="black"
        >
          DWEN
        </Text>
      </group>

      {/* Right banner wing */}
      <mesh 
        position={[0.67, -1.24, 0.19]} 
        rotation={[0, -0.35, 0.1]} 
        castShadow
      >
        <boxGeometry args={[0.48, 0.24, 0.05]} />
        <meshStandardMaterial 
          color="#C59F2D" // Slightly shaded gold
          roughness={0.25}
          metalness={0.8}
        />
      </mesh>
      
      {/* Right Text (KAN) */}
      <group position={[0.67, -1.24, 0.23]} rotation={[0, -0.35, 0.1]}>
        <Text
          color={EMBLEM_BLACK}
          fontSize={0.12}
          fontWeight="black"
        >
          KAN
        </Text>
      </group>
    </InteractiveGroup>
  );
}

export default function Crest3D() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Fallback beautiful flat SVG design if webgl fails or is unsupported in sandbox
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-radial from-red-950/20 to-transparent">
        <div className="w-48 h-48 rounded-full bg-linear-to-tr from-yellow-600/30 via-red-600/20 to-zinc-900 border border-yellow-600/30 flex items-center justify-center relative shadow-2xl animate-spin-slow">
          {/* Flat stylized fallback crest */}
          <div className="w-32 h-40 bg-zinc-950/90 border-2 border-yellow-500 rounded-b-full flex flex-col items-center justify-between p-4 relative shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <span className="text-yellow-500 text-lg font-black tracking-widest mt-1">★</span>
            <div className="flex gap-1 w-full justify-center px-1">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2.5 h-16 rounded-xs ${i % 2 === 0 ? 'bg-red-600' : 'bg-zinc-800'}`} 
                />
              ))}
            </div>
            <div className="text-yellow-500 text-[10px] font-bold">1876</div>
            <div className="absolute -bottom-4 bg-yellow-500 text-zinc-950 font-black text-[9px] px-3.5 py-1.5 rounded-full shadow-lg tracking-widest">
              DWEN HWE KAN
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[350px] relative">
      <div className="absolute inset-0 bg-radial from-red-600/5 via-transparent to-transparent pointer-events-none rounded-full blur-3xl scale-150"></div>
      
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          // Detect WebGL issues and provide fallback if needed
          if (!gl.getContext()) {
            setHasError(true);
          }
        }}
        onError={() => setHasError(true)}
      >
        <ambientLight intensity={0.5} />
        
        {/* Key studio lighting */}
        <directionalLight position={[5, 10, 5]} intensity={1.8} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} />
        
        {/* Highly polished crimson & gold glowing rim lights */}
        <pointLight position={[-4, -3, 2]} intensity={1.4} color="#E11D48" />
        <pointLight position={[4, -2, 3]} intensity={1.5} color="#D4AF37" />
        <pointLight position={[0, 4, 1]} intensity={0.8} color="#FFFFFF" />

        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
          <CrestModel />
        </Float>
      </Canvas>
    </div>
  );
}
