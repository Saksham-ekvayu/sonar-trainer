import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';

interface SurfaceMeshProps {
  isAnimating: boolean;
}

function SonarSurfaceMesh({ isAnimating }: SurfaceMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometryRef = useRef<THREE.PlaneGeometry>(null);
  const frameRef = useRef(0);

  const gridSize = 50;
  const segments = gridSize - 1;

  // Create initial geometry
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(10, 10, segments, segments);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [segments]);

  // Create gradient material with Indian Navy colors
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        colorLow: { value: new THREE.Color('#0a192f') },    // Deep navy
        colorMid1: { value: new THREE.Color('#1a3a5c') },   // Navy blue
        colorMid2: { value: new THREE.Color('#2a5a8c') },   // Medium blue
        colorMid3: { value: new THREE.Color('#8aa4c8') },   // Light blue
        colorHigh: { value: new THREE.Color('#C5A047') },   // Gold
        colorTop: { value: new THREE.Color('#E8D08C') },    // Light gold
        minHeight: { value: -0.5 },
        maxHeight: { value: 0.5 },
      },
      vertexShader: `
        varying float vHeight;
        varying vec3 vNormal;
        
        void main() {
          vHeight = position.y;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 colorLow;
        uniform vec3 colorMid1;
        uniform vec3 colorMid2;
        uniform vec3 colorMid3;
        uniform vec3 colorHigh;
        uniform vec3 colorTop;
        uniform float minHeight;
        uniform float maxHeight;
        
        varying float vHeight;
        varying vec3 vNormal;
        
        void main() {
          float t = (vHeight - minHeight) / (maxHeight - minHeight);
          t = clamp(t, 0.0, 1.0);
          
          vec3 color;
          if (t < 0.2) {
            color = mix(colorLow, colorMid1, t / 0.2);
          } else if (t < 0.4) {
            color = mix(colorMid1, colorMid2, (t - 0.2) / 0.2);
          } else if (t < 0.6) {
            color = mix(colorMid2, colorMid3, (t - 0.4) / 0.2);
          } else if (t < 0.8) {
            color = mix(colorMid3, colorHigh, (t - 0.6) / 0.2);
          } else {
            color = mix(colorHigh, colorTop, (t - 0.8) / 0.2);
          }
          
          // Add lighting
          vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
          float diff = max(dot(vNormal, lightDir), 0.3);
          
          gl_FragColor = vec4(color * diff, 1.0);
        }
      `,
      side: THREE.DoubleSide,
    });
  }, []);

  // Animate the surface
  useFrame(() => {
    if (!meshRef.current || !isAnimating) return;

    frameRef.current += 0.05;
    const positions = meshRef.current.geometry.attributes.position;
    const f = frameRef.current;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      
      // Create sonar-like wave patterns
      const distance = Math.sqrt(x * x + z * z);
      const mainWave = Math.cos(distance * 2 - f) * Math.exp(-distance * 0.3) * 0.4;
      const secondaryWave = Math.sin(distance * 1.5 - f * 0.7) * Math.exp(-distance * 0.4) * 0.2;
      const noise = (Math.random() - 0.5) * 0.02;
      
      positions.setY(i, mainWave + secondaryWave + noise);
    }

    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} castShadow receiveShadow>
    </mesh>
  );
}

function AxisLabels() {
  return (
    <>
      {/* X Axis Label */}
      <Text
        position={[6, -0.5, 0]}
        fontSize={0.4}
        color="#C5A047"
        anchorX="center"
        anchorY="middle"
      >
        Range (m)
      </Text>
      
      {/* Y Axis Label */}
      <Text
        position={[-6, 2, 0]}
        fontSize={0.4}
        color="#C5A047"
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, Math.PI / 2]}
      >
        Amplitude (dB)
      </Text>
      
      {/* Z Axis Label */}
      <Text
        position={[0, -0.5, 6]}
        fontSize={0.4}
        color="#C5A047"
        anchorX="center"
        anchorY="middle"
      >
        Frequency (Hz)
      </Text>
    </>
  );
}

interface SurfaceMesh3DChartProps {
  isAnimating?: boolean;
}

export function SurfaceMesh3DChart({ isAnimating = true }: SurfaceMesh3DChartProps) {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border bg-[#0a192f]">
      <Canvas
        camera={{ position: [8, 6, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: '#0a192f' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
        <directionalLight position={[-10, 5, -10]} intensity={0.3} color="#8aa4c8" />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#C5A047" />

        {/* Grid */}
        <Grid
          position={[0, -0.6, 0]}
          args={[12, 12]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#1a3a5c"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#C5A047"
          fadeDistance={30}
          fadeStrength={1}
          infiniteGrid={false}
        />

        {/* Surface Mesh */}
        <SonarSurfaceMesh isAnimating={isAnimating} />

        {/* Axis Labels */}
        <AxisLabels />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          autoRotate={isAnimating}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
