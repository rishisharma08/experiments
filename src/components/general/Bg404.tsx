import React, { Suspense, useEffect, useMemo, useRef, useState, type HtmlHTMLAttributes } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { SVGLoader, type SVGResult } from 'three/addons/loaders/SVGLoader.js';
import { twMerge } from 'tailwind-merge';
import type { Pos } from 'src/types';
import Button from './Button';

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

interface MultiLayerSVGProps {
  url: string,
  mousePos: React.RefObject<Pos>,
  tilts: React.RefObject<Pos>,
  isMobile: React.RefObject<boolean>,
}
// Define how fast each layer moves
const LAYER_SPEEDS: Record<string, number> = {
  'default': 1,  // Slowest (deepest)
  'bg-layer': 0.5,  // Slowest (deepest)
  'mid-layer': 1.2,
  'fg-layer': 2.5,  // Fastest (closest)
  'car': 2.5,  // car
};

const MultiLayerSVG = (props: MultiLayerSVGProps) => {
  const {
    url,
    mousePos,
    isMobile,
    tilts,
  } = props;
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
    let { x, y } = mousePos.current!;
    if( isMobile.current ){
      ({x, y} = tilts.current!);
    }
    const time = state.clock.getElapsedTime();

    layers.forEach((layer, i) => {
      const layerGroup = layerRefs.current[i];
      if (layerGroup) {
        // Each layer calculates its own target based on its unique speed factor
        // Multiply by a larger factor to make the parallax effect visible
        const parallaxScale = isMobile.current ? 30 : 20; // Adjust this value to control parallax intensity
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
      scale={isMobile.current ? 0.0160 : 0.18}
      rotation={[Math.PI, 0, 0]}
      position={ isMobile.current ? [-9.5, 3.50, 0]: [-11, 4.75, 0] } // Center the SVG: -(1200/2)*0.01, -(675/2)*0.01
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
  const mousePos = useRef<Pos>({ x: 0, y: 0 });
  const tilts = useRef<Pos>({ x: 0, y: 0 });
  const isMobile = useRef( false );
  const requestTiltRef = useRef<(() => void) | null>(null);

  // Detect if iOS 13+ permission is needed (only runs once on mount)
  const needsPermission = typeof window !== 'undefined' &&
    window.DeviceOrientationEvent &&
    typeof (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission === 'function';

  const [showPermissionButton, setShowPermissionButton] = useState(needsPermission);

  useEffect(() => {
    let tiltListenersAdded = false;
    const handleMouseMove = (event: MouseEvent) => {
      // Convert to normalized device coordinates (-1 to +1)
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      mousePos.current = { x, y };
    };

    const handleOrientation = ( e: DeviceOrientationEvent ) => {
      isMobile.current = true;
      tilts.current.x = ( e.gamma || 0 ) / 90;
      tilts.current.y = ( e.beta || 0 ) / 90;
    };

    const addOrientationListener = () => {
      if (!tiltListenersAdded) {
        window.addEventListener( "deviceorientation", handleOrientation );
        tiltListenersAdded = true;
      }
    };

    const requestTilt = () => {
      const RequestEvent = DeviceOrientationEvent as unknown as DeviceOrientationEventiOS;
      if( typeof RequestEvent.requestPermission === "function" ){
        // iOS 13+ - requires user gesture
        RequestEvent.requestPermission()
          .then(( permission )=>{
            if( permission === "granted" ){
              addOrientationListener();
              setShowPermissionButton(false);
            } else {
              setShowPermissionButton(false);
            }
          })
          .catch(()=>{
            // Permission denied or error
            setShowPermissionButton(false);
          });
      }else{
        // Android or older browsers - no permission needed
        // Only add listener on touch-enabled devices
        if ('ontouchstart' in window) {
          addOrientationListener();
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Check if device orientation is available
    if (window.DeviceOrientationEvent) {
      if( needsPermission ){
        // iOS 13+ - store requestTilt for button click
        requestTiltRef.current = requestTilt;
      } else {
        // Android or older browsers - request immediately
        requestTilt();
      }
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if( tiltListenersAdded ){
        window.removeEventListener( "deviceorientation", handleOrientation );
      }
    };
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
          <MultiLayerSVG
            url={`${import.meta.env.BASE_URL}bg404.svg`}
            mousePos={mousePos}
            isMobile={isMobile}
            tilts={tilts}
          />
        </Suspense>
      </Canvas>

      {/* iOS 13+ Permission Button */}
      {showPermissionButton && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl max-w-sm mx-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white font-mono">
              Enable Motion Controls
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-mono">
              Allow device orientation to control the parallax effect by tilting your device.
            </p>
            <Button
              onClick={() => requestTiltRef.current?.()}
              className="w-full"
            >
              Enable
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
