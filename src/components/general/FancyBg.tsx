import React, { useEffect, useMemo, useRef, useState, type HtmlHTMLAttributes } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { SVGLoader, type SVGResult } from 'three/addons/loaders/SVGLoader.js';
import { twMerge } from 'tailwind-merge';

interface ShapeItem {
  shape: THREE.Shape;
  color: THREE.Color;
}

const ParallaxSVG: React.FC<{ url: string; mousePos: { x: number; y: number }; fill?: string }> = ({ url, mousePos, fill }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Explicitly typing the loader result
  const svgData = useLoader(SVGLoader, url) as SVGResult;

  const shapes = useMemo<ShapeItem[]>(() => {
    return svgData.paths.flatMap((path) => {
      const pathShapes = SVGLoader.createShapes(path);
      return pathShapes.map((shape) => {
        return {
          shape,
          color: path.color,
        }
      });
    });
  }, [svgData]);

  useFrame(() => {
    if (!groupRef.current) return;

    // Use the passed mousePos instead of state.pointer
    const { x, y } = mousePos;

    // Smooth lerping for the group position
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, x * 1.5, 0.002);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, y * 1.5, 0.002);
  });

  return (
    <group ref={groupRef}>
      <group scale={0.1} rotation={[Math.PI, 0, 0]} position={[-4, 4, 0]}>
        {shapes.map((item, index) => (
          <mesh key={index}>
            <shapeGeometry args={[item.shape]} />
            <meshBasicMaterial color={fill || item.color} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

interface FancyBgProps extends HtmlHTMLAttributes<HTMLDivElement> {
  fill?: string;
}

export const FancyBg = ( props: FancyBgProps ) => {
  const { className="", fill, ...others} = props;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [resolvedColor, setResolvedColor] = useState<string | undefined>(fill);
  const divRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const resolveColor = () => {
      if (fill === 'currentColor' && divRef.current) {
        const computedColor = window.getComputedStyle(divRef.current).color;
        setResolvedColor(computedColor);
      } else {
        setResolvedColor(fill);
      }
    };

    // Initial resolve
    resolveColor();

    // Watch for dark mode changes on document element (where Tailwind adds 'dark' class)
    const observer = new MutationObserver(resolveColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Also listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => resolveColor();
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [fill, className]);

  return (
    <div
      ref={divRef}
      className={twMerge( "", className )}
      {...others}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ pointerEvents: 'none' }}
      >
        <ParallaxSVG url={`${import.meta.env.BASE_URL}rs.svg`} mousePos={mousePos} fill={resolvedColor} />
      </Canvas>
    </div>
  );
};
