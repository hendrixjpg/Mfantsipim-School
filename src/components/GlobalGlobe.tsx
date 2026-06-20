import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, MapPin, Award, Navigation, Info, Users, Briefcase } from 'lucide-react';

interface LocationNode {
  id: string;
  name: string;
  country: string;
  desc: string;
  latitude: number;
  longitude: number;
  type: 'hq' | 'chapter' | 'alumni';
  notablePresences: string[];
}

const LOCATIONS: LocationNode[] = [
  {
    id: 'cape-coast',
    name: 'Cape Coast (Kwabotwe)',
    country: 'Ghana',
    desc: 'The historic bedrock of Mfantsipim School. Founded on Kwabotwe Hill on April 3, 1876, it represents the heart and source of the entire global network.',
    latitude: 5.1053,
    longitude: -1.2466,
    type: 'hq',
    notablePresences: ['Mfantsipim Campus', 'Rev. Ebenezer K. Aidoo', 'historic archives']
  },
  {
    id: 'accra',
    name: 'Accra',
    country: 'Ghana',
    desc: 'The national administrative powerhouse and core hub of MOBA (Mfantsipim Old Boys Association), hosting critical executive decision-making groups.',
    latitude: 5.6037,
    longitude: -0.1870,
    type: 'chapter',
    notablePresences: ['MOBA National Secretariat', 'Ernest Addison (Governor, Bank of Ghana)', 'Annual Fundraisers']
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    desc: 'The oldest European chapter of MOBA. Drives strong resource planning efforts, academic partnerships, and hosts iconic international reunions.',
    latitude: 51.5074,
    longitude: -0.1278,
    type: 'chapter',
    notablePresences: ['MOBA UK Chapter', 'Royal Society Collaborations', 'European Old Boys Network']
  },
  {
    id: 'new-york',
    name: 'New York & New Jersey',
    country: 'United States & Canada',
    desc: 'MOBA North America Chapter. Orchestrates large-scale institutional endowments and scholarship program development assisting talented scholars.',
    latitude: 40.7128,
    longitude: -74.0060,
    type: 'chapter',
    notablePresences: ['MOBA North America Board', 'Alex Quaison-Sackey legacy', 'Endowment Trust Funds']
  },
  {
    id: 'geneva',
    name: 'Geneva',
    country: 'Switzerland',
    desc: 'The global diplomatic and humanitarian epicenter, immortalizing the incredible international legacy and leadership of Kofi Annan at the United Nations.',
    latitude: 46.2044,
    longitude: 6.1432,
    type: 'alumni',
    notablePresences: ['Kofi Annan (Former UN Secretary-General)', 'Global Peace Initiatives', 'International Civil Service Office']
  },
  {
    id: 'toronto',
    name: 'Toronto',
    country: 'Canada',
    desc: 'MOBA Canada Chapter. Actively fosters direct mentorship networks between seasoned engineering, medical, and banking professionals and newly arriving alumni.',
    latitude: 43.6532,
    longitude: -79.3832,
    type: 'chapter',
    notablePresences: ['MOBA Canada Union', 'Academic exchange programs', 'North American Tech Hubs']
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    desc: 'Representing MOBA Oceania, proving that the brotherhood of Kwabotwe extends to the outermost corners of the globe, upholding the red and black banner.',
    latitude: -33.8688,
    longitude: 151.2093,
    type: 'chapter',
    notablePresences: ['MOBA Australia & Oceania Chapter', 'Pacific Rim Executive Council', 'Alumni Fellowship']
  }
];

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);
  
  return new THREE.Vector3(x, y, z);
}

// Sub-component inside the Canvas
interface GlobeCoreProps {
  selectedId: string | null;
  onSelectNode: (id: string) => void;
}

