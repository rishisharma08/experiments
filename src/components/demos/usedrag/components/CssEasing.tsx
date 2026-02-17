import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PageSubHeading from "src/components/general/PageSubHeading";
import useDrag from "../useDrag";
import type { Pos } from "src/types";
import Select from "src/components/general/Select";
import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";
import type { DotLottie } from "@lottiefiles/dotlottie-react";

setWasmUrl( import.meta.env.BASE_URL + "/dotlottie-player.wasm" );

const size = 400;
const duration = 2000;

type Bezier = [ string, string, string, string ];

const solveCubicBezier = (t: number, p1y: number, p2y: number): number => {
  // Simplified for y-axis assuming start is 0 and end is 1
  // Formula: (1-t)^3*P0 + 3(1-t)^2*t*P1 + 3(1-t)*t^2*P2 + t^3*P3
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;
  return ((ay * t + by) * t + cy) * t;
};



function DragHandle(){
  return <div
    className="size-full bg-black -translate-x-1/2 -translate-y-1/2 border border-white"
  />;
}

function CssEasing(){
  const boundRef = useRef<HTMLDivElement>( null );
  const drag1Ref = useRef<HTMLDivElement>( null );
  const drag2Ref = useRef<HTMLDivElement>( null );
  const cp1: Pos = {
    x: 0,
    y: size,
  };
  const cp2: Pos = {
    x: size,
    y: 0
  };
  const {
    transform: transform1,
    isDragging: isDragging1,
  } = useDrag({
    dragElem: drag1Ref,
    boundElem: boundRef,
    // checkBounds: checkBounds,
  });
  const {
    transform: transform2,
    isDragging: isDragging2,
  } = useDrag({
    dragElem: drag2Ref,
    boundElem: boundRef,
    // checkBounds: checkBounds,
  });
  const [property, propertySet] = useState( "transform" );
  // const sampleDivRef = useRef<HTMLDivElement>( null );
  // const [sampleDivDims, sampleDivDimsSet] = useState<Dim>({
  //   width: 0, height: 0
  // });
  const isDragging = isDragging1 || isDragging2;
  const transformString1 = transform1 ? `translateX(${transform1.x}px) translateY(${transform1.y}px)` : `translateX(${cp1.x}px) translateY(${cp1.y}px)`;
  const transformString2 = transform2 ? `translateX(${transform2.x}px) translateY(${transform2.y}px)` : `translateX(${cp2.x}px) translateY(${cp2.y}px)`;

  const pathRef = useRef<SVGPathElement>( null );
  const [lottie, lottieSet] = useState<DotLottie | null>( null );
  const [totalFrames, totalFramesSet] = useState<number>( 0 );
  const animationFrameRef = useRef<number | null>( null );

  const startLottieAnimation = useCallback(( bez: Bezier) => {
    if( !lottie ){
      return;
    }

    // Cancel any existing animation
    if( animationFrameRef.current !== null ){
      cancelAnimationFrame( animationFrameRef.current );
      animationFrameRef.current = null;
    }

    const [ , y1, , y2 ] = bez.map( Number );
    const startTime = window.performance.now();

    const animate = (currentTime: number): void => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1); // t goes from 0->1
      // this is the math way - with an equation i found
      // const progress = solveCubicBezier( t, y1, y2 );
      // const targetFrame = Math.floor( progress * totalFrames );
      
      //this is the bootleg way where i can just deduce points from the curve itself.
      //t goes from 0->1 linearly
      //we need to get the curve's y coordinate at a multiplier of to get position at that time. (x coordinate is time)
      //pathRef.current?.getPointAtLength( t * pathLength ).y will give us size -> 0 (since the coordinates are going from top left to bottom right, but we draw it bottom left to top right)
      //we then substract it from size to get it 0->size
      //then multiple by totalFrames/size to bring it in range of 0->totalFrames
      const pathLength = pathRef.current?.getTotalLength() || 0;
      const targetFrame = Math.floor(
        (
          size - (
            pathRef.current?.getPointAtLength( t * pathLength ).y ?? size
          )
        ) * totalFrames/size
      );

      lottie.setFrame( targetFrame < 0 ? totalFrames + targetFrame : targetFrame );
      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [lottie, totalFrames, pathRef]);

  const bezierArray = useMemo(()=>{
    const bezier: Bezier = [
      ( ( transform1 ? transform1.x : cp1.x ) / size ).toFixed(2),
      ( ( size - ( transform1 ? transform1.y : cp1.y ) ) / size ).toFixed(2),
      ( ( transform2 ? transform2.x : cp2.x ) / size ).toFixed(2),
      ( ( size - ( transform2 ? transform2.y : cp2.y ) ) / size ).toFixed(2),
    ];
    return bezier;
  }, [ transform1, transform2, cp1.x, cp1.y, cp2.x, cp2.y ]);

  // Handle pause/play based on dragging state
  useEffect(() => {
    if( !lottie ) return;

    if( isDragging ){
      // Cancel any running animation
      if( animationFrameRef.current !== null ){
        cancelAnimationFrame( animationFrameRef.current );
        animationFrameRef.current = null;
      }
      lottie.pause();
    } else {
      startLottieAnimation( bezierArray );
    }
  }, [ isDragging, bezierArray, lottie, totalFrames ]);

  const transitionTimingFunction = `cubic-bezier(${bezierArray.join( "," )})`

  const dotLottieRefCallback = ( lottieObj: DotLottie ) => {
    if( lottieObj ){
      lottieSet( lottieObj );
    }
  };

  /* useEffect(()=>{
    if( sampleDivRef.current ){
      sampleDivDimsSet({
        width: sampleDivRef.current.offsetWidth,
        height: sampleDivRef.current.offsetHeight,
      });
    }
  }, [sampleDivRef]); */

  useEffect(()=>{
    const handleLottieLoad = () => {
      totalFramesSet( lottie?.totalFrames ?? 0 );
    };
    if( lottie ){
      lottie.addEventListener( 'load', handleLottieLoad );
    }

    return () => {
      // Remove event listeners when the component is unmounted.
      if( lottie ) {
        lottie.removeEventListener( 'load', handleLottieLoad );
      }
    };

  }, [lottie]);

  return (
    <div className="group">
      <PageSubHeading
        className="mt-8"
      >
        Use Drag Handles to make your CSS cubic-besier curve
      </PageSubHeading>
      <div className="space-y-2 mt-2">
        <div
          style={{
            width: size
          }}
          className={`aspect-square relative`}
          ref={boundRef}
        >
          <div
            className="w-2 aspect-square select-none cursor-pointer absolute top-0 left-0"
            ref={drag1Ref}
            style={{
              transform: transformString1,
            }}
          >
            <DragHandle />
          </div>
          <div
            className="w-2 aspect-square select-none cursor-pointer absolute top-0 left-0"
            ref={drag2Ref}
            style={{
              transform: transformString2,
            }}
          >
            <DragHandle />
          </div>
          <svg
            className="size-full absolute -z-1 pointer-events-none overflow-visible dark:bg-white"
          >
            <path
              className="stroke-accent-color"
              d={`M ${cp1.x} ${cp1.y} C ${transform1 ? transform1.x :  cp1.x} ${transform1 ? transform1.y : cp1.y}, ${transform2 ? transform2.x : cp2.x} ${transform2 ? transform2.y : cp2.y}, ${cp2.x} ${cp2.y}`}
              // stroke="black"
              fill="none"
              ref={pathRef}
            />
            <path
              d={`M ${cp1.x} ${cp1.y} L ${transform1 ? transform1.x : cp1.x} ${transform1 ? transform1.y : cp1.y}`}
              stroke="black"
              strokeWidth={0.25}
            />
            <path
              d={`M ${transform2 ? transform2.x : cp2.x} ${transform2 ? transform2.y : cp2.y} L ${cp2.x} ${cp2.y}`}
              stroke="black"
              strokeWidth={0.25}
            />
            <path
              d={`M 0 0 L 0 ${size} L ${size} ${size}`}
              stroke="black"
              strokeWidth={0.25}
              fill="none"
            />
          </svg>
        </div>
        <div>
          {transitionTimingFunction}
        </div>
        <div>
          <p className="text-xs">Select a Property to see Totoro go</p>
          <Select
            // className="select-styled"
            onChange={( e )=>{
              propertySet( e.target.value )
            }}
          >
            <option value="transform">Transform</option>
            <option value="opacity">Opacity</option>
          </Select>
        </div>
        <DotLottieReact
          src="https://lottie.host/97ea5edf-8850-49d6-80f2-3ec609eff387/vaLaoqQQmw.lottie"
          // src="https://lottie.host/23942cdf-98fb-4f51-9c60-76d791ef732d/OTW5jjlnB1.json"
          // src="https://lottie.host/63e43fb7-61be-486f-aef2-622b144f7fc1/2m8UGcP8KR.json"
          dotLottieRefCallback={dotLottieRefCallback}
          style={{
            pointerEvents: "none",
            width: 300,
            transitionProperty: isDragging ? "none" : property,
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: transitionTimingFunction,
            ...( property === "transform" ? {transform: `translateX(${isDragging ? size - 150 : 0 - 100}px)`} :{} ),
            ...( property === "opacity" ? {opacity: `${isDragging ? 0 : 1}`} :{} ),
          }}
        />
        {/* <div
          ref={sampleDivRef}
          className="size-20 bg-gray-300 border border-white"
          style={{
            transitionProperty: isDragging ? "none" : property,
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: transitionTimingFunction,
            ...( property === "transform" ? {transform: `translateX(${isDragging ? 0 : size - sampleDivDims.width}px)`} :{} ),
            ...( property === "opacity" ? {opacity: `${isDragging ? 0 : 1}`} :{} ),
          }}
        /> */}
      </div>
    </div>
  );
}

export default CssEasing;