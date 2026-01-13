# 🎮 التصميم ثلاثي الأبعاد والتأثيرات البصرية
# 3D Visualisierungen & CSS Animationen

---

## 🚗 Three.js Auto-Viewer

### Car3DViewer Komponente

```tsx
// components/3d/Car3DViewer.tsx

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, ContactShadows, Html } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';

interface Car3DViewerProps {
  modelUrl: string;
  autoRotate?: boolean;
  showControls?: boolean;
  showColorPicker?: boolean;
  availableColors?: string[];
  onColorChange?: (color: string) => void;
  showHotspots?: boolean;
  hotspots?: Hotspot[];
}

const Car3DViewer = ({
  modelUrl,
  autoRotate = true,
  showControls = true,
  showColorPicker = false,
  availableColors = [],
  onColorChange,
  showHotspots = false,
  hotspots = [],
}: Car3DViewerProps) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="car-3d-viewer">
      {/* شريط التحميل */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <CarIcon className="animate-pulse" />
            <span>جاري تحميل النموذج...</span>
          </div>
          <div className="loading-bar">
            <div className="loading-progress" />
          </div>
        </div>
      )}

      {/* محدد الألوان */}
      {showColorPicker && availableColors.length > 0 && (
        <div className="color-picker">
          <span>اختر اللون:</span>
          <div className="color-options">
            {availableColors.map((color) => (
              <button
                key={color}
                className={`color-swatch ${selectedColor === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  setSelectedColor(color);
                  onColorChange?.(color);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Canvas ثلاثي الأبعاد */}
      <Canvas
        shadows
        camera={{ position: [5, 2, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => setIsLoading(false)}
      >
        <Suspense fallback={null}>
          {/* الإضاءة */}
          <ambientLight intensity={0.4} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <spotLight
            position={[-10, 10, -10]}
            angle={0.3}
            penumbra={1}
            intensity={0.5}
          />

          {/* نموذج السيارة */}
          <CarModel
            url={modelUrl}
            color={selectedColor}
            showHotspots={showHotspots}
            hotspots={hotspots}
          />

          {/* الظلال */}
          <ContactShadows
            position={[0, -0.5, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
          />

          {/* البيئة */}
          <Environment preset="city" />

          {/* التحكم */}
          {showControls && (
            <OrbitControls
              autoRotate={autoRotate}
              autoRotateSpeed={2}
              enablePan={false}
              minDistance={3}
              maxDistance={10}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2}
            />
          )}
        </Suspense>
      </Canvas>

      {/* أزرار التحكم */}
      <div className="viewer-controls">
        <button onClick={() => resetCamera()} title="إعادة تعيين الكاميرا">
          <RefreshIcon />
        </button>
        <button onClick={() => toggleAutoRotate()} title="الدوران التلقائي">
          <RotateIcon />
        </button>
        <button onClick={() => toggleFullscreen()} title="ملء الشاشة">
          <ExpandIcon />
        </button>
        <button onClick={() => takeScreenshot()} title="لقطة شاشة">
          <CameraIcon />
        </button>
      </div>
    </div>
  );
};

// نموذج السيارة
const CarModel = ({ url, color, showHotspots, hotspots }) => {
  const { scene, materials } = useGLTF(url);
  const modelRef = useRef<THREE.Group>();

  // تطبيق اللون
  useEffect(() => {
    if (color && materials) {
      Object.values(materials).forEach((material: any) => {
        if (material.name.includes('body') || material.name.includes('paint')) {
          material.color.set(color);
        }
      });
    }
  }, [color, materials]);

  // تحريك بسيط
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group ref={modelRef}>
      <primitive object={scene} scale={1} position={[0, 0, 0]} />

      {/* نقاط المعلومات */}
      {showHotspots && hotspots.map((hotspot, index) => (
        <Hotspot key={index} {...hotspot} />
      ))}
    </group>
  );
};

// نقطة معلومات
const Hotspot = ({ position, label, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={isHovered ? '#3b82f6' : '#ffffff'}
          emissive={isHovered ? '#3b82f6' : '#ffffff'}
          emissiveIntensity={0.5}
        />
      </mesh>

      {isHovered && (
        <Html position={[0, 0.2, 0]} center>
          <div className="hotspot-tooltip">
            <h4>{label}</h4>
            <p>{description}</p>
          </div>
        </Html>
      )}
    </group>
  );
};

export default Car3DViewer;
```

### CSS للمشاهد ثلاثي الأبعاد

```css
/* styles/3d-viewer.css */

.car-3d-viewer {
  position: relative;
  width: 100%;
  height: 500px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 20px;
  overflow: hidden;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: white;
}

.loading-spinner svg {
  width: 48px;
  height: 48px;
}

