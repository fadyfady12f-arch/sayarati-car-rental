import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PresentationControls,
  Html,
  useProgress
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { RotateCcw, ZoomIn, ZoomOut, Palette } from 'lucide-react';
import * as THREE from 'three';

// Available car colors
const carColors = [
  { name: 'أسود', color: '#1a1a1a' },
  { name: 'أبيض', color: '#f5f5f5' },
  { name: 'أحمر', color: '#dc2626' },
  { name: 'أزرق', color: '#2563eb' },
  { name: 'رمادي', color: '#6b7280' },
  { name: 'فضي', color: '#c0c0c0' },
];

// Loading component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{progress.toFixed(0)}% جاري التحميل</p>
      </div>
    </Html>
  );
}

// Simple car model (placeholder - replace with actual GLTF model)
function CarModel({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Car Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Car Top/Cabin */}
      <mesh position={[0.3, 1.2, 0]} castShadow>
        <boxGeometry args={[2, 0.8, 1.8]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Windows */}
      <mesh position={[0.3, 1.2, 0.91]}>
        <boxGeometry args={[1.8, 0.6, 0.02]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.3, 1.2, -0.91]}>
        <boxGeometry args={[1.8, 0.6, 0.02]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* Front windshield */}
      <mesh position={[-0.8, 1.1, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.02, 0.7, 1.7]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* Rear windshield */}
      <mesh position={[1.4, 1.1, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.02, 0.7, 1.7]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* Wheels */}
      {[
        [-1.2, 0.3, 1.1],
        [-1.2, 0.3, -1.1],
        [1.2, 0.3, 1.1],
        [1.2, 0.3, -1.1],
      ].map((position, index) => (
        <group key={index} position={position as [number, number, number]}>
          {/* Tire */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.32, 16]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      <mesh position={[-2, 0.5, 0.7]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-2, 0.5, -0.7]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>

      {/* Taillights */}
      <mesh position={[2, 0.5, 0.7]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[2, 0.5, -0.7]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

// Scene component
function Scene({ color }: { color: string }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={2048}
      />
      <spotLight
        position={[-10, 10, -10]}
        angle={0.15}
        penumbra={1}
        intensity={0.5}
      />

      {/* Car Model */}
      <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap={{ mass: 4, tension: 1500 }}
        rotation={[0, 0.3, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <CarModel color={color} />
      </PresentationControls>

      {/* Floor/Shadow */}
      <ContactShadows
        position={[0, -0.1, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />

      {/* Environment */}
      <Environment preset="city" />
    </>
  );
}

interface Car3DViewerProps {
  carName?: string;
  className?: string;
}

const Car3DViewer = ({ carName = 'السيارة', className = '' }: Car3DViewerProps) => {
  const [selectedColor, setSelectedColor] = useState(carColors[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div className={`relative bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl overflow-hidden ${className}`}>
      {/* 3D Canvas */}
      <div className="aspect-[16/9] w-full">
        <Canvas
          shadows
          camera={{ position: [5, 3, 5], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={<Loader />}>
            <Scene color={selectedColor.color} />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            minDistance={4}
            maxDistance={10}
          />
        </Canvas>
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        {/* Color Picker */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg"
          >
            <div
              className="w-6 h-6 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: selectedColor.color }}
            />
            <span className="text-sm font-medium text-gray-700">{selectedColor.name}</span>
            <Palette className="w-4 h-4 text-gray-500" />
          </motion.button>

          {/* Color Options */}
          {showColorPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full mb-2 left-0 bg-white rounded-xl shadow-xl p-3 min-w-[200px]"
            >
              <p className="text-sm font-medium text-gray-700 mb-2">اختر اللون</p>
              <div className="grid grid-cols-3 gap-2">
                {carColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColor(color);
                      setShowColorPicker(false);
                    }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                      selectedColor.name === color.name
                        ? 'bg-primary-50 ring-2 ring-primary-500'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm"
                      style={{ backgroundColor: color.color }}
                    />
                    <span className="text-xs text-gray-600">{color.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
          <p className="text-xs text-gray-500">
            اسحب للتدوير • استخدم العجلة للتكبير
          </p>
        </div>
      </div>

      {/* Car Name Badge */}
      <div className="absolute top-4 right-4">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
          <p className="text-sm font-bold text-gray-800">{carName}</p>
          <p className="text-xs text-gray-500">عرض ثلاثي الأبعاد</p>
        </div>
      </div>
    </div>
  );
};

export default Car3DViewer;