function GlobeCore({ selectedId, onSelectNode }: GlobeCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Holographic earth dot distribution
  const [positions, sizes] = useMemo(() => {
    const count = 400;
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Fibonacci sphere mapping
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = 2.39996 * i; // Golden angle
      
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      
      const rMultiplier = 2.0;
      pos[i * 3] = x * rMultiplier;
      pos[i * 3 + 1] = y * rMultiplier;
      pos[i * 3 + 2] = z * rMultiplier;
      
      // Randomize sizes slightly for twinkle
      sz[i] = 0.02 + Math.random() * 0.03;
    }
    return [pos, sz];
  }, []);

  // Compute 3D node coordinates
  const nodes = useMemo(() => {
    return LOCATIONS.map((loc) => ({
      ...loc,
      pos: latLonToVector3(loc.latitude, loc.longitude, 2.0)
    }));
  }, []);

  // Base node for connections
  const capeCoastNode = useMemo(() => {
    const cc = LOCATIONS.find(l => l.id === 'cape-coast')!;
    return latLonToVector3(cc.latitude, cc.longitude, 2.0);
  }, []);

  // Curved lines from Cape Coast to other nodes
  const connectionCurves = useMemo(() => {
    return nodes
      .filter((n) => n.id !== 'cape-coast')
      .map((n) => {
        const start = capeCoastNode;
        const end = n.pos;
        
        // Calculate midpoint and pull it outwards to create dynamic curve arc
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const distance = start.distanceTo(end);
        
        // Dynamic arc height based on distance
        const arcHeight = 2.0 + distance * 0.35;
        const control = mid.clone().normalize().multiplyScalar(arcHeight);
        
        const curve = new THREE.QuadraticBezierCurve3(start, control, end);
        const points = curve.getPoints(40);
        
        return {
          id: n.id,
          points
        };
      });
  }, [nodes, capeCoastNode]);

  // Handle smooth rotation and centering on selected node
  useFrame(() => {
    if (!groupRef.current) return;

    if (selectedId) {
      const activeNode = LOCATIONS.find((n) => n.id === selectedId);
      if (activeNode) {
        // Calculate standard target spherical rotation angles
        // Longitude goes from -180 to 180, negative is west
        // Latitude goes from -90 to 90, positive is north
        const targetY = -activeNode.longitude * (Math.PI / 180);
        const targetX = activeNode.latitude * (Math.PI / 180);

        // Smoothly lerp spherical angles
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.06);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.06);
      }
    } else {
      // Slow idle rotation when no node is actively focused
      groupRef.current.rotation.y += 0.002;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.1, 0.03);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Semi-transparent Earth Sphere core */}
      <mesh>
        <sphereGeometry args={[1.98, 40, 40]} />
        <meshBasicMaterial color="#111827" transparent opacity={0.6} />
      </mesh>

      {/* Main Wireframe Meridians */}
      <mesh>
        <sphereGeometry args={[1.99, 16, 16]} />
        <meshBasicMaterial color="#374151" wireframe transparent opacity={0.15} />
      </mesh>

      {/* Holographic Continents/Points Lattice */}
      <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#d1d5db"
          size={0.035}
          sizeAttenuation={true}
          transparent
          opacity={0.35}
        />
      </points>

      {/* Connection Arcs (Emanating from Cape Coast to Chapter nodes) */}
      {connectionCurves.map((curve) => {
        const isActive = selectedId === curve.id;
        return (
          <line key={curve.id}>
            <bufferGeometry attach="geometry" onUpdate={(el) => el.setFromPoints(curve.points)} />
            <lineBasicMaterial
              color={isActive ? '#dc2626' : '#f59e0b'}
              linewidth={1.5}
              transparent
              opacity={isActive ? 0.9 : 0.25}
            />
          </line>
        );
      })}

      {/* Interactive Location Nodes */}
      {nodes.map((node) => {
        const isSelected = selectedId === node.id;
        const isHovered = hoveredNode === node.id;
        
        // Adjust pin colors: Red for HQ, Gold for general Chapters/Diplomatic nodes
        let color = '#f59e0b'; // Gold
        if (node.type === 'hq') {
          color = '#dc2626'; // Deep Crimson
        } else if (isSelected) {
          color = '#dc2626'; // Highlight selected with Crimson too
        } else if (isHovered) {
          color = '#f87171'; // Hover state
        }

        return (
          <group key={node.id} position={node.pos}>
            {/* Glowing outer resonance ring */}
            <mesh>
              <sphereGeometry args={[isSelected ? 0.10 : 0.07, 16, 16]} />
              <meshBasicMaterial color={color} transparent opacity={0.4} />
            </mesh>

            {/* Core anchor pin point */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(node.id);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
                setHoveredNode(node.id);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'default';
                setHoveredNode(null);
              }}
            >
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>

            {/* Hover 3D HTML Tooltip overlays */}
            {(isHovered || isSelected) && (
              <Html distanceFactor={6} center>
                <div 
                  className="bg-zinc-950/90 border border-zinc-800 text-white text-[10px] font-black tracking-wider uppercase px-2 py-1 rounded shadow-xl whitespace-nowrap pointer-events-none select-none"
                  style={{ transform: 'translateY(-24px)' }}
                >
                  {node.name}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default function GlobalGlobe() {
  const [selectedId, setSelectedId] = useState<string | null>('cape-coast');

  const activeNode = LOCATIONS.find((l) => l.id === selectedId) || LOCATIONS[0];

  return (
    <section className="section-padding bg-zinc-950 relative overflow-hidden" id="global-footprint">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(220,38,38,0.06)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(245,158,11,0.02)_0%,transparent_40%)] pointer-events-none" />

      <div className="container-custom relative z-10">
        
        {/* Header Block with high architectural aesthetic */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <Navigation size={12} className="text-red-500 animate-pulse" />
              Global_Footprint // International_MOBA_Chapters
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-white mb-6">
              The <span className="text-red-600">Global</span> Brotherhood
            </h2>
            <p className="text-zinc-400 text-lg font-medium leading-relaxed">
              From our legendary red hills of Kwabotwe, Mfantsipim Old Boys (MOBA) guide major economic, technological, and scholastic networks across every timezone.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-1 bg-red-600/30 rounded-full" />
          </div>
        </div>

        {/* Dynamic Interactive Dual-Column Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Chapter Detail & Selection Cards */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col gap-4">
            
            {/* Scrollable Location List */}
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0 scrollbar-none">
              {LOCATIONS.map((loc) => {
                const isSelected = selectedId === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelectedId(loc.id)}
                    className={`flex-shrink-0 text-left px-5 py-4 rounded-2xl transition-all border flex items-center justify-between gap-4 select-none cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-900/90 border-red-600/50 text-white shadow-lg shadow-red-950/20'
                        : 'bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-500'
                      }`}>
                        {loc.type === 'hq' ? 'HQ' : loc.country.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm tracking-tight">{loc.name}</h3>
                        <p className="text-[10px] uppercase font-black tracking-wider opacity-60">{loc.country}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping mr-2 hidden lg:block" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Details Card Panel with Exit/Expansion Animations */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-zinc-900/60 border border-zinc-900 rounded-3xl p-8 mt-4 relative"
              >
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-zinc-800 rounded-tl-3xlSub" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-zinc-800 rounded-br-3xlSub" />
                
                <div className="flex items-center gap-3 text-[10px] font-black text-red-500 uppercase tracking-[0.25em] mb-4">
                  <Info size={14} />
                  active chapter node file
                </div>

                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">
                  {activeNode.name}
                </h3>
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-medium">
                  {activeNode.desc}
                </p>

                {/* Sub-points Grid */}
                <div className="border-t border-zinc-800/80 pt-6">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Users size={12} /> Key_Focal_Points
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeNode.notablePresences.map((pres, idx) => (
                      <span 
                        key={idx}
                        className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-[10px] font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1.5"
                      >
                        <span className="w-1 h-1 rounded-full bg-red-500" />
                        {pres}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Right Column: Interactive 3D WebGL Canvas */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center relative">
            
            {/* Interactive hint overlay */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none select-none flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 text-[9px] font-black tracking-widest uppercase text-zinc-500 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Interactive Canvas (Drag / Zoom Enabled)
            </div>

            <div className="w-full aspect-square max-w-[500px] lg:max-w-none h-[420px] md:h-[520px] rounded-full overflow-hidden flex items-center justify-center relative bg-gradient-to-r from-zinc-950 via-zinc-900/10 to-zinc-950">
              
              {/* Spinning compass HUD indicator coordinates in backgrounds */}
              <div className="absolute inset-0 border border-zinc-900/40 rounded-full flex items-center justify-center pointer-events-none">
                <div className="w-[85%] h-[85%] border border-[dashed] border-zinc-900/30 rounded-full animate-[spin_100s_linear_infinite]" />
                <div className="w-[70%] h-[70%] border border-zinc-900/10 rounded-full" />
              </div>

              {/* Three.js Canvas */}
              <Canvas
                shadows={false}
                camera={{ position: [0, 0, 4.5], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
                className="w-full h-full"
              >
                <ambientLight intensity={1.5} />
                <directionalLight position={[5, 3, 5]} intensity={0.5} />
                <Suspense fallback={null}>
                  <GlobeCore
                    selectedId={selectedId}
                    onSelectNode={(id) => setSelectedId(id)}
                  />
                  <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={3.5}
                    maxDistance={6.0}
                  />
                </Suspense>
              </Canvas>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