.loading-bar {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.loading-progress {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  animation: loadingProgress 2s ease-in-out infinite;
}

@keyframes loadingProgress {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}

.color-picker {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  z-index: 5;
  color: white;
}

.color-options {
  display: flex;
  gap: 0.5rem;
}

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-swatch:hover {
  transform: scale(1.2);
}

.color-swatch.active {
  border-color: white;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

.viewer-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.viewer-controls button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.viewer-controls button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.hotspot-tooltip {
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  min-width: 150px;
  text-align: center;
}

.hotspot-tooltip h4 {
  margin: 0 0 0.25rem;
  font-size: 0.9rem;
  color: #1f2937;
}

.hotspot-tooltip p {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
}
```

---

## ✨ CSS Animationen & Effekte

### Globale Animationen

```css
/* styles/animations.css */

/* ============================================
   KEYFRAME ANIMATIONS
   ============================================ */

/* تأثير الظهور من الأسفل */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* تأثير الظهور من اليمين (RTL) */
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* تأثير النبض */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* تأثير التوهج */
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
  }
}

/* تأثير الدوران */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* تأثير الارتداد */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* تأثير الموجة */
@keyframes wave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* تأثير التدرج المتحرك */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* تأثير الطفو */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(2deg);
  }
  75% {
    transform: translateY(-5px) rotate(-2deg);
  }
}

/* ============================================
   UTILITY CLASSES
   ============================================ */

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-fade-in-right {
  animation: fadeInRight 0.6s ease-out forwards;
}

.animate-pulse {
  animation: pulse 2s infinite;
}

.animate-glow {
  animation: glow 2s infinite;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-bounce {
  animation: bounce 1s infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* تأخير الحركة */
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

[data-aos] {
  opacity: 0;
  transition: all 0.6s ease-out;
}

[data-aos].aos-animate {
  opacity: 1;
}

[data-aos="fade-up"] {
  transform: translateY(50px);
}

[data-aos="fade-up"].aos-animate {
  transform: translateY(0);
}

[data-aos="fade-right"] {
  transform: translateX(-50px);
}

[data-aos="fade-right"].aos-animate {
  transform: translateX(0);
}

[data-aos="zoom-in"] {
  transform: scale(0.8);
}

[data-aos="zoom-in"].aos-animate {
  transform: scale(1);
}
```

### Button Effekte

```css
/* styles/buttons.css */

/* زر أساسي */
.btn-primary {
  position: relative;
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:active {
  transform: translateY(-1px);
}

/* زر التدرج المتحرك */
.btn-gradient {
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 25%,
    #6B8DD6 50%,
    #8E37D7 75%,
    #667eea 100%
  );
  background-size: 300% 300%;
  animation: gradientShift 5s ease infinite;
}

/* زر مع رسوم متحركة للأيقونة */
.btn-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-with-icon svg {
  transition: transform 0.3s ease;
}

.btn-with-icon:hover svg {
  transform: translateX(-5px); /* RTL */
}

/* زر محدد */
.btn-outline {
  background: transparent;
  border: 2px solid #3b82f6;
  color: #3b82f6;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.btn-outline::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0; /* RTL */
  width: 0;
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
  z-index: -1;
}

.btn-outline:hover {
  color: white;
}

.btn-outline:hover::before {
  width: 100%;
}

/* زر الحجز الكبير */
.btn-book-now {
  position: relative;
  padding: 1rem 3rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
}

.btn-book-now::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.btn-book-now:hover::after {
  width: 300px;
  height: 300px;
}
```

### Card Effekte

```css
/* styles/cards.css */

/* بطاقة السيارة */
.car-card {
  position: relative;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.car-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s ease;
}

.car-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.car-card:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}

.car-card .car-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.car-card .car-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.car-card:hover .car-image img {
  transform: scale(1.1);
}

/* تأثير الإضاءة على البطاقة */
.car-card .shine-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transform: skewX(-25deg);
  transition: left 0.5s ease;
}

.car-card:hover .shine-effect {
  left: 150%;
}

/* بطاقة ثلاثية الأبعاد */
.card-3d {
  perspective: 1000px;
}

.card-3d-inner {
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card-3d:hover .card-3d-inner {
  transform: rotateY(10deg) rotateX(5deg);
}

/* بطاقة زجاجية */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}
```

### Loading Effekte

```css
/* styles/loaders.css */

/* دوار التحميل */
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* نقاط التحميل */
.loading-dots {
  display: flex;
  gap: 8px;
}

