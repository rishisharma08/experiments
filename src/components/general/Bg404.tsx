import React, { Suspense, useEffect, useMemo, useRef, useState, type HtmlHTMLAttributes } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { SVGLoader, type SVGResult } from 'three/addons/loaders/SVGLoader.js';
import { twMerge } from 'tailwind-merge';

// Define how fast each layer moves
const LAYER_SPEEDS: Record<string, number> = {
  'default': 1,  // Slowest (deepest)
  'bg-layer': 0.5,  // Slowest (deepest)
  'mid-layer': 1.2,
  'fg-layer': 2.5,  // Fastest (closest)
  'car': 2.5,  // car
};

const MultiLayerSVG: React.FC<{ url: string, mousePos: {x: number, y: number} }> = ({ url, mousePos }) => {
  const groupRef = useRef<THREE.Group>(null);
  const svgData = useLoader(SVGLoader, url) as SVGResult;

  // Process shapes and associate them with their group IDs
  const layers = useMemo(() => {
    return svgData.paths.map((path) => {
      const node = path.userData?.node as SVGElement;
      // const pathId = node?.id;
      const group = node?.closest( "g" ) as SVGGElement;
      const groupId = group?.id;
      // const groupId = (node?.parentNode as HTMLElement)?.id;
      // const id = path.userData?.node?.id || 'default';
      // console.log( groupId, node );
      const speed = LAYER_SPEEDS[groupId] || 1.0;

      return {
        shapes: SVGLoader.createShapes(path),
        color: path.color,
        speed,
        groupId, // Store the groupId to identify the car later
      };
    });
  }, [svgData]);

  // Create stable refs for each layer (initialize once with proper length)
  const layerRefs = useRef<(THREE.Group | null)[]>(
    Array(svgData.paths.length).fill(null)
  );

  useFrame((state) => {
    // const { x, y } = state.pointer;
    const { x, y } = mousePos;
    const time = state.clock.getElapsedTime();

    layers.forEach((layer, i) => {
      const layerGroup = layerRefs.current[i];
      if (layerGroup) {
        // Each layer calculates its own target based on its unique speed factor
        // Multiply by a larger factor to make the parallax effect visible
        const parallaxScale = 20; // Adjust this value to control parallax intensity
        const targetX = x * layer.speed * parallaxScale;
        let targetY = -y * layer.speed * parallaxScale; // Negative Y for natural movement

        // Add bounce animation to the car
        if (layer.groupId === 'car') {
          const bounceAmplitude = 5; // Height of the bounce
          const bounceSpeed = 18; // Speed of the bounce (higher = faster)
          const bounce = Math.sin(time * bounceSpeed) * bounceAmplitude;
          targetY += bounce;
        }

        layerGroup.position.x = THREE.MathUtils.lerp(layerGroup.position.x, targetX, 0.05);
        layerGroup.position.y = THREE.MathUtils.lerp(layerGroup.position.y, targetY, 0.05);
      }
    });
  });

  return (
    <group
      ref={groupRef}
      scale={0.018}
      rotation={[Math.PI, 0, 0]}
      position={[-11, 4.75, 0]} // Center the SVG: -(1200/2)*0.01, -(675/2)*0.01
    >
      {layers.map((layer, i) => (
        <group key={i} ref={(el) => { layerRefs.current[i] = el; }}>
          {layer.shapes.map((shape, j) => (
            <mesh key={j}>
              <shapeGeometry args={[shape]} />
              <meshBasicMaterial color={layer.color} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

interface Bg404Props extends HtmlHTMLAttributes<HTMLDivElement> {
  fill?: string;
}

export const Bg404 = ( props: Bg404Props ) => {
  const { className = "", ...others} = props;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert to normalized device coordinates (-1 to +1)
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return (
    <div
      className={twMerge( "", className )}
      {...others}
    >
      <Canvas
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 6], fov: 75 }}
        style={{
          pointerEvents: "none"
        }}
      >
        <Suspense fallback={null}>
          <MultiLayerSVG url={`${import.meta.env.BASE_URL}bg404.svg`} mousePos={mousePos}/>
        </Suspense>
      </Canvas>
    </div>
  );
};