.loading-dots span {
  width: 10px;
  height: 10px;
  background: #3b82f6;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

/* شريط التحميل */
.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* هيكل التحميل (Skeleton) */
.skeleton {
  background: linear-gradient(
    90deg,
    #f3f4f6 25%,
    #e5e7eb 50%,
    #f3f4f6 75%
  );
  background-size: 200% 100%;
  animation: wave 1.5s infinite;
  border-radius: 8px;
}

.skeleton-text {
  height: 1rem;
  margin-bottom: 0.5rem;
}

.skeleton-title {
  height: 1.5rem;
  width: 60%;
  margin-bottom: 1rem;
}

.skeleton-image {
  height: 200px;
}

/* تحميل السيارة */
.car-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.car-loading svg {
  width: 60px;
  height: 30px;
}

.car-loading .wheel {
  animation: spin 0.6s linear infinite;
}

.car-loading .body {
  animation: bounce 0.3s ease-in-out infinite;
}
```

### Hover Effekte

```css
/* styles/hover-effects.css */

/* تأثير التكبير */
.hover-zoom {
  transition: transform 0.3s ease;
}

.hover-zoom:hover {
  transform: scale(1.05);
}

/* تأثير الرفع */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* تأثير الإضاءة */
.hover-glow {
  transition: box-shadow 0.3s ease;
}

.hover-glow:hover {
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
}

/* تأثير الحدود */
.hover-border {
  position: relative;
}

.hover-border::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 2px solid transparent;
  border-radius: inherit;
  transition: border-color 0.3s ease;
}

.hover-border:hover::after {
  border-color: #3b82f6;
}

/* تأثير التدرج على النص */
.hover-gradient-text {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  transition: background-position 0.3s ease;
}

.hover-gradient-text:hover {
  background-position: 200% center;
}

/* تأثير الخط تحت الرابط */
.hover-underline {
  position: relative;
  text-decoration: none;
}

.hover-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  right: 0; /* RTL */
  width: 0;
  height: 2px;
  background: currentColor;
  transition: width 0.3s ease;
}

.hover-underline:hover::after {
  width: 100%;
}
```

### Page Transitions

```css
/* styles/transitions.css */

/* انتقال الصفحة */
.page-transition-enter {
  opacity: 0;
  transform: translateX(-20px);
}

.page-transition-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease-out;
}

.page-transition-exit {
  opacity: 1;
  transform: translateX(0);
}

.page-transition-exit-active {
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.3s ease-in;
}

/* انتقال المكونات */
.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.fade-exit {
  opacity: 1;
}

.fade-exit-active {
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* انتقال القائمة */
.slide-enter {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-enter-active {
  transform: translateY(0);
  opacity: 1;
  transition: all 0.3s ease;
}

.slide-exit {
  transform: translateY(0);
  opacity: 1;
}

.slide-exit-active {
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.3s ease;
}
```

---

## 🎨 Framer Motion Komponenten

```tsx
// components/animations/MotionComponents.tsx

import { motion, AnimatePresence } from 'framer-motion';

// متغيرات الحركة
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.4 },
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
};

// مكون الظهور عند التمرير
export const ScrollReveal = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

// مكون البطاقة المتحركة
export const AnimatedCard = ({ children, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -10,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      }}
      className="animated-card"
    >
      {children}
    </motion.div>
  );
};

// مكون القائمة المتحركة
export const AnimatedList = ({ children }) => {
  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.ul>
  );
};

export const AnimatedListItem = ({ children }) => {
  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
    >
      {children}
    </motion.li>
  );
};

// مكون العداد المتحرك
export const AnimatedCounter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, duration]);

  return <span>{count.toLocaleString('ar-SY')}</span>;
};

// مكون الصفحة المتحركة
export const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// مكون النافذة المنبثقة المتحركة
export const AnimatedModal = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
```

---

## 🗺️ خريطة سوريا التفاعلية

```tsx
// components/landing/SyriaMap.tsx

const SyriaMap = ({ branches, onBranchClick }) => {
  return (
    <svg viewBox="0 0 500 400" className="syria-map">
      {/* خلفية الخريطة */}
      <defs>
        <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
      </defs>

      {/* المحافظات */}
      {governorates.map((gov) => (
        <motion.path
          key={gov.id}
          d={gov.path}
          fill={`url(#mapGradient)`}
          stroke="#3b82f6"
          strokeWidth="1"
          whileHover={{
            fill: '#93c5fd',
            scale: 1.02,
          }}
          onClick={() => onGovernorateClick(gov)}
          className="governorate-path"
        />
      ))}

      {/* علامات الفروع */}
      {branches.map((branch) => (
        <motion.g
          key={branch.id}
          transform={`translate(${branch.x}, ${branch.y})`}
          whileHover={{ scale: 1.3 }}
          onClick={() => onBranchClick(branch)}
          className="branch-marker"
        >
          <circle r="8" fill="#3b82f6" />
          <circle r="12" fill="none" stroke="#3b82f6" strokeWidth="2">
            <animate
              attributeName="r"
              from="8"
              to="20"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="1"
              to="0"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <text y="25" textAnchor="middle" fontSize="12" fill="#1f2937">
            {branch.nameAr}
          </text>
        </motion.g>
      ))}
    </svg>
  );
};
```

---

## ➡️ Weiter zu: 07_API_BACKEND.md
